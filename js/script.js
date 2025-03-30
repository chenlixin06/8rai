document.addEventListener('DOMContentLoaded', function() {
    // 创建主题切换按钮
    function createThemeToggle() {
        // 获取header-right元素
        const headerRight = document.querySelector('.header-right');
        if (!headerRight) return;
        
        // 创建主题切换按钮
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
        themeToggle.title = '切换主题模式';
        
        // 添加到body
        document.body.appendChild(themeToggle);
        
        // 检查本地存储中的主题设置
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
        } else {
            // 确保为light模式设置正确的data-theme属性
            document.documentElement.setAttribute('data-theme', 'light');
        }
        
        // 添加点击事件
        themeToggle.addEventListener('click', function() {
            // 切换主题
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
                showToast('已切换到白天模式');
                // 额外刷新特定元素的样式
                refreshElementsStyle('light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
                showToast('已切换到夜间模式');
                // 额外刷新特定元素的样式
                refreshElementsStyle('dark');
            }
        });
    }
    
    // 刷新特定元素的样式以确保主题正确应用
    function refreshElementsStyle(theme) {
        // 修复导航菜单颜色
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            // 重新应用样式
            link.style.color = '';
            if (theme === 'light') {
                // 白天模式时使用更深的文字颜色
                link.style.color = '#1a202c';
                link.style.fontWeight = '600';
            } else {
                // 夜间模式
                setTimeout(() => {
                    link.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
                }, 10);
            }
        });
        
        // 强制刷新AI模型评测区域
        const modelsComparison = document.querySelector('.models-comparison');
        if (modelsComparison) {
            modelsComparison.style.backgroundColor = '';
            setTimeout(() => {
                modelsComparison.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--card-color');
            }, 10);
        }
        
        // 刷新评测基准卡片
        const benchmarkItems = document.querySelectorAll('.benchmark-item');
        benchmarkItems.forEach(item => {
            item.style.backgroundColor = '';
            setTimeout(() => {
                item.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--card-color');
            }, 10);
        });
        
        // 刷新品牌展示部分
        const pillars = document.querySelectorAll('.pillar');
        pillars.forEach(pillar => {
            pillar.style.backgroundColor = '';
            setTimeout(() => {
                pillar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--card-color');
            }, 10);
        });
    }
    
    createThemeToggle();
    
    // 初始化时执行一次样式刷新
    setTimeout(() => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        refreshElementsStyle(currentTheme);
    }, 100);
    
    // 获取搜索框元素 - 从新位置获取
    const searchInput = document.querySelector('.header-right .search-box input');
    const searchButton = document.querySelector('.header-right .search-box button');
    const searchBox = document.querySelector('.header-right .search-box');
    const header = document.querySelector('header');

    // 获取所有工具卡片
    const allTools = document.querySelectorAll('.tool-card');
    
    // 实现搜索功能
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // 如果搜索词为空，显示所有工具
            allTools.forEach(tool => {
                tool.style.display = 'flex';
            });
            return;
        }
        
        // 过滤工具卡片
        allTools.forEach(tool => {
            const toolName = tool.querySelector('h3, h4').textContent.toLowerCase();
            const toolDesc = tool.querySelector('p').textContent.toLowerCase();
            
            if (toolName.includes(searchTerm) || toolDesc.includes(searchTerm)) {
                tool.style.display = 'flex';
            } else {
                tool.style.display = 'none';
            }
        });
    }
    
    // 搜索框展开/收起功能
    searchButton.addEventListener('click', function(e) {
        // 如果有输入内容，直接执行搜索
        if (searchInput.value.trim() !== '') {
            performSearch();
        }
    });
    
    // 添加搜索框回车事件
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有链接的active类
            navLinks.forEach(link => link.classList.remove('active'));
            
            // 给当前点击的链接添加active类
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动监听，更新导航高亮和搜索框状态
    function onScroll() {
        // 获取所有内容板块
        const sections = document.querySelectorAll('section[id]');
        
        // 获取当前滚动位置
        let scrollPosition = window.scrollY + 100; // 添加偏移量以提前高亮
        
        // 处理头部状态
        const header = document.querySelector('header');
        
        if (scrollPosition > 100) {
            header.classList.add('header-scrolled');
            
            // 检查是否是移动端
            if (window.innerWidth <= 768) {
                const logoContainer = document.querySelector('.logo-container');
                const logoText = document.querySelector('.logo-text');
                
                if (logoContainer) logoContainer.style.display = 'none';
                if (logoText) logoText.style.display = 'none';
            }
        } else {
            header.classList.remove('header-scrolled');
            
            // 恢复LOGO显示
            const logoContainer = document.querySelector('.logo-container');
            const logoText = document.querySelector('.logo-text');
            
            if (logoContainer) logoContainer.style.display = '';
            if (logoText) logoText.style.display = '';
        }
        
        // 默认移除所有链接的active类
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // 检查每个板块的位置
        let foundActive = false;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // 如果当前滚动位置在这个板块内
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // 给对应导航链接添加active类
                const correspondingLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                    foundActive = true;
                }
            }
        });
    }

    // 添加滚动事件监听
    window.addEventListener('scroll', onScroll);

    // 窗口大小改变时检查
    window.addEventListener('resize', function() {
        const header = document.querySelector('header');
        const logoContainer = document.querySelector('.logo-container');
        const logoText = document.querySelector('.logo-text');
        
        if (header.classList.contains('header-scrolled')) {
            if (window.innerWidth <= 768) {
                if (logoContainer) logoContainer.style.display = 'none';
                if (logoText) logoText.style.display = 'none';
            } else {
                if (logoContainer) logoContainer.style.display = '';
                if (logoText) logoText.style.display = '';
            }
        }
        
        // 强制刷新一次主题样式
        const currentTheme = localStorage.getItem('theme') || 'light';
        refreshElementsStyle(currentTheme);
    });
    
    // 给logo链接添加点击事件
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // 移除所有链接的active类
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
        });
    }
    
    // 初始化时执行一次滚动监听
    onScroll();
    
    // 添加工具卡片悬停动画
    allTools.forEach(tool => {
        tool.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        tool.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // 添加返回顶部功能
    const createBackToTopButton = () => {
        const button = document.createElement('button');
        button.id = 'back-to-top';
        button.innerHTML = '<i class="bi bi-arrow-up"></i>';
        
        document.body.appendChild(button);
        
        button.addEventListener('mouseover', () => {
            button.classList.add('back-to-top-hover');
        });
        
        button.addEventListener('mouseout', () => {
            button.classList.remove('back-to-top-hover');
        });
        
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.classList.add('show');
            } else {
                button.classList.remove('show');
                
                // 确保动画完成后再隐藏
                if (window.pageYOffset <= 300) {
                    setTimeout(() => {
                        if (window.pageYOffset <= 300) {
                            button.classList.remove('show');
                        }
                    }, 300);
                }
            }
        });
    };
    
    createBackToTopButton();
    
    // 新闻标签切换功能
    const newsTabs = document.querySelectorAll('.news-tab');
    const newsCards = document.querySelectorAll('.news-card');
    
    if (newsTabs.length > 0) {
        newsTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 移除所有标签的active类
                newsTabs.forEach(t => t.classList.remove('active'));
                // 给当前点击的标签添加active类
                this.classList.add('active');
                
                // 获取标签类别
                const category = this.getAttribute('data-tab');
                console.log('切换到新闻类别:', category);
                
                // 实现新闻筛选功能
                if (category === 'latest') {
                    // 显示所有新闻
                    newsCards.forEach(card => {
                        card.style.display = 'block';
                    });
                } else {
                    // 根据类别筛选新闻
                    newsCards.forEach(card => {
                        const cardCategory = card.getAttribute('data-category') || 'latest';
                        if (cardCategory === category) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    }
    
    // AI模型评测类别切换功能
    const evalCategories = document.querySelectorAll('.eval-category');
    const modelRows = document.querySelectorAll('.model-row');
    
    if (evalCategories.length > 0) {
        evalCategories.forEach(category => {
            category.addEventListener('click', function() {
                // 移除所有类别的active类
                evalCategories.forEach(c => c.classList.remove('active'));
                // 给当前点击的类别添加active类
                this.classList.add('active');
                
                // 获取类别名称
                const categoryName = this.getAttribute('data-category');
                console.log('切换到模型类别:', categoryName);
                
                // 实现模型类别切换功能
                if (categoryName === 'llm') {
                    // 显示所有模型
                    modelRows.forEach(row => {
                        row.style.display = 'grid';
                    });
                } else {
                    // 根据类别筛选模型
                    modelRows.forEach(row => {
                        const rowCategory = row.getAttribute('data-category') || 'llm';
                        if (rowCategory === categoryName) {
                            row.style.display = 'grid';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                }
            });
        });
    }
    
    // 添加RSS订阅功能
    const rssLink = document.querySelector('.rss-feed');
    if (rssLink) {
        rssLink.addEventListener('click', function(e) {
            // 创建并显示一个临时提示
            showToast('已打开RSS订阅源: 36kr.com/feed-ai');
        });
    }
    
    // 显示临时提示信息的函数
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '1000';
        toast.style.fontSize = '14px';
        
        document.body.appendChild(toast);
        
        // 2秒后移除提示
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 2000);
    }
}); 