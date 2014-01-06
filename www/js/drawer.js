function closeDrawerAndSendMessage(selection) {
  var msg = { selection: selection };
  window.postMessage(msg, "*");
}

window.addEventListener("message", function(msg) {
  	var target = msg.data.name;
  	if (target != null) {
    	$('#main-menu .header .username').html(target);		
	}
});