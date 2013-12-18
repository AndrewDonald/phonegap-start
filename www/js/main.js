/* Method from PhoneGap Example
function startApp(){
    $('.app').addClass('hide');
    $('.page.home').removeClass('hide');
}
*/
var _session                    = {};
    _session.id                 = "";
    _session.loggedIn           = false;
    _session.page               = "page-login";
    _session.user               = {};
    _session.geolocation        = {"latitude":0,"longitude":0};
    _session.people             = {"user":{}};      // Children: _session.people.user['userid']
    _session.conversation       = {"chat":{}};      // Children: _session.conversation.chat['chatid']
    _session.stream             = {"streamid":0, "stream":"All"};
    _session.streamAdded        = {"stream":{}};    // Children: _session.streamAdded.stream['id']  // Added Parallel Streams parent
    _session.streamConversation = {"chat":{}};      // Children: _session.streamConversation.chat['chatid']     // inStream Conversation parent
        
    //_session.user.filter = "My Filter";           // Filter to apply. "" = no filter 
    //_session.user.filters = {};                   // Filters parent
    //_session.user.filters.filter['My Filter'] = {gender:"B", ageFrom:25, ageTo:55, distance:3.5};
    
    
var _application                                = {};
    _application.version                        = "0.3.3";
    _application.node                           = {};
    _application.node.port                      = 8787;
    _application.node.socket                    = null;
    _application.detect                         = {};
    _application.detect.useragent               = navigator.userAgent.toLowerCase();
    _application.node.streamserver              = "https://dev.lucidlife.co";
    _application.gmtOffset                      = new Date().getTimezoneOffset();
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
    
    _application.template                       = {};
    _application.template.streamButton          = $('#stream-button.template').html();
    _application.template.userButton            = $('#user-button.template').html();
    _application.template.userProfile           = $('#user-profile.template').html();
    _application.template.thoughtListItem       = $('#thought-list-item.template').html();
    _application.template.notificationItem      = $('#notification-item.template').html();
    _application.template.dateHeaderItem        = $('#date-header-item.template').html();
    _application.template.addedMemberItem       = $('#added-member-item.template').html();
    _application.template.addedStreamItem       = $('#added-stream-item.template').html();
    _application.template.chatItem              = $('#chat-item.template').html();
    
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
    _application.mini                           = "-a."; // 50
    _application.badge                          = "-b."; // 100
    _application.preview                        = "-c."; // 500
    _application.messageMember                  = {};
    _application.indicator                      = {unreadMessages:0,buddyrequests:0};

var _lucid                          = {};
    _lucid.panel                    = {};
    _lucid.panel.stream             = {};
    _lucid.panel.stream.view        = ["all","people","chat","photos","videos","audio","stream","filter","profile"];
    _lucid.panel.stream.view.active = 0;
    _lucid.panel.pages              = ["stream","filter","profile"];
    _lucid.panel.apps               = ["chat","polls","surveys","promos","games","favorites","app1","app2","app3","app4"];
    _lucid.panel.apps.active        = 0;

// moment.js Initialization
moment.lang('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s",
        s:  "secs",
        m:  "a min",
        mm: "%dmins",
        h:  "an hr",
        hh: "%dhrs",
        d:  "a day",
        dd: "%ddays",
        M:  "a mth",
        MM: "%dmths",
        y:  "a yr",
        yy: "%dyrs"
    }
});

moment.lang('en', {
    calendar : {
        lastDay : '[yesterday @] LT',
        sameDay : '[today @] LT',
        nextDay : '[tomorrow at] LT',
        lastWeek : '[last] dddd [@] LT',
        nextWeek : 'dddd [@] LT',
        sameElse : 'L'
    }
});

$(function() {
populatePeopleList();
    initEventHandlers();

    updateAbout();
    gotoPage('page-login');
    
    // Auto-Login if previous authentication data exists in localStorage
    if(storage.data('login')){
        $('#form-login input[name="email"]').val(storage.data('login').email);
        $('#form-login input[name="password"]').val(storage.data('login').password);
        loginUser();
    }
    //app.initialize(); //app.initialize(); // app.receivedEvent();
    
   // $('.max-height').css('max-height', $(window).height() - 128);
});

// Show Step-1 of Create User Form
function joinNow(){
    gotoPage('page-create-user');
    $('#form-create-user > .steps').removeClass('active');
    $('#form-create-user > .steps.step-1').addClass('active');
}

