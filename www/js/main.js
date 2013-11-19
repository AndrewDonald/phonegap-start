/* Method from PhoneGap Example
function startApp(){
    $('.app').addClass('hide');
    $('.page.home').removeClass('hide');
}
*/
var _session            = {};
    _session.stream     = {};
    _session.stream.id  = 0;
    
var _application                                = {};
    _application.node                           = {};
    _application.node.port                      = 8787;
    _application.node.socket                    = null;
    _application.servercookie                   = "PHPSESSID";
    _application.detect                         = {};
    _application.detect.useragent               = navigator.userAgent.toLowerCase();
    /*
    _application.detect.touchEnabled            = Modernizr.touch || 
                                                    (_application.detect.useragent.match(/(iphone|ipod|ipad)/) ||
                                                    _application.detect.useragent.match(/(android)/)  || 
                                                    _application.detect.useragent.match(/(iemobile)/) || 
                                                    _application.detect.useragent.match(/iphone/i) || 
                                                    _application.detect.useragent.match(/ipad/i) || 
                                                    _application.detect.useragent.match(/ipod/i) || 
                                                    _application.detect.useragent.match(/blackberry/i) || 
                                                    _application.detect.useragent.match(/bada/i));
    */
    _application.streamtimer                    = false;
    _application.url                            = {};
    _application.url.api                        = "https://dev.lucidlife.co/api/ajax.php"; 
    _application.url.fetch                      = {};
    _application.url.fetch["profile"]           = "/img/fetch.php?k=profile_";   // + userid + size="","-b" or "-c" + picext
    _application.url.fetch["activity"]          = "/img/fetch.php?k=activity_";  // + activityid + size="","-b" or "-c" + picext
    _application.filter                         = {};
    _application.filter.arrDistance             = ["1", "5", "10", "25", "50", "100", "250", "All"];
    _application.media                          = {"audioExtentionList":"mp3 ogg wmv wav", "photoExtentionList":"jpg png gif", "videoExtentionList":"avi mkv mpg mpeg mov mp4"};
    /*
    _application.template                       = {};
    _application.template["Message-Area"]       = $('#Message-Area').html();
    _application.template["User-Badge"]         = $('#User-Badge').html().replace('{Message-Area}', _application.template["Message-Area"]);
    _application.template["Member-List-Item"]   = $('#Member-List-Item').html();
    _application.template["List-Item"]          = $('#List-Item').html().replace('{Message-Area}', _application.template["Message-Area"]);
    _application.template.hotStreamsList        = $('#Hot-Streams-List-Item').html();
    _application.template["Stream-List-Item"]   = $('#Stream-List-Item').html();
//  _application.template["Buddy-List-Item"]    = $('#Buddy-List-Item').html();
    _application.template["Upload-File-Photo"]  = $('#Upload-File-Photo').html();
    */
    _application.pic                            = {};
    _application.pic.height                     = 50;
    _application.pic.width                      = 50;
    _application.mini                          = "-a."; // 50
    _application.badge                          = "-b."; // 100
    _application.preview                        = "-c."; // 500
    _application.streamMember                   = {};
    _application.messageMember                  = {};
    _application.indicator                      = {unreadMessages:0,buddyrequests:0};
    _application.geo                           = {};

var _lucid                      = {};
_lucid.panel                    = {};
_lucid.panel.stream             = {};
_lucid.panel.stream.view        = ["all","people","chat","photos","videos","audio","stream","filter","profile"];
_lucid.panel.stream.view.active = 0;
_lucid.panel.pages              = ["stream","filter","profile"];
_lucid.panel.apps               = ["chat","polls","surveys","promos","games","favorites","app1","app2","app3","app4"];
_lucid.panel.apps.active        = 0;


$(function() {
    $('.max-height').css('max-height', $(window).height() - 116);
    initEventHandlers();
});

// Show Step-1 of Create User Form
function joinLucidLife(){
    $('#pages > .page').removeClass('active');
    $('#page-create-user').addClass('active');
    $('#form-create-user > .steps').removeClass('active');
    $('#form-create-user > .steps.step-1').addClass('active');
}

// Show Step-2 of Create User Form 
function verifyCreateAccount(){
    $('#form-create-user > .steps').toggleClass('active');
}

// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
var geoSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function geoError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

navigator.geolocation.getCurrentPosition(geoSuccess, geoError);


/*
method:
auth_user
email:
test@flud.com
password:
testtest

https://dev.lucidlife.co/api/testbench.html
*/