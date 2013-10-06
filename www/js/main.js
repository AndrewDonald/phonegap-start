/* Method from PhoneGap Example
function startApp(){
    $('.app').addClass('hide');
    $('.page.home').removeClass('hide');
}
*/

var _ll = {};
_ll.pane = {};
_ll.pane.stream = ["People", "All", "Chat", "Photos", "Videos", "Audio"];
_ll.pane.stream.active = 0;
_ll.pane.private = ["Connections", "Chat"];
_ll.pane.private.active = 0;

$(function() {
    /*
    // Trigger Info to be peeked at
    $('#header .main-nav-controls .info').click().animate({delay: 0}, 2000, function(){
        $(this).click();
    });
    */

    // ENABLE BOOTSTRAP CAROUSELS
    $('.carousel').carousel({interval: false});

    // ENABLE BOOTSTRAP CAROUSEL SWIPING GESTURES
    $(".carousel-inner").swipe( {
        //Generic swipe handler for all directions
        swipeLeft:function(event, direction, distance, duration, fingerCount) {
            $(this).parent().carousel('prev'); 
        },
        swipeRight: function() {
            $(this).parent().carousel('next'); 
        },
        threshold: 0 // Default is 75px, set to 0 for demo so any distance triggers swipe
    });

    // DISPLAY DEFAULT STREAM & PERSONAL PANES 
    $('body')
        .addClass('stream-pane-active-' + _ll.pane.stream.active)
        .addClass('private-pane-active-' + _ll.pane.private.active);

    $('.stream-pane-menu > .status-icon:eq(' + _ll.pane.stream.active + ')').addClass('active');

    // STREAM PANES CONTROLLER: Slide through the various Stream Panes
    $('.content #home').on('click',function(){
        // STREAM PANES
        _ll.pane.stream.active = (_ll.pane.stream.active++ < _ll.pane.stream.length - 1) ? _ll.pane.stream.active : 0;
        $('body')
            .alterClass('stream-pane-active-*','')
            .addClass('stream-pane-active-' + _ll.pane.stream.active);

        $('.stream-pane-menu > .status-icon').removeClass('active')
        $('.stream-pane-menu > .status-icon:eq(' + _ll.pane.stream.active + ')').addClass('active');

        // PRIVATE PANES
        _ll.pane.private.active = (_ll.pane.private.active++ < _ll.pane.private.length - 1) ? _ll.pane.private.active : 0;
        $('body')
            .alterClass('private-pane-active-*','')
            .addClass('private-pane-active-' + _ll.pane.private.active);

        $('.private-pane-menu > .status-icon').removeClass('active')
        $('.private-pane-menu > .status-icon:eq(' + _ll.pane.private.active + ')').addClass('active');
    });
});

// MAIN-MENU INFO: Toggle Hide/Show All Indicators andd Info Popup
$('#header .main-nav-controls .info').on('click',function(){
    $(this).toggleClass('active');
    if($(this).is('.active')){
        $('body').toggleClass('public-panels-peek');
        $('.indicator').fadeIn(500);
    }else{
        $('body').toggleClass('public-panels-active');
        $('.indicator').fadeOut(500);
    }
});

// STREAM HEADER Toggle Hide/Show Stream Info
$('#stream-header .status').on('click',function(){
    $(this)
        .toggleClass('active')
        .children('.toggle')
            .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    $(this).next().slideToggle('fast');
    $('body').toggleClass('public-panel-expanded');
});

// STREAM FOOTER Toggle Hide/Show Stream Activity and Personal Indicators
$('#footer .status').on('click',function(){
    $(this)
        .toggleClass('active')
        .children('.toggle')
            .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    $(this).next().slideToggle('fast');
    $('body').toggleClass('private-panel-expanded');
});

/* UTILS */
// Alter classes by partial match using "*" wildcard. ie: $('#foo').alterClass('foo-* bar-*', 'foobar')
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