// Show Step-1 of Create User Form
function joinBack(){
    $('#form-create-user > .steps.step-2').removeClass('active');
    $('#form-create-user > .steps.step-1').addClass('active');
}

// Show Step-2 of Create User Form 
function verifyCreateAccount(){
    $('#form-create-user > .steps').toggleClass('active');
}

function initializeApp(){
    _session.loggedIn = true;
    $('body').removeClass('logged-out');
    $('#main-menu .header .btn.login-toggle').addClass('active');
    $('#main-menu .header .username').html(_session.user.fname + " " + _session.user.lname);
    
    //setSessionID(value);
    storage.data("login", {"email": _session.user.email, "password": $('#form-login input[name="password"]').val()});
    //localStorage.setItem('email', _session.user.email);
    //localStorage.setItem('password', $('#form-login input[name="password"]').val());
    updateAbout();
    $('#profile-toggle').attr('data-userid', _session.user.userid); // Profile Initialization
    gotoPage('page-new-thought');
    //updateNodeServer();
}

function deinitializeApp(){
    _session.loggedIn = false;
    $('body').removeClass('logged-out');
    $('#main-manu .header .btn.login-toggle').removeClass('active');
    
    updateAbout();
    gotoPage('page-login');
}

// Changes Thought Stream
function changeStream(objStream){
    _session.stream  = objStream;
    _session.streamAdded = {"stream":{}}; 
    _session.streamConversation = {"chat":{}}; 
    
    gotoPage('page-conversation');
    $('#page-conversation h2#today').html('<b>TODAY</b><br>' + moment().format("dddd, MMMM Do YYYY"));
    $('#page-conversation .connection-items-con .connection-items-list').empty();
    updateStreamStatus();

    // Pre populate stream with recent/latest conversation
    getChats();
    updateNodeServer();
    // Show all People in People Page
    populatePeopleList();
    $('#people-controls .btn[data-filter=blocked]').click();
}

// Changes Thought Stream
function updateStreamStatus(){
    if($(window).width() <= 360 && _session.stream.stream.length > 30 ){
        $('#stream-status-panel .filter-info').removeClass('pull-right').addClass('pull-left');
    }else{
        $('#stream-status-panel .filter-info').removeClass('pull-left').addClass('pull-right');
    }
    $('#stream-status-panel .stream-info .stream-name').html(_session.stream.stream);
    $('#stream-status-panel .stream-info .badge').html('9999');
}

function addStreamMember(objUser, direction) {
    $('.stream-people > article.User-Badge[data-userid="' + objUser.userid + '"]').remove();
//    var selector = " > .wrapper";
//    if ($('html').is('.no-touch')) {
//  selector += " > .jspContainer > .jspPane";
//    }
    if (direction == 0) {    
        $('.stream-people').prepend(createUserBadge(objUser, "people")).children('article.User-Badge:first').hide().show(500).flash(500,2); //.removeAttr('style');
    } else {
        $('.stream-people').append(createUserBadge(objUser, "people")).children('article.User-Badge:first').show(); //.removeAttr('style');
    }
}

/* Chat Response object data
 public $chatid;
 public $userid;
 public $fname;
 public $lname;
 public $gender;
 public $age;
 public $latitude;
 public $longitude;
 public $distance;
 public $picextension;
 public $streamid;
 public $stream;
 public $chat;
 public $chatpicextension;
 public $createdate;
 public $updatedate;
 public $status;
*/

function addUser(objUser) {
    _session.people.user[objUser.userid] = {userid:         objUser.userid,
                                            fname:          objUser.fname,
                                            lname:          objUser.lname,
                                            gender:         objUser.gender,
                                            age:            objUser.age,
                                            latitude:       objUser.latitude,
                                            longitude:      objUser.longitude,
                                            distance:       objUser.distance,
                                            picextension:   objUser.picextension,
                                            streamid:       objUser.streamid,
                                            entrydate:      objUser.createdate};
}

