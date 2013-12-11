// API Server Requests functions

// Ajax request to server api methods (default async=true unless sent as false)
function apiRequest(objMessage, callbackFunction, async) {
    var asyncMethod = true;
    if(typeof async != "undefined" && async == false) {
	   asyncMethod = false;
    }
    
    $.ajax({
        type: 	  "POST",
        dataType: "json",
        async: 	  asyncMethod,
        url: 	  _application.url.api,
        cache: 	  false,
        data: 	  objMessage
    })
    .complete(function(response, status, xhr) {
        return callbackFunction(response.responseJSON);
    })
    .fail(function() {
        return callbackFunction(0);
    });
}

// CREATE USER
function createUser(){
    var user = {};
        user.email          = $('#form-create-user [name=email]').val();
        user.password       = $('#form-create-user [name=password]').val();
        user.fname          = $('#form-create-user [name=fname]').val();
        user.lname          = $('#form-create-user [name=lname]').val();
        user.gender         = $('#form-create-user [name=gender]:checked').val();
        user.birthdate      = $('#form-create-user [name=birthdate]').val(); //$('input#join-year').val() + "-" + $('input#join-month').val() + "-" + $('input#join-day').val();
        user.pic            = "";
        user.picextension   = "";
        user.biography      = $('#form-create-user [name=biography]').val();
        user.twitter        = ""; //$('input#join-twitter').val();
    
    var objMessage = {};
        objMessage.method       = "create_user";
        objMessage.user         = user;

    openLoader('Creating your account and profile...');
    apiRequest(objMessage, createUser_Callback, false);
}

function createUser_Callback(result) {
    if(result == 0) {
        // Ajax request failed
        closeLoader();
        alert('createUser Failed.');
    }else{
        if(result.status > 0){
            // Successful
            _session.user = result.object;
            //alert('Created User #' + _session.user.userid);
            acquireGeolocation();
            //$('img#join-new-profile-pic').attr('src', getPic('profile', _session.user.userid, _application.preview));
            //$('section#PAGE_JOIN #join-content > *.active').removeClass('active');
            //$('section#PAGE_JOIN #join-content > #join-get-photo').addClass('active'); 
        }else{
            // Server returned an error = failed authorization
            closeLoader();
            alert('createUser Failed with a response.');
            /*
            if (result.details != undefined) {
                for (var key in result.details) {
                    document.getElementById("join-"+key).setCustomValidity(result.details[key]);
                }
                setTimeout('$("#join-submit").click()', 100); // must click to actually show the errors 
            }
            */
        }
    }
    //$('form#form-create-user > .step2').removeClass('active');
    //$('form#form-create-user > .step1').addClass('active');
    //$('#form-thought').scrollTo();
}


// LOGIN USER
function loginUser(){
    var objMessage = {};
        objMessage.method      = "auth_user";
        objMessage.email       = $('#form-login input[name="email"]').val();
        objMessage.password    = $('#form-login input[name="password"]').val();
    
    openLoader('Logging in...');
    apiRequest(objMessage, loginUser_Callback, false);
}

function loginUser_Callback(result) {
    closeLoader();

    if(result==0) {
        // Ajax request failed
        alert('Login request returned failure');
    }else{
        if(result.status > 0){
            // Successful Authentication
            _session.id     = result.sessionid;
            _session.user   = result.object;
            acquireGeolocation();
        }else{
            // Server returned an error = failed authorization
    	    if (result.message != undefined) {
                $('#modal-login-failed .modal-body').html(result.message);
                $('#modal-login-failed').modal('show');
        		//document.getElementById("login-password").setCustomValidity(result.message);
        		//setTimeout('$("#login-submit").click()', 100); // must click to actually show the errors 
        	}
        }
    }
}

// Logout User
function logoutUser(){
    var objMessage = {};
        objMessage.method = "logout";

    apiRequest(objMessage, logoutUser_Callback, false);
    
    return false;
}

function logoutUser_Callback(result) {
    if(result==0) {
        // Ajax request failed
    }else{
        if(result.status > 0){
            // Successful
        }else{
            // Server returned an error = failed authorization
            alert('Error: ' + result.message);
        }
        
        //initializeSession();
        deinitializeApp();
    }
}

