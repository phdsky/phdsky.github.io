(function () {
    'use strict';

    var script = document.currentScript;
    var siteId = script && script.getAttribute('data-site-id');
    var host = location.hostname;
    if (!siteId || (host !== 'phdsky.com' && host !== 'phdsky.github.io' && host !== 'www.phdsky.com')) return;
    if (window.__visitorTrackingStarted) return;
    window.__visitorTrackingStarted = true;

    // Use the same session-aware collection request as the official widgets.
    var sessionId;
    try {
        var key = 'visitor-session-' + siteId;
        sessionId = sessionStorage.getItem(key);
        if (!sessionId) {
            sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
            sessionStorage.setItem(key, sessionId);
        }
    } catch (error) {
        sessionId = Math.random().toString(36).slice(2);
    }
    fetch('https://feed-pulse.com/api/track/' + encodeURIComponent(siteId), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'omit',
        keepalive: true,
        body: JSON.stringify({
            referrer: document.referrer || 'direct',
            landing_page: location.pathname || '/',
            title: (document.title || '').slice(0, 160),
            host: location.host,
            session_id: sessionId
        })
    }).then(function (response) {
        if (!response.ok) throw new Error('Visitor collection failed');
        document.dispatchEvent(new Event('visitor-recorded'));
    }).catch(trackPixel);

    function trackPixel() {
    var pixel = new Image();
    window.__visitorTrackingPixel = pixel;
    pixel.onload = function () {
        document.dispatchEvent(new Event('visitor-recorded'));
    };
    pixel.onerror = function () {
        console.warn('Visitor tracking pixel could not be loaded.');
    };
    var params = new URLSearchParams({
        path: location.pathname || '/',
        title: (document.title || '').slice(0, 160),
        host: location.host,
        ref: document.referrer || ''
    });
    pixel.src = 'https://feed-pulse.com/api/track-pixel/' + encodeURIComponent(siteId) + '?' + params.toString();
    }
})();
