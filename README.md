# ![Get Outta Here](/images/icon48.png) Get Outta Here

Google Chrome extension to control your time spent on unproductive websites. 

Whenever the extension detects that the current website is in your list of unproductive websites, it triggers the timer. When the time is up, the extension will alert you and automatically closes the tab that you are currently on. Timer will still run even if page refreshes or you enter another website that is in your list.

## Features
- Add/Delete websites to list of unproductive websites
- Clear all websites from the list
- Choose duration of timer
- Choose to close the active tab after time is up or not
    
![popup](/images/popup.png) ![websites table](/images/websites_table.png) ![times up](/images/times_up.png)

### No On/Off Button
I decided against having an on/off button because I don't want to be tempted to turn it off. To turn it off is by typing `chrome://extensions` into the search bar and manually turning it off there. Hopefully, this extra barrier deters users from turning it off when it's convenient for them.

### Issues
There is a problem with Chrome extensions where the CSS hover lags and the "close active tab" button doesn't initially appear when using an external monitor. This doesn't affect the extension's functionality. 
(https://bugs.chromium.org/p/chromium/issues/detail?id=971701)



