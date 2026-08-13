(function () {
    'use strict';

    var DATA_ORIGIN = 'https://visitor-tracker-129.emergent.host';
    var EARTH_TEXTURE = 'https://cdn.jsdelivr.net/npm/three-globe@2.45.2/example/img/earth-day.jpg';
    var ALL_TIME_HOURS = 999999;
    var MAX_VISITOR_POINTS = 5000;

    function initVisitorGlobe(root) {
        if (typeof window.Globe !== 'function') {
            root.classList.add('visitor-globe-unavailable');
            return;
        }

        var stage = root.querySelector('.visitor-globe-stage');
        var siteId = root.getAttribute('data-site-id');
        var size = stage.clientWidth || 280;

        var globe = window.Globe()(stage)
            .width(size)
            .height(size)
            .backgroundColor('rgba(0,0,0,0)')
            .globeImageUrl(EARTH_TEXTURE)
            .showAtmosphere(true)
            .atmosphereColor('#7897ff')
            .atmosphereAltitude(0.12)
            .pointsData([])
            .pointLat('lat')
            .pointLng('lng')
            .pointColor(function () { return '#ff4f73'; })
            .pointAltitude(0.018)
            .pointRadius(0.38)
            .pointsMerge(true);

        globe.pointOfView({ lat: 22, lng: 18, altitude: 1.72 }, 0);

        var controls = globe.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.48;
        controls.enableZoom = false;
        controls.enablePan = false;

        function update() {
            fetch(DATA_ORIGIN + '/api/visitor-map/' + encodeURIComponent(siteId) + '?hours=' + ALL_TIME_HOURS + '&limit=' + MAX_VISITOR_POINTS, {
                mode: 'cors',
                credentials: 'omit'
            })
                .then(function (response) {
                    if (!response.ok) throw new Error('Visitor data request failed');
                    return response.json();
                })
                .then(function (data) {
                    var points = Array.isArray(data.points) ? data.points : [];
                    globe.pointsData(points);
                })
                .catch(function () {});
        }

        update();
        window.setInterval(update, 30000);
    }

    function init() {
        document.querySelectorAll('[data-visitor-globe]').forEach(initVisitorGlobe);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
