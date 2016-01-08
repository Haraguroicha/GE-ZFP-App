window.addEventListener('load', function() {
    var url = location.hash.substr(1);
    var wv = document.getElementById('wv');
    wv.setUserAgentOverride(navigator.userAgent + ' GE ZFP App');
    wv.src = url;
});