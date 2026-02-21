// 搜索功能
document.addEventListener('DOMContentLoaded', function() {
    const searchTrigger = document.querySelector('.search-trigger');
    const searchModal = document.getElementById('searchModal');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.querySelector('.search-input');

    // 打开搜索弹窗
    if (searchTrigger) {
        searchTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            searchModal.classList.add('active');
            searchInput.focus();
        });
    }

    // 关闭搜索弹窗
    if (closeSearch) {
        closeSearch.addEventListener('click', function() {
            searchModal.classList.remove('active');
        });
    }

    // 点击背景关闭
    if (searchModal) {
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
            }
        });
    }

    // ESC 键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            searchModal.classList.remove('active');
        }
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            // 解码 URL 编码的锚点，并移除开头的 #
            const targetId = decodeURIComponent(href.substring(1));
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 图片懒加载
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 代码高亮（如果需要）
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }

    // 返回顶部按钮
    createBackToTop();
});

// 创建返回顶部按钮
function createBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
    `;

    document.body.appendChild(backToTopBtn);

    // 显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    // 点击返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 悬停效果
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });

    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}

// Inline Tooltip：点击固定，右上角关闭按钮
document.addEventListener('DOMContentLoaded', function () {
  function unpinAll() {
    document.querySelectorAll('.tip-trigger.tip-pinned').forEach(function (t) {
      t.classList.remove('tip-pinned');
      var btn = t.querySelector('.tip-close');
      if (btn) btn.remove();
    });
  }

  document.querySelectorAll('.tip-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasPinned = trigger.classList.contains('tip-pinned');
      unpinAll();
      if (!wasPinned) {
        trigger.classList.add('tip-pinned');
        var box = trigger.querySelector('.tip-box');
        if (box && !box.querySelector('.tip-close')) {
          // 阻止 tip-box 内的所有事件冒泡，防止选中文字时关闭
          box.addEventListener('click', function (e) { e.stopPropagation(); });
          box.addEventListener('mousedown', function (e) { e.stopPropagation(); });
          box.addEventListener('mouseup', function (e) { e.stopPropagation(); });
          var btn = document.createElement('button');
          btn.className = 'tip-close';
          btn.innerHTML = '&times;';
          btn.title = '关闭';
          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            trigger.classList.remove('tip-pinned');
            btn.remove();
          });
          box.appendChild(btn);
        }
      }
    });
  });

  // 点击其他区域关闭
  document.addEventListener('click', function () {
    unpinAll();
  });
});

// 移动端菜单切换（如果需要）
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}
