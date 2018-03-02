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
function clickFollowButton(element, test_mode, delay, resolve) {
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    console.log("waiting: " + delay);
    wait(delay).then(() => {
        if (test_mode) {
            console.log("TEST click: " + delay);
        } else {
            console.log("REAL click: " + delay);
            dispatchMouseEvent(element, 'mouseover', true, true);
            dispatchMouseEvent(element, 'mousedown', true, true);
            dispatchMouseEvent(element, 'click', true, true);
            dispatchMouseEvent(element, 'mouseup', true, true);
        }
        resolve();
    });
}

// listener
chrome.runtime.onMessage.addListener(
    function (msg, sender, sendResponse) {
        // could redo this as a switch or fn lookup
        if (msg.text === 'report_back') {
            console.log("sending report back");
            sendResponse(document.all[0].outerHTML);
        }

        if (msg.text === 'get_count') {
            var links = $("a[id='follow-user']:not(.f-hide)");
            console.log("links: " + links.length);
            sendResponse({count: links.length});
            //links.each((l) => console.log("href: " + l.href));
        }

        if (msg.text === 'get_links') {
            var links = $("a[id='follow-user']:not(.f-hide)");
            console.log("links: " + links.length);
            links.each((l) => console.log("href: " + l.href));
        }

        if (msg.text === 'do_follow') {
            var count = msg.count;
            var links = $("a[id='follow-user']:not(.f-hide)");

            // early return
            if (!links) {
                console.log("no links found");
                sendResponse({count: 0});
            }

            // don't process more links than are available
            console.log("links: ", links.length);
            if (count > links.length) {
                console.log("reducing count from " + count + " to " + length);
                count = links.length;
            }

            // create the queue
            var fns = [];
            let test_mode = msg.test_mode;
            for (let i = 0; i < count; i++) {
                console.log("links[" + i + "]: " + links[i]);
                fns.push(new Promise(function(resolve,reject) {
                    clickFollowButton(links[i], test_mode, i * 1000, resolve);
                }));
                console.log("added");
            }

            let c = count;
            Promise.all(fns).then(
                () => sendResponse({count: c, test_mode: test_mode}),
                () => console.log("error") 
            );
            
            console.log("queue done");            
        }
        return true;
    }
);