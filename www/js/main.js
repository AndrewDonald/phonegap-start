/* Method from PhoneGap Example
function startApp(){
    $('.app').addClass('hide');
    $('.page.home').removeClass('hide');
}
*/

var _lucid = {};
_lucid.panel = {};
_lucid.panel.stream = ["people", "chat", "photos", "videos", "audio"];
_lucid.panel.stream.active = 0;
_lucid.panel.apps = ["stream","filter","people", "chat","polls","surveys","promos","games","favorites","app1","app2","app3","app4"];
_lucid.panel.apps.active = 0;

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
            $(this).parent().carousel('next'); 
        },
        swipeRight: function() {
            $(this).parent().carousel('prev'); 
        },
        threshold: 0 // Default is 75px, set to 0 for demo so any distance triggers swipe
    });

    // ENABLE BOOTSTRAP CAROUSEL SWIPING GESTURES
    $("#home").swipe( {
        //Generic swipe handler for all directions
        swipeLeft:function(event, direction, distance, duration, fingerCount) {
            swipeStreamPane('right'); 
        },
        swipeRight: function() {
            swipeStreamPane('left'); 
        },
        threshold: 0 // Default is 75px, set to 0 for demo so any distance triggers swipe
    });

    $('.stream-pane-menu > .status-icon:eq(' + _lucid.panel.stream.active + ')').addClass('active');

    // STREAM PANES CONTROLLER: Slide through the various Stream Panes
    $('.content #home').on('click',function(){
        // STREAM PANES
        _lucid.panel.stream.active = (_lucid.panel.stream.active++ < _lucid.panel.stream.length - 1) ? _lucid.panel.stream.active : 0;
        $('body')
            .alterClass('stream-pane-active-*','')
            .addClass('stream-pane-active-' + _lucid.panel.stream.active);

        $('.stream-pane-menu > .status-icon').removeClass('active')
        $('.stream-pane-menu > .status-icon:eq(' + _lucid.panel.stream.active + ')').addClass('active');

        $(".stream-pane-menu-con").scrollTo('#' + _lucid.panel.stream[_lucid.panel.stream.active].toLowerCase() + '-stream-pane');
/*
        var offset = $('#' + _lucid.panel.stream[_lucid.panel.stream.active].toLowerCase() + '-stream-pane').offset();
$(".stream-pane-menu-con").animate({
    scrollTop: offset.top,
    scrollLeft: offset.left
});
*/
/*
        // PRIVATE PANES
        _lucid.panel.private.active = (_lucid.panel.private.active++ < _lucid.panel.private.length - 1) ? _lucid.panel.private.active : 0;
        $('body')
            .alterClass('private-pane-active-*','')
            .addClass('private-pane-active-' + _lucid.panel.private.active);

        $('.private-pane-menu > .status-icon').removeClass('active')
        $('.private-pane-menu > .status-icon:eq(' + _lucid.panel.private.active + ')').addClass('active');
*/

    });

});

//* EVENT HANDLERS *//
// STREAM CONTROLS BUTTON
$('.stream-private-pane').on('click',function(){
    $(this).toggleClass('active');
    $('.stream-controls-carousel').toggle();
    $('body').toggleClass('stream-controls-panel-expanded');
});

/*
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
$('#footer .private-panels').on('click',function(){
    $(this)
        .toggleClass('active')
        .children('.toggle')
            .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    $(this).next().slideToggle('fast');
    $('body').toggleClass('private-panel-expanded');
});
*/

// TOGGLE ON/OFF SELETOR BUTTONS
$('.toggle-on-off').on('click',function(){
    $(this).toggleClass('on');
});

// STREAM PANEL MENU
$('.stream-pane-menu > .btn-lucid').on('click',function(){
    _lucid.panel.stream.active = $(this).index();
    $('body')
        .alterClass('stream-pane-active-*','')
        .addClass('stream-pane-active-' + _lucid.panel.stream.active);

    $('.stream-pane-menu > .status-icon').removeClass('active');
    $('.stream-pane-menu > .status-icon:eq(' + _lucid.panel.stream.active + ')').addClass('active');
});

// PANEL MENU
$('.panel > .panel-nav > .panel-menu:not(".btn-group")').on('click', '.btn', function(){
    var panel = $(this).data('panel');
    var panelType = $(this).data('panel-type');
    _lucid.panel[panel].active = $(this).index();
    
    /*
    $('body')
        .alterClass('private-pane-active-*','')
        .addClass('private-pane-active-' + _lucid.panel.private.active);
    */

    $(this).siblings('.btn').removeClass('active');
    $('.panel:not(".' + panelType + '-panel")').removeClass('active');
    

    $(this).toggleClass('active');
    $('.panel .' + panelType + '-panel').toggleClass('active');
});


// STREAM PANE Swipe handler
function swipeStreamPane(direction){
    if(direction.toLowerCase() == "left"){
        _lucid.panel.stream.active = (_lucid.panel.stream.active-- > 0) ? _lucid.panel.stream.active : (_lucid.panel.stream.length - 1);
    }else{
        _lucid.panel.stream.active = (_lucid.panel.stream.active++ < _lucid.panel.stream.length - 1) ? _lucid.panel.stream.active : 0;
    }

    $('body')
        .alterClass('stream-pane-active-*','')
        .addClass('stream-pane-active-' + _lucid.panel.stream.active);

    $('.stream-pane-menu > .status-icon').removeClass('active')
    $('.stream-pane-menu > .status-icon:eq(' + _lucid.panel.stream.active + ')').addClass('active');

    $(".stream-pane-menu-con").scrollTo('#' + _lucid.panel.stream[_lucid.panel.stream.active].toLowerCase() + '-stream-pane');
}

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

$.fn.scrollTo = function( targetDom ){
    var offset = $(targetDom).offset();
    $(this).animate({
        scrollTop: offset.top,
        scrollLeft: offset.left
    });
}
