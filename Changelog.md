## 1.7.3 - 2025-05-14

### Changed

-   Update dependencies to support the nRF Connect for Desktop v5.2.0 release.

## 1.7.2 - 2024-11-11

### Changed

-   Updated `nrfutil device` to v2.6.4.

## 1.7.1 - 2024-05-30

### Added

-   Support for Apple silicon.

## 1.7.0 - 2024-04-09

### Changed

-   Integrated the functionality of the Feedback tab in the **Give Feedback**
    dialog in the About tab.

## 1.6.1 - 2024-03-13

### Changed

-   Updated `nrfutil device` to v2.1.1.

## 1.6.0 - 2024-01-08

### Added

-   Persist state of `show log` panel.
-   Feedback tab.

### Fixed

-   Duplication of the events sent by analytics.

## 1.5.0 - 2023-12-07

### Changed

-   From **nrf-device-lib-js** to **nrfutil device**, as a backend for
    interacting with devices.

## 1.4.5 - 2023-07-12

### Fixed

-   Selecting a different device without ejecting now works correctly.
-   Switching from bootloader to application mode no longer updates graph data.
-   The `Restart application with verbose logging` button now restarts the app.

## 1.4.4 - 2023-04-13

### Added

-   `Update Bootloader` prompt and `sdfu` programming for it.
-   Reconnecting status in device selector.

### Fixed

-   Blocking dialog when disconnecting a device when the Programming dialog is
    open.
-   No longer auto-reconnect to the last disconnected device if it is in the
    device list when clicking the `Auto Reconnect` Toggle.
-   Dispatch `deviceSetupError` when `sdfu` programming fails.
-   State not always updated when port is closed by a usb disconnect.

## 1.4.3 - 2023-02-13

### Added

-   Prompt to program device if firmware can not be validated and no data is
    received when started.

### Changed

-   Support for nRF Connect for Desktop v4.0.0.

### Fixed

-   Programming the device firmware on macOS.

## 1.4.2 - 2022-09-05

### Added

-   Support for keyboard shortcuts.
-   Support for `nrf-device-lib-js` 0.4.12.

### Changed

-   Button style and layout.

### Fixed

-   Did not display all serialport devices.

## 1.4.1 - 2022-01-04

### Changed

-   Wording of some sidepanel items.

### Fixed

-   Not using bundled firmware in some cases froze the app.

## 1.4.0 - 2021-11-01

### Changed

-   Label of graph changed from abbreviated BLE Channel.
-   Establish compatibility with nRF Connect for Desktop 3.8.

## 1.3.1 - 2020-12-09

### Changed

-   Slight updates to the UI and needed changes for launcher 3.6.1.

## 1.3.0 - 2020-09-02

### Changed

-   New look & feel.

## 1.2.0 - 2019-07-03

### Changed

-   Updated to React Bootstrap 4.
