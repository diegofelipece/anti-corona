chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({
    file: 'dist/content.js',
  })
})