// GET USER GEO
function saveGeolocation(){
    var objMessage = {};
        objMessage.method       = "save_geolocation";
        objMessage.geolocation  = _session.geolocation; //{"latitude": _session.geolocation.latitude, "longitude": _session.geolocation.longitude};
    
    $('#modal-loader .modal-body').html('Saving geolocation...');
    apiRequest(objMessage, saveGeolocation_Callback, false);
}

function saveGeolocation_Callback(result) {
    closeLoader();

    if(result==0) {
        // Ajax request failed
        alert('Sending geolocation failed.');
    }else{
        if(result.status > 0){
            // Successful
            $('#main-menu .header .btn.login-toggle').addClass('active');
            $('#main-menu .header .username').html(_session.user.fname + " " + _session.user.lname);
            if(!_session.loggedIn){
                initializeApp();
            }else{

                updateAbout(); 
            }
        }else{
            // Server returned an error
            if (result.message != undefined) {
                alert('Sending geolocation response failed.');
                //$('#modal-send-geo-failed .modal-body').html(result.message);
                //$('#modal-send-geo-failed').modal('show');
            }
        }
    }
}

// Get Thoughts (Hot & Past)
function getThoughts(){
    var objMessage = {};
        objMessage.method = "get_thoughts";

    apiRequest(objMessage, getThoughts_Callback);
}

function getThoughts_Callback(result) {
    if(result==0) {
        // Ajax request failed
    }else{
        if(result.status > 0){
            // Successful
            populateThoughtList('hot', result.object.hot);
            populateThoughtList('past', result.object.past);
        }else{
            // Server returned an error = failed authorization
            alert("Failed to retrieve Thought Lists.");
        }
    }
}


// Live-Query
function liveQuery(searchValue){
    if(searchValue.length > 2){
        // Enable thought submittal if less than 3 char thought
        $('#form-thought .btn[name=submitThought]').removeClass('disabled');
        
        var objMessage = {};
            objMessage.method   = "get_thought_suggestions";
            objMessage.keyword  = searchValue;

        apiRequest(objMessage, liveQuery_CALLBACK);
    }else{
        // Disable thought submittal if less than 3 char thought
        $('#form-thought .btn[name=submitThought]').addClass('disabled');

        $('#join-conversation.suggested').removeClass('suggested');
        $('#join-conversation .btn-hot-streams:not(".active")').click();
    }
}

function liveQuery_CALLBACK(result) {
    if(result == 0) {
        //ajax server request failed
    }else{
        if(result.status > 0){
            // Successful
            if(result.object.length > 0){
                populateThoughtList('suggested', result.object);
                $('.thought-lists-nav').addClass('suggested');
                $('.thought-lists-nav .btn-suggested-streams').click();
            }else{
                $('.thought-lists-nav').removeClass('suggested');
                $('.thought-lists-nav .btn-hot-streams').click();
            }
        }else{
            // Failed Response
            alert('Error: ' + result.message);
        }
    }
}

// Submit Thought
function submitThought(thought){
    var objMessage = {};
    objMessage.method   = "submit_thought";
    objMessage.thought  = thought;

    apiRequest(objMessage, submitThought_Callback, false);
}

function submitThought_Callback(result) {
    if(result==0) {
        // Ajax request failed
    }else{
        if(result.status > 0){
            // Successful
            changeStream(result.object);
        }else{
            // Server returned an error
            alert('Error: ' + result.message);
        }
    }
}

// Subscribe Thought
function subscribeThought(streamid){
    var objMessage = {};
        objMessage.method = "subscribe_thought";
        objMessage.streamid = streamid;

    apiRequest(objMessage, subscribeThought_Callback, false);
}

function subscribeThought_Callback(result) {
    if(result==0) {
        // Ajax request failed
    }else{
        if(result.status > 0){
            // Successful
            changeStream(result.object);
        }else{
            // Server returned an error
            alert('Error: ' + result.message);
        }
    }
}


// Send Chat
function sendChat(objChat){
    var msg = {};
        msg.streamid    = objChat.streamid;
        msg.chat        = objChat.chat;
    
    var objMessage = {};
        objMessage.method   = "send_chat";
        objMessage.chat     = msg;
      
    apiRequest(objMessage, sendChat_Callback);
}

