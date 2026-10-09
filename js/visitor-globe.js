(function () {
    'use strict';

    var DATA_ORIGIN = 'https://feed-pulse.com';
    var EARTH_TEXTURE = 'https://cdn.jsdelivr.net/npm/three-globe@2.45.2/example/img/earth-day.jpg';
    var TRACKING_STARTED_AT = Date.UTC(2026, 7, 13);
    var MAX_VISITOR_POINTS = 5000;

    function initVisitorGlobe(root) {
        if (typeof window.Globe !== 'function') {
            root.classList.add('visitor-globe-unavailable');
            return;
        }

        var stage = root.querySelector('.visitor-globe-stage');
        var siteId = root.getAttribute('data-site-id');
        var size = stage.clientWidth || 280;
        var orientedToVisitor = false;
        // Google DSPL country centers are approximate locations, not city coordinates.
        var countryCenters = fetch('/js/visitor-countries.csv').then(function (response) {
            if (!response.ok) throw new Error('Country coordinates unavailable');
            return response.text();
        }).then(function (csv) {
            var centers = {};
            csv.split(/\r?\n/).slice(1).forEach(function (line) {
                var fields = line.split(',');
                if (fields[1] && fields[2]) centers[fields[0]] = {lat: Number(fields[1]), lng: Number(fields[2])};
            });
            return centers;
        });

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
            .pointRadius(function (point) { return point.approximate ? 0.75 : 0.5; })
            .pointLabel(function (point) { return point.approximate ? '国家级近似位置 · ' + point.countryCode + ' · ' + point.count + ' 次访问' : '访客位置'; })
            .pointsMerge(false);

        globe.pointOfView({ lat: 22, lng: 18, altitude: 1.72 }, 0);

        var controls = globe.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.48;
        controls.enableZoom = false;
        controls.enablePan = false;

        function update() {
            var trackedHours = Math.max(1, Math.ceil((Date.now() - TRACKING_STARTED_AT) / 3600000));
            var mapRequest = fetch(DATA_ORIGIN + '/api/visitor-map/' + encodeURIComponent(siteId) + '?hours=' + trackedHours + '&limit=' + MAX_VISITOR_POINTS, {
                mode: 'cors',
                credentials: 'omit'
            })
                .then(function (response) {
                    if (!response.ok) throw new Error('Visitor data request failed');
                    return response.json();
                }).catch(function () { return {points: []}; });
            var flagsRequest = fetch(DATA_ORIGIN + '/api/widget/flags/' + encodeURIComponent(siteId) + '?include_bots=0', {
                credentials: 'omit'
            }).then(function (response) {
                if (!response.ok) throw new Error('Visitor countries unavailable');
                return response.json();
            });
            Promise.all([mapRequest, flagsRequest, countryCenters])
                .then(function (data) {
                    var points = (Array.isArray(data[0].points) ? data[0].points : []).filter(function (point) {
                        return Number.isFinite(point.lat) && Number.isFinite(point.lng);
                    });
                    if (!points.length) {
                        points = (data[1].countries || []).filter(function (country) {
                            return country.count > 0 && data[2][country.country_code];
                        }).map(function (country) {
                            var center = data[2][country.country_code];
                            return {lat: center.lat, lng: center.lng, countryCode: country.country_code, count: country.count, approximate: true};
                        });
                    }
                    globe.pointsData(points);
                    if (points.length && !orientedToVisitor) {
                        globe.pointOfView({lat: points[0].lat, lng: points[0].lng, altitude: 1.72}, 700);
                        orientedToVisitor = true;
                    }
                    root.dataset.visitorDataStatus = 'ready';
                    root.dataset.visitorPointCount = String(points.length);
                })
                .catch(function (error) {
                    root.dataset.visitorDataStatus = 'error';
                    console.warn('Visitor globe data unavailable:', error);
                });
        }

        update();
        document.addEventListener('visitor-recorded', update);
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
