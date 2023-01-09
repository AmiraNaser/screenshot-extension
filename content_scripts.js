chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.name === 'stream' && message.streamId) {
        let track, canvas;
        navigator.mediaDevices.getUserMedia({
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: message.streamId
                },
            }
        }).then((stream) => {
            track = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(track);
            return imageCapture.grabFrame();
        }).then((bitmap) => {
            track.stop();
            canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            let context = canvas.getContext('2d');
            context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
            return canvas.toDataURL();
        }).then((url) => {
            chrome.runtime.sendMessage({name: 'download', url}, (response) => {
                if (response.success) {
                    alert("Screenshot Saved");
                } else {
                    alert("Error saving screenshot")
                }
                canvas.remove()
                sendResponse({success: true})
            });
        }).catch((err) => {
            alert("Could not take a screenshot");
            sendResponse({success: false, message: err})
        });
        return true;   
    }
});


