'use strict';

function disableButtons() {
    $('#follow_1').prop('disabled',true);
    $('#follow_3').prop('disabled',true);
    $('#follow_10').prop('disabled',true);
}
function enableButtons() {
    $('#follow_1').prop('disabled',false);
    $('#follow_3').prop('disabled',false);
    $('#follow_10').prop('disabled',false);
}
document.addEventListener('DOMContentLoaded', function () {
    $('#follow_1').click(function (e) {
        disableButtons();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {text: 'do_follow', count: 1}, function(response) {
                console.log("re-enable");
                enableButtons();
            });
        });
    })
    $('#follow_3').click(function (e) {
        disableButtons();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {text: 'do_follow', count: 3}, function(response) {
                console.log("re-enable");
                enableButtons();
            });
        });
    })
    $('#follow_10').click(function (e) {
        disableButtons();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {text: 'do_follow', count: 10}, function(response) {
                console.log("re-enable");
                enableButtons();
            });
        });
    })
});
