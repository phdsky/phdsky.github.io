/**
 * 端到端自动驾驶 子图。
 * 涵盖：UniAD → VAD/VADv2 → SparseDrive 系列 → DiffusionDrive
 * 上游依赖：BEVFormer / MapTR
 */
(function () {
  function init() {
    if (!window.PaperGraph || typeof window.PaperGraph.create !== 'function') {
      return;
    }

    var definedNodes = [
      // 上游依赖（顶部，灰青色作为参考）
      { id: 'bevformer', label: 'BEVFormer\n(ECCV 2022)\n[BEV 编码器]', color: '#16a085', font: { color: '#fff' }, url: '/posts/2022/papers/2022_ECCV_BEVFormer_Spatiotemporal_Transformers/',                          x: -200, y: -200 },
      { id: 'maptr',     label: 'MapTR\n(ICLR 2023)\n[向量化地图]',     color: '#16a085', font: { color: '#fff' }, url: '/posts/2023/papers/2023_ICLR_MapTR_Structured_Modeling_Online_Vectorized_HD_Map/',           x:  200, y: -200 },

      // 端到端主链（紫色）—— 时间从上到下，路线左右分支
      { id: 'uniad',          label: 'UniAD\n(CVPR 2023)\n[全栈级联]',                  color: '#9b59b6', font: { color: '#fff' }, url: '/posts/2023/papers/2023_CVPR_UniAD_Planning_Oriented_Autonomous_Driving/',                                  x:    0, y:  -40 },
      { id: 'vad',            label: 'VAD\n(ICCV 2023)\n[向量化场景]',                  color: '#9b59b6', font: { color: '#fff' }, url: '/posts/2024/papers/2024_arXiv_VAD_VADv2_Vectorized_End_to_End_Autonomous_Driving/',                       x:    0, y:  120 },
      { id: 'vadv2',          label: 'VADv2\n(arXiv 2024)\n[4096 词汇表 + p(a|o)]',     color: '#9b59b6', font: { color: '#fff' }, url: '/posts/2024/papers/2024_arXiv_VAD_VADv2_Vectorized_End_to_End_Autonomous_Driving/',                       x:    0, y:  280 },
      { id: 'sparsedrive',    label: 'SparseDrive\n(arXiv 2024)\n[去 BEV 全 token 化]', color: '#9b59b6', font: { color: '#fff' }, url: '/posts/2026/papers/2026_arXiv_SparseDrive_Series_End_to_End_Autonomous_Driving/',                          x: -200, y:  440 },
      { id: 'sparsedrivev2',  label: 'SparseDriveV2\n(arXiv 2025)\n[260K 分解词表]',     color: '#9b59b6', font: { color: '#fff' }, url: '/posts/2026/papers/2026_arXiv_SparseDrive_Series_End_to_End_Autonomous_Driving/',                          x: -200, y:  600 },
      { id: 'diffusiondrive', label: 'DiffusionDrive\n(CVPR 2025)\n[20 锚点 截断扩散]',  color: '#9b59b6', font: { color: '#fff' }, url: '/posts/2025/papers/2025_CVPR_DiffusionDrive_Truncated_Diffusion_End_to_End_Driving/',                       x:  200, y:  600 },

      // 阵营标签（无 URL，仅作示意，颜色区分）
      { id: 'scoring',  label: '评分派\n（封闭词表 + 概率 / 评分）', color: '#3498db', font: { color: '#fff' }, x: -200, y:  720 },
      { id: 'generation', label: '生成派\n（扩散 / Flow Matching）',  color: '#e74c3c', font: { color: '#fff' }, x:  200, y:  720 }
    ];

    var definedEdges = [
      // 上游依赖
      { from: 'bevformer', to: 'uniad', label: 'BEV Encoder',      arrows: 'to' },
      { from: 'maptr',     to: 'vad',   label: 'MapTR + Planning = VAD', arrows: 'to' },
      { from: 'maptr',     to: 'uniad', label: 'MapFormer 输入',    arrows: 'to', dashes: true },

      // 主链演进
      { from: 'uniad',         to: 'vad',           label: '多任务 → 向量化简化',                arrows: 'to' },
      { from: 'vad',           to: 'vadv2',         label: '回归 → p(a|o) 分布',                  arrows: 'to' },
      { from: 'vadv2',         to: 'sparsedrive',   label: '向量化 → 全 sparse token',            arrows: 'to' },
      { from: 'sparsedrive',   to: 'sparsedrivev2', label: '词表扩展：4K → 260K',                 arrows: 'to' },
      { from: 'vadv2',         to: 'diffusiondrive', label: '评分派 → 生成派',                    arrows: 'to', dashes: true },
      { from: 'sparsedrive',   to: 'diffusiondrive', label: '稀疏感知编码器复用',                  arrows: 'to', dashes: true },

      // 阵营归属
      { from: 'sparsedrivev2', to: 'scoring',    label: '范式归属', arrows: 'to', dashes: true },
      { from: 'vadv2',         to: 'scoring',    label: '范式归属', arrows: 'to', dashes: true },
      { from: 'diffusiondrive', to: 'generation', label: '范式归属', arrows: 'to', dashes: true }
    ];

    window.PaperGraph.create({
      wrapperId: 'e2e-graph-wrapper',
      containerId: 'e2e-graph',
      toolbarPrefix: 'e2e-graph',
      height: 640,
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
