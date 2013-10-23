/* Method from PhoneGap Example
function startApp(){
    $('.app').addClass('hide');
    $('.page.home').removeClass('hide');
}
*/

var _lucid                      = {};
_lucid.panel                    = {};
_lucid.panel.stream             = {};
_lucid.panel.stream.view        = ["all","people","chat","photos","videos","audio","stream","filter","profile"];
_lucid.panel.stream.view.active = 0;
_lucid.panel.pages              = ["stream","filter","profile"];
_lucid.panel.apps               = ["chat","polls","surveys","promos","games","favorites","app1","app2","app3","app4"];
_lucid.panel.apps.active        = 0;

$(function() {
    /*
    // Trigger Info to be peeked at
    $('#header .main-nav-controls .info').click().animate({delay: 0}, 2000, function(){
        $(this).click();
    });
    */

/*
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
    $(".stream-content").swipe({
        //Generic swipe handler for all directions
        swipeLeft:function(event, direction, distance, duration, fingerCount) {
            swipeStreamPanel('right'); 
        },
        swipeRight: function() {
            swipeStreamPanel('left'); 
        },
        threshold: 0 // Default is 75px, set to 0 for demo so any distance triggers swipe
    });
*/
    
    $('.stream-show-panel > panel-heading.panel-nav > .panel-menu > .btn:eq(' + _lucid.panel.stream.view.active + ')').addClass('active');

    // STREAM PANES CONTROLLER: Slide through the various Stream Panes
    $('.stream-content #home').on('click',function(){
        // STREAM PANES
        _lucid.panel.stream.view.active = (_lucid.panel.stream.view.active++ < _lucid.panel.stream.show.length - 1) ? _lucid.panel.stream.view.active : 0;
        $('body')
            .alterClass('stream-pane-active-*','')
            .addClass('stream-pane-active-' + _lucid.panel.stream.view.active);

        $('.stream-show-panel > panel-heading.panel-nav > .panel-menu > .btn').removeClass('active')
        $('.stream-show-panel > panel-heading.panel-nav > .panel-menu > .btn:eq(' + _lucid.panel.stream.view.active + ')').addClass('active');
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


//* EVENT HANDLERS *//////////////////////////////////////////////////////////////
/*
// Lucid Menu Hold Open until clicked/tapped outside of menu
$('#connections-panel-items.dropdown-menu').click(function(e) {
    e.stopPropagation();
});
*/

// Main Menu Toggle
$('#main-menu-toggle').on('click',function(){
    $(this).toggleClass('active');
    $('body').toggleClass('main-menu-active');
});

// Chevron Toggle
$('a.chevron').on('click',function(){
    $(this).toggleClass('active')
        .children('.chevron-toggle').toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
});

/*
// Lucid Menu Toggle
$('#connections-panel-toggle').on('click',function(){
    $(this).toggleClass('active');
    $('body').toggleClass('connections');
});
*/

// Main Menu Items
$('#main-menu-items > li > button').on('click',function(){
    //$(this).toggleClass('active');
    if($(this).is('.active') && typeof $(this).data('class-target') != "undefined"){
        $($(this).data('target')).collapse('hide');
    }
    /*else{
        var pageTarget = $(this).data('page-target');
        var classTarget = $(this).data('class-target');
        if(typeof classTarget == "undefined"){
            classTarget = "";
        }
        
        $('#pages > :not("#page-' + pageTarget + '")').removeClass('active');
        $('#pages > #page-' + pageTarget).toggleClass('active view-' + classTarget);
    }*/
});


/*
// Select User
$('.btn-lucid.user').on('click',function(){
    $(this).toggleClass('active').siblings().removeClass('active');
});
*/

// Stream & Filter Controls Toggles (*only one allowed open at a time)
$('#stream-and-filter-status .status-area a').on('click',function(){
            // If Stream COntrols
    if($(this).is('.stream-controls-toggle')){
        if($('body').hasClass('filter-controls')){
            $('.filter-controls-con').slideToggle('fast');
        }
        $('body').removeClass('filter-controls');
        $('body').toggleClass('stream-controls');
        $('.stream-controls-con').slideToggle('fast');
    }else{ // If Filter Controls
        if($('body').hasClass('stream-controls')){
            $('.stream-controls-con').slideToggle('fast');
        }
        $('body').removeClass('stream-controls');
        $('body').toggleClass('filter-controls');
        $('.filter-controls-con').slideToggle('fast');
    }
    $(this).children('.chevron-toggle').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
});

// Toggle Stream Associate
$('.stream-associations-list > li > a').on('click',function(){
    $(this).toggleClass('active');
});

// Toggle Stream Associate Remove
$('.stream-associations-list > li > button').on('click',function(){
    $(this).parent('li').remove();
    if($('.stream-associations-list > li').size() == 0){
        $('#stream-associations').removeClass('active');
    }
});

// TOGGLE STREAM VIEWS SELETOR BUTTONS
$('#stream-filters-menu > .stream-filters-menu-list > .btn').on('click',function(){
    $(this).toggleClass('active');
    $('body').toggleClass($(this).data('stream-filter'));
    if($(this).is('#associated-streams-toggle')){
        $('#stream-associations .stream-associations-list').toggleClass('active'); //.toggleClass('list-inline');
    }
});

// REMOVE ASSOCIATED STREAM BUTTON
$('#stream-associations button.remove').on('click',function(){
    $(this).parent().remove();
});

/*
// TOGGLE ON/OFF SELETOR BUTTONS
$('#connections-panel-items > li > a').on('click',function(){
    $(this).children('.menu-icon').toggleClass('glyphicon-eye-open glyphicon-eye-close');
    $('body').toggleClass($(this).data('toggle-item'));
});
*/

// TOGGLE ON/OFF SELETOR BUTTONS
$('.toggle-on-off').on('click',function(){
    $(this).toggleClass('on');
});

$('#connection-alerts button').on('click',function(){
    $(this).toggleClass('active').siblings().removeClass('active');
    if($(this).hasClass('active')){
        $('.alerts-panel[data-user="' + $(this).data('user') + '"]').slideToggle('fast').siblings().hide('fast');
    }else{
        $('.alerts-panel[data-user="' + $(this).data('user') + '"]').slideUp('fast');
    }
});

$('.alerts-panel .alert-link').on('click',function(){
    $(this).remove();
});

/*
// PANEL MENU
$('.panel > .panel-nav > .panel-menu:not(".btn-group")').on('click', '.btn', function(){
    var panel = $(this).data('panel');
    var panelType = $(this).data('panel-type');
    _lucid.panel[panel].active = $(this).index();

    $(this).siblings('.btn').removeClass('active');
    $('.panel:not(".' + panelType + '-panel")').removeClass('active');
    
    $(this).toggleClass('active');
    $('.panel .' + panelType + '-panel').toggleClass('active');
});
*/

// STREAM PANE Swipe handler
function swipeStreamPanel(direction){
    if(direction.toLowerCase() == "left"){
        _lucid.panel.stream.show.active = (_lucid.panel.stream.show.active-- > 0) ? _lucid.panel.stream.show.active : (_lucid.panel.stream.show.length - 1);
    }else{
        _lucid.panel.stream.show.active = (_lucid.panel.stream.show.active++ < _lucid.panel.stream.show.length - 1) ? _lucid.panel.stream.show.active : 0;
    }

    $('body')
        .alterClass('stream-pane-active-*','')
        .addClass('stream-pane-active-' + _lucid.panel.stream.show.active);

    $('.stream-pane-menu > .status-icon').removeClass('active')
    $('.stream-pane-menu > .status-icon:eq(' + _lucid.panel.stream.show.active + ')').addClass('active');

    $(".stream-pane-menu-con").scrollTo('#' + _lucid.panel.stream[_lucid.panel.stream.show.active].toLowerCase() + '-stream-pane');
}

/* UTILS */////////////////////////////////////////////////////////////////////
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

$.fn.scrollTo = function( targetDom ){
    var offset = $(targetDom).offset();
    $(this).animate({
        scrollTop: offset.top,
        scrollLeft: offset.left
    });
}
