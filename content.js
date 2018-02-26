// fire specified mouse event
function dispatchMouseEvent (target, var_args) {
    var e = document.createEvent("MouseEvents");
    // If you need clientX, clientY, etc., you can call
    // initMouseEvent instead of initEvent
    e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
    target.dispatchEvent(e);
};

// all of these are necessary
// ipad/iphone actually do it this way
function clickFollowButton(element) {
    dispatchMouseEvent(element, 'mouseover', true, true);
    dispatchMouseEvent(element, 'mousedown', true, true);
    dispatchMouseEvent(element, 'click', true, true);
    dispatchMouseEvent(element, 'mouseup', true, true);
}

function asyncQueue(stopOnError) {
    // a resolved promise, which acts as the seed of a .then() chain (ie a "queue").
    var p = $.when(); 
    return function(fn) {
        p = p
          .then(null, function() { if(!stopOnError) return $.when(); }) // prevent propagation of a previous error down the chain.
          .then(fn);
        return p;
    }
}
function successHandler(i) {
    console.log('success: ' + i);
}
function errorHandler() {
    console.log('error:');
}
function goodDelay() { // simulate a successful request
    return $.Deferred(function(dfrd){ setTimeout(dfrd.resolve, 1000); });
}

// listener
chrome.runtime.onMessage.addListener(
    function (msg, sender, sendResponse) {
        if (msg.text === 'report_back') {
            console.log("sending report back");
            sendResponse(document.all[0].outerHTML);
        }
        if (msg.text === 'get_links') {
            var links = $("a[id='follow-user']:not(.f-hide)");
            console.log("links: " + links.length);
            links.each(function () {
                console.log("href: " + this.href);
            });
        }

        if (msg.text === 'do_follow') {
            var count = msg.count;
            var links = $("a[id='follow-user']:not(.f-hide)");
            if (!links) {
                console.log("no links found");
            } else {
                console.log("links: ", links.length);
                if (count > links.length) {
                    console.log("reducing count from " + count + " to " + length);
                    count = links.length;
                }

                // create queue with increasing timeout
                var queue = asyncQueue(false);
                for (i = 0; i < count; i++) {
                    var randomdelay = Math.ceil(Math.random() * 10) + 1;
                    var fixeddelay = 3 * i;
                    var delay = (randomdelay + fixeddelay) * 1000;
                    console.log("delay: " + delay);
                    var element = links[i];                    
                    console.log("element: " + element);
                    //var f = function() { setTimeout(clickFollowButton, delay, element); }
                    var f = $.Deferred(function(dfrd) { setTimeout(clickFollowButton, delay, element);});
                    //funqueue.push(f)
                    let iNow = i;
                    var sc = (function() { successHandler(iNow); });
                    queue(f).then(sc, errorHandler);
                }
                // add callback to queue
                var f = $.Deferred(function(dfrd) { setTimeout(sendResponse, 3000);});
                queue(f).then(
                    function() { console.log("done") }, errorHandler);

                // run queue
            }
        }
        return true;
    }
);