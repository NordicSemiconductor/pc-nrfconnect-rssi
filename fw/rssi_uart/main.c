/**
 * Copyright (c) 2014 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 3. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 4. This software, with or without modification, must only be used with a
 *    Nordic Semiconductor ASA integrated circuit.
 *
 * 5. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS
 * OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

#include <string.h>
#include "app_uart.h"
#include "nrf_delay.h"
#include "bsp.h"

#define FREQ_ADV_CHANNEL_37         2      /**<Radio channel number which corresponds with 37-th BLE channel **/
#define FREQ_ADV_CHANNEL_38         26     /**<Radio channel number which corresponds with 38-th BLE channel **/
#define FREQ_ADV_CHANNEL_39         80     /**<Radio channel number which corresponds with 39-th BLE channel **/
#define UART_TX_BUF_SIZE            512    /**< UART TX buffer size. */
#define UART_RX_BUF_SIZE            2048   /**< UART RX buffer size. */
#define NEW_PACKET_BYTE             255
#define RSSI_NO_SIGNAL              127    /**< Minimum value of RSSISAMPLE */

#if defined ( __CC_ARM )
static const char version_str[16] __attribute__((at(0x2000))) = "rssi-fw-1.0.0\0\0\0";
#endif


static uint8_t min_channel        = 0;     /**< Lowest scanned channel if adv_channels_en = true */
static uint8_t max_channel        = 80;    /**< highest scanned channel if adv_channels_en = true */
static uint32_t sweep_delay       = 1000;
static uint32_t scan_repeat_times = 1;

static bool uart_error = false;
static bool uart_send = false;
static bool scan_ble_adv = false;

void uart_put(uint8_t c)
{
	if (uart_send && !uart_error) {
		uart_error = (app_uart_put(c) != NRF_SUCCESS);
		if (uart_error) {
			bsp_board_led_off(1);
		}
	}
}

void set_uart_send_enable(bool enable)
{
	uart_send = enable;
	if (uart_send) {
		bsp_board_led_on(1);
	} else {
		bsp_board_led_off(1);
	}
}

void uart_send_packet(uint8_t channel_number, uint8_t rssi)
{
	uart_put(0xff);
	uart_put(channel_number);
	uart_put(rssi);
}

void set_scan_ble_adv(bool enable) {
	scan_ble_adv = enable;
	for (uint8_t i = min_channel; i <= max_channel; ++i)
	{
		uart_send_packet(i, RSSI_NO_SIGNAL);
	}
}

void rssi_measurer_configure_radio(void)
{
	NRF_RADIO->POWER  = 1;
	NRF_RADIO->SHORTS = RADIO_SHORTS_READY_START_Msk | RADIO_SHORTS_END_DISABLE_Msk;
	NVIC_EnableIRQ(RADIO_IRQn);

	NRF_CLOCK->TASKS_HFCLKSTART = 1;
	while (NRF_CLOCK->EVENTS_HFCLKSTARTED == 0);
}

#define WAIT_FOR( m ) do { while (!m); m = 0; } while(0)

uint8_t rssi_measurer_scan_channel(uint8_t channel_number)
{
	uint8_t sample;

	NRF_RADIO->FREQUENCY  = channel_number;
	NRF_RADIO->TASKS_RXEN = 1;

	WAIT_FOR(NRF_RADIO->EVENTS_READY);
	NRF_RADIO->TASKS_RSSISTART = 1;
	WAIT_FOR(NRF_RADIO->EVENTS_RSSIEND);

	sample = 127 & NRF_RADIO->RSSISAMPLE;

	NRF_RADIO->TASKS_DISABLE = 1;
	WAIT_FOR(NRF_RADIO->EVENTS_DISABLED);

	return sample;
}

uint8_t rssi_measurer_scan_channel_repeat(uint8_t channel_number)
{
	uint8_t sample;
	uint8_t max = RSSI_NO_SIGNAL;
	for (int i = 0; i <= scan_repeat_times; ++i) {
		sample = rssi_measurer_scan_channel(channel_number);
		// taking minimum since sample = -dBm.
		max = MIN(sample, max);
	}
	return max;
}