function addChatItem(objChat) {
    if(!_session.people.user[objChat.userid]){
        addUser(objChat);
    }

    var user = objChat;

    _session.streamConversation.chat[user.chatid] =   {chatid:user.chatid,
                                                        userid:user.userid,
                                                        chat:user.chat,
                                                        chatpic:user.chatpicextension,
                                                        createdate:user.createdate,
                                                        status:user.status};

    if (objChat.updatedate != null) {
        user.time = splitDate(objChat.updatedate);
    }else{
        user.time = splitDate(objChat.createdate);
    }

    if (objChat.chatpicextension != null) {
        user.messageattachment = '<img alt="' + user.chatid + '" src="' + _application.url.fetch["activity"] + user.chatid + _application.preview + user.chatpicextension + '"/>';
    }else{
        user.messageattachment = "";
    }
    
//    var selector = " > .wrapper";
//    if ($('html').is('.no-touch')) {
//  selector += " > .jspContainer > .jspPane";
//    }
    
    var mediaType = "chat";
    var mediaTypeMax = 3;
    if (objChat.chatpicextension != null && objChat.chatpicextension.length > 0) {
        if(_application.media.photoExtentionList.indexOf(objChat.chatpicextension) >= 0){
            mediaType = "photo";
            mediaTypeMax = 4;
        }else if(_application.media.videoExtentionList.indexOf(objChat.chatpicextension) >= 0){
            mediaType = "video";
            mediaTypeMax = 1;
        }else if(_application.media.audioExtentionList.indexOf(objChat.chatpicextension) >= 0){
            mediaType = "audio";
            mediaTypeMax = 1;
        }
    }

    //var chatItem = createChatItem(objChat);
    //if (direction == 0) { //$('ul.more_stories li:gt(2)').hide();
    $('#page-conversation .connection-items-con .connection-items-list').prepend(createChatItem(objChat));
    var convoItem = $('#page-conversation .connection-items-con .connection-items-list [data-userid=' + objChat.userid + ']:first');
    $(convoItem).slideDown(500, function(){
        $(this).removeAttr('style').find('.btn-lucid.user').removeClass('exit').animate({delay:0}, function(){
            $(convoItem).find('.panel-body').removeClass('exit');
        });
    });
    
    /*
        //if($('#page-conversation > .connection-items-con .connection-items-list').size() > 0 && $(this).children().size() <= mediaTypeMax){
        //   $('#page-conversation > .connection-items-con .connection-items-list').children('li:gt(' + mediaTypeMax + ')').remove();
        //}
    }else{
        $('#page-conversation > .connection-items-con .connection-items-list').append(createUserBadge(user, mediaType)).children('article.User-Badge:first');
        //if($('#page-conversation > .connection-items-con .connection-items-list').size() > 0 && $(this).children().size() <= mediaTypeMax){
        //    $('#page-conversation > .connection-items-con .connection-items-list').children('li:gt(' + mediaTypeMax + ')').remove();
        //}
    }
    */
}

function createUserButton(objData, objSettingsOverrides){
    var objSettings = {animate:false, square:false, class:""};
    $.extend(objSettings, objSettingsOverrides);


    if(objSettings.square == true){
        objSettings.class += ' square';
    }

    if(objSettings.animate == true){
        objSettings.class += ' pop';
    }

    var userButton = _application.template.userButton
                    //.replace(/\{{connecting}}/g,        getConnectingClass(objData.userid))
                    .replace(/\{{badge}}/g,      '') //getConnectingQty(objData.userid))
                    //.replace(/\{{connected}}/g,         getConnectedClass(objData.userid))
                    //.replace(/\{{viewed-your-profile}}/g,getViewedYourProfileClass(objData.userid))
                    //.replace(/\{{viewed-your-profile-date}}/g,getViewedYourProfileDate(objData.userid))
                    //.replace(/\{{connection-request}}/g,    if(connection-request-date) = show icon)
                    //.replace(/\{{last-active-date}}/g,  getLastActiveDate(objData.userid))
                    //.replace(/\{{user-status}}/g,       getUserStatusClass(objData.userid))
                    //.replace(/\{{active}}/g,            '')
                    .replace(/\{{stream-class}}/g,      getStreamClass(objData.streamid))
                    .replace(/\{{you}}/g,               getUserClass(objData.userid))
                    .replace(/\{{viewed}}/g,            'viewed')
                    .replace(/\{{viewed-date}}/g,       objData.createdate)
                    .replace(/\{{streamid}}/g,          objData.streamid)
                    .replace(/\{{stream}}/g,            objData.stream)
                    .replace(/\{{fname}}/g,             objData.fname)
                    .replace(/\{{lname}}/g,             objData.lname)
                    .replace(/\{{userid}}/g,            objData.userid)
                    .replace(/\{{createdate}}/g,        objData.createdate)
                    .replace(/\{{class}}/g,             objSettings.class);
    
    return userButton;
}

