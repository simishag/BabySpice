// Baby Spice
// background.js

// listen for keyboard command & send message to content.js
// note: console.log here goes to background page (extension)
// rather than normal page console
// note: command key listener has to go in background.js
chrome.commands.onCommand.addListener(
  function (cmd) {
    chrome.tabs.getSelected(chrome.windows.WINDOW_ID_CURRENT, function (tab) {
      if (cmd === 'toggle-feature') {
        chrome.tabs.sendMessage(tab.id, { text: 'report_back' },
          function (domContent) {
            // console.log("do something with domContent: " + domContent.toString().length);
          });
      }

      if (cmd === 'print-links') {
        chrome.tabs.sendMessage(tab.id, { text: 'get_links' });
      }

      if (cmd === 'do-follow') {
        chrome.tabs.sendMessage(tab.id, { text: 'do_follow' });
      }
      return true;
    });
  }
);
