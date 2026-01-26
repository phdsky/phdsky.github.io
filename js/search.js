// 本地搜索功能
let searchData = null;

// 加载搜索数据
function loadSearchData() {
    if (searchData) return Promise.resolve(searchData);
    
    return fetch('/search.xml')
        .then(response => response.text())
        .then(xml => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'text/xml');
            const entries = xmlDoc.getElementsByTagName('entry');
            
            searchData = Array.from(entries).map(entry => {
                return {
                    title: entry.getElementsByTagName('title')[0]?.textContent || '',
                    url: entry.getElementsByTagName('url')[0]?.textContent || '',
                    content: entry.getElementsByTagName('content')[0]?.textContent || ''
                };
            });
            
            return searchData;
        })
        .catch(err => {
            console.error('搜索数据加载失败:', err);
            return [];
        });
}

// 执行搜索
function performSearch(keyword) {
    if (!keyword) return [];
    
    keyword = keyword.toLowerCase().trim();
    
    return searchData.filter(post => {
        return post.title.toLowerCase().includes(keyword) ||
               post.content.toLowerCase().includes(keyword);
    });
}

// 显示搜索结果
function displaySearchResults(results, keyword) {
    const searchModal = document.getElementById('searchModal');
    let resultsHTML = searchModal.querySelector('.search-results');
    
    if (!resultsHTML) {
        resultsHTML = document.createElement('div');
        resultsHTML.className = 'search-results';
        searchModal.querySelector('.search-content').appendChild(resultsHTML);
    }
    
    if (results.length === 0) {
        resultsHTML.innerHTML = '<p class="no-results">未找到相关内容</p>';
        return;
    }
    
    const html = results.map(result => {
        const titleHighlight = highlightKeyword(result.title, keyword);
        const contentSnippet = getContentSnippet(result.content, keyword, 100);
        
        return `
            <div class="search-result-item">
                <h3><a href="${result.url}">${titleHighlight}</a></h3>
                <p>${contentSnippet}</p>
            </div>
        `;
    }).join('');
    
    resultsHTML.innerHTML = `
        <p class="search-result-count">找到 ${results.length} 条结果</p>
        ${html}
    `;
}

// 高亮关键词
function highlightKeyword(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// 获取内容摘要
function getContentSnippet(content, keyword, length = 100) {
    content = content.replace(/<[^>]+>/g, '').trim();
    
    if (!keyword) {
        return content.substring(0, length) + '...';
    }
    
    const lowerContent = content.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    const index = lowerContent.indexOf(lowerKeyword);
    
    if (index === -1) {
        return content.substring(0, length) + '...';
    }
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + keyword.length + 50);
    let snippet = content.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return highlightKeyword(snippet, keyword);
}

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const searchForm = document.querySelector('.search-modal form');
    
    // 预加载搜索数据
    loadSearchData();
    
    // 监听表单提交
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const keyword = searchInput.value.trim();
            if (!keyword) return;
            
            loadSearchData().then(data => {
                const results = performSearch(keyword);
                displaySearchResults(results, keyword);
            });
        });
    }
    
    // 实时搜索（可选）
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            const keyword = this.value.trim();
            if (keyword.length < 2) {
                const resultsDiv = document.querySelector('.search-results');
                if (resultsDiv) resultsDiv.innerHTML = '';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                loadSearchData().then(data => {
                    const results = performSearch(keyword);
                    displaySearchResults(results, keyword);
                });
            }, 300);
        });
    }
});