function sendChat_Callback(result) {
    if(result==0) {
        // Ajax request failed
    }else{
        if(result.status > 0){
            // Successful
            $('#send-message').val('');
        }else{
            // Server returned an error = failed authorization
            alert('Error: ' + result.message);
        }
    }
}

// Get Chats (retrieve latest/recent chat items from stream for initial population)
function getChats(stream) {
    if (!stream || stream == ""){
        stream = _session.stream.stream;
    }

    var objMessage = {};
        objMessage.method    = "get_chats";
        objMessage.stream    = stream;
    
    apiRequest(objMessage, getChats_Callback, false);
    
    return false;
}

function getChats_Callback(result) {
    if(result==0) {
        // Ajax request failed
        alert('')
    }else{
        if(result.status > 0){
            //$('#stream-activity-con > .wrapper').empty();
            if(result.object.length > 0){
                var chats = result.object.reverse();
                for (var x=0; x<chats.length; x++) {
                    addChatItem(chats[x], 1);
                }
            }
        }else{
            // Server returned an error
            alert('Error: ' + result.message);
        }
    }
}


////////////// NODE Server APIs ///////////////
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

// always call this to initiate. 
function updateNodeServer() {
    // logged in, not on stream
    //if (_session.lastpage != "#STREAM" && _session.user != null) {
    if (_session.loggedIn && _session.stream.streamid == null) {
        _session.stream = {};
        if (_application.node.socket == null) {
            initiateNodeServer();
        } else {
            _application.node.socket.send(JSON.stringify({"type":"listen_details","stream": _session.stream.stream, "sessionid": _session.id}));
        }
    } 
    // logged in or anonymous, in stream
    else if (_session.loggedIn && _session.stream.streamid != null) {
        if (_application.node.socket == null) {
            initiateNodeServer();
        } else {
            _application.node.socket.send(JSON.stringify({"type":"listen_details","stream": _session.stream.stream, "sessionid": _session.id}));
            setTimeout("ping('" + _session.stream.stream + "')", 1000); 
        }
    } 
}

// never call this, only update will call this
function initiateNodeServer() {
    if (window.location.hostname == "lucidlife.co") {
        _application.node.socket = io.connect("https://stream.lucidlife.co:" + _application.node.port, {secure: true});
    } else {
        //_application.node.socket = io.connect("https://" + window.location.hostname + ":" + _application.node.port, {secure: true});
        _application.node.socket = io.connect(_application.node.streamserver + ":" + _application.node.port, {secure: true});
    }
    
    _application.node.socket.on('connect', function () {
    _application.node.socket.on('message', function (msg) {
        msg = JSON.parse(msg);
        
        // Identify and respond to messages
        switch (msg.type) {
        case "listen_details":
            _application.node.socket.send(JSON.stringify({"type":"listen_details","stream": _session.stream.stream, "sessionid": _session.id}));
            if (_session.stream.stream != null) {
            setTimeout('ping("' + _session.stream.stream + '")', 1000); 
            }
            break;
        case "chat":
            addChatItem(msg.object);
            break;
        case "notification":
            addNotificationItem(msg.object);
            break;
        case "subscription":
            _session.people[msg.object.userid.toString()] = msg.object; 
            _session.people[msg.object.userid.toString()].time = splitDate(_session.people[msg.object.userid.toString()].createdate);
            //addStreamMember(msg.object, 0);
            $('.connection-items-con').prepend('AddMember: ' + JSON.stringify(msg.object));
            break;
        case "add_connection":
            break;
        case "send_message":
            getUnreadMessages();
            $('#connections-unread-messages-link > .qty-notification').flash();
            break;
        default:
            break;
        }
    });
    });
}


//************************* OLD METHODS BEGIN BELOW ******************************//
// Login user
function ping(stream, status){
	// only logged in users can ping
	if (_session.loggedin != true || stream == null) {
		return false;
	}
    if (stream == "") stream = "All"; 
    var objMessage = {};
        objMessage.method    = "subscription";
        objMessage.stream    = stream;
        objMessage.status    = status;
    
    if (status == "I") {
	    apiRequest(objMessage, ping_delete_Callback, false);
    } else {
	    apiRequest(objMessage, ping_Callback, false);
    }
    
    return false;
}

function ping_delete_Callback(result) {
    if(result==0) {
        // Ajax request failed
    }else{
        if(result.status > 0){
	    // do nothing
        }else{
            // Server returned an error = failed authorization
            errorHandler(result.status);
        }
    }
}

