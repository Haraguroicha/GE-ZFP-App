HTMLFormElement.prototype.__submit = HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit = function submit() {
    setTimeout(function() {window.close();}, 500);
    return this.__submit();
}