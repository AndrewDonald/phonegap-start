/* Method from PhoneGap Example
function startApp(){
    $('.app').addClass('hide');
    $('.page.home').removeClass('hide');
}
*/
var _temp                   = {};

var _session                = {};
    _session.id             = "";
    _session.loggedIn       = false;
    _session.page           = "page-login";
    _session.user           = {};
    _session.geolocation    = {"latitude":0,"longitude":0};
    _session.users          = {"user":{}};      // Children: _session.users.user['userid']
    _session.public         = {"chat":{}};      // Children: _session.public.chat['chatid']
    _session.stream         = {"streamid":null, "stream":null};
    _session.streamAdded    = {"stream":{}};    // Children: _session.streamAdded.stream['id']  // Added Parallel Streams parent
    _session.streampublic   = {"chat":{}};      // Children: _session.streampublic.chat['chatid']     // inStream public parent
    _session.people         = {};
    _session.timeElapse     = 0; //setInterval(function(){timeElapse()}, 30000);

    //_session.user.filter = "My Filter";           // Filter to apply. "" = no filter 
    //_session.user.filters = {};                   // Filters parent
    //_session.user.filters.filter['My Filter'] = {gender:"B", ageFrom:25, ageTo:55, distance:3.5};
    
var _application                                = {};
    _application.version                        = "0.4.0";
    _application.node                           = {};
    _application.node.port                      = 8787;
    _application.node.socket                    = null;
    _application.detect                         = {};
    _application.detect.useragent               = navigator.userAgent.toLowerCase();
    _application.node.streamserver              = "https://dev.lucidlife.co";
    _application.gmtOffset                      = new Date().getTimezoneOffset();
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
    _application.template.userProfileModal      = $('#user-profile-modal.template').html();
    _application.template.streamAccordionTab    = $('#stream-accordion-tab.template').html();
    _application.template.thoughtListItem       = $('#thought-list-item.template').html();
    _application.template.notificationItem      = $('#notification-item.template').html();
    _application.template.dateHeaderItem        = $('#date-header-item.template').html();
    _application.template.addedMemberItem       = $('#added-member-item.template').html();
    _application.template.addedStreamItem       = $('#added-stream-item.template').html();
    _application.template.chatItem              = $('#chat-item.template').html();
    //_application.template["Upload-File-Photo"]  = $('#Upload-File-Photo').html();

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
        s:      "a moment ago",
        m:      "1 min ago",
        mm:     "%d mins ago",
        h:      "1 hr ago",
        hh:     "%d hrs ago",
        d:      "1 day ago",
        dd:     "%d days ago",
        M:      "1 mth ago",
        MM:     "%d mths ago",
        y:      "1 yr ago",
        yy:     "%d yrs ago"
    }
});

moment.lang('en', {
    calendar : {
        lastDay:    '[Yesterday]',
        sameDay:    '[Today]',
        nextDay:    '[Tomorrow]',
        lastWeek:   'dddd',
        nextWeek:   'dddd',
        sameElse:   'L'
    }
});