void uart_error_handle(app_uart_evt_t * p_event)
{
	if (p_event->evt_type == APP_UART_COMMUNICATION_ERROR)
	{
		APP_ERROR_HANDLER(p_event->data.error_communication);
	}
	else if (p_event->evt_type == APP_UART_FIFO_ERROR)
	{
		APP_ERROR_HANDLER(p_event->data.error_code);
	}
}

void uart_get_line()
{
	static const int bufsize = 64;
	uint8_t buf[bufsize];
	uint8_t* p = &buf[0];

	if (app_uart_get(p) != NRF_SUCCESS) {
		return;
	}

	memset(buf+1, bufsize-1, 0);

	while (*p != 0x0d && *p != 0x00 && (p-buf < bufsize)) {
		if (app_uart_get(++p) != NRF_SUCCESS) {
			break;
		}
	}

	char* q = (char*)&buf[0];
	if (strncmp(q, "set ", 4) == 0) {
		q += 4;
		if (strncmp(q, "delay ", 6) == 0) {
			q += 6;
			int d = atoi(q);
			sweep_delay = MAX(5, MIN(d, 1000));
			return;
		}
		if (strncmp(q, "repeat ", 7) == 0) {
			q += 7;
			int d = atoi(q);
			scan_repeat_times = MAX(1, MIN(d, 100));
			return;
		}
		if (strncmp(q, "channel min ", 12) == 0) {
			q += 12;
			int d = atoi(q);
			min_channel = MAX(1, MIN(d, max_channel));
			return;
		}
		if (strncmp(q, "channel max ", 12) == 0) {
			q += 12;
			int d = atoi(q);
			max_channel = MAX(min_channel, MIN(d, 100));
			return;
		}
		return;
	}
	if (strncmp(q, "start", 5) == 0) {
		set_uart_send_enable(true);
		return;
	}
	if (strncmp(q, "stop", 4) == 0) {
		set_uart_send_enable(false);
		return;
	}
	if (strncmp(q, "scan adv ", 9) == 0) {
		q += 9;
		if (strncmp(q, "true", 4) == 0) {
			set_scan_ble_adv(true);
			return;
		}
		if (strncmp(q, "false", 5) == 0) {
			set_scan_ble_adv(false);
		}
		return;
	}
	if (strncmp(q, "led", 3) == 0) {
		bsp_board_led_invert(0);
		return;
	}
}

void uart_loopback()
{
	uint8_t sample;
	if (scan_ble_adv) {
		sample = rssi_measurer_scan_channel_repeat(FREQ_ADV_CHANNEL_37);
		uart_send_packet(FREQ_ADV_CHANNEL_37, sample);
		sample = rssi_measurer_scan_channel_repeat(FREQ_ADV_CHANNEL_38);
		uart_send_packet(FREQ_ADV_CHANNEL_38, sample);
		sample = rssi_measurer_scan_channel_repeat(FREQ_ADV_CHANNEL_39);
		uart_send_packet(FREQ_ADV_CHANNEL_39, sample);
	} else {
		for (uint8_t i = min_channel; i <= max_channel; ++i)
		{
			sample = rssi_measurer_scan_channel_repeat(i);
			uart_send_packet(i, sample);
		}
	}

	uart_get_line();

	if (uart_error) {
		nrf_delay_ms(MAX(sweep_delay, 500));
		uart_error = false;
		set_uart_send_enable(uart_send);
	}

	nrf_delay_ms(sweep_delay);
}


/**
 * @brief Function for main application entry.
 */
int main(void)
{
	uint32_t err_code;

	bsp_board_leds_init();

	const app_uart_comm_params_t comm_params = {
		RX_PIN_NUMBER,
		TX_PIN_NUMBER,
		RTS_PIN_NUMBER,
		CTS_PIN_NUMBER,
		APP_UART_FLOW_CONTROL_DISABLED,
		false,
		UART_BAUDRATE_BAUDRATE_Baud115200
	};

	APP_UART_FIFO_INIT(
		&comm_params,
		UART_RX_BUF_SIZE,
		UART_TX_BUF_SIZE,
		uart_error_handle,
		APP_IRQ_PRIORITY_LOWEST,
		err_code
	);

	APP_ERROR_CHECK(err_code);
	app_uart_flush();

	rssi_measurer_configure_radio();

	while (true)
	{
		uart_loopback();
	}
}


/** @} */
