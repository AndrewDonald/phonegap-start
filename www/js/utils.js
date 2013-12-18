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
        _session.page = page;
        if(page == "page-profile"){
            $('#page-profile .user-profile').empty();
        }
    }else{
        $('#new-thought-toggle').addClass('active');
        if($('#form-thought input[name=thought]').val().length < 3){
            $('#form-thought .btn[name=submitThought]').addClass('disabled');
        }else{
            $('#form-thought .btn[name=submitThought]').removeClass('disabled');
        }
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
    _session.geolocation = {"latitude":position.coords.latitude.toFixed(7), "longitude":position.coords.longitude.toFixed(7)};
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
    $('#modal-about .latitude').html(_session.geolocation.latitude);
    $('#modal-about .longitude').html(_session.geolocation.longitude);
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
        list += _application.template.thoughtListItem
                .replace(/\{{streamid}}/g, this.streamid)
                .replace(/\{{stream}}/g, this.stream)
                .replace(/\{{activeusers}}/g, this.activeusers);
    });
    $('.' + thoughtList + '-thought-list').html(list);
}


function getSessionID(){
    return storage.data('sessionid');
}

function setSessionID(value){
    storage.data('sessionid', value);
}

function getStreamID(){
    return _session.stream.streamid;
}

// SplitDate
function splitDate(date) {
    if (date != null) { 
        var first = date.split(" ");
        var day = first[0].split("-");
        day[1] = day[1] - 1; // month should be 0-11
        var time = first[1].split(":");
        var dt = day.concat(time);
        return (new Date(Date.UTC(dt[0], dt[1], dt[2], dt[3], dt[4], dt[5]))).getTime();
    }
}

function getStreamClass(streamid){
    var streamClass = "in-stream"; 
    if(streamid == _session.stream.streamid){
        streamClass = "added-stream";
    }

    return streamClass;
}

function getUserClass(userid){
    var userClass = ""; 
    if(userid == _session.user.userid){
        userClass = "you";
    }

    return userClass;
}

function getElapsedTime(date){
    var dateNowGMT  = moment.utc().add('minutes', _application.gmtOffset);
    // Client's clock may be behind so adjust to equal sent date if so to equal "a few seconds ago" instead of "in a few seconds"
    var secondsDiff = dateNowGMT.diff(date, 'seconds');
        if(secondsDiff < 0){dateNowGMT = date;}

    return moment(date).from(dateNowGMT);
}

function getFormatedDate(date){
    var dateNowGMT  = moment.utc().add('minutes', _application.gmtOffset);
    // Client's clock may be behind so adjust to equal sent date if so to equal "a few seconds ago" instead of "in a few seconds"
    var secondsDiff = dateNowGMT.diff(date, 'seconds');
        if(secondsDiff < 0){dateNowGMT = date;}

    return moment(dateNowGMT).calendar();
}

function getFormatedGender(gender){
    if(gender == "M"){
        formatedGender = "Male";
    }else{
        formatedGender = "Female";
    }

    return formatedGender;

}