function ping_Callback(result) {
    if(result==0) {
        // Ajax request failed
    }else{
        if(result.status > 0){
	    _session.stream = {};
	    _session.stream.streamid = result.object.streamid;
	    _session.stream.stream = result.object.stream;
	    $('input.stream-search').val(result.object.stream);
        }else{
            // Server returned an error = failed authorization
            errorHandler(result.status);
        }
    }
}

// get past pings
function getPings(stream) {
    if (stream == "") stream = "All"; 
    var objMessage = {};
        objMessage.method    = "get_pings";
        objMessage.stream    = stream;
    
    apiRequest(objMessage, getPings_Callback, false);
    
    return false;
}

function getPings_Callback(result) {
    if(result==0 || result == undefined) {
        // Ajax request failed
    }else{
        if(result.status > 0){
	    $('#stream-header').html(createUserBadge(result.object, "header"));
	    //$('#stream-activity-con > .wrapper').empty();

	    for (var x=0; x<result.object.length; x++) {
		_session.people[result.object[x].userid.toString()] = result.object[x];
		_session.people[result.object[x].userid.toString()].time = splitDate(_session.people[result.object[x].userid.toString()].createdate);
		addStreamMember(result.object[x], 1);
	    }
	    /*
	    // Custom Scrollbars
	    if ($('html').is('.no-touch')) {
		var settings = {};
		var pane = $('html.no-touch .stream-chat > .wrapper.scroll-pane');
		pane.jScrollPane(settings);
		var api = pane.data('jsp');
		
		api.reinitialise();
		//setTimeout(function(){$('html.no-touch .stream-people > .wrapper.scroll-pane').jScrollPane();},3000);
	    }
	    */
        }else{
            // Server returned an error = failed authorization
            errorHandler(result.status);
        }
    }
}



// the HTML5 form error validations 
function validateInput(input) {
    // DO NOT USE JQUERY, YOU WILL BREAK THIS.
    input.setCustomValidity('');
    // join
    if (input.id == "join-password" || input.id == "join-password-repeat") {
	document.getElementById('join-password').setCustomValidity('');
	document.getElementById('join-password-repeat').setCustomValidity('');
	if ((document.getElementById('join-password').value != "" && document.getElementById('join-password-repeat').value != "") && (document.getElementById('join-password').value != document.getElementById('join-password-repeat').value)) {
		input.setCustomValidity('Passwords must match');
	}
    }
    if (input.id == "join-postalcode" || input.id == "join-country" ) {
	document.getElementById('join-postalcode').setCustomValidity('');
	document.getElementById('join-country').setCustomValidity('');
	if (document.getElementById('join-country').value != "" && document.getElementById('join-postalcode').value != "") {
		getGeo(document.getElementById('join-country').value,document.getElementById('join-postalcode').value);
	}
    }
    // login
    if (input.id == "login-email") {
	document.getElementById('login-password').setCustomValidity('');
    }
}

// get user profile
function getUserProfile(userid) {
    var objMessage = {};
        objMessage.method    = "get_user";
        objMessage.userid    = userid;
    
    apiRequest(objMessage, getUserProfile_Callback, false);
    
    return false;
}

function getUserProfile_Callback(result) {
    if(result==0 || result == undefined) {
        // Ajax request failed
    }else{
        if(result.status > 0){
	    	$('#PAGE_PROFILE > .section-body').html(createUserBadge(result.object, "profile")); // True = get more data to display for Profile
		getSavedStreams(result.object.userid);
        }else{
            // Server returned an error = failed authorization
            errorHandler(result.status);
        }
    }
}




