'use strict';

function disableButtons() {
    $('#follow_1').prop('disabled',true);
    $('#follow_3').prop('disabled',true);
    $('#follow_10').prop('disabled',true);
    $('#message').text('Running...');
}

function enableButtons(count) {
    $('#follow_1').prop('disabled',false);
    $('#follow_3').prop('disabled',false);
    $('#follow_10').prop('disabled',false);
    $('#message').text("Followed: " + count);
}

function sendClicks(count) {
    disableButtons();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {text: 'do_follow', count: count}, function(response) {
            console.log("re-enable: " + response.count);
            enableButtons(response.count);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    $('#follow_1').click(function (e) {
        sendClicks(1);
    })
    $('#follow_3').click(function (e) {
        sendClicks(3);
    })
    $('#follow_10').click(function (e) {
        sendClicks(10);
    })
});
