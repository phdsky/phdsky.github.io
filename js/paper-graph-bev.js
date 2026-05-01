/**
 * BEV + Transformer 感知统一框架 子图。
 * 涵盖：LSS / BEVDet / BEVDepth / BEVFormer / DETR3D / PETR / Sparse4D / StreamPETR / BEVFusion
 * + MapTR 系列 + UniAD（作为下游应用入口）
 */
(function () {
  function init() {
    if (!window.PaperGraph || typeof window.PaperGraph.create !== 'function') {
      return;
    }

    var definedNodes = [
      // 骨干 / 经典检测（顶部参考点）
      { id: 'detr',        label: 'DETR\n(ECCV 2020)',           color: '#f1c40f',                      url: '/posts/2020/papers/2020_ECCV_DETR_End_to_End_Object_Detection_with_Transformers/',                  x: -180, y: -240 },
      { id: 'defdetr',     label: 'Deformable DETR\n(ICLR 2021)', color: '#f1c40f',                      url: '/posts/2021/papers/2021_ICLR_Deformable_DETR_Deformable_Transformers/',                            x:  -20, y: -240 },
      { id: 'mask2former', label: 'Mask2Former\n(CVPR 2022)',     color: '#3498db', font: { color: '#fff' }, url: '/posts/2022/papers/2022_CVPR_Mask2Former_Universal_Image_Segmentation/',                       x:  160, y: -240 },

      // 显式 BEV 投影（LSS 派，左列绿）
      { id: 'lss',       label: 'LSS\n(ECCV 2020)',     color: '#27ae60', font: { color: '#fff' }, url: '/posts/2020/papers/2020_ECCV_LSS_Lift_Splat_Shoot/',                                                       x: -260, y: -100 },
      { id: 'bevdet',    label: 'BEVDet\n(arXiv 2021)', color: '#27ae60', font: { color: '#fff' }, url: '/posts/2021/papers/2021_arXiv_BEVDet_High_Performance_Multi_Camera_3D_Object_Detection/',                  x: -260, y:    0 },
      { id: 'bevdepth',  label: 'BEVDepth\n(AAAI 2023)', color: '#27ae60', font: { color: '#fff' }, url: '/posts/2023/papers/2023_AAAI_BEVDepth_Acquisition_Reliable_Depth/',                                       x: -260, y:  100 },
      { id: 'bevfusion', label: 'BEVFusion\n(ICRA 2023)', color: '#27ae60', font: { color: '#fff' }, url: '/posts/2023/papers/2023_ICRA_BEVFusion_Multi_Task_Multi_Sensor_Fusion/',                                  x: -180, y:  220 },

      // Query / 隐式 BEV（右列青）
      { id: 'detr3d',     label: 'DETR3D\n(CoRL 2021)',    color: '#16a085', font: { color: '#fff' }, url: '/posts/2021/papers/2021_CoRL_DETR3D_3D_Object_Detection_via_3D_to_2D_Queries/',                          x:  20, y: -100 },
      { id: 'petr',       label: 'PETR\n(ECCV 2022)',      color: '#16a085', font: { color: '#fff' }, url: '/posts/2022/papers/2022_ECCV_PETR_Position_Embedding_Transformation_for_Multi_View_3D_Object_Detection/', x: 130, y:    0 },
      { id: 'bevformer',  label: 'BEVFormer\n(ECCV 2022)', color: '#16a085', font: { color: '#fff' }, url: '/posts/2022/papers/2022_ECCV_BEVFormer_Spatiotemporal_Transformers/',                                    x: -20, y:  100 },
      { id: 'sparse4d',   label: 'Sparse4D\n(arXiv 2022)', color: '#16a085', font: { color: '#fff' }, url: '/posts/2022/papers/2022_arXiv_Sparse4D_Sparse_Spatial_Temporal_Fusion/',                                 x: 200, y:  100 },
      { id: 'streampetr', label: 'StreamPETR\n(ICCV 2023)', color: '#16a085', font: { color: '#fff' }, url: '/posts/2023/papers/2023_ICCV_StreamPETR_Object_Centric_Temporal_Modeling/',                              x: 130, y:  220 },

      // Map polyline query（最右列，垂直演进）
      { id: 'hdmapnet',     label: 'HDMapNet\n(ICRA 2022)',     color: '#16a085', font: { color: '#fff' }, url: '/posts/2022/papers/2022_ICRA_HDMapNet_Online_HD_Map_Construction/',                  x: 360, y: -100 },
      { id: 'vectormapnet', label: 'VectorMapNet\n(ICML 2023)', color: '#16a085', font: { color: '#fff' }, url: '/posts/2023/papers/2023_ICML_VectorMapNet_End_to_end_Vectorized_HD_Map_Learning/', x: 360, y:    0 },
      { id: 'maptr',        label: 'MapTR\n(ICLR 2023)',         color: '#16a085', font: { color: '#fff' }, url: '/posts/2023/papers/2023_ICLR_MapTR_Structured_Modeling_Online_Vectorized_HD_Map/', x: 360, y:  100 },
      { id: 'maptrv2',      label: 'MapTRv2\n(IJCV 2024)',      color: '#16a085', font: { color: '#fff' }, url: '/posts/2024/papers/2024_IJCV_MapTRv2_End_to_End_Vectorized_HD_Map/',               x: 360, y:  220 },

      // 占用预测
      { id: 'occformer', label: 'OccFormer\n(ICCV 2023)', color: '#3498db', font: { color: '#fff' }, url: '/posts/2023/papers/2023_ICCV_OccFormer_Dual_Path_Transformer_3D_Semantic_Occupancy/', x: -60, y: 320 },

      // 端到端入口（仅作下游引用，不展开）
      { id: 'uniad', label: 'UniAD\n(CVPR 2023)\n[端到端入口]', color: '#9b59b6', font: { color: '#fff' }, url: '/posts/2023/papers/2023_CVPR_UniAD_Planning_Oriented_Autonomous_Driving/', x: 100, y: 360 }
    ];

    var definedEdges = [
      // 显式 BEV 演进
      { from: 'lss',       to: 'bevdet',    label: 'View Transformer 基础', arrows: 'to' },
      { from: 'bevdet',    to: 'bevdepth',  label: '深度估计改进',           arrows: 'to' },
      { from: 'lss',       to: 'bevdepth',  label: '深度分布监督',           arrows: 'to', dashes: true },
      { from: 'bevdepth',  to: 'bevfusion', label: '深度增强融合',           arrows: 'to' },
      { from: 'lss',       to: 'bevfusion', label: 'BEV 池化加速',           arrows: 'to', dashes: true },

      // Query 派演进
      { from: 'defdetr',   to: 'detr3d',     label: '3D set prediction 扩展', arrows: 'to' },
      { from: 'detr',      to: 'defdetr',    label: '可变形注意力改进',         arrows: 'to' },
      { from: 'detr3d',    to: 'petr',       label: '3D query → embedding',    arrows: 'to' },
      { from: 'detr3d',    to: 'sparse4d',   label: '稀疏 query + 反投影',     arrows: 'to', dashes: true },
      { from: 'defdetr',   to: 'bevformer',  label: '可变形注意力核心组件',     arrows: 'to' },
      { from: 'petr',      to: 'streampetr', label: '物体级时序扩展',           arrows: 'to' },
      { from: 'sparse4d',  to: 'streampetr', label: '时序传播思路',             arrows: 'to', dashes: true },

      // 显式 vs 隐式
      { from: 'lss',       to: 'bevformer',  label: 'BEV 范式对比',             arrows: 'to', dashes: true },

      // Map polyline 演进
      { from: 'hdmapnet',     to: 'vectormapnet', label: '栅格 → 端到端矢量化',         arrows: 'to' },
      { from: 'vectormapnet', to: 'maptr',        label: '自回归 → 并行 polyline query', arrows: 'to' },
      { from: 'maptr',        to: 'maptrv2',      label: '解耦+一对多+密集监督',         arrows: 'to' },
      { from: 'defdetr',      to: 'maptr',        label: 'DETR 范式迁移至地图',          arrows: 'to', dashes: true },
      { from: 'bevformer',    to: 'maptr',        label: 'Deformable Attn 交叉注意力',   arrows: 'to', dashes: true },

      // 占用
      { from: 'lss',         to: 'occformer',  label: 'LSS 2D → 3D 体素', arrows: 'to' },
      { from: 'mask2former', to: 'occformer',  label: '掩码分类 → 3D 适配', arrows: 'to' },

      // 下游入口
      { from: 'bevformer', to: 'uniad', label: 'BEV Encoder 基础', arrows: 'to' },
      { from: 'maptr',     to: 'uniad', label: 'MapFormer 输入',   arrows: 'to', dashes: true },
      { from: 'occformer', to: 'uniad', label: 'OccFormer 输入',   arrows: 'to', dashes: true }
    ];

    window.PaperGraph.create({
      wrapperId: 'bev-graph-wrapper',
      containerId: 'bev-graph',
      toolbarPrefix: 'bev-graph',
      height: 560,
      definedNodes: definedNodes,
      definedEdges: definedEdges
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
