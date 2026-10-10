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
        var countryStats = [];
        var totalVisits = 0;
        var pointerInside = false;
        var focusInside = false;
        var touchPaused = false;
        var details = document.createElement('section');
        details.className = 'visitor-globe-details';
        details.hidden = true;
        details.setAttribute('aria-label', '访客详情');
        var closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'visitor-globe-details-close';
        closeButton.textContent = '×';
        closeButton.setAttribute('aria-label', '关闭访客详情');
        var detailBody = document.createElement('div');
        details.appendChild(closeButton);
        details.appendChild(detailBody);
        root.appendChild(details);

        function countryName(code, fallback) {
            code = String(code || '').toUpperCase();
            if (!/^[A-Z]{2}$/.test(code) || code === 'XX' || code === 'ZZ') return '未知';
            try {
                var name = new Intl.DisplayNames(['zh-CN'], {type: 'region'}).of(code);
                return name && name !== code ? name : '未知';
            } catch (error) { return fallback && fallback !== code ? fallback : '未知'; }
        }

        function countryFlag(code) {
            code = String(code || '').toUpperCase();
            if (countryName(code) === '未知') return '◎';
            return String.fromCodePoint(127397 + code.charCodeAt(0), 127397 + code.charCodeAt(1));
        }

        function addDetail(text, className) {
            var line = document.createElement('p');
            line.className = className || '';
            line.textContent = text;
            detailBody.appendChild(line);
        }

        function addCountry(code, fallback, count, total) {
            var row = document.createElement('div');
            row.className = 'visitor-globe-country';
            var flag = document.createElement('span');
            flag.className = 'visitor-globe-flag';
            flag.textContent = countryFlag(code);
            flag.setAttribute('aria-hidden', 'true');
            var name = document.createElement('span');
            name.className = 'visitor-globe-country-name';
            name.textContent = countryName(code, fallback);
            var value = document.createElement('span');
            value.className = 'visitor-globe-country-count';
            value.textContent = count + ' 次';
            row.appendChild(flag);
            row.appendChild(name);
            row.appendChild(value);
            var bar = document.createElement('span');
            bar.className = 'visitor-globe-country-bar';
            bar.style.width = Math.min(100, Math.max(0, Number(count) / Math.max(1, total) * 100)) + '%';
            bar.setAttribute('aria-hidden', 'true');
            row.appendChild(bar);
            detailBody.appendChild(row);
        }

        function syncRotation() {
            if (controls) controls.autoRotate = details.hidden && !pointerInside && !focusInside && !touchPaused;
        }

        function showDetails(point) {
            detailBody.replaceChildren();
            addDetail(point ? '来访位置' : '访客足迹', 'visitor-globe-details-title');
            if (point) {
                if (point.countryCode) addCountry(point.countryCode, point.countryName, point.count || 0, point.count || 1);
                else addDetail('访客位置');
                addDetail(point.approximate ? '国家级近似位置' : '位置：' + point.lat.toFixed(2) + '°, ' + point.lng.toFixed(2) + '°', 'visitor-globe-details-label');
                if (point.approximate) addDetail('此点代表该国家的来访记录，不代表具体城市或个人。', 'visitor-globe-details-note');
            } else {
                addDetail(String(totalVisits), 'visitor-globe-details-total');
                addDetail('累计访问次数', 'visitor-globe-details-label');
                countryStats.forEach(function (country) {
                    addCountry(country.country_code, country.country_name, country.count, totalVisits);
                });
                if (!countryStats.length) addDetail('暂未收到可展示的国家记录。');
                addDetail('访问次数包含重复访问，不是独立访客人数。', 'visitor-globe-details-note');
            }
            details.hidden = false;
            syncRotation();
        }

        function hideDetails() {
            details.hidden = true;
            syncRotation();
        }
        root.addEventListener('pointerenter', function (event) {
            if (event.pointerType !== 'touch') pointerInside = true;
            syncRotation();
        });
        root.addEventListener('pointerleave', function () {
            pointerInside = false;
            syncRotation();
        });
        stage.addEventListener('pointerdown', function (event) {
            if (event.pointerType === 'touch') touchPaused = true;
            syncRotation();
        });
        root.addEventListener('focusin', function () { focusInside = true; syncRotation(); });
        root.addEventListener('focusout', function (event) {
            focusInside = root.contains(event.relatedTarget);
            syncRotation();
        });
        closeButton.addEventListener('click', hideDetails);
        root.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') hideDetails();
        });
        stage.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                showDetails();
            }
        });
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
            .pointRadius(function (point) { return point.approximate ? 0.9 : 0.6; })
            .pointLabel(function (point) { return point.approximate ? countryFlag(point.countryCode) + ' ' + countryName(point.countryCode, point.countryName) + ' · ' + point.count + ' 次访问（国家级近似位置）' : '访客位置'; })
            .pointsMerge(false)
            .onPointClick(function (point) { showDetails(point); })
            .onGlobeClick(function () { showDetails(); });

        globe.pointOfView({ lat: 22, lng: 18, altitude: 1.72 }, 0);

        var controls = globe.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.48;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableDamping = false;
        syncRotation();

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
                    countryStats = data[1].countries || [];
                    totalVisits = Number(data[1].all_time || data[1].total) || 0;
                    var points = (Array.isArray(data[0].points) ? data[0].points : []).filter(function (point) {
                        return Number.isFinite(point.lat) && Number.isFinite(point.lng);
                    });
                    if (!points.length) {
                        points = (data[1].countries || []).filter(function (country) {
                            return country.count > 0 && data[2][country.country_code];
                        }).map(function (country) {
                            var center = data[2][country.country_code];
                            return {lat: center.lat, lng: center.lng, countryCode: country.country_code, countryName: country.country_name, count: country.count, approximate: true};
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
