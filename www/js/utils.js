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

// GOTOPAGE
function gotoPage(page){
    $('#pages .page.active').removeClass('active');
    $('#pages #' + page).addClass('active');
    $('body').attr('data-page', page);
    if(page != 'page-new-thought'){
        $('#new-thought-toggle').removeClass('active');
        $('#new-thought-panel').slideUp('fast', function(){
            $('#send-message-con').slideDown('fast');
        });
        _session.page = page;
    }else{
        $('#new-thought-toggle').addClass('active');
        $('#send-message-con').slideUp('fast', function(){
            $('#new-thought-panel').slideDown('fast');
        });
        getThoughts();
    }
}

function openLoader(message, options){
    $('#modal-loader .modal-body').html(message);

    if(typeof secure != "undefined"){
        $('#modal-loader').modal(options);
    }else{
        $('#modal-loader').modal('show');
    }
}

function closeLoader(){
    // Wait for previous lightbox to fadeout then close
    $('#modal-loader').modal('hide');
}

// GEO-LOCATION
function acquireGeolocation(){
    // Display Loader Lightbox
    openLoader('Acquiring geolocation...', {"backdrop":false, "keyboard":false});
    
    // Aquire GEO Location
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {enableHighAccuracy:true});
}

// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
function geoSuccess(position) {
    /*
    alert('GEO LOCATION INFO\n\n' +
          'Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    */
    _application.geolocation = {"latitude":position.coords.latitude.toFixed(7), "longitude":position.coords.longitude.toFixed(7)};
    saveGeolocation();
}

// onError Callback receives a PositionError object
//
function geoError(error) {
    $('#modal-loader .modal-body').html("LucidLife is unable to retrieve your current location.\n\nPlease ensure GPS is turned on and permissions are enabled for this application then login again.");
    $('#modal-loader .modal-footer').addClass('active');
}

function updateAbout(){
    $('#modal-about .version').html(_application.version);
    $('#modal-about .latitude').html(_application.geolocation.latitude);
    $('#modal-about .longitude').html(_application.geolocation.longitude);
    if(_session.user){
        $('#modal-about .user-info-name').html(_session.user.fname + ' ' + _session.user.lname);
        $('#modal-about .user-info-userid').html(_session.user.userid);
        $('#modal-about .user-info-gender').html(_session.user.gender);
        $('#modal-about .user-info-birthdate').html(_session.user.birthdate);
        if(_session.user.userid){
            $('#modal-about .user-info-status').html(_session.user.updatedate);
        }
        $('#modal-about .user-info-lastlogin').html(_session.user.lastlogin);
    }
}

function populateThoughtList(thoughtList, objList){
    var list = "";
    $.each(objList, function(){
        list += _template.thoughtListItem
                .replace(/\{stream}/g, this.stream)
                .replace(/\{activeusers}/g, this.activeusers);
    });
    $('.' + thoughtList + '-thought-list').html(list);
}