// Upload Photo
function uploadPhoto(parentDOM){
    var form = "#" + parentDOM + " form.upload_form ";
    
    if ($('#' + parentDOM).attr('data-target-type') == "Stream") {
		var method = "upload_chat_pic";
    }else{
		var method = "upload_profile_pic";
		hideJoinUploadForm();
    }
        
    // Create formData
    var data = new FormData();
    $.each($("#" + parentDOM + ' input.upload-file')[0].files, function(i, file) {
	data.append('theFile', 	file);
	data.append('method', 	method);
	data.append('streamid',	_session.stream.streamid);
	data.append('Submit', 	"Upload");
	data.append('x1', 	$(form + 'input.upload-file-x1').val());
	data.append('y1', 	$(form + 'input.upload-file-y1').val());
	data.append('w', 	$(form + 'input.upload-file-x2').val());
	data.append('h', 	$(form + 'input.upload-file-y2').val());
	data.append('canvaswidth', $(form + 'input.upload-file-canvas-width').val());
	data.append('chat', $(form + 'input.stream-message').val());
    });

    $.ajax({
        type: 	  "POST",
        dataType: "json",
        async: 	  false,
		contentType: false,
		processData: false,
        url: 	  _application.url.api,
        cache: 	  false,
        data:	  data
    })
    .complete(function(response) {
		if (_session.lastpage == "#JOIN" || _session.lastpage == "#STREAM") {
			keepalive();
		}
    })
    .fail(function() {
		alert("failed photo upload.");
    });
    
    return false;
}



// Active Menu Hot Streams
function getHotStreams(type){
    var objMessage = {};
        objMessage.method = "get_hot_streams";
        
    if (typeof type == "undefined" || type == "ActiveMenu") {
	apiRequest(objMessage, getHotStreams_ActiveMenu_CALLBACK);
    }else{
	apiRequest(objMessage, getHotStreams_CALLBACK);
    }
}

function getHotStreams_CALLBACK(result) {}

function getHotStreams_ActiveMenu_CALLBACK(result) {
    if(result == 0){
        // Ajax request failed
    }else{
        if(result.status > 0){
            _session.hotstreams = result.object;
            $('#streams-hot > li').remove();
            
            if (result.object == 0){
                // Server returned no results
                $('#streams-hot').append('<li class="none">none</li>');
            }else{
                // Server returned results
                $.each(result.object, function(index) {
		    		var objStreamItem = {};
		    		objStreamItem.streamid 	= _session.hotstreams[index].streamid;
		    		objStreamItem.stream 	= _session.hotstreams[index].stream;
		    		objStreamItem.activeusers 	= _session.hotstreams[index].activeusers;
                    $('#streams-hot').append(createStreamListItem(objStreamItem, false));
                });
            }
        }else{
            // Server returned an error
            errorHandler(result.status);
        }
    }
}

// Active Menu Saved Streams
function getSavedStreams(userid, type){
    var objMessage = {};
    
    objMessage.method = "get_subscriptions";
    objMessage.userid = userid;
    
    if (type && type == "ActiveMenu") {
		apiRequest(objMessage, getSavedStreams_ActiveMenu_CALLBACK);
    }else{
		apiRequest(objMessage, getSavedStreams_CALLBACK);
    }
}
    
function getSavedStreams_CALLBACK(result) { 
    if(result == 0){
        // Ajax request failed
    }else{
        if(result.status > 0){
            $('.aux-thoughts-list li:not(".header")').remove();
            
            if (result.object == 0){
                // Server returned no results
                $('.aux-thoughts-list').append('<li class="none">none</li>');
            }else{
                // Server returned results
                $.each(result.object, function(index) {
		    		var objStreamItem = {};
		    		objStreamItem.streamid = result.object[index].streamid;
		    		objStreamItem.stream = result.object[index].stream;
		    		objStreamItem.activeusers = result.object[index].activeusers;                        
                    $('.aux-thoughts-list').append(createStreamListItem(objStreamItem, false));
                });
            }
        }else{
            // Server returned an error
            errorHandler(result.status);
        }
    }
}

function getSavedStreams_ActiveMenu_CALLBACK(result) {
    if(result == 0){
        // Ajax request failed
    }else{
        if(result.status > 0){
            _session.savedstreams = result.object;
            $('#streams-saved li:not(".header")').remove();
            
            if (result.object == 0){
                // Server returned no results
                $('#streams-saved').append('<li class="none">none</li>');
            }else{
                // Server returned results
				var objStreamItem = {};
                $.each(result.object, function(index) {
		    		objStreamItem = {};
		    		objStreamItem.streamid = _session.savedstreams[index].streamid;
		    		objStreamItem.stream = _session.savedstreams[index].stream;
		    		objStreamItem.activeusers = _session.savedstreams[index].activeusers;                        
                    $('#streams-saved').append(createStreamListItem(objStreamItem, true));
                });
            }
        }else{
            // Server returned an error
            errorHandler(result.status);
        }
    }
}


