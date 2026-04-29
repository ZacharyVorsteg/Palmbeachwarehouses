// Realistic availability widget: green Mon-Fri 8am-6pm ET, gray otherwise.
// Updates every .agent-status-dot and every [data-agent-status] element.
// Each [data-agent-status] may set data-agent-prefix to customize role text.
(function(){
    var dots = document.querySelectorAll('.agent-status-dot');
    var roles = document.querySelectorAll('[data-agent-status]');
    if (!dots.length && !roles.length) return;
    var DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var et = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/New_York'}));
    var day = et.getDay(), hr = et.getHours();
    var isWeekday = day >= 1 && day <= 5;
    var online = isWeekday && hr >= 8 && hr < 18;
    var ariaLabel, statusText;
    if (online) {
        ariaLabel = 'Online — replying now';
        statusText = 'Online · Replies within hours';
    } else {
        var nextDay;
        if (isWeekday && hr < 8) {
            nextDay = 'today';
        } else {
            var addDays = 1;
            while (addDays < 8) {
                var d = (day + addDays) % 7;
                if (d >= 1 && d <= 5) { nextDay = (addDays === 1 ? 'tomorrow' : DAYS[d]); break; }
                addDays++;
            }
        }
        ariaLabel = 'Away — back ' + nextDay + ' at 8 AM ET';
        statusText = 'Away · Back ' + nextDay + ' at 8 AM ET';
    }
    dots.forEach(function(d){
        d.classList.toggle('is-online', online);
        d.setAttribute('aria-label', ariaLabel);
    });
    roles.forEach(function(r){
        var prefix = r.getAttribute('data-agent-prefix');
        if (prefix === null) prefix = 'Your tenant rep';
        r.textContent = prefix ? prefix + ' · ' + statusText : statusText;
    });
})();
