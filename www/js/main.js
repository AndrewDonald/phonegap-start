function startApp(){
    $('.app').addClass('hide');
    $('.page.home').removeClass('hide');
}

$('#stream-header .status').on('click',function(){
    $(this).children('.toggle').toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    $(this).next().slideToggle('fast');
    $('body').toggleClass('client-header-expanded');
});


$('#footer .status .toggle').on('click',function(){
    $('body').toggleClass('stream-activity-filters-expanded');
    $(this).children('span').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
    $(this).siblings('.stream-activity-filters').slideToggle('fast');
});


$('.stream-activity-filters button').on('click',function(){
    $(this).toggleClass('btn-warning btn-success');
    if($(this).is('.activity-all.btn-warning')){ // If Show All Activities is deselected
        $('.stream-activity-filters-media .btn').removeClass('btn-success').addClass('btn-warning');
        $('.stream-activity-filters-media .btn.activity-people').addClass('btn-success');
    }else if($(this).is('.activity-all.btn-success')){ // If Show All Activities is selected
        $('.stream-activity-filters-media .btn').removeClass('btn-warning').addClass('btn-success');
    }else if($(this).parent('.stream-activity-filters-media').size() > 0){ // If any single activity is selected
        $('.stream-activity-filters .btn.activity-all').removeClass('btn-success').addClass('btn-warning');
    }

    if($('.stream-activity-filters-media .btn.btn-warning').size() == 0){ // If all activity buttons are selected
        $('.stream-activity-filters .btn.activity-all').removeClass('btn-warning').addClass('btn-success');
    }

    if($('.stream-activity-filters .btn.btn-success').size() == 0){ // If No activity buttons are selected
        $('.stream-activity-filters-media .btn.activity-people').removeClass('btn-warning').addClass('btn-success');
    }
});