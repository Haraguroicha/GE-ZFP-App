'use strict';
const ABOUT_BLANK = 'about:blank';
const ABOUT_CLOSE = chrome.runtime.getURL('close.html');
const DEFAULT_BLANK = chrome.runtime.getURL('blank.html');
const BLANK_TEXT = `<meta http-equiv="refresh" content="0; url='${DEFAULT_BLANK}'">`;

var mainWindow;

function OpenZFP(args, win) {
    var webview = win.contentWindow.document.querySelector('webview');
    var url = (args.url || ABOUT_BLANK)
        .replace(/lights=[\w]+/gi, '')
        .replace(/titleBar=[\w]+/gi, '')
        .replace(/mode=[\w]+/gi, '')
        .replace(/^https?(:\/\/)([^\/]+)\/zfp\/?\??/gi, 'https$1$2/ZFP?lights=Off&titleBar=Off&mode=Inbound&')
        .replace(/&+/gi, '&')
        .replace(/&#+/gi, '#');
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
                        console.log(e)
                        e.preventDefault();
                        newWindow_openInTabAndInterceptRedirect(e, (screen.availWidth >= 1024 ? screen.availWidth : 1024) - 100, (screen.availHeight >= 768 ? screen.availHeight : 750) - 100);
                    });
                    webview.addEventListener('contentload', function(e) {
                        var url = e.target.src;
                        if (url == ABOUT_CLOSE) {
                            return Array.from(chrome.app.window.getAll()).forEach(function(win) {
                                win.close();
                            });
                        }
                        if (url == ABOUT_BLANK && !args.url) {
                            return e.target.src = `data:text/html;base64,${btoa(BLANK_TEXT)}`;
                        }
                    });
                    webview.addEventListener('consolemessage', function(e) {
                        console.log('Guest page logged a message: ', e.message);
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
function newWindow_openInTabAndInterceptRedirect(event, w, h) {
    var newWindow = event.window;
    var child = popupwindow('childWindow.html', 'child', w, h);
    var formHTML = event.targetUrl;
    // Create an invisible proxy webview to listen to redirect
    // requests from |newWindow| (the window that the guest is
    // trying to open). NOTE: The proxy webview currently has to
    // live somewhere in the DOM, so we append it to the body.
    // This requirement is in the process of being eliminated.
    var proxyWebview = document.createElement('webview');
    setTimeout(function() {
        child.document.title = 'Waiting...';
        child.document.body.appendChild(proxyWebview);
        child.document.body.className = '';
        child.document.getElementById('background').style.display = 'none';
    }, 1000);
    proxyWebview.addEventListener('loadstop', function(e) {
        e.target.executeScript({
            code: 'document.title'
        }, function(title) {
            child.document.title = document.title || decodeURIComponent(formHTML.split('/').splice(-1));
        });
    });
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