// Appointment-only operation does not imply real-time availability.
(function () {
  document.querySelectorAll('.agent-status-dot').forEach(function (dot) {
    dot.classList.remove('is-online');
    dot.setAttribute('aria-label', 'By appointment only');
  });
  document.querySelectorAll('[data-agent-status]').forEach(function (label) {
    var prefix = label.getAttribute('data-agent-prefix');
    if (prefix === null) prefix = 'Your tenant rep';
    label.textContent = (prefix ? prefix + ' · ' : '') + 'By appointment only · Please contact us';
  });
})();
