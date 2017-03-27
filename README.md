# pc-nrfconnect-rssi

This project implements an RSSI Viewer as an example of how to implement applications for [pc-nrfconnect-core](https://github.com/NordicSemiconductor/pc-nrfconnect-core).

The repository is based on [pc-nrfconnect-boilerplate](https://github.com/NordicSemiconductor/pc-nrfconnect-boilerplate), check out the documentation about [how to create apps](https://github.com/NordicSemiconductor/pc-nrfconnect-core#creating-apps).

The application displays the Received Signal Strength Indicator in dBm per frequency in 2400-2480 MHz measured by nRF52832 SoC.

![screenshot](resources/rssi_viewer.jpg)

The application connects to the selected serial port, checks and performs firmware update if needed, finally starts serial communication with nRF52832.

The communication in PC to firmware direction is simply few ASCII commands, firmware to PC direction is binary flow of 3 bytes [0xff, channel_number, rssi]. The received data is visualized by a chart.js based Line chart in the MainView, and few simple controls in the SidePanel to change the communication or the visualization.