$(function() {
    /* Test (Start) */
    populatePeople();
    //populateNewestMember({streamid:0, stream:"test", userid:"2", picextension:"jpg", fname:"TestNewUser"});
    $('.btn-accordion.new, .btn-accordion.new-arrivals').click();
    /* Test (End) */

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
    _session.stream         = objStream;
    _session.streamAdded    = {"stream":{}}; 
    _session.public         = {"chat":{}}; 
    
    gotoPage('page-people');
    // Display Today's Date Header
    $('#page-public h2#today').html('Today');
    // Clear Public Chat
    $('#page-public .connection-items-list').empty();
    populateNewestMember(_session.user);
    updateStreamStatus();

    // Pre populate stream with recent/latest public
    getChats();
    updateNodeServer();
    // Show all People in People Page
    getStream();
}

// Changes Thought Stream
function updateStreamStatus(){
    if($(window).width() <= 360 && _session.stream.stream.length > 30 ){
        $('#stream-status-panel .filter-info').removeClass('pull-right').addClass('pull-left');
    }else{
        $('#stream-status-panel .filter-info').removeClass('pull-left').addClass('pull-right');
    }
    $('#stream-status-panel .stream-info .stream-name').html(_session.stream.stream);
    //$('#stream-status-panel .stream-info .badge').html();
}

function addUser(objUser) {
    _session.users.user[objUser.userid] = {userid:         objUser.userid,
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
                    //.replace(/\{{viewed-profile}}/g,getViewedYourProfileClass(objData.userid))
                    //.replace(/\{{viewed-profile-date}}/g,getViewedYourProfileDate(objData.userid))
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
                    .replace(/\{{time}}/g,              objData.lastlogindate)
                    .replace(/\{{last-login-date}}/g,   getElapsedTime(objData.lastlogindate))
                    .replace(/\{{biography}}/g,         objData.biography ? objData.biography : '');
    
    return userProfile;
}

function createUserProfileModal(objData){
    var userProfileModal = _application.template.userProfileModal
                    .replace(/\{{fname}}/g,             objData.fname)
                    .replace(/\{{lname}}/g,             objData.lname)
                    .replace(/\{{userid}}/g,            objData.userid)
                    .replace(/\{{gender}}/g,            getFormatedGender(objData.gender))
                    .replace(/\{{age}}/g,               objData.age)
                    .replace(/\{{time}}/g,              objData.lastlogindate)
                    .replace(/\{{last-login-date}}/g,   getElapsedTime(objData.lastlogindate))
                    .replace(/\{{biography}}/g,         objData.biography ? objData.biography : '');
    
    return userProfileModal;
}

function createChatItem(objData){
    var chatItem = _application.template.chatItem
                    .replace(/\{{user-button}}/g,       createUserButton(objData, {animate:true}))
                    //.replace(/\{{connected}}/g,         getConnectedClass(objData.userid))
                    //.replace(/\{{connecting}}/g,        getConnectingClass(objData.userid))
                    //.replace(/\{{connecting-qty}}/g,    getConnectingQty(objData.userid))
                    //.replace(/\{{viewed-profile}}/g,getViewedYourProfileClass(objData.userid))
                    //.replace(/\{{viewed-profile-date}}/g,getViewedYourProfileDate(objData.userid))
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
                    .replace(/\{{time}}/g,              objData.createdate)
                    .replace(/\{{createdate}}/g,        getElapsedTime(objData.createdate));
    
    return chatItem;
}

// Displays a line item in the public Stream
function displayStreamItem(objHtml, append){
    if(append){
        $('#page-public .connection-items-list').append(objHtml)
            .children('.list-group-item:first').hide().slideDown(250).removeAttr('style');
    }else{
        $('#page-public .connection-items-list').prepend(objHtml)
            .children('.list-group-item:first').hide().slideDown(250).removeAttr('style');
    }
}

function addNotificationItem(notification) {                       
    displayStreamItem(_application.template.notificationItem.replace(/\{{notification}}/g, notification));
}

function addStream(objData) {
    if(!_session.streamAdded.stream[objData.streamid.toString()]){
        _session.streamAdded.stream[objData.streamid.toString()] = {"streamid":objData.streamid, "stream":objData.stream};
        
        var addedStreamItem = _application.template.addedStreamItem
                                .replace(/\{{stream-button}}/g, _application.template.streamButton)
                                .replace(/\{{streamid}}/g,      objData.streamid)
                                .replace(/\{{stream}}/g,        objData.stream)
                                .replace(/\{{activeusers}}/g,   '99') // objData.members
                                .replace(/\{{added}}/g,         'added')
                                .replace(/\{{time}}/g,          getTimeNow())
                                .replace(/\{{entrytime}}/g,     'Added ' + getElapsedTime(getTimeNow()));

        displayStreamItem(addedStreamItem);
    }
}

function removeStream(streamid){
    delete _session.streamAdded.stream[streamid];
    $('#page-public .stream-button[data-streamid=' + streamid + '] .btn').addClass('btn-default disabled');
}

function addMemberItem(objData) {
    if(!_session.users.user[objData.userid.toString()]){
        _session.users.user[objData.userid.toString()]         = objData; 
        _session.users.user[objData.userid.toString()].time    = splitDate(_session.users.user[objData.userid.toString()].createdate);
        
        var addMemberItem = _application.template.addedMemberItem
                            .replace(/\{{user-button}}/g,   createUserButton(objData, {animate:true}))
                            .replace(/\{{time}}/g,          getTimeNow())
                            .replace(/\{{entrydate}}/g,     getElapsedTime(getTimeNow()));

       displayStreamItem(addMemberItem);
       displayNewMember(addMemberItem);
    }
}

function removeUser(objData) {
    if(!_session.users.user[objData.userid.toString()]){
        _session.users.user[objData.userid.toString()]         = objData; 
        _session.users.user[objData.userid.toString()].time    = splitDate(_session.users.user[objData.userid.toString()].createdate);
        
        var removeMemberItem = _application.template.addedMemberItem
                                .replace(/\{{user-button}}/g,   createUserButton(objData, {animate:true}))
                                .replace(/\{{time}}/g,          getTimeNow())
                                .replace(/\{{entrytime}}/g,     getElapsedTime(moment.utc().add('minutes', _application.gmtOffset)));

       displayStreamItem(removeMemberItem);
    }
}

// Iterate through and display all chat items
function addChats(objData) {
    if(objData.length > 0){
        var chats = objData;
        var day = getTimeNow();
        for (var x=0; x<chats.length; x++) {
            // Insert Date Header for each different day except "today"
            if(moment(chats[x].createdate).calendar().toLowerCase() != "today" && moment(chats[x].createdate).isBefore(day, 'day')){
                day = chats[x].createdate;
                displayStreamItem(_application.template.dateHeaderItem.replace(/\{{date}}/g, moment(day).calendar()), true);
            }

            addChatItem(chats[x], true);
        }
    }
}

function addChatItem(objData, append) {
    if(!_session.public.chat[objData.chatid.toString()]){
        _session.public.chat[objData.chatid.toString()]       = objData; 
        _session.public.chat[objData.chatid.toString()].time  = splitDate(_session.public.chat[objData.chatid.toString()].createdate);
        
        var you = "";
        if(objData.userid == _session.user.userid){
            you = "you";
        }

        var chatItem = _application.template.chatItem
                        .replace(/\{{user-button}}/g,   createUserButton(objData, {animate:true}))
                        .replace(/\{{you}}/g,           you)
                        .replace(/\{{chat}}/g,          objData.chat)
                        .replace(/\{{time}}/g,          objData.createdate)
                        .replace(/\{{createdate}}/g,    getElapsedTime(objData.createdate));

        displayStreamItem(chatItem, append);
    }
}

function createStreamAccordionTab(objData){
    var streamType = "in-stream";
    if(objData.streamid != _session.stream.streamid){
        streamType = "added-stream";
    }

    var streamAccordionTab = _application.template.streamAccordionTab
                            .replace(/\{{stream-type}}/g,   streamType)
                            .replace(/\{{streamid}}/g,      objData.streamid)
                            .replace(/\{{stream}}/g,        objData.stream)
                            .replace(/\{{activeusers}}/g,   objData.activeusers);
    
    return streamAccordionTab;
}

function populateNewestMember(objUser){
    $('#page-people .newest-members-list .btn-accordion').after(createUserButton(objUser));
    var newestMembersQty = $('#page-people .newest-members-list .btn').size();
    $('#page-people .newest-members-list .btn-accordion .badge').html(newestMembersQty);
}

function populatePeople(objStream){
    if(typeof objStream == "undefined"){
        objStream = _session.people;
    }
    
    var listpeopleThought = "";

    // Iterate through object to create list of html objects (StreamAccordionTabs=streams & userButtons=people)
    var streamCount = 0;
    $.each(objStream, function(){
        streamCount++;
        var streamid = this.streamid;
        listpeopleThought += createStreamAccordionTab(this);

        // Iterate through active users in stream
        $.each(this.users, function(){
            listpeopleThought += createUserButton(this);
        });
    });

    // Display HTML objects list 
    $('#page-people .people-list').html(listpeopleThought);

    // Set Stream Members to active state as default 
    $('#page-people #people-controls .btn[data-filter=default]:not(.active)').click();
    
    // Open Stream accordion if there are no added streams for default
    if(streamCount == 1){
        $('#page-people .people-list .btn-accordion[data-streamid=' + _session.stream.streamid + ']:not(.active)').click();
    }

    // Expand Newest Members as default if another tab (openStreamAccordionTab) has been set 
    if(typeof _temp.openStreamAccordionTab != "undefined"){
        $('#page-people .people-list .btn-accordion[data-streamid=' + _temp.openStreamAccordionTab + ']:not(.active)').click();
    }else{
        $('#page-people .people-list .btn-accordion.newest-members:not(.active)').click();
    }
    
    delete _temp.openStreamAccordionTab;
}

/*
{
   "status":1,
   "object":[
      {
         "streamid":"7963",
         "stream":"Test Test2",
         "activeusers":"2",
         "users":[
            {
               "fname":"Sharif",
               "lname":"Aly",
               "userid":"1"
            },
            {
               "fname":"Sharif",
               "lname":"Aly",
               "userid":"3"
            }
         ]
      }
   ]
}
*/
