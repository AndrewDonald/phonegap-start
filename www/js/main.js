/* Method from PhoneGap Example
function startApp(){
    $('.app').addClass('hide');
    $('.page.home').removeClass('hide');
}
*/

var _ll = {};
_ll.pane = {};
_ll.pane.stream = ["All", "People", "Chat", "Photos", "Videos", "Audio"];
_ll.pane.stream.active = 1;
_ll.pane.personal = ["Chat", "Connections", "History"];
_ll.pane.personal.active = 0;

$(function() {
    /*
    // Trigger Info to be peeked at
    $('#header .main-nav-controls .info').click().animate({delay: 0}, 2000, function(){
        $(this).click();
    });
    */

    // Set to default Stream Pane
    $('body').addClass(_ll.pane.stream[_ll.pane.stream.active].toLowerCase() + "-pane-active");

    // STREAM PANES CONTROLLER: Slide through the various Stream Panes
    $('.content #home').on('click',function(){
        _ll.pane.stream.active++;
        if(_ll.pane.stream.active == _ll.pane.stream.length){
            _ll.pane.stream.active = 0;
        }
        console.log(_ll.pane.stream.join("-pane-active ").toLowerCase());
        $('body')
            .removeClass((_ll.pane.stream.join("-pane-active ")).toLowerCase())
            .addClass(_ll.pane.stream[_ll.pane.stream.active].toLowerCase() + "-pane-active");
    });
});

// MAIN-MENU INFO: Toggle Hide/Show All Indicators andd Info Popup
$('#header .main-nav-controls .info').on('click',function(){
    $(this).toggleClass('active');
    if($(this).is('.active')){
        $('#stream-header .status:not(".active")').click();
        $('.indicator').fadeIn(500);
    }else{
        $('#stream-header .status.active').click();
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