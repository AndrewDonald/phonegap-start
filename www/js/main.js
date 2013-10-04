/* Method from PhoneGap Example
function startApp(){
    $('.app').addClass('hide');
    $('.page.home').removeClass('hide');
}
*/

$(function() {
    /*
    // Trigger Info to be peeked at
    $('#header .main-nav-controls .info').click().animate({delay: 0}, 2000, function(){
        $(this).click();
    });
    */
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