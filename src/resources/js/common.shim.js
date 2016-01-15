if (typeof (window.console) == 'undefined')
    window.console = new function () { this.log = function () { }; this.error = function () { }; this.warn = function () { } };
if (!window.btoa) {
    // Source: http://www.koders.com/javascript/fid78168FE1380F7420FB7B7CD8BAEAE58929523C17.aspx
    window.btoa = function (input) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var result = '';
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            result += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
        } while (i < input.length);
        return result;
    };
}
if (!!!String.prototype.substring)
    String.prototype.substring = function (start, length) {
        var array = [];
        for (var i = start; i < start + length; i++) {
            array.push(this.charAt(i));
        }
        return array.join();
    };
if (!!!String.prototype.indexOf)
    String.prototype.indexOf = function (s) {
        for (var i = 0; i < this.length - s.length; i++) {
            if (this.charAt(i) === s.charAt(0) && this.substring(i, s.length) === s) {
                return i;
            }
        }
        return -1;
    };
