var _template = {};
	_template.thoughtListItem = '<li class="list-group-item"><a class="btn btn-lucid-normal" data-streamid="{streamid}" onclick="subscribeThought($(this).data(\'streamid\'));"><span class="stream-name">{stream}</span><span class="badge">{activeusers}</span></a></li>';




// TEMPLATES
/*
// thoughtListItem
<li class="list-group-item">
    <a class="btn btn-lucid-normal">
        <span class="stream-name">HotStream7</span><span class="badge">16</span>
    </a>
</li>

// btn-lucid.user
<button class="btn btn-lucid user {{you}} {{in-stream/added-stream}} {{connecting}} {{connected}} {{viewed-your-profile}} {{online/inactive/offline}}" style="background-image: url(img/profile/profile-{{userid}}.jpg);" last-active-date="{{last-active-date}}" data-connecting="{{connecting-qty}}" data-viewed-your-profile-date="{{viewed-your-profile-date}}" data-userid="{{userid}}" data-streamid="{{streamid}}" data-stream="{{stream}}">
    <sup class="badge label-lucid">1<span class="glyphicon glyphicon-link"></span></sup>
    <sub>
        <span class="stream-indicator-icon"></span>
        <span class="viewed-your-profile-indicator-icon glyphicon glyphicon-eye-open"></span>
        <span class="connected-indicator-icon glyphicon glyphicon-link"></span>
    </sub>
    <label><span class="fname">{{fname}}</span><span class="lname">{{lname}}</span></label>
</button>

// connection-items-list = chat
<li class="list-group-item chat {{in-stream/added-stream}} {{you}} {{viewed}} {{connected}}" data-viewed-date="{{viewed-date}}" data-connecting="{{connecting-qty}}" data-entry-date="{{entry-date}}" data-streamid="{{streamid}}" data-stream="{{stream}}" data-userid="{{userid}}" data-user-fname="{{fname}}" data-user-lname="{{lname}}">
    <div class="connection-item-panel panel">
        <div class="panel-header">
            {{btn-lucid.user}}
        </div>
        <div class="panel-body">
            <blockquote class="connection-content">I hope we can finish this app soon!</blockquote>
            <div class="callout-pointer"></div>
            <div class="status">
                <span class="sent">{{create-date}}</span>
                <span class="not-viewed-icon glyphicon glyphicon-eye-close"></span>
                <span class="viewed-icon glyphicon glyphicon-eye-open"></span>
            </div>
        </div>
        <div class="panel-footer">
            <button class="btn-like btn btn-lucid-normal">Like<span class="glyphicon glyphicon-thumbs-up"></span></button>
        
        </div>
    </div>
</li>
*/