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

                // queue with increasing timeout
                for (i = 0; i < count; i++) {
                    var randomdelay = Math.ceil(Math.random() * 10) + 1;
                    var fixeddelay = 3 * i;
                    var delay = (randomdelay + fixeddelay) * 1000;
                    console.log("delay: " + delay);
                    var element = links[i];                    
                    console.log("element: " + element);
                    setTimeout(clickFollowButton, delay, element);
                }
            }
        }
        return true;
    }
);