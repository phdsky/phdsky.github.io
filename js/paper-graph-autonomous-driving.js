(function () {
  function initPaperGraph() {
    if (!window.PaperGraph || typeof window.PaperGraph.create !== 'function') {
      return;
    }

    var definedNodes = [
      // 经典 2D 检测 (最顶部)
      { id: 'rcnn', label: 'R-CNN 系列\n(CVPR 2014)', color: '#e67e22', url: '/posts/2014/papers/2014_CVPR_RCNN_Series_Region_Based_Object_Detection/', x: -380, y: -480 },
      { id: 'yolo', label: 'YOLO 系列\n(CVPR 2016)', color: '#e67e22', url: '/posts/2018/papers/2018_arXiv_YOLO_Series_Unified_Real_Time_Object_Detection/', x: -170, y: -480 },
      { id: 'ssd', label: 'SSD\n(ECCV 2016)', color: '#e67e22', url: '/posts/2016/papers/2016_ECCV_SSD_Single_Shot_MultiBox_Detector/', x: 30, y: -480 },
      { id: 'retinanet', label: 'RetinaNet\n(ICCV 2017)', color: '#e67e22', url: '/posts/2017/papers/2017_ICCV_RetinaNet_Focal_Loss_Dense_Object_Detection/', x: 230, y: -480 },
      { id: 'efficientdet', label: 'EfficientDet\n(CVPR 2020)', color: '#e67e22', url: '/posts/2020/papers/2020_CVPR_EfficientDet_Scalable_Efficient_Object_Detection/', x: 430, y: -480 },
      // 2D检测基础 -> 跟踪 -> 3D (顶部)
      { id: 'centernet', label: 'CenterNet\n(CVPR 2019)', color: '#f1c40f', url: '/posts/2019/papers/2019_CVPR_CenterNet_Objects_as_Points/', x: -20, y: -280 },
      { id: 'centertrack', label: 'CenterTrack\n(ECCV 2020)', color: '#f1c40f', url: '/posts/2020/papers/2020_ECCV_CenterTrack_Tracking_Objects_as_Points/', x: -230, y: -200 },
      { id: 'centerpoint', label: 'CenterPoint\n(CVPR 2021)', color: '#f1c40f', url: '/posts/2021/papers/2021_CVPR_CenterPoint_Center_based_3D_Object_Detection_and_Tracking/', x: -230, y: -80 },
      // LiDAR 点云编码基础
      { id: 'pointpillars', label: 'PointPillars\n(CVPR 2019)', color: '#f1c40f', url: '/posts/2019/papers/2019_CVPR_PointPillars_Fast_Encoders_LiDAR_3D_Object_Detection/', x: -440, y: -80 },
      { id: 'detr', label: 'DETR\n(ECCV 2020)', color: '#f1c40f', url: '/posts/2020/papers/2020_ECCV_DETR_End_to_End_Object_Detection_with_Transformers/', x: -20, y: -120 },
      { id: 'defdetr', label: 'Deformable DETR\n(ICLR 2021)', color: '#f1c40f', url: '/posts/2021/papers/2021_ICLR_Deformable_DETR_Deformable_Transformers/', x: -20, y: 50 },
      { id: 'dinodetr', label: 'DINO DETR\n(ICLR 2023)', color: '#f1c40f', url: '/posts/2023/papers/2023_ICLR_DINO_DETR_Series_Denoising_Detection/', x: 180, y: -30 },
      // LSS系 显式BEV投影 (左侧)
      { id: 'lss', label: 'LSS\n(ECCV 2020)', color: '#27ae60', font: { color: '#fff' }, url: '/posts/2020/papers/2020_ECCV_LSS_Lift_Splat_Shoot/', x: -280, y: -120 },
      { id: 'bevdet', label: 'BEVDet\n(arXiv 2021)', color: '#27ae60', font: { color: '#fff' }, url: '/posts/2021/papers/2021_arXiv_BEVDet_High_Performance_Multi_Camera_3D_Object_Detection/', x: -300, y: 50 },
      { id: 'bevdepth', label: 'BEVDepth\n(AAAI 2023)', color: '#27ae60', font: { color: '#fff' }, url: '/posts/2023/papers/2023_AAAI_BEVDepth_Acquisition_Reliable_Depth/', x: -280, y: 200 },
      { id: 'bevfusion', label: 'BEVFusion\n(ICRA 2023)', color: '#27ae60', font: { color: '#fff' }, url: '/posts/2023/papers/2023_ICRA_BEVFusion_Multi_Task_Multi_Sensor_Fusion/', x: -160, y: 350 },
      // Transformer Query系 (右侧)
      { id: 'detr3d', label: 'DETR3D\n(CoRL 2021)', color: '#16a085', font: { color: '#fff' }, url: '/posts/2021/papers/2021_CoRL_DETR3D_3D_Object_Detection_via_3D_to_2D_Queries/', x: 120, y: -30 },
      { id: 'petr', label: 'PETR\n(ECCV 2022)', color: '#16a085', font: { color: '#fff' }, url: '/posts/2022/papers/2022_ECCV_PETR_Position_Embedding_Transformation_for_Multi_View_3D_Object_Detection/', x: 260, y: 50 },
      { id: 'bevformer', label: 'BEVFormer\n(ECCV 2022)', color: '#16a085', font: { color: '#fff' }, url: '/posts/2022/papers/2022_ECCV_BEVFormer_Spatiotemporal_Transformers/', x: 20, y: 200 },
      { id: 'sparse4d', label: 'Sparse4D\n(arXiv 2022)', color: '#16a085', font: { color: '#fff' }, url: '/posts/2022/papers/2022_arXiv_Sparse4D_Sparse_Spatial_Temporal_Fusion/', x: 280, y: 200 },
      { id: 'streampetr', label: 'StreamPETR\n(ICCV 2023)', color: '#16a085', font: { color: '#fff' }, url: '/posts/2023/papers/2023_ICCV_StreamPETR_Object_Centric_Temporal_Modeling/', x: 180, y: 350 },
      // 骨干网络 (上方)
      { id: 'resnet', label: 'ResNet\n(CVPR 2016)', color: '#e74c3c', font: { color: '#fff' }, url: '/posts/2016/papers/2016_CVPR_ResNet_Deep_Residual_Learning/', x: -420, y: -280 },
      { id: 'vit', label: 'ViT\n(ICLR 2021)', color: '#e74c3c', font: { color: '#fff' }, url: '/posts/2021/papers/2021_ICLR_ViT_Vision_Transformer_Image_Recognition/', x: -300, y: -350 },
      { id: 'swin', label: 'Swin Transformer\n(ICCV 2021)', color: '#e74c3c', font: { color: '#fff' }, url: '/posts/2022/papers/2022_CVPR_Swin_Transformer_Series_Hierarchical_Vision_Transformer/', x: -170, y: -280 },
      // 车道线检测 (右上方独立)
      { id: 'laneaf', label: 'LaneAF\n(arXiv 2021)', color: '#e91e63', font: { color: '#fff' }, url: '/posts/2021/papers/2021_arXiv_LaneAF_Robust_Multi_Lane_Detection_with_Affinity_Fields/', x: 470, y: -120 },
      // 在线矢量化高精地图 (右侧垂直演进柱)
      { id: 'hdmapnet',     label: 'HDMapNet\n(ICRA 2022)',     color: '#16a085', font: { color: '#fff' }, url: '/posts/2022/papers/2022_ICRA_HDMapNet_Online_HD_Map_Construction/',                       x: 600, y: 50  },
      { id: 'vectormapnet', label: 'VectorMapNet\n(ICML 2023)', color: '#16a085', font: { color: '#fff' }, url: '/posts/2023/papers/2023_ICML_VectorMapNet_End_to_end_Vectorized_HD_Map_Learning/',     x: 600, y: 200 },
      { id: 'maptr',        label: 'MapTR\n(ICLR 2023)',         color: '#16a085', font: { color: '#fff' }, url: '/posts/2023/papers/2023_ICLR_MapTR_Structured_Modeling_Online_Vectorized_HD_Map/',     x: 600, y: 350 },
      { id: 'maptrv2',      label: 'MapTRv2\n(IJCV 2024)',      color: '#16a085', font: { color: '#fff' }, url: '/posts/2024/papers/2024_IJCV_MapTRv2_End_to_End_Vectorized_HD_Map/',                  x: 600, y: 500 },
      // 3D 语义占用预测
      { id: 'occformer', label: 'OccFormer\n(ICCV 2023)', color: '#3498db', font: { color: '#fff' }, url: '/posts/2023/papers/2023_ICCV_OccFormer_Dual_Path_Transformer_3D_Semantic_Occupancy/', x: -160, y: 500 },
      { id: 'mask2former', label: 'Mask2Former\n(CVPR 2022)', color: '#3498db', font: { color: '#fff' }, url: '/posts/2022/papers/2022_CVPR_Mask2Former_Universal_Image_Segmentation/', x: -360, y: 500 },
      // 端到端自动驾驶
      { id: 'uniad', label: 'UniAD\n(CVPR 2023)', color: '#9b59b6', font: { color: '#fff' }, url: '/posts/2023/papers/2023_CVPR_UniAD_Planning_Oriented_Autonomous_Driving/', x: 20, y: 640 },
      { id: 'vad', label: 'VAD / VADv2\n(ICCV 2023 / arXiv 2024)', color: '#9b59b6', font: { color: '#fff' }, url: '/posts/2024/papers/2024_arXiv_VAD_VADv2_Vectorized_End_to_End_Autonomous_Driving/', x: 200, y: 540 },
      { id: 'sparsedrive', label: 'SparseDrive 系列\n(arXiv 2024→2026)', color: '#9b59b6', font: { color: '#fff' }, url: '/posts/2026/papers/2026_arXiv_SparseDrive_Series_End_to_End_Autonomous_Driving/', x: 320, y: 640 },
      { id: 'diffusiondrive', label: 'DiffusionDrive\n(CVPR 2025)', color: '#9b59b6', font: { color: '#fff' }, url: '/posts/2025/papers/2025_CVPR_DiffusionDrive_Truncated_Diffusion_End_to_End_Driving/', x: 200, y: 760 }
    ];

    var definedEdges = [
      { from: 'centernet', to: 'centertrack', label: '检测->跟踪扩展', arrows: 'to' },
      { from: 'centernet', to: 'centerpoint', label: '中心点->3D 点云', arrows: 'to' },
      { from: 'centertrack', to: 'centerpoint', label: '速度匹配->3D 跟踪', arrows: 'to' },
      { from: 'centernet', to: 'detr', label: 'anchor-free 启发', arrows: 'to', dashes: true },
      { from: 'detr', to: 'defdetr', label: '可变形注意力改进', arrows: 'to' },
      { from: 'detr', to: 'dinodetr', label: 'query 显式化+去噪训练', arrows: 'to' },
      { from: 'defdetr', to: 'dinodetr', label: '多尺度特征继承', arrows: 'to' },
      { from: 'defdetr', to: 'petr', label: 'Transformer 检测范式', arrows: 'to', dashes: true },
      { from: 'defdetr', to: 'detr3d', label: '3D set prediction 扩展', arrows: 'to' },
      { from: 'detr3d', to: 'petr', label: '3D query 范式 → embedding-based', arrows: 'to' },
      { from: 'detr3d', to: 'sparse4d', label: '稀疏 query + 反投影', arrows: 'to', dashes: true },
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
      // 在线建图演进链：HDMapNet → VectorMapNet → MapTR → MapTRv2
      { from: 'hdmapnet', to: 'vectormapnet', label: '栅格→端到端矢量化', arrows: 'to' },
      { from: 'vectormapnet', to: 'maptr', label: '自回归→并行 polyline query', arrows: 'to' },
      { from: 'maptr', to: 'maptrv2', label: '解耦注意力+一对多+密集监督', arrows: 'to' },
      { from: 'defdetr', to: 'vectormapnet', label: 'DETR set prediction', arrows: 'to', dashes: true },
      { from: 'lss', to: 'occformer', label: 'LSS 2D→3D 体素', arrows: 'to' },
      { from: 'bevdepth', to: 'occformer', label: '深度监督', arrows: 'to', dashes: true },
      { from: 'defdetr', to: 'occformer', label: 'Deformable Attn 组件', arrows: 'to', dashes: true },
      // 端到端自动驾驶
      { from: 'bevformer', to: 'uniad', label: 'BEV Encoder 基础', arrows: 'to' },
      { from: 'defdetr', to: 'uniad', label: 'Query 检测范式', arrows: 'to' },
      { from: 'uniad', to: 'vad', label: '多任务→向量化简化', arrows: 'to' },
      { from: 'maptr', to: 'vad', label: 'MapTR + Planning = VAD', arrows: 'to' },
      { from: 'vad', to: 'sparsedrive', label: '向量化→稀疏化', arrows: 'to' },
      { from: 'vad', to: 'diffusiondrive', label: '词表评分→生成采样', arrows: 'to', dashes: true },
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
      { from: 'mask2former', to: 'occformer', label: '掩码分类→3D 适配', arrows: 'to' },
      // 骨干网络演进
      { from: 'resnet', to: 'vit', label: 'CNN→Transformer', arrows: 'to', dashes: true },
      { from: 'vit', to: 'swin', label: '层级化改进', arrows: 'to' },
      { from: 'resnet', to: 'centernet', label: '默认 backbone', arrows: 'to', dashes: true },
      { from: 'resnet', to: 'detr', label: 'CNN backbone', arrows: 'to', dashes: true }
    ];


    window.PaperGraph.create({
      wrapperId: 'paper-graph-wrapper',
      containerId: 'paper-graph',
      toolbarPrefix: 'paper-graph',
      height: 750,
      definedNodes: definedNodes,
      definedEdges: definedEdges
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPaperGraph);
  } else {
    initPaperGraph();
  }
})();