// Active Menu Get Unread Messages
function getUnreadMessages(){
    var objMessage = {};
        //objMessage.read     = 0;    // Messages returned: don't send read = All, 0 = Unread, 1 = Read
        objMessage.method   = "get_inbox";

    apiRequest(objMessage, getUnreadMessages_CALLBACK);
}

function getUnreadMessages_CALLBACK(result) {
    if(result == 0){
        // Ajax request failed
    }else{
        if(result.status > 0){
            $('#connections-unread-messages li:not(".header")').remove();
            
            if (result.object == 0){	// Server returned no results
                $('#connections-unread-messages').append('<li class="none">none</li>');
            }else{	// Server returned results
		// Update Message Notification # of messages
		//if ($('#connections-unread-messages-link').parent('.btn-group').is(':not(".open")')) {
		
		//$('#connections-link > .qty-notification').html('+' + parseInt(_application.indicator.unreadMessages + _application.indicator.buddyrequests));
		
		// Update Messages list by storing and correlating
		var arrSenders = [];
		var senderid;
		var unread = 0;
		$.each(result.object, function(index){
		    var senderIndex = $.inArray(result.object[index].senderid, arrSenders);
		    
		    // Increment unread messages indicator value
		    if(result.object[index].read == "0") {unread++;}
		    
		    if(senderIndex == -1){ // New Sender
			senderid = result.object[index].senderid;
			arrSenders.push(result.object[index].senderid);
			senderIndex = $.inArray(result.object[index].senderid, arrSenders);
			_application.messageMember[senderid] 				= {};
			_application.messageMember[senderid].fname 			= result.object[index].fname;
			_application.messageMember[senderid].lname 			= result.object[index].lname;
			_application.messageMember[senderid].picextension 		= result.object[index].picextension;
			_application.messageMember[senderid].receiverid 		= result.object[index].receiverid;
			_application.messageMember[senderid].senderid 			= result.object[index].senderid;
			_application.messageMember[senderid].messages			= {};
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()]		= {};
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()].messageid 	= result.object[index].messageid;
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()].message	= result.object[index].message;
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()].createdate 	= splitDate(result.object[index].createdate);
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()].status 	= result.object[index].status;
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()].picextension 	= result.object[index].picextension;
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()].read 		= result.object[index].read;
			
			// Display Member user-badge in Unread Messages List Dropdown
			$('#connections-unread-messages')
			    .append(_application.template["Member-List-Item"]
			       //.replace(/\[receiverid]/g,      _application.messageMember[index].receiverid)
			       .replace(/\[senderid]/g,    _application.messageMember[senderid].senderid)
			       .replace(/\[messageid]/g,   _application.messageMember[senderid].messages[result.object[index].messageid.toString()].messageid)
			       .replace(/".."/g,           '"' + getPic('profile', _application.messageMember[senderid].senderid, _application.badge) + '"')
			       .replace(/\[fname]/g,       _application.messageMember[senderid].fname)
			       .replace(/\[lname]/g,       _application.messageMember[senderid].lname)
			       .replace(/\[message]/g,     _application.messageMember[senderid].messages[result.object[index].messageid.toString()].message)
			       .replace(/\[createdate]/g,  _application.messageMember[senderid].messages[result.object[index].messageid.toString()].createdate)
			    )

		    }else{
			senderid = result.object[index].senderid;
			var arrLength = _application.messageMember[senderid].messages.length;
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()]		= {};
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()].messageid 	= result.object[index].messageid;
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()].message	= result.object[index].message;
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()].createdate 	= splitDate(result.object[index].createdate);
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()].status 	= result.object[index].status;
			_application.messageMember[senderid].messages[result.object[index].messageid.toString()].read 		= result.object[index].read;
		    }
		});
		
		// Display # of messages indicator for each mail member and correlate mail messages
		for (var key in _application.messageMember) {
		    if(_application.messageMember.hasOwnProperty(key)) {
			$('#connections-unread-messages > li[data-senderid="' + key + '"]')
			    .find('.member-list-item-link[data-senderid="' + _application.messageMember[key].senderid + '"] > sup.message-qty')
				.html(Object.keys(_application.messageMember[key].messages).length)
			    .parent().siblings('ul.nav-list').append(createMessageMemberList(_application.messageMember[key]));
		    }
		}
		
		// Update Message Indicator
		_application.indicator.unreadMessages = unread;
		$('#connections-unread-messages-link > .qty-notification').html(_application.indicator.unreadMessages);
            }
        }else{
            // Server returned an error
            errorHandler(result.status);
        }
    }
}


