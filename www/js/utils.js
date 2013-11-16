// Dom Sorter
jQuery.fn.sortDom = function sortDivs(dom, data, direction) { //direction = "desc" or "asc"
    // Apply sort direction
    if(typeof direction == "undefined" || direction == ""){
        $("> " + dom, this[0]).sort(desc_sort).appendTo(this[0]);
    }else{
        $("> " + dom, this[0]).sort(asc_sort).appendTo(this[0]);
    }
    // Sorter methods
    function desc_sort(a, b){return ($(b).data(data)) < ($(a).data(data)) ? 1 : -1;}
    function asc_sort(a, b){return ($(b).data(data)) > ($(a).data(data)) ? 1 : -1;}
}

// Alter classes by partial match using "*" wildcard. ie: $('#foo').alterClass('foo-* bar-*', 'foobar')
//    $('body')
//        .alterClass('private-pane-active-*','')
//        .addClass('private-pane-active-' + _lucid.panel.private.active);
$.fn.alterClass = function ( removals, additions ) {
    var self = this;

    if ( removals.indexOf( '*' ) === -1 ) {
        // Use native jQuery methods if there is no wildcard matching
        self.removeClass( removals );
        return !additions ? self : self.addClass( additions );
    }
     
    var patt = new RegExp( '\\s' +
                    removals.
                        replace( /\*/g, '[A-Za-z0-9-_]+' ).
                        split( ' ' ).
                        join( '\\s|\\s' ) +
                        '\\s', 'g' );
     
    self.each( function ( i, it ) {
        var cn = ' ' + it.className + ' ';
        while ( patt.test( cn ) ) {
            cn = cn.replace( patt, ' ' );
        }
        it.className = $.trim( cn );
    });
     
    return !additions ? self : self.addClass( additions );
};

// ScrollTo
$.fn.scrollTo = function( targetDom ){
    var offset = $(targetDom).offset();
    $(this).animate({
        scrollTop: offset.top,
        scrollLeft: offset.left
    });
}