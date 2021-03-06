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

	window.addEventListener("message", function(msg) {
	  	var target = msg.data.selection;
	  	if (target != null) {
			switch(target){
				case 'page-people':
					gotoPage(target);
					$('#page-people .people-list').toggleClass('active');
					break;
				case 'page-profile':
					gotoPage(target, true); // Let Page Handler know it's user and highlight Menu item
					$('#page-profile .user-profile').html(createUserProfile(_session.user, {square: true}));
					break;
				case 'page-login':
					gotoPage(target);
					if($(this).attr('id') == 'logout-toggle'){
						executeLogout();
					}
					break;
				case 'modal-about':
					$('#modal-about').modal();
					break;
				default:
					$('body').attr('data-page', target);
					gotoPage(target);
					break;
			}
			menuStatus = 0;
			steroids.drawers.hideAll();     
	    }   
	});
	
    // Submit Login
    $('#form-login input[name=email], #form-login input[name=password]').on('keypress', function(e) {
        if (e.which == 13 || e.keyCode == 13) {
            e.preventDefault();
            loginUser();
        }
    });

    // Submit Create User Form
    $('#form-create-user .btn-submit').on('click',function(){
        createUser();
        return false;
    });

    // Submit New Thought
    $('#form-thought input[name=thought]').on('keypress', function(e) {
        if (e.which == 13 || e.keyCode == 13) {
            e.preventDefault();
            submitThought($(this).val());
        }
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

    // Owl Carousel - Thought Page Group
    $('#thought-page-carousel').owlCarousel({
        slideSpeed:         300,
        paginationSpeed:    400,
        singleItem:         true,
        pagination:         false, 
        addClassActive:     true,
        afterMove:          updateThoughtSlider
    });
    
    // Owl Carousel - Item Select Navigation Control
    $('.btn-slider').click(function(){
        sliderDom       = '#' + $(this).parents('.slider-nav:first').attr('id').replace('-nav', '');
        sliderItemIndex = $(this).index();
        $(sliderDom).trigger('owl.goTo', sliderItemIndex);
    });

    // Highlight active Slider Nav item
    function updateThoughtSlider(sliderDom){
        var sliderItemActiveIndex = $(sliderDom).find('.owl-item.active').index();
        var sliderNavItem = $('#' + $(sliderDom).attr('id') + '-nav').children('.btn-slider:eq(' + sliderItemActiveIndex + ')');
        $(sliderNavItem)
            .addClass('active')
            .siblings().removeClass('active');

        // Repopulate People List if Sliding to People Page
        if($(sliderNavItem).attr('id') == 'btn-people-page'){
            $('body').attr('data-page', 'page-people');
            //$('#page-people').animate({scrollTop: '0px'}, 0);
            getStream();
            timeElapseStop();
        }

        if($(sliderNavItem).attr('id') == 'btn-public-page'){
            $('body').attr('data-page', 'page-public');
            timeElapseStart('page-public');
        }
    }

    // Show Character Counter on maxLength text inputs
    $('input[maxlength]').on('focus keyup',function() { 
        var maxChars = $(this).attr('maxlength');
        var numChars = $(this).val().length;
        $(this).parent().next('.character-counter').html(maxChars - numChars);
        //$('nav#footer').addClass('detach');
        //$('nav#footer').css('position','absolute');
        //$('nav#footer').css('top','0px');
    });

    // Clear Character Counter on maxLength text inputs onblur
    $('input[maxlength]').on('blur',function() {
        $(this).parent().next('.character-counter').empty();
        //$('nav#footer').removeClass('detach');
        //$('nav#footer').css('position','fixed');
        //$('nav#footer').css('top','0px');
    });

	// main menu toggle
	var menuStatus = 0;
	var menuView = new steroids.views.WebView( "/www/views/main-menu.html" );
	menuView.preload();

	var menuViewAnimation = new steroids.Animation({
	  transition: "slideFromLeft",
	  duration: 0.3,
	  curve: "linear"
	});

    // Main Menu Toggle
    $('#main-menu-toggle').on('click',function(){
        $(this).toggleClass('active');
		toggleDrawer();
        $('body').toggleClass('main-menu-active'); 
	});
		
	function toggleDrawer() { 
	  //$('body').toggleClass('main-menu-active');      
	  if (menuStatus == 0) {
	  	  menuStatus = 1;
		  window.postMessage({ name: _session.user.fname + " " + _session.user.lname }, "*");
		  steroids.drawers.show( {
			view: menuView,
			edge: steroids.screen.edges.LEFT,
			animation: menuViewAnimation
		  }, {
			onSuccess: function() {
			},
			onFailure: function(error) {
                if($('#main-menu-toggle').is('.active')){
                    $('body').toggleClass('main-menu-active'); 
                }
				alert("failure");
			}
		  });
	  } else {
	  	  menuStatus = 0;
		  steroids.drawers.hideAll();
	  }
	}

	// Thoughts Menu Toggle
    $('#new-thought-toggle').on('click',function(){
        $(this).toggleClass('active');
        $('body').toggleClass('new-thought-active');

        $('#send-message').attr('placeholder',"What's on your mind...");
        $('#new-thought-toggle').addClass('active');
        $('#form-thought input[name=thought]').val('');
        if($('#form-thought input[name=thought]').val().length < 3){
            $('#form-thought .btn[name=submitThought]').addClass('disabled');
        }else{
            $('#form-thought .btn[name=submitThought]').removeClass('disabled');
        }

        $('.suggested-thought-list').removeClass('active');
        $('.thought-lists-nav').removeClass('suggested');
        $('.btn-hot-streams').click();

        getThoughts();

    });

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
        // Close private Panel
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
        // Close private Panel
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

    // TOGGLE OPEN/CLOSE private PANEL
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
            //$('#people-list').addClass('active').slideDown('fast');
            var page = '#page-people';
            switch($(this).data('filter')){
                 case 'viewed-profile':
                    $(page + ' .people-list > .panel-menu > *').hide();
                    $(page + ' .people-list > .panel-menu > .btn.viewed-profile').show();
                    $(page + ' .people-list > .panel-menu').sortDom('.btn:visible', 'viewed-profile');
                    break;
                case 'connection-request':
                    $(page + ' .people-list > .panel-menu > *').hide();
                    $(page + ' .people-list > .panel-menu > .btn.connection-request').show();
                    $(page + ' .people-list > .panel-menu').sortDom('.btn:visible', 'connection-request');
                    break;
                case 'connected':
                    $(page + ' .people-list > .panel-menu > *').hide();
                    $(page + ' .people-list > .panel-menu > .btn.connected').show();
                    $(page + ' .people-list > .panel-menu').sortDom('.btn:visible', 'username');
                    break;
                case 'connecting':
                    $(page + ' .people-list > .panel-menu > *').hide();
                    $(page + ' .people-list > .panel-menu > .btn.connecting').show();
                    $(page + ' .people-list > .panel-menu').sortDom('.btn:visible', 'connecting');
                    break;
                 case 'blocked':
                    $(page + ' .people-list > .panel-menu > *').hide();
                    $(page + ' .people-list > .panel-menu > .btn.blocked').show();
                    $(page + ' .people-list > .panel-menu').sortDom('.btn:visible', 'blocked');
                    break;
                default: // All people in stream
                    //$('#people-list .viewed-profile, #people-list .in-stream, #people-list .added-stream').show();
                    //$(page + ' .people-list > .panel-menu > *').show();
                    //$(page + ' .people-list > .panel-menu').sortDom('.btn:visible', 'entry-date');
                    populatePeople();
                    break;
            }
        }
/*
        else{
            $('#people-panel .legend').remove(); // Remove Legend after user sees it first time
            //if($(this).is('.people-stream-toggle')){
                $('#people-list .btn.user.active').click(); // Close Active User Panel
                $('#people-list').removeClass('active').slideUp('fast'); // Close People Nav
            //}else if($(this).is('.people-private-toggle')){
            //    alert('hide private');
            //}
        }
        */
    });


    // TOGGLE CONNECTION PANEL USERS
    $('#people-list .btn.user').on('click',function(){
        $('.menu-toggle-stream-controls-panel.active').click();
        if($(this).is('.active')){
            $(this).removeClass('active');
            $('#send-message').prop('placeholder', "What's on your mind...");
            $('.connection-items-con.active').removeClass('active');
            $('OMIT#connection-items-header, .connection-items-con[data-userid="' + $(this).data('userid') + '"]').slideUp('fast');
        }else{
            $('#people-panel.vertical > #people-list').scrollTo($(this), 1000);
            $('body.filter-controls .filter-controls-toggle, #people-controls .btn.grid-toggle.active').click();
            $(this).addClass('active').siblings('.active').removeClass('active');
            $('#send-message').addClass('private').prop('placeholder', 'message ' + $(this).data('username'));
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




    // Chevron Toggle
/*
    $('.btn-accordion').on('click', function(){
        $(this).toggleClass('active')
            .children('.chevron-toggle').toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
        
        // People List Accordions
        if($(this).parents('#stream-and-people').size() > 0){
            //$(this).nextUntil('pre').toggleClass('reverse-pop').animate({delay:0}, 250, function(){
            //    $(this).toggle();
            //});
            $(this).nextUntil('pre').slideToggle(250);
        }
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