// Message Mark As Read
function updateMessageMarkAsRead(senderid, messageid){
    var msg         	= {};
	msg.messageid 	= messageid;
	msg.senderid 	= senderid;
	msg.receiverid 	= _session.user.userid;
	msg.message 	= _application.messageMember[senderid.toString()].messages[messageid.toString()].message;
	msg.read 	= 1;
    
    var objMessage = {};
        objMessage.method   = "update_message";
        objMessage.message  = msg;
        
    apiRequest(objMessage, updateMessageMarkAsRead_CALLBACK);
}

function updateMessageMarkAsRead_CALLBACK(result) {
    if(result==0) {
        // Ajax request failed
    }else{
        if(result.status > 0){
            // Successful
	   _application.messageMember[result.object.senderid].messages[result.object.messageid].read = 1;
        }else{
            // Server returned an error = failed authorization
	    errorHandler(result.status);
        }
    }
}

// Message Delete
function updateMessageDelete(senderid, messageid){
    var msg         = {};
	msg.messageid = messageid;
	msg.senderid = senderid;
	msg.receiverid = _session.user.userid;
	msg.message = _application.messageMember[senderid].messages[messageid].message;
	msg.status = "I";
    
    var objMessage = {};
        objMessage.method   = "update_message";
        objMessage.message  = msg;
        
    apiRequest(objMessage, updateMessageDelete_CALLBACK);
}

function updateMessageDelete_CALLBACK(result) {
    if(result==0) {
        // Ajax request failed
    }else{
        if(result.status > 0){
            // Successful
	   delete _application.messageMember[result.object.senderid].messages[result.object.messageid];
        }else{
            // Server returned an error = failed authorization
	    errorHandler(result.status);
        }
    }
}

// Send Message to Stream
function messageSendToStream(streamid, message){
    //uploadPhoto("Message-Stream-Lightbox");
    var msg         	= {};
        msg.streamid  	= streamid;
        msg.chat   	= message;
    
    var objMessage = {};
        objMessage.method   	= "send_chat";
        objMessage.chat  	= msg;
        
    apiRequest(objMessage, messageSendToStream_CALLBACK);
}

function messageSendToStream_CALLBACK(result) {
    // chatid, senderid, streamid, chat, chatpicextension, 
    if(result==0) {
        // Ajax request failed
    }else{
        if(result.status > 0){
            // Successful
	    $('input.stream-message').val('');
	    
	    //$('#Message-Stream-Lightbox').find('article.User-Badge textarea.message-entry').val('');
	    //$('#Message-Stream-Lightbox').find('textarea#message-stream-message').val('');
        }else{
            // Server returned an error = failed authorization
	    errorHandler(result.status);
        }
    }
}

/*
// Buddy Requests
function displayActiveMenuBuddyRequests(){
    var objMessage = {};
        objMessage.method = "get_pending_requests";

    apiRequest(objMessage, displayActiveMenuBuddyRequests_CALLBACK);
}

function displayActiveMenuBuddyRequests_CALLBACK(result) {
    if(result == 0){
        // Ajax request failed
    }else{
        if(result.status > 0){
            _session.buddyrequests = result.object;
            $('#connections-buddy-requests li:not(".header")').remove();
            
            if (result.object == 0){
                // Server returned no results
                $('#connections-buddy-requests').append('<li class="none">none</li>');
            }else{
		// Update Notification # of buddy requests
		_application.indicator.buddyrequests = result.object.length;
		$('#connections-buddy-requests-link > .qty-notification').html('+' + _application.indicator.buddyrequests);
		$('#connections-link > .qty-notification').html('+' + parseInt(_application.indicator.unreadMessages + _application.indicator.buddyrequests));
		
                // Server returned results
                $.each(result.object, function(index) {
                    $('#connections-buddy-requests')
                        .append($('template#Buddy-List-Item').html()
                            .replace('[userid]',    _session.buddyrequests[index].userid)
                            .replace(/".."/g,       '"' + getPic('profile', _session.messages[index], _application.badge) + '"')
                            .replace('[name]',      _session.buddyrequests[index].name)
                        );
                });
            }
        }else{
            // Server returned an error
            errorHandler(result.status);
        }
    }
}
*/

