//* DEVICE EVENT HANDLERS *//
/*
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // Display Loader Lightbox
        $('#modal-loader .modal-body').html('Getting location...');
        $('#modal-loader').modal('show');
        
        // Aquire GEO Location
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {enableHighAccuracy:true});

        //console.log('Received Event: ' + id);
    }
};
*/

//* APP EVENT HANDLERS *//
function initEventHandlers(){
    // Submit Create User Form
    $('#form-create-user .btn-submit').on('click',function(){
        createUser();
        return false;
    });
	
    // Toggle-Nav Custom Component (Shows/Hides content based on index of Nav Item clicked)
    $('.toggle-nav > .btn').on('click', function(){
        var index = $(this).index();
        var target = $(this).data('target');
        if(!target){
            target = $(this).parent().next();
        }

        $(this).addClass('active').siblings().removeClass('active');
        $(target).children(':eq(' + index + ')').addClass('active').siblings().removeClass('active');
        //$(this).parent().next().children(':eq(' + index + ')').addClass('active').siblings().removeClass('active');
    });

    // Tab-Lucid Custom Component (Shows/Hides content using collapse)
    $('.tab-lucid').on('click', function(){
        $(this).toggleClass('active');
    });

    
    

/*
    $('#send-message').on('focus',function(e) { 
        $('html,body').animate({
              scrollTop: 0
         });
        $('nav#footer').addClass('detach');
        //$('nav#footer').css('position','absolute');
        //$('nav#footer').css('top','0px');
    });
    
    $('#send-message').on('blur',function(e) {
        $('nav#footer').removeClass('detach');
        //$('nav#footer').css('position','fixed');
        //$('nav#footer').css('top','0px');
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
    /*
        // STREAM PANES CONTROLLER: Slide through the various Stream Panes
        $('.stream-content #home').on('click',function(){
            // STREAM PANES
            _lucid.panel.stream.view.active = (_lucid.panel.stream.view.active++ < _lucid.panel.stream.show.length - 1) ? _lucid.panel.stream.view.active : 0;
            $('body')
                .alterClass('stream-pane-active-*','')
                .addClass('stream-pane-active-' + _lucid.panel.stream.view.active);

            $('.stream-show-panel > panel-heading.panel-nav > .panel-menu > .btn').removeClass('active')
            $('.stream-show-panel > panel-heading.panel-nav > .panel-menu > .btn:eq(' + _lucid.panel.stream.view.active + ')').addClass('active');
    */
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


        //Open Panels
        //$('.menu-toggle-stream-controls-panel, .menu-toggle-connections').click();



    
    /*
    // Lucid Menu Hold Open until clicked/tapped outside of menu
    $('#people-panel-items.dropdown-menu').click(function(e) {
        e.stopPropagation();
    });
    */

    // Main Menu Toggle
    $('#main-menu-toggle').on('click',function(){
        $(this).toggleClass('active');
        if($(this).is('.active')){
            $('body').addClass('main-menu-active');
        }else{
            $('.navbar-fixed-top, .navbar-fixed-bottom').addClass('delay-fixed');
            $('body').removeClass('main-menu-active').animate({delay:0}, 500, function(){
                $('.navbar-fixed-top, .navbar-fixed-bottom').removeClass('delay-fixed');
            });
        }
    });



    /*
    // Lucid Menu Toggle
    $('#control-panels-toggle').on('click',function(){
        $(this).toggleClass('active');
        $('body').toggleClass('connections');
    });
    */

    // Main Menu Items
    $('[data-toggle-item]').on('click',function(){
        $('#main-menu-toggle').removeClass('active');
        $('body').removeClass('main-menu-active');
        $('.navbar-fixed-top, .navbar-fixed-bottom').addClass('delay-fixed');
        $('body').removeClass('main-menu-active').animate({delay:0}, 500, function(){
            $('.navbar-fixed-top, .navbar-fixed-bottom').removeClass('delay-fixed');
        });
        //$(this).toggleClass('active');
        if($(this).is('.active') && typeof $(this).data('class-target') != "undefined"){
            $($(this).data('target')).collapse('hide');
        }else{
            var target = $(this).data('toggle-item');
            /*
            var classTarget = $(this).data('class-target');
            if(typeof classTarget == "undefined"){
                classTarget = "";
            }
            */
            
            switch(target){
                case 'page-new-thought':
                    $('#new-thought-toggle').toggleClass('active');
                    if($('#new-thought-toggle').is('.active')){
                        gotoPage('page-new-thought'); // Go to New Thought Page
                    }else{
                        gotoPage(_session.page);    // Return to last page
                    }
                    break;  
                case 'page-people':
                    $('body').removeClass('people-panel-peek').addClass('people-panel');
                    $('#people-list').toggleClass('active');
                    gotoPage(target);
                    //$('#people-panel').addClass('vertical');
                    //$('.people-controls-toggle').click();
                    break;
                case 'page-profile':
                    gotoPage(target);
                    $('#page-profile .user-profile').html(createUserProfile(_session.user, {square: true}));
                    break;
                case 'page-login':
                    gotoPage(target);
                    if($(this).attr('id') == 'logout-toggle'){
                        executeLogout();
                    }
                    break;
                default:
                    $('body').attr('data-page', target);
                        gotoPage(target);
                    break;
            }
        }
    });


    /*
    // Select User
    $('.btn-lucid.user').on('click',function(){
        $(this).toggleClass('active').siblings().removeClass('active');
    });
    */

    // Toggle Stream Select (blur on click to remove active state)
    $('.select-toggle').on('click blur', function(e){
        if($(this).next('.dropdown-menu').is(':visible') || e.type == "blur"){
            $(this).removeClass('active');
            $(this).blur();
        }else{
            $(this).addClass('active');
        }
    });
    /*
    // Toggle Filter Select (blur on click to remove active state)
    $('.select-toggle').on('click blur', function(e){
        if($('#modal-select-filter').is(':visible') || e.type == "blur"){
            $(this).removeClass('active');
            $(this).blur();
        }else{
            $(this).addClass('active');
        }
    });
    */
    /*
    // Toggle Stream Pause
    $('.stream-pause-toggle').on('click',function(){
        $('.stream-select-toggle').toggleClass('active');
        //$('.stream-select-toggle').toggleClass('disabled');
    });
    */

    /*
    // Toggle Stream New
    $('.stream-new-toggle').on('click',function(){
        // Close Connections Panel
        $('#people-list button.user.active').click();
        $('.filter-controls-toggle.active').click();
        // Display Stream options
        $(this).toggleClass('active');
    });
    */

    /*
    // Associated Stream Off message's button to turn back on
    $('#stream-associations-panel .stream-associates-off > button.associates-on').on('click', function(){
        //$('.associated-streams-toggle').click();
    });

    // No Associated Streams message's button to add
    $('#stream-associations-panel .no-stream-associates > button.associates-on').on('click', function(){
        $('.stream-select-toggle').click();
    });
    */

    // Remove Stream Associate
    $('.stream-associations-list > li > button').on('click', function(){
        $(this).parent().hide('fast', function(){
            $(this).remove();
            if($('.stream-associations-list > li').size() == 0){
                $('#stream-associations-panel').addClass('empty');
            }
        });
    });

    // Toggle Stream Associate
    $('.stream-associations-list > li > a').on('click', function(){
        if($('.stream-associations-list > li').size() > 0){
            $('#stream-associations-panel').removeClass('empty');
        }
        $(this).toggleClass('active');
    });

    // Filter Controls Toggles (*only one allowed open at a time)
    $('.filter-controls-toggle').on('click', function(){
        // Close Connections Panel
        $('#people-list button.user.active').click();
        $('body').toggleClass('filter-controls');
        $('.filter-controls-con').slideToggle('fast');
    });


    /*
    // Toggle Associated Streams Horizontal/Vertical view
    $('.associated-streams-vertical-toggle').on('click', function(){
        $('body').toggleClass('associations-vertical');
        $('.stream-associations').toggleClass('vertical');
    });
    */

    // Toggle Associated Streams On/Off
    $('.toggle-expand').on('click blur', function(e){
        if(e.type == "click"){
            $(this).toggleClass('active').children('.toggle-icon');
            $(this).parent('.slider-status-con').toggleClass('vertical')
                .children('.list-group').toggleClass('list-inline');
        }else{
            if( $(this).parent('.slider-status-con').is('.vertical')){
                $(this).addClass('active');
            } 
        }
    });


    // Toggle Associated Streams On/Off
    /*
    $('.xassociated-streams-toggle').on('blur', function(){
        if($('.associated-streams-status-con').is('.vertical')){
            $('.associated-streams-toggle').toggleClass('active');
            //alert('keep active');
        }
    });
    */

    // Toggle Filter on/off
    $('.filter-toggle-menu-list > li').on('click', function(){
        $('body').addClass('filter-on');
        $(this).toggleClass('active');
        if($(this).hasClass('active')){
            $('.filter-controls-toggle').removeClass('off');
        }else{
            $('.filter-controls-toggle').addClass('off');
        }

        var link = $(this).children('li > a');
        $('body').toggleClass($(this).data('stream-filter'));
        $(link).toggleClass('active');
        //$('.associated-streams-toggle').toggleClass('active');
        if($(link).is('.associated-streams-toggle')){
            if($(link).hasClass('active')){
                $('#stream-associations-panel').removeClass('off');
            }else{
                $('#stream-associations-panel').addClass('off');
            }
        }

        if($(link).is('.glyphicon-list') || $(this).is('.glyphicon-th-large')){
            $(link).toggleClass('glyphicon-list glyphicon-th-large');
        }
    });

    /*
    // TOGGLE ON/OFF SELETOR BUTTONS
    $('#people-panel-items > li > a').on('click',function(){
        $(this).children('.menu-icon').toggleClass('glyphicon-eye-open glyphicon-eye-close');
        $('body').toggleClass($(this).data('toggle-item'));
    });
    */

    // TOGGLE ON/OFF SELETOR BUTTONS
    $('.toggle-on-off').on('click',function(){
        $(this).toggleClass('on');
    });

    // TOGGLE OPEN/CLOSE CONNECTIONS PANEL
    $('#people-controls .btn').on('click',function(){
        /*
        // Grid: Show People with Vertical Scrolling
        if($(this).is('.grid-toggle')){
            $('#people-panel .legend').remove(); // Remove Legend after user sees it first time
            $('#people-panel').toggleClass('vertical');
            if($('#people-panel').is('.vertical')){
                $('.menu-toggle-stream-controls-panel.active, #people-list .btn.user.active').click();
            }
        */

        $(this).toggleClass('active').siblings().removeClass('active');
        if($(this).is('.active')){
            $('#people-list').addClass('active').slideDown('fast');
            switch($(this).data('filter')){
                case 'connected':
                    $('#people-list > .panel-menu > .btn').hide();
                    $('#people-list > .panel-menu > .btn.connected').show();
                    $('#people-list > .panel-menu').sortDom('.btn:visible', 'username');
                    break;
                case 'connection-request':
                    $('#people-list > .panel-menu > .btn').hide();
                    $('#people-list > .panel-menu > .btn.connection-request').show();
                    $('#people-list > .panel-menu').sortDom('.btn:visible', 'connection-request');
                    break;
                case 'connecting':
                    $('#people-list > .panel-menu > .btn').hide();
                    $('#people-list > .panel-menu > .btn.connecting').show();
                    $('#people-list > .panel-menu').sortDom('.btn:visible', 'connecting');
                    break;
                case 'viewed-your-profile':
                    $('#people-list > .panel-menu > .btn').hide();
                    $('#people-list > .panel-menu > .btn.viewed-your-profile').show();
                    $('#people-list > .panel-menu').sortDom('.btn:visible', 'viewed-your-profile');
                    break;
                 case 'blocked':
                    $('#people-list > .panel-menu > .btn').hide();
                    $('#people-list > .panel-menu > .btn.blocked').show();
                    $('#people-list > .panel-menu').sortDom('.btn:visible', 'blocked');
                    break;
                default: // All people in stream
                    //$('#people-list .viewed-profile, #people-list .in-stream, #people-list .added-stream').show();
                    $('#people-list > .panel-menu > .btn').show();
                    $('#people-list > .panel-menu').sortDom('.btn:visible', 'entry-date');
                    break;
            }
        }else{
            $('#people-panel .legend').remove(); // Remove Legend after user sees it first time
            //if($(this).is('.people-stream-toggle')){
                $('#people-list .btn.user.active').click(); // Close Active User Panel
                $('#people-list').removeClass('active').slideUp('fast'); // Close People Nav
            //}else if($(this).is('.people-connections-toggle')){
            //    alert('hide connections');
            //}
        }
    });

    // TOGGLE CONNECTION PANEL USERS
    $('#people-list .btn.user').on('click',function(){
        $('.menu-toggle-stream-controls-panel.active').click();
        if($(this).is('.active')){
            $(this).removeClass('active');
            $('#send-message').prop('placeholder', 'message everyone');
            $('.connection-items-con.active').removeClass('active');
            $('OMIT#connection-items-header, .connection-items-con[data-userid="' + $(this).data('userid') + '"]').slideUp('fast');
        }else{
            $('#people-panel.vertical > #people-list').scrollTo($(this), 1000);
            $('body.filter-controls .filter-controls-toggle, #people-controls .btn.grid-toggle.active').click();
            $(this).addClass('active').siblings('.active').removeClass('active');
            $('#send-message').addClass('private').prop('placeholder', 'message ' + $(this).data('username'));
            $('OMIT#connection-items-header').slideDown('fast');
            $('.connection-items-con[data-userid="' + $(this).data('userid') + '"]').addClass('active').slideDown('fast')
                .siblings('.active').removeClass('active').slideUp('fast');  
        }
    });

    $('#people-list .alert-link').on('click',function(){
        //$(this).remove();
        alert('selected a user item');
    });

    // Connection Items Header Controls
    $('#connection-items-header .btn').on('click',function(){
        // Toggle on/off buttons
        $(this).toggleClass('active');

        switch ($(this).data('connection-type')){
            case 'viewed':
                $('#people-panel > .panel-body').toggleClass('show-viewed');
                break;
            case 'close': 
                
                break;
            default: 
                $(this).siblings().removeClass('active');
                break;
        }
    });

    /*
    // Chevron Toggle
    $('.chevron-toggle').parent().on('click',function(){
        $(this).toggleClass('active .btn.active').click();
            .children('.chevron-toggle').toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    });
    */

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
    /*
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
    */
}
// initEventHandlers (END)