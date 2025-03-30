document.addEventListener('DOMContentLoaded', function() {
    // 检测微信浏览器并添加特定类
    function detectWechatBrowser() {
        const ua = navigator.userAgent.toLowerCase();
        const isWechat = ua.indexOf('micromessenger') !== -1;
        
        if (isWechat) {
            document.body.classList.add('wechat-browser');
            document.querySelector('header').classList.add('wechat-header');
            
            // 检测iOS设备
            const isIOS = /iphone|ipad|ipod/.test(ua);
            if (isIOS) {
                document.body.classList.add('wechat-ios');
                document.querySelector('header').classList.add('wechat-ios-header');
            }
            
            // 微信浏览器特定优化
            optimizeForWechat();
        }
    }
    
    // 为微信浏览器优化头部
    function optimizeForWechat() {
        const header = document.querySelector('header');
        if (!header) return;
        
        // 检测是否为iOS设备
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
        
        // 应用初始样式
        if (isIOS) {
            // iOS微信特定样式应用于JS（覆盖CSS中的样式）
            document.body.style.paddingTop = '140px'; 
            header.style.paddingTop = '45px';
            header.style.minHeight = '100px';
        } else {
            // 普通微信样式
            document.body.style.paddingTop = '120px';
            header.style.paddingTop = '40px';
            header.style.minHeight = '100px';
        }

        // 修改滚动监听器，添加微信特定处理
        const originalOnScroll = window.onscroll;
        
        window.onscroll = function(e) {
            // 调用原来的滚动监听器
            if (typeof originalOnScroll === 'function') {
                originalOnScroll(e);
            }
            
            // 微信浏览器特定处理
            if (window.scrollY > 50) {
                if (isIOS) {
                    header.style.paddingTop = '45px';
                    header.style.minHeight = '90px';
                } else {
                    header.style.paddingTop = '40px';
                    header.style.minHeight = '90px';
                }
            } else {
                if (isIOS) {
                    header.style.paddingTop = '45px';
                    header.style.minHeight = '100px';
                } else {
                    header.style.paddingTop = '40px';
                    header.style.minHeight = '100px';
                }
            }
        };
        
        // 处理方向锁定和弹性滚动
        document.body.style.overscrollBehavior = 'none';
        document.documentElement.style.overscrollBehavior = 'none';
        
        // 防止微信上下滑动时的地址栏移动导致的布局跳动
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop) {
                // 向下滚动
                header.classList.add('wechat-scroll-down');
                header.classList.remove('wechat-scroll-up');
            } else {
                // 向上滚动
                header.classList.add('wechat-scroll-up');
                header.classList.remove('wechat-scroll-down');
            }
            lastScrollTop = st <= 0 ? 0 : st;
        }, false);
    }
    
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
            // 先完全重置所有内联样式，防止样式残留
            link.style = '';
            
            // 根据当前主题重新应用样式
            if (link.classList.contains('active')) {
                // 活跃状态链接样式
                link.style.color = 'white';
                link.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
                link.style.fontWeight = '600';
                link.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            } else if (theme === 'light') {
                // 白天模式下的非活跃链接
                link.style.color = '#1a202c';
                link.style.fontWeight = '600';
                link.style.backgroundColor = 'transparent';
                link.style.boxShadow = 'none';
            } else {
                // 夜间模式下的非活跃链接
                link.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
                link.style.fontWeight = '600';
                link.style.backgroundColor = 'transparent';
                link.style.boxShadow = 'none';
            }
            
            // 确保所有导航按钮尺寸一致
            link.style.minWidth = window.innerWidth <= 480 ? '80px' : '100px';
            link.style.textAlign = 'center';
            link.style.display = 'block';
            link.style.whiteSpace = 'nowrap';
        });
        
        // 再次执行滚动检测，确保正确高亮当前所在板块
        setTimeout(() => {
            onScroll();
        }, 50);
        
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
        
        // 初始化调整工具卡片
        adjustToolCards();
        
        // 初始化执行一次滚动监听
        onScroll();
    }, 100);
    
    // 移除搜索相关代码
    const header = document.querySelector('header');

    // 获取所有工具卡片
    const allTools = document.querySelectorAll('.tool-card');
    
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有链接的active类
            navLinks.forEach(link => {
                link.classList.remove('active');
                link.style.backgroundColor = '';
                link.style.color = '';
                link.style.fontWeight = '';
                link.style.boxShadow = '';
            });
            
            // 给当前点击的链接添加active类
            this.classList.add('active');
            
            // 确保活跃链接样式一致
            this.style.color = 'white';
            this.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
            this.style.fontWeight = '600';
            this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            
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
            
            // 检查是否为移动设备
            if (window.innerWidth <= 768) {
                header.classList.add('mobile-view');
            } else {
                header.classList.remove('mobile-view');
            }
        } else {
            header.classList.remove('header-scrolled');
            
            // 检查是否为移动设备
            if (window.innerWidth <= 768) {
                header.classList.add('mobile-view');
            } else {
                header.classList.remove('mobile-view');
            }
        }
        
        // 默认移除所有链接的active类和样式
        navLinks.forEach(link => {
            link.classList.remove('active');
            // 完全重置样式
            link.style = '';
            
            // 恢复默认的尺寸样式
            link.style.minWidth = window.innerWidth <= 480 ? '80px' : '100px';
            link.style.textAlign = 'center';
            link.style.display = 'block';
            link.style.whiteSpace = 'nowrap';
        });
        
        // 检查每个板块的位置
        let foundActive = false;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // 如果当前滚动位置在这个板块内
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // 给对应导航链接添加active类和样式
                const correspondingLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                    correspondingLink.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
                    correspondingLink.style.color = 'white';
                    correspondingLink.style.fontWeight = '600';
                    correspondingLink.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                    // 保持基本样式
                    correspondingLink.style.minWidth = window.innerWidth <= 480 ? '80px' : '100px';
                    correspondingLink.style.textAlign = 'center';
                    correspondingLink.style.display = 'block';
                    correspondingLink.style.whiteSpace = 'nowrap';
                    foundActive = true;
                }
            }
        });
        
        // 如果没有找到活跃的板块，重新应用当前主题的默认样式
        if (!foundActive) {
            const currentTheme = localStorage.getItem('theme') || 'light';
            navLinks.forEach(link => {
                if (currentTheme === 'light') {
                    link.style.color = '#1a202c';
                } else {
                    link.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
                }
                link.style.fontWeight = '600';
                link.style.backgroundColor = 'transparent';
                link.style.boxShadow = 'none';
                // 保持基本样式
                link.style.minWidth = window.innerWidth <= 480 ? '80px' : '100px';
                link.style.textAlign = 'center';
                link.style.display = 'block';
                link.style.whiteSpace = 'nowrap';
            });
        }
        
        // 处理回到顶部按钮
        const backToTopButton = document.getElementById('back-to-top');
        if (backToTopButton) {
            if (scrollPosition > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        }
    }

    // 添加滚动事件监听
    window.addEventListener('scroll', onScroll);

    // 窗口大小改变时检查
    window.addEventListener('resize', function() {
        const header = document.querySelector('header');
        
        // 检查是否为移动设备
        if (window.innerWidth <= 768) {
            header.classList.add('mobile-view');
            
            // 为移动端优化头部样式
            optimizeMobileHeader();
        } else {
            header.classList.remove('mobile-view');
            
            // 恢复桌面样式
            header.style.height = '';
            header.style.minHeight = '';
        }
        
        // 强制刷新一次主题样式
        const currentTheme = localStorage.getItem('theme') || 'light';
        refreshElementsStyle(currentTheme);
        
        // 重新检查滚动位置，更新头部样式
        onScroll();
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
    
    // 初始化时检查设备类型，设置适当的类
    function initResponsiveStyles() {
        const header = document.querySelector('header');
        
        // 检查是否为移动设备
        if (window.innerWidth <= 768) {
            header.classList.add('mobile-view');
            
            // 为移动端优化头部样式
            optimizeMobileHeader();
        } else {
            header.classList.remove('mobile-view');
        }
        
        // 初始检查滚动位置
        onScroll();
    }
    
    // 为移动端优化头部样式和行为
    function optimizeMobileHeader() {
        const header = document.querySelector('header');
        
        if (!header) return;
        
        // 确保头部始终完整显示
        header.style.height = 'auto';
        header.style.minHeight = '60px';
        
        // 更新工具卡片样式以适应移动端尺寸
        adjustToolCards();
        
        // 添加过渡效果，使滚动更平滑
        header.style.transition = 'all 0.3s ease';
    }
    
    // 调整工具卡片尺寸和内容显示
    function adjustToolCards() {
        const toolCards = document.querySelectorAll('.tool-card');
        const resourceCards = document.querySelectorAll('.resource-card');
        
        // 处理工具卡片
        toolCards.forEach(card => {
            // 确保卡片高度一致
            equalizeCardHeight(card);
            
            // 限制描述文本长度
            const description = card.querySelector('p');
            if (description) {
                limitTextDisplay(description);
            }
        });
        
        // 处理资源卡片
        resourceCards.forEach(card => {
            // 确保卡片高度一致
            equalizeCardHeight(card);
            
            // 限制描述文本长度
            const description = card.querySelector('p');
            if (description) {
                limitTextDisplay(description);
            }
        });
    }
    
    // 使卡片高度一致
    function equalizeCardHeight(card) {
        if (window.innerWidth <= 480) {
            // 小屏幕设备上使用较小的固定高度
            card.style.height = 'auto';
            card.style.minHeight = '180px';
        } else if (window.innerWidth <= 768) {
            // 平板上使用中等固定高度
            card.style.height = 'auto';
            card.style.minHeight = '200px';
        } else {
            // 桌面设备恢复自适应
            card.style.height = 'auto';
            card.style.minHeight = 'auto';
        }
    }
    
    // 限制文本显示长度
    function limitTextDisplay(element) {
        if (!element) return;
        
        if (window.innerWidth <= 480) {
            // 超小屏幕上显示更少的文本
            element.style.webkitLineClamp = '2';
            element.style.maxHeight = '2.4em';
        } else if (window.innerWidth <= 768) {
            // 平板上显示适中的文本
            element.style.webkitLineClamp = '3';
            element.style.maxHeight = '3.6em';
        } else {
            // 桌面设备不限制
            element.style.webkitLineClamp = 'none';
            element.style.maxHeight = 'none';
        }
    }
    
    // 创建回到顶部按钮
    function createBackToTopButton() {
        const backToTopButton = document.createElement('button');
        backToTopButton.id = 'back-to-top';
        backToTopButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
        backToTopButton.title = '回到顶部';
        document.body.appendChild(backToTopButton);
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // 鼠标悬停效果
        backToTopButton.addEventListener('mouseenter', function() {
            backToTopButton.classList.add('back-to-top-hover');
        });
        
        backToTopButton.addEventListener('mouseleave', function() {
            backToTopButton.classList.remove('back-to-top-hover');
        });
    }
    
    // 显示Toast消息
    function showToast(message) {
        // 检查是否已存在toast元素
        let toast = document.querySelector('.toast-message');
        
        if (!toast) {
            // 创建新的toast元素
            toast = document.createElement('div');
            toast.className = 'toast-message';
            document.body.appendChild(toast);
            
            // 添加样式
            toast.style.position = 'fixed';
            toast.style.bottom = '30px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            toast.style.color = 'white';
            toast.style.padding = '10px 20px';
            toast.style.borderRadius = '5px';
            toast.style.zIndex = '9999';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
        }
        
        // 设置消息内容
        toast.textContent = message;
        
        // 显示消息
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        // 3秒后隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            
            // 完全隐藏后从DOM中移除
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

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
    
    // 页面加载完成后初始化
    createBackToTopButton();
    initResponsiveStyles();
    detectWechatBrowser(); // 添加微信浏览器检测
    
    // 处理新闻标签切换功能
    initNewsTabSwitching();
    
    // 处理AI模型评测分类切换功能
    initEvaluationCategorySwitching();
});

// 初始化新闻标签切换功能
function initNewsTabSwitching() {
    const newsTabs = document.querySelectorAll('.news-tab');
    if (!newsTabs.length) return;
    
    newsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的active类
            newsTabs.forEach(t => t.classList.remove('active'));
            
            // 给当前点击的标签添加active类
            this.classList.add('active');
            
            // 此处可以添加过滤新闻内容的逻辑
            const category = this.getAttribute('data-category');
            console.log('选择的新闻类别:', category);
            
            // TODO: 根据类别筛选新闻内容
        });
    });
}

// 初始化AI模型评测分类切换功能
function initEvaluationCategorySwitching() {
    const evalCategories = document.querySelectorAll('.eval-category');
    if (!evalCategories.length) return;
    
    evalCategories.forEach(category => {
        category.addEventListener('click', function() {
            // 移除所有分类的active类
            evalCategories.forEach(c => c.classList.remove('active'));
            
            // 给当前点击的分类添加active类
            this.classList.add('active');
            
            // 此处可以添加过滤评测内容的逻辑
            const categoryType = this.getAttribute('data-category');
            console.log('选择的评测类别:', categoryType);
            
            // TODO: 根据类别筛选评测内容
        });
    });
} 