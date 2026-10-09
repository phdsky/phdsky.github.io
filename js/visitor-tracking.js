(function () {
    'use strict';

    var script = document.currentScript;
    var siteId = script && script.getAttribute('data-site-id');
    var host = location.hostname;
    if (!siteId || (host !== 'phdsky.com' && host !== 'phdsky.github.io' && host !== 'www.phdsky.com')) return;
    if (window.__visitorTrackingStarted) return;
    window.__visitorTrackingStarted = true;

    // Official FeedPulse tracking pixel: map widgets only read visitor data.
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
})();
