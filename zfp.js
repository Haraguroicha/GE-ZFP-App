'use strict';
const ABOUT_BLANK = 'about:blank';
const BLANK_TEXT = `Sorry for your inconvenient to saw this page when you want to Open GE ZFP, 
this app is only used for triggered by match ZFP URL in your browser, 
please click a ZFP link or paste ZFP link in your address bar to navigate ZFP.`;

var mainWindow;

function OpenZFP(args, win) {
    var webview = win.contentWindow.document.querySelector('webview');
    var url = (args.url || ABOUT_BLANK).replace(/^https?(:\/\/)/gi, 'https$1');
    webview.src = url;
    return webview;
}

chrome.app.runtime.onLaunched.addListener(function(args) {
    var screenWidth = (screen.availWidth >= 1024 ? screen.availWidth : 1024);   //screen.availWidth;
    var screenHeight = (screen.availHeight >= 768 ? screen.availHeight : 750);  //screen.availHeight;
    var width = 1024;
    var height = 750;
    chrome.app.window.create('app.html', {
            id: '_zfpMainWindow'
        }, function openCallback(win) {
            mainWindow = win;
            if (mainWindow.contentWindow.document.readyState == 'complete') {
                if (!!args.url) {
                    OpenZFP(args, win);
                }
            } else {
                win.innerBounds.width = width;
                win.innerBounds.height = height;
                win.innerBounds.minWidth = 1000;
                win.innerBounds.minHeight = 580;
                win.innerBounds.left = Math.floor((screenWidth - width) / 2);
                win.innerBounds.top = Math.floor((screenHeight - height) / 2);
                win.contentWindow.addEventListener('load', function() {
                    win.resizeTo((screen.availWidth >= 1024 ? screen.availWidth : 1024), (screen.availHeight >= 768 ? screen.availHeight : 750));
                    var webview = OpenZFP(args, win);
                    webview.addEventListener('newwindow', function(e) {
                        // console.log(e)
                        // e.preventDefault();
                        // newWindow_openInTabAndInterceptRedirect(e);
                    });
                    webview.addEventListener('contentload', function(e) {
                        var url = e.target.src;
                        if (url == ABOUT_BLANK && !args.url) {
                            e.target.src = `data:text/html;base64,${btoa(BLANK_TEXT)}`;
                        }
                    });
                });
            }
        }
    );
});

function popupwindow(url, title, w, h) {
    var left = (screen.availWidth / 2) - (w / 2);
    var top = (screen.availHeight / 2) - (h / 2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left + ', screenX=' + left + ', screenY=' + top);
}
function newWindow_openInTabAndInterceptRedirect(event) {
    var newWindow = event.window;
    var child = popupwindow('childWindow.html', 'child', 800, 600);
    var formHTML = event.targetUrl;
    if(formHTML.match(/^EMR\/\//i) == null) {
        setTimeout(function() {
            var args = unescape(formHTML).split('\x07').slice(1).reverse().slice(-2).reverse();
            var title = decodeURIComponent(atob(args[0] || ''));
            var message = decodeURIComponent(atob(args[1] || ''));
            child.document.title = 'Sending Native Message' + (title.length > 0 ? ' - ' + title : '');
            child.document.getElementById('message').innerHTML = message || 'Please waiting for response...';
        }, 500);
        setTimeout(function() { child.location.href = formHTML; }, 1000);
    } else {
        formHTML = unescape(formHTML).match(/EMR\/\/(.*)$/)[0].split('\x07')[2];
        console.log(formHTML);
        setTimeout(function() {
            child.document.title = 'Submitting Form...';
            child.document.getElementById('content').innerHTML = formHTML;
            child.document.getElementsByTagName('form')[0].submit();
            //child.close();
        }, 1000);
    }
        //chrome.app.window.create('packaged/childWindow.html', {id: id}, openCallback);
        // Create an invisible proxy webview to listen to redirect
        // requests from |newWindow| (the window that the guest is
        // trying to open). NOTE: The proxy webview currently has to
        // live somewhere in the DOM, so we append it to the body.
        // This requirement is in the process of being eliminated.
        var proxyWebview = document.createElement('webview');
        //p = proxyWebview;
        console.log(proxyWebview);
        /*
        proxyWebview.onBeforeRequest.addListener(
            // Listen to onBeforeRequest event (chrome.webRequest API)
            // on proxyWebview in order to intercept newWindow's redirects.
            function(e) {
              console.log(e);
            },
            { urls: [ "<all_urls>" ] },
            [ 'blocking' ]
        );
        */
        mainWindow.contentWindow.document.body.appendChild(proxyWebview);

        // Attach |newWindow| to proxyWebview. From the original
        // webview guest's point of view, the window is now opened
        // and ready to be redirected: when it does so, the redirect
        // will be intercepted by |onBeforeRequestListener|.
        newWindow.attach(proxyWebview);
}

/*
chrome.tabs.onUpdated.addListener(function(_id, cgi, _t) {
    var rej = function(v) {console.log(`rejected: ${v}`)};
    var zfpPattern = /^https?:\/\/.*\/ZFP[/?]{1}/i;
    var id = _t.id;
    var url = _t.url;
    var status = _t.status;
    if (url.match(zfpPattern) != null) {
        var zp = new Promise(function (resolve, reject) {
            var z = [];
            var rs = function() {
                resolve(z);
            };
            var t = setTimeout(rs, 100);
            chrome.windows.getAll(function(windows) {
                Array.from(windows).forEach(function(window) {
                    chrome.tabs.getAllInWindow(window.id, function(tabs) {
                        Array.from(tabs).forEach(function(tab) {
                            var isZFP = tab.url.match(zfpPattern) != null;
                            if (isZFP) {
                                z.push(tab);
                                clearTimeout(t);
                                t = setTimeout(rs, 100);
                            }
                        });
                    });
                });
            });
        }).then(function(zt) {
            zt = zt.map(function(e) {
                if (e.id != id) {
                    return e;
                } else {
                    console.log(e);
                    return null;
                }
            });
            if(zt.length > 0) {
                var t = zt[0];
                if(t != null) {
                    chrome.tabs.executeScript(t.id, {
                        code: `
                            var qs = '${url}'
                                .replace(/(&?lights=O(ff|n)&?|&?titleBar=O(ff|n)&?|&?mode=Inbound&?)/gi, '&')
                                .replace(/[&]+/gi, '&')
                                .replace(/\\?(&?)/gi, '?lights=Off&titleBar=Off&mode=Inbound$1')
                                .replace(/\\/#/gi, '/?lights=Off&titleBar=Off&mode=Inbound#')
                                .replace(/&#/gi, '#');
                            var ll = { search: location.search, hash: location.hash };
                            if (location.href != qs) {
                                location.replace(qs);
                            }
                        `
                    }, function() {
                        try {
                            chrome.tabs.remove(id);
                        } catch(e) {
                            //
                        }
                    });
                }
            }
        }, rej).catch(rej);
    }
});
*/