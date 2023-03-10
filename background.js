chrome.action.onClicked.addListener((tab) => {
    chrome.desktopCapture.chooseDesktopMedia([
        "screen",
        "window",
        "tab"
    ], tab, (streamId) => {
        if (streamId && streamId.length) {
            setTimeout(() => {
                chrome.tabs.sendMessage(tab.id, {name: "stream", streamId}, (response) => console.log(response))
            }, 200)
        }
        
    })
})
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.name === 'download' && message.url) {
        chrome.downloads.download({
            filename: 'screenshot.png',
            url: message.url
        }, (downloadId) => {
            sendResponse({success: true})
        })

        return true;
    }
});