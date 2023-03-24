# What time is it Mr. Wolf?

A browser extension that enhances your experience with the Smaregi Timecard system by calculating and displaying the remaining working hours for the week, along with the expected end time for the day. Stay on top of your work schedule and never miss a beat with Smaregi Timecard Helper!

Go to the chrome web store and add the [What time is it Mr. Wolf?](https://chrome.google.com/webstore/detail/what-time-is-it-mrwolf/nckligekkdbanfgnilneakpknpklllge) extension.

### Features

- Automatically calculates the remaining working hours for the week
- Calculates the expected end time for the day, considering breaks
- Displays a convenient summary with the remaining time and end time
- Automatically updates the displayed information when necessary
- Lightweight and unobtrusive, only runs when you're on the Smaregi Timecard website
- Works with Google Chrome and compatible browsers

### Installation
1. Clone this repository or download it as a ZIP file.
2. In Google Chrome, go to the extensions page (chrome://extensions).
3. Enable "Developer mode" by toggling the switch in the top-right corner.
4. Click the "Load unpacked" button and select the directory containing the downloaded repository.
5. The What time is it Mr. Wolf? extension should now appear in your extensions list, and its icon should be visible in the toolbar. 

### Usage
After installing the extension, simply navigate to the Smaregi Timecard website (timecard1.smaregi.jp/staffs/dashboard). The extension will automatically run and display the remaining working hours for the week, along with the expected end time for the day, on the web page.

### Configuration
You can customize the default working hours per week and the default starting time by modifying the corresponding values in the background script (background.js). The default values are 40 hours per week and 8:00 AM as the starting time.

```javascript
const defaultWeeklyHours = 40;
const defaultStartTime = 8;
```

### Contributing
We welcome contributions to improve the What time is it Mr. Wolf? extension. If you'd like to contribute, please fork the repository and submit a pull request with your changes.

### License
What time is it Mr. Wolf? is released under the MIT License.