function createUserProfile(objData){
    var userProfile = _application.template.userProfile
                    .replace(/\{{user-button}}/g,       createUserButton(objData, {square: true}))
                    .replace(/\{{gender}}/g,            getFormatedGender(objData.gender))
                    .replace(/\{{age}}/g,               objData.age)
                    //.replace(/\{{last-active-date}}/g,  getLastActiveDate(objData.userid))
                    .replace(/\{{biography}}/g,         objData.biography ? null : '');
    
    return userProfile;
}

function createChatItem(objData){
    var chatItem = _application.template.chatItem
                    .replace(/\{{user-button}}/g,       createUserButton(objData, {animate:true}))
                    //.replace(/\{{connected}}/g,         getConnectedClass(objData.userid))
                    //.replace(/\{{connecting}}/g,        getConnectingClass(objData.userid))
                    //.replace(/\{{connecting-qty}}/g,    getConnectingQty(objData.userid))
                    //.replace(/\{{viewed-your-profile}}/g,getViewedYourProfileClass(objData.userid))
                    //.replace(/\{{viewed-your-profile-date}}/g,getViewedYourProfileDate(objData.userid))
                    //.replace(/\{{last-active-date}}/g,  getLastActiveDate(objData.userid))
                    //.replace(/\{{user-status}}/g,       getUserStatusClass(objData.userid))
                    .replace(/\{{stream-class}}/g,      getStreamClass(objData.streamid))
                    .replace(/\{{you}}/g,               getUserClass(objData.userid))
                    .replace(/\{{viewed}}/g,            'viewed')
                    .replace(/\{{viewed-date}}/g,       objData.createdate)
                    .replace(/\{{entry-date}}/g,        objData.createdate)
                    .replace(/\{{streamid}}/g,          objData.streamid)
                    .replace(/\{{stream}}/g,            objData.stream)
                    .replace(/\{{fname}}/g,             objData.fname)
                    .replace(/\{{lname}}/g,             objData.lname)
                    .replace(/\{{userid}}/g,            objData.userid)
                    .replace(/\{{chat}}/g,              objData.chat)
                    .replace(/\{{chatpicextension}}/g,  objData.chatpicextension)
                    .replace(/\{{createdate}}/g,        getElapsedTime(objData.createdate));
    
    return chatItem;
}

// Displays a line item in the COnversation Stream
function displayStreamItem(objHtml){
    $('#page-conversation .connection-items-con .connection-items-list').prepend(objHtml)
        .children('.list-group-item:first').hide().slideDown(250).removeAttr('style');
}

function addNotificationItem(notification) {                       
    displayStreamItem(_application.template.notificationItem.replace(/\{{notification}}/g, notification));
}

function addStreamItem(objData) {
    if(!_session.streamAdded.stream[objData.streamid.toString()]){
        _session.streamAdded.stream[objData.streamid.toString()] = {"streamid":objData.streamid, "stream":objData.stream};
        
        var addedStreamItem = _application.template.addedStreamItem
                                .replace(/\{{stream-button}}/g, _application.template.streamButton)
                                .replace(/\{{streamid}}/g, objData.streamid)
                                .replace(/\{{stream}}/g, objData.stream)
                                .replace(/\{{members}}/g, '99') // objData.members
                                .replace(/\{{added-stream}}/g, 'added-stream');

        displayStreamItem(addedStreamItem);
    }
}

function addMemberItem(objData) {
    if(!_session.people.user[objData.userid.toString()]){
        _session.people.user[objData.userid.toString()]         = objData; 
        _session.people.user[objData.userid.toString()].time    = splitDate(_session.people.user[objData.userid.toString()].createdate);
        
        var addMemberItem = _application.template.addedMemberItem
                            .replace(/\{{user-button}}/g, createUserButton(objData, {animate:true}));

       displayStreamItem(addMemberItem);
    }
}

function addChatItem(objData) {
    if(!_session.conversation.chat[objData.chatid.toString()]){
        _session.conversation.chat[objData.chatid.toString()]       = objData; 
        _session.conversation.chat[objData.chatid.toString()].time  = splitDate(_session.conversation.chat[objData.chatid.toString()].createdate);
        
        var you = "";
        if(objData.userid == _session.user.userid){
            you = "you";
        }

        var chatItem = _application.template.chatItem
                            .replace(/\{{user-button}}/g,   createUserButton(objData, {animate:true}))
                            .replace(/\{{you}}/g,           you)
                            .replace(/\{{chat}}/g,          objData.chat)
                            .replace(/\{{createdate}}/g,    getElapsedTime(objData.createdate));

       displayStreamItem(chatItem);
    }
}

function populatePeopleList(){
    $('#people-list').html($('#sample-people.template').html());
}
