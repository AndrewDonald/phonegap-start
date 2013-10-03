function startApp(){
    $('.app').addClass('hide');
    $('.page.home').removeClass('hide');
}

$('#stream-header .status').on('click',function(){
    $(this).children('.toggle').toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    $(this).next().slideToggle('fast');
    $('body').toggleClass('client-header-expanded');
});