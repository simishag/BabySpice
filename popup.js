'use strict';

function disableButtons() {
    $('#follow_1').prop('disabled', true);
    $('#follow_3').prop('disabled', true);
    $('#follow_10').prop('disabled', true);
    $('#follow_all').prop('disabled', true);
}

function enableButtons(response) {
    $('#follow_1').prop('disabled', false);
    $('#follow_3').prop('disabled', false);
    $('#follow_10').prop('disabled', false);
    $('#follow_all').prop('disabled', false);
}

function sendClicks(count) {
    disableButtons();
    $('#message').text('Running...');

    let test_mode = $('#test_mode').prop('checked') || false;
    //console.log("test_mode: " + test_mode);
    
    let delay = parseFloat($('#click_delay').val());
    console.log("delay: " + delay);

    // make sure it's actually a number
    if (isNaN(delay)) {
        $('#message').text("Delay must be a number");
        enableButtons();
        return false;
    }
    // ...and that it's in range
    if (delay < 1.0 || delay > 10.0) {
        $('#message').text("Delay out of range")
        enableButtons();
        return false;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var json = {
            text: 'do_follow',
            count: count,
            delay: delay,
            test_mode: test_mode
        }
        chrome.tabs.sendMessage(tabs[0].id, json, function (response) {
            console.log("re-enable: " + response.count);
            enableButtons(response);
            getLinkCount();
            var s = "";
            if (response.test_mode) {
                s += "(TEST) ";
            }
            s += "Followed: " + response.count;
            $('#message').text(s);
        });
    });
}

function getLinkCount() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var json = {
            text: 'get_count',
        }
        chrome.tabs.sendMessage(tabs[0].id, json, function (response) {
            if (response) {
                $('#link_count').text(response.count);
            } else {
                $('#message').text("Reload page to get link count");
            }
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
    $('#follow_all').click(function (e) {
        sendClicks(0);
    });
    getLinkCount();
});
