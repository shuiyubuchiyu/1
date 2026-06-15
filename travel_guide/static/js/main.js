/**
 * 旅游指南网站主脚本
 * 提供搜索和交互功能
 */

// 搜索目的地功能
function searchDestinations() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('请输入搜索关键词');
        return;
    }
    
    // 使用 API 进行搜索
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert('未找到匹配的目的地');
            } else {
                // 显示第一个结果
                window.location.href = `/destination/${data[0].id}`;
            }
        })
        .catch(error => {
            console.error('搜索出错:', error);
            alert('搜索失败，请稍后重试');
        });
}

// 支持回车键搜索
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchDestinations();
            }
        });
    }
    
    // 添加卡片点击效果
    const cards = document.querySelectorAll('.destination-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果点击的不是按钮，则导航到详情页
            if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
                const link = this.querySelector('a.btn');
                if (link) {
                    window.location.href = link.href;
                }
            }
        });
    });
    
    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 添加加载动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有卡片
    document.querySelectorAll('.destination-card, .guide-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// 收藏功能（示例）
function toggleFavorite(destId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(destId);
    
    if (index === -1) {
        favorites.push(destId);
        alert('已添加到收藏夹');
    } else {
        favorites.splice(index, 1);
        alert('已从收藏夹移除');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// 分享功能
function shareDestination(name) {
    if (navigator.share) {
        navigator.share({
            title: name,
            text: `我发现了一个超棒的旅游目的地：${name}`,
            url: window.location.href
        }).catch(error => {
            console.log('分享取消');
        });
    } else {
        // 备用方案：复制链接
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('链接已复制到剪贴板');
        });
    }
}

console.log('🌍 探索世界旅游指南已加载');
