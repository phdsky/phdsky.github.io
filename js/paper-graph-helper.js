/**
 * 通用论文知识图谱工厂。
 * 用法：
 *   PaperGraph.create({
 *     wrapperId: 'paper-graph-wrapper',     // 外层 div id
 *     containerId: 'paper-graph',           // 网络容器 div id
 *     toolbarPrefix: 'paper-graph',         // 工具栏按钮 id 前缀（zoom-in/zoom-out/fit/fullscreen）
 *     height: 600,                          // 容器高度（px）
 *     definedNodes: [...],                  // 节点数组
 *     definedEdges: [...],                  // 边数组
 *     physics: { ... }                      // 可选，覆盖默认 forceAtlas2Based 参数
 *   });
 */
(function () {
  function createPaperGraph(opts) {
    var container = document.getElementById(opts.containerId);
    var wrapper = document.getElementById(opts.wrapperId);
    if (!container || !wrapper || typeof vis === 'undefined') {
      return;
    }

    var defaultPhysics = {
      solver: 'forceAtlas2Based',
      forceAtlas2Based: {
        gravitationalConstant: -60,
        centralGravity: 0.003,
        springLength: 200,
        springConstant: 0.04,
        avoidOverlap: 0.9
      },
      stabilization: { iterations: 400, fit: true }
    };

    var nodes = new vis.DataSet(
      opts.definedNodes.map(function (n) {
        return {
          id: n.id,
          label: n.label,
          url: n.url,
          x: n.x,
          y: n.y,
          fixed: false,
          color: {
            background: n.color,
            border: n.color,
            highlight: { background: n.color, border: '#333' }
          },
          font: n.font || { color: '#fff', size: 13, face: 'system-ui' },
          shape: 'box',
          borderWidth: 0,
          margin: 10,
          shadow: { enabled: true, size: 6, x: 2, y: 2 }
        };
      })
    );

    var edges = new vis.DataSet(
      opts.definedEdges.map(function (e) {
        return {
          from: e.from,
          to: e.to,
          label: e.label,
          arrows: e.arrows,
          dashes: e.dashes || false,
          color: { color: '#aaa', highlight: '#667eea' },
          font: {
            size: 11,
            color: '#666',
            strokeWidth: 2,
            strokeColor: '#fff',
            background: '#fafbfc'
          },
          smooth: { type: 'dynamic' }
        };
      })
    );

    var network = new vis.Network(
      container,
      { nodes: nodes, edges: edges },
      {
        physics: opts.physics || defaultPhysics,
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView: true,
          dragView: true,
          dragNodes: true
        }
      }
    );

    function graphZoom(factor) {
      var s = network.getScale();
      network.moveTo({
        scale: s * factor,
        animation: { duration: 300, easingFunction: 'easeInOutQuad' }
      });
    }

    function graphFit(animate) {
      network.fit({
        animation: animate
          ? { duration: 400, easingFunction: 'easeInOutQuad' }
          : false
      });
    }

    var defaultHeight = (opts.height || 600) + 'px';

    function graphFullscreen() {
      if (!document.fullscreenElement) {
        wrapper.requestFullscreen().then(function () {
          wrapper.style.background = '#fafbfc';
          container.style.height = '100vh';
          network.redraw();
          graphFit(true);
        });
      } else {
        document.exitFullscreen();
      }
    }

    network.on('stabilizationIterationsDone', function () {
      network.setOptions({ physics: false });
      graphFit(false);
    });

    network.on('click', function (params) {
      if (params.nodes.length > 0) {
        var nodeId = params.nodes[0];
        var node = nodes.get(nodeId);
        if (node && node.url) {
          window.location.href = node.url;
        }
      }
    });

    network.on('hoverNode', function () {
      container.style.cursor = 'pointer';
    });

    network.on('blurNode', function () {
      container.style.cursor = 'default';
    });

    var prefix = opts.toolbarPrefix;
    var zoomInBtn = document.getElementById(prefix + '-zoom-in');
    var zoomOutBtn = document.getElementById(prefix + '-zoom-out');
    var fitBtn = document.getElementById(prefix + '-fit');
    var fullscreenBtn = document.getElementById(prefix + '-fullscreen');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', function () { graphZoom(1.3); });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', function () { graphZoom(0.7); });
    }
    if (fitBtn) {
      fitBtn.addEventListener('click', function () { graphFit(true); });
    }
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', function () { graphFullscreen(); });
    }

    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement) {
        container.style.height = defaultHeight;
        network.redraw();
        graphFit(true);
      }
    });

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        network.redraw();
        graphFit(false);
      }, 120);
    });

    setTimeout(function () { graphFit(false); }, 80);

    return network;
  }

  window.PaperGraph = window.PaperGraph || {};
  window.PaperGraph.create = createPaperGraph;
})();