// Update User
function updateUser(){
    var objMessage = {};
        objMessage.method  = "update_user";
        objMessage.user    = _session.user

    apiRequest(objMessage, updateUser_CALLBACK);
}

function updateUser_CALLBACK(result) {
    if(result == 0){
        // Ajax request failed
    }else{
        if(result.status > 0){
            if (result.object == 0){
                // Server returned no results
               
            }else{
                // Server returned results
                _session.user = result.object;
            }
        }else{
            // Server returned an error
            errorHandler(result.status);
        }
    }
}

// Update User Settings
function updateUserSettings(){
    var errorMesg = "";
    errorMesg += updateArrayItemByID(_session.user.settings, "show_icon_labels", $('input#show-icon-titles').is(':checked') ? 1 : 0, "");
    errorMesg += updateArrayItemByID(_session.user.settings, "stream_columns", $('input#number-of-stream-columns').val(), "");
    
    if (errorMesg.length > 0 ) { // Error
        displayMessage("Settings were not saved.\nPlease re-login.");
        displayMessage("Couldn't find the following User Settings:" + update, true);
    }else{
        applyUserSettings();
        
        // Send update to server
        var objMessage = {};
            objMessage.method      = "update_settings";
            objMessage.settings    = _session.user.settings

        apiRequest(objMessage, updateUserSettings_CALLBACK);
    }
}
	
function updateUserSettings_CALLBACK(result) {
    if(result == 0){
        // Ajax request failed
    }else{
        if(result.status > 0){
            if (result.object == 0){
                // Server returned no results
            }else{
                // Server returned results
                _session.user.settings = result.object;
            }
        }else{
            // Server returned an error
            errorHandler(result.status);
        }
    }   
}

function updateUserFilter() {
    var distance = $('input#filter-distance').val();
    var gender = "";
    if ($('input#filter-gender-male').is(':checked') && !$('input#filter-gender-female').is(':checked')) {
        gender = "M";
    } else if (!$('input#filter-gender-male').is(':checked') && $('input#filter-gender-female').is(':checked')) {
        gender = "F";
    } else if ($('input#filter-gender-male').is(':checked') && $('input#filter-gender-female').is(':checked')) {
        gender = "B";
    }else{
        gender = "N";
    }
    
    var ageFrom = $('input#filter-age-from').val();
    var ageTo   = $('input#filter-age-to').val();
    
    var objMessage = {};
        objMessage.method           = "update_filter";
        objMessage.filter           = {};
        objMessage.filter.distance  = distance;
        objMessage.filter.gender    = gender;
        objMessage.filter.agefrom   = ageFrom;
        objMessage.filter.ageto     = ageTo;

    apiRequest(objMessage, updateUserFilter_CALLBACK);
    
    return false;
}

function updateUserFilter_CALLBACK(result){
    if(result == 0){
        // Ajax request failed
    }else{
        if(result.status > 0){
            if (result.object == 0){
                // Server returned no results
            }else{
                // Server returned results
                _session.user.filter = result.object;
            }
        }else{
            // Server returned an error
            errorHandler(result.status);
        }
    }   
}





// Keepalive
function keepalive(){

    var servercookie = _session.id;
    
    if (servercookie != null && servercookie.length > 0 ) {
	var objMessage = {};
	    objMessage.method   = "keepalive";
	    objMessage.sessionid  = servercookie;
    
	apiRequest(objMessage, keepalive_CALLBACK, false);
    } else {
	initializeSession();
	executeLogout();
    }

}

function keepalive_CALLBACK(result) {
    if(result==0) {
        // Ajax request failed
	initializeSession();
    }else{
        if(result.status > 0){
            // Successful
	    initializeSession(result.object);
	    executeLogin("keepalive");
        }else{
            // Server returned an error = failed authorization
	    initializeSession();
	    executeLogout();
	    
	    // Show error if was previously logged in and have timed out
	    if (typeof _session.loggedin != "undefined" && _session.loggedin == true) {
		errorHandler(result.status, result.message);
	    }
        }
    }
}

