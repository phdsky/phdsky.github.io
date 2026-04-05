(function () {
  function initPaperGraph() {
    var container = document.getElementById('paper-graph');
    var wrapper = document.getElementById('paper-graph-wrapper');

    // 仅在知识图谱页面初始化，避免影响其他页面。
    if (!container || !wrapper || typeof vis === 'undefined') {
      return;
    }

    var definedNodes = [
      // 经典 2D 检测 (最顶部)
      { id: 'rcnn', label: 'R-CNN 系列\n(CVPR 2014)', color: '#fdcb6e', url: '/posts/2014/papers/2014_CVPR_RCNN_Series_Region_Based_Object_Detection/', x: -240, y: -340 },
      { id: 'yolo', label: 'YOLO 系列\n(CVPR 2016)', color: '#fdcb6e', url: '/posts/2018/papers/2016_CVPR_YOLO_Series_Unified_Real_Time_Object_Detection/', x: -100, y: -340 },
      { id: 'ssd', label: 'SSD\n(ECCV 2016)', color: '#fdcb6e', url: '/posts/2026/papers/2016_ECCV_SSD_Single_Shot_MultiBox_Detector/', x: 30, y: -340 },
      { id: 'retinanet', label: 'RetinaNet\n(ICCV 2017)', color: '#fdcb6e', url: '/posts/2026/papers/2017_ICCV_RetinaNet_Focal_Loss_Dense_Object_Detection/', x: 160, y: -340 },
      { id: 'efficientdet', label: 'EfficientDet\n(CVPR 2020)', color: '#fdcb6e', url: '/posts/2026/papers/2020_CVPR_EfficientDet_Scalable_Efficient_Object_Detection/', x: 290, y: -340 },
      // 2D检测基础 -> 跟踪 -> 3D (顶部)
      { id: 'centernet', label: 'CenterNet\n(CVPR 2019)', color: '#ff9f43', url: '/posts/2019/papers/2019_CVPR_CenterNet_Objects_as_Points/', x: 0, y: -180 },
      { id: 'centertrack', label: 'CenterTrack\n(ECCV 2020)', color: '#ff9f43', url: '/posts/2020/papers/2020_ECCV_CenterTrack_Tracking_Objects_as_Points/', x: -140, y: -120 },
      { id: 'centerpoint', label: 'CenterPoint\n(CVPR 2021)', color: '#ff9f43', url: '/posts/2021/papers/2021_CVPR_CenterPoint_Center_based_3D_Object_Detection_and_Tracking/', x: -140, y: -40 },
      // LiDAR 点云编码基础
      { id: 'pointpillars', label: 'PointPillars\n(CVPR 2019)', color: '#ff9f43', url: '/posts/2026/papers/2019_CVPR_PointPillars_Fast_Encoders_LiDAR_3D_Object_Detection/', x: -280, y: -40 },
      { id: 'detr', label: 'DETR\n(ECCV 2020)', color: '#ff9f43', url: '/posts/2020/papers/2020_ECCV_DETR_End_to_End_Object_Detection_with_Transformers/', x: 0, y: -60 },
      { id: 'defdetr', label: 'Deformable DETR\n(ICLR 2021)', color: '#ff9f43', url: '/posts/2021/papers/2021_ICLR_Deformable_DETR_Deformable_Transformers/', x: 0, y: 60 },
      { id: 'dinodetr', label: 'DINO DETR\n(ICLR 2023)', color: '#ff9f43', url: '/posts/2022/papers/2023_ICLR_DINO_DETR_Series_Denoising_Detection/', x: 130, y: 0 },
      // LSS系 显式BEV投影 (左侧)
      { id: 'lss', label: 'LSS\n(ECCV 2020)', color: '#54a0ff', url: '/posts/2020/papers/2020_ECCV_LSS_Lift_Splat_Shoot/', x: -170, y: -60 },
      { id: 'bevdet', label: 'BEVDet\n(arXiv 2021)', color: '#54a0ff', url: '/posts/2021/papers/2021_arXiv_BEVDet_High_Performance_Multi_Camera_3D_Object_Detection/', x: -185, y: 60 },
      { id: 'bevdepth', label: 'BEVDepth\n(AAAI 2022)', color: '#54a0ff', url: '/posts/2022/papers/2022_AAAI_BEVDepth_Acquisition_Reliable_Depth/', x: -170, y: 175 },
      { id: 'bevfusion', label: 'BEVFusion\n(ICRA 2022)', color: '#ee5a24', url: '/posts/2022/papers/2022_ICRA_BEVFusion_Multi_Task_Multi_Sensor_Fusion/', x: -90, y: 280 },
      // Transformer Query系 (右侧)
      { id: 'petr', label: 'PETR\n(ECCV 2022)', color: '#1dd1a1', url: '/posts/2022/papers/2022_ECCV_PETR_Position_Embedding_Transformation_for_Multi_View_3D_Object_Detection/', x: 175, y: 60 },
      { id: 'bevformer', label: 'BEVFormer\n(ECCV 2022)', color: '#1dd1a1', url: '/posts/2022/papers/2022_ECCV_BEVFormer_Spatiotemporal_Transformers/', x: 30, y: 175 },
      { id: 'sparse4d', label: 'Sparse4D\n(arXiv 2022)', color: '#1dd1a1', url: '/posts/2022/papers/2022_arXiv_Sparse4D_Sparse_Spatial_Temporal_Fusion/', x: 190, y: 175 },
      { id: 'streampetr', label: 'StreamPETR\n(ICCV 2023)', color: '#1dd1a1', url: '/posts/2023/papers/2023_ICCV_StreamPETR_Object_Centric_Temporal_Modeling/', x: 130, y: 280 },
      // 骨干网络 (上方)
      { id: 'swin', label: 'Swin Transformer\n(ICCV 2021)', color: '#636e72', font: { color: '#fff' }, url: '/posts/2026/papers/2021_ICCV_Swin_Transformer_Series_Hierarchical_Vision_Transformer/', x: -100, y: -180 },
      // 车道线检测 (右上方独立)
      { id: 'laneaf', label: 'LaneAF\n(arXiv 2021)', color: '#5f27cd', font: { color: '#fff' }, url: '/posts/2021/papers/2021_arXiv_LaneAF_Robust_Multi_Lane_Detection_with_Affinity_Fields/', x: 310, y: -60 },
      // 在线矢量化高精地图 (下方)
      { id: 'maptr', label: 'MapTR/v2\n(ICLR 2023)', color: '#e056fd', font: { color: '#fff' }, url: '/posts/2022/papers/2022_ICLR_MapTR_Structured_Modeling_Online_Vectorized_HD_Map/', x: 310, y: 175 },
      // 3D 语义占用预测
      { id: 'occformer', label: 'OccFormer\n(ICCV 2023)', color: '#00cec9', url: '/posts/2023/papers/2023_ICCV_OccFormer_Dual_Path_Transformer_3D_Semantic_Occupancy/', x: -90, y: 380 },
      { id: 'mask2former', label: 'Mask2Former\n(CVPR 2022)', color: '#00cec9', url: '/posts/2026/papers/2022_CVPR_Mask2Former_Universal_Image_Segmentation/', x: -220, y: 380 },
      // 端到端自动驾驶
      { id: 'uniad', label: 'UniAD\n(CVPR 2023)', color: '#e17055', font: { color: '#fff' }, url: '/posts/2022/papers/2022_CVPR_UniAD_Planning_Oriented_Autonomous_Driving/', x: 30, y: 480 },
      { id: 'sparsedrive', label: 'SparseDrive\n(arXiv 2024)', color: '#e17055', font: { color: '#fff' }, url: '/posts/2024/papers/2024_arXiv_SparseDrive_End_to_End_Autonomous_Driving_Sparse/', x: 190, y: 480 },
      { id: 'diffusiondrive', label: 'DiffusionDrive\n(CVPR 2025)', color: '#e17055', font: { color: '#fff' }, url: '/posts/2024/papers/2025_CVPR_DiffusionDrive_Truncated_Diffusion_End_to_End_Driving/', x: 110, y: 580 }
    ];

    var definedEdges = [
      { from: 'centernet', to: 'centertrack', label: '检测->跟踪扩展', arrows: 'to' },
      { from: 'centernet', to: 'centerpoint', label: '中心点->3D 点云', arrows: 'to' },
      { from: 'centertrack', to: 'centerpoint', label: '速度匹配->3D 跟踪', arrows: 'to' },
      { from: 'centernet', to: 'detr', label: 'anchor-free 启发', arrows: 'to', dashes: true },
      { from: 'detr', to: 'defdetr', label: '可变形注意力改进', arrows: 'to' },
      { from: 'detr', to: 'dinodetr', label: 'query 显式化+去噪训练', arrows: 'to' },
      { from: 'defdetr', to: 'dinodetr', label: '多尺度特征继承', arrows: 'to' },
      { from: 'defdetr', to: 'petr', label: 'Transformer 检测范式', arrows: 'to' },
      { from: 'defdetr', to: 'bevformer', label: '可变形注意力核心组件', arrows: 'to' },
      { from: 'defdetr', to: 'sparse4d', label: '稀疏查询继承', arrows: 'to' },
      { from: 'swin', to: 'bevformer', label: 'Swin 骨干网络', arrows: 'to' },
      { from: 'swin', to: 'bevdet', label: 'Swin 骨干替换', arrows: 'to', dashes: true },
      { from: 'lss', to: 'bevdet', label: 'View Transformer 基础', arrows: 'to' },
      { from: 'bevdet', to: 'bevdepth', label: '深度估计改进', arrows: 'to' },
      { from: 'lss', to: 'bevdepth', label: '深度分布监督', arrows: 'to' },
      { from: 'lss', to: 'bevfusion', label: 'BEV 池化加速', arrows: 'to' },
      { from: 'bevdepth', to: 'bevfusion', label: '深度增强融合', arrows: 'to' },
      { from: 'centerpoint', to: 'bevdet', label: 'CenterPoint 检测头', arrows: 'to' },
      { from: 'centerpoint', to: 'bevfusion', label: 'CenterPoint 检测头', arrows: 'to' },
      { from: 'petr', to: 'streampetr', label: '物体级时序扩展', arrows: 'to' },
      { from: 'petr', to: 'sparse4d', label: '稀疏采样替代全局注意力', arrows: 'to' },
      { from: 'sparse4d', to: 'streampetr', label: '时序传播思路', arrows: 'to', dashes: true },
      { from: 'bevformer', to: 'streampetr', label: '时序建模思路对比', arrows: 'to', dashes: true },
      { from: 'lss', to: 'bevformer', label: 'BEV 范式对比', arrows: 'to', dashes: true },
      { from: 'defdetr', to: 'maptr', label: 'DETR 范式迁移至地图', arrows: 'to' },
      { from: 'lss', to: 'maptr', label: 'BEV 特征提取', arrows: 'to', dashes: true },
      { from: 'bevformer', to: 'maptr', label: 'Deformable Attn 交叉注意力', arrows: 'to', dashes: true },
      { from: 'lss', to: 'occformer', label: 'LSS 2D→3D 体素', arrows: 'to' },
      { from: 'bevdepth', to: 'occformer', label: '深度监督', arrows: 'to', dashes: true },
      { from: 'defdetr', to: 'occformer', label: 'Deformable Attn 组件', arrows: 'to', dashes: true },
      // 端到端自动驾驶
      { from: 'bevformer', to: 'uniad', label: 'BEV Encoder 基础', arrows: 'to' },
      { from: 'defdetr', to: 'uniad', label: 'Query 检测范式', arrows: 'to' },
      { from: 'sparse4d', to: 'sparsedrive', label: '稀疏感知继承', arrows: 'to' },
      { from: 'uniad', to: 'sparsedrive', label: '端到端 → 稀疏化', arrows: 'to' },
      { from: 'maptr', to: 'sparsedrive', label: '在线建图模块', arrows: 'to', dashes: true },
      { from: 'sparsedrive', to: 'diffusiondrive', label: '感知编码器复用', arrows: 'to' },
      { from: 'uniad', to: 'diffusiondrive', label: '端到端范式对比', arrows: 'to', dashes: true },
      // 经典 2D 检测链
      { from: 'rcnn', to: 'yolo', label: '两阶段→单阶段', arrows: 'to' },
      { from: 'rcnn', to: 'ssd', label: '两阶段→单阶段', arrows: 'to' },
      { from: 'ssd', to: 'retinanet', label: 'Focal Loss 改进', arrows: 'to' },
      { from: 'retinanet', to: 'efficientdet', label: 'BiFPN+复合缩放', arrows: 'to' },
      { from: 'retinanet', to: 'centernet', label: 'anchor-based→anchor-free', arrows: 'to', dashes: true },
      { from: 'yolo', to: 'centernet', label: '实时检测→中心点', arrows: 'to', dashes: true },
      // LaneAF ↔ MapTR 对比
      { from: 'laneaf', to: 'maptr', label: '车道结构建模对比', arrows: 'to', dashes: true },
      // PointPillars 关系
      { from: 'pointpillars', to: 'centerpoint', label: '柱体编码→中心点检测', arrows: 'to' },
      { from: 'pointpillars', to: 'bevfusion', label: 'LiDAR 编码器', arrows: 'to', dashes: true },
      // Mask2Former 关系
      { from: 'defdetr', to: 'mask2former', label: 'MSDeformAttn 像素解码器', arrows: 'to' },
      { from: 'mask2former', to: 'occformer', label: '掩码分类→3D 适配', arrows: 'to' }
    ];

    var nodes = new vis.DataSet(
      definedNodes.map(function (n) {
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
      definedEdges.map(function (e) {
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
        physics: {
          solver: 'forceAtlas2Based',
          forceAtlas2Based: {
            gravitationalConstant: -40,
            centralGravity: 0.005,
            springLength: 140,
            springConstant: 0.06,
            avoidOverlap: 0.8
          },
          stabilization: { iterations: 300, fit: true }
        },
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
      // 首次进入页面后自动执行一次适应窗口。
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

    var zoomInBtn = document.getElementById('paper-graph-zoom-in');
    var zoomOutBtn = document.getElementById('paper-graph-zoom-out');
    var fitBtn = document.getElementById('paper-graph-fit');
    var fullscreenBtn = document.getElementById('paper-graph-fullscreen');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', function () {
        graphZoom(1.3);
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', function () {
        graphZoom(0.7);
      });
    }

    if (fitBtn) {
      fitBtn.addEventListener('click', function () {
        graphFit(true);
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', function () {
        graphFullscreen();
      });
    }

    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement) {
        container.style.height = '600px';
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

    // 页面首屏渲染后再 fit 一次，避免字体加载与容器宽度变化导致视图偏移。
    setTimeout(function () {
      graphFit(false);
    }, 80);

    window._paperGraphNetwork = network;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPaperGraph);
  } else {
    initPaperGraph();
  }
})();
