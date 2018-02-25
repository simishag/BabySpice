'use strict';

document.addEventListener('DOMContentLoaded', function () {
    $('#get_links').click(function (e) {
        console.log("get_links clicked");
    })
    $('#follow_1').click(function (e) {
        console.log("follow_1 clicked");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {text: 'do_follow', count: 1}, function(response) {
                console.log("follow_1 callback");
            });
        });
    })
    $('#follow_3').click(function (e) {
        console.log("follow_3 clicked");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {text: 'do_follow', count: 3}, function(response) {
                console.log("follow_3 callback");
            });
        });
    })
    $('#follow_10').click(function (e) {
        console.log("follow_10 clicked");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {text: 'do_follow', count: 10}, function(response) {
                console.log("follow_10 callback");
            });
        });
    })
});
