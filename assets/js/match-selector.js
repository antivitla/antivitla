function matchSelector (element, selector) {
    var matches = (element.document || element.ownerDocument).querySelectorAll(selector),
        i = matches.length;
    while (--i >= 0 && matches.item(i) !== element) ;
    return i > -1;
}