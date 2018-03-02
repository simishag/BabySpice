'use strict';

function disableButtons() {
    $('#follow_1').prop('disabled',true);
    $('#follow_3').prop('disabled',true);
    $('#follow_10').prop('disabled',true);
    $('#message').text('Running...');
}

function enableButtons(response) {
    $('#follow_1').prop('disabled',false);
    $('#follow_3').prop('disabled',false);
    $('#follow_10').prop('disabled',false);
    var s = "";
    if (response.test_mode) {
        s += "(TEST) ";
    }
    s += "Followed: " + response.count;
    $('#message').text(s);
}

function sendClicks(count) {
    disableButtons();
    let test_mode = $('#test_mode').prop('checked') || false;
    //console.log("test_mode: " + test_mode);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var json = {
            text: 'do_follow',
            count: count,
            test_mode: test_mode
        }
        chrome.tabs.sendMessage(tabs[0].id, json, function(response) {
            console.log("re-enable: " + response.count);
            getLinkCount();
            enableButtons(response);
        });
    });
}

function getLinkCount() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var json = {
            text: 'get_count',
        }
        chrome.tabs.sendMessage(tabs[0].id, json, function(response) {
            console.log("link count: " + response.count);
            $('#link_count').text(response.count);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    $('#follow_1').click(function (e) {
        sendClicks(1);
    });
    $('#follow_3').click(function (e) {
        sendClicks(3);
    });
    $('#follow_10').click(function (e) {
        sendClicks(10);
    });
    getLinkCount();
});
