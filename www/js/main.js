/* Method from PhoneGap Example
function startApp(){
    $('.app').addClass('hide');
    $('.page.home').removeClass('hide');
}
*/

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
    $('.page').addClass('active')
    initEventHandlers();
});



/*
method:
auth_user
email:
test@flud.com
password:
testtest

https://dev.lucidlife.co/api/testbench.html
*/