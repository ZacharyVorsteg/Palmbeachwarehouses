// Realistic availability widget: green Mon-Fri 8am-6pm ET, gray otherwise.
// Updates every .agent-status-dot and every [data-agent-status] element.
// Each [data-agent-status] may set data-agent-prefix to customize role text.
(function(){
    var dots = document.querySelectorAll('.agent-status-dot');
    var roles = document.querySelectorAll('[data-agent-status]');
    if (!dots.length && !roles.length) return;
    var et = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/New_York'}));
    var day = et.getDay(), hr = et.getHours();
    var isWeekday = day >= 1 && day <= 5;
    var online = isWeekday && hr >= 8 && hr < 18;
    var ariaLabel, statusText;
    if (online) {
        ariaLabel = 'Online now — replies within hours';
        statusText = 'Online now · Replies within hours';
    } else {
        ariaLabel = 'Replies within 2 hours on weekdays';
        statusText = 'Replies within 2 hours · Mon–Fri';
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
