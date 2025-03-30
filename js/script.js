document.addEventListener('DOMContentLoaded', function() {
    // 获取搜索框元素 - 从新位置获取
    const searchInput = document.querySelector('.header-right .search-box input');
    const searchButton = document.querySelector('.header-right .search-box button');

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
    
    // 添加搜索按钮点击事件
    searchButton.addEventListener('click', performSearch);
    
    // 添加搜索框回车事件
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // 移动导航引用
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    // 关闭移动导航
    function closeMobileNav() {
        if (window.innerWidth <= 768 && nav) {
            nav.classList.remove('active');
        }
    }
    
    // 初始化移动导航事件
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止冒泡
            nav.classList.toggle('active');
        });
        
        // 如果用户点击导航外的区域，关闭导航
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
    }
    
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
            
            // 点击导航链接后关闭移动导航
            closeMobileNav();
        });
    });
    
    // 响应式处理
    function handleResponsiveLayout() {
        if (window.innerWidth <= 768) {
            // 确保在移动视图下导航是隐藏的
            if (mobileMenuToggle) {
                mobileMenuToggle.style.display = 'block';
            }
            
            if (nav) {
                // 只有当没有active类时才隐藏导航
                if (!nav.classList.contains('active')) {
                    nav.style.visibility = 'hidden';
                    nav.style.maxHeight = '0';
                    nav.style.height = '0';
                }
            }
        } else {
            // 在大屏幕上，确保导航是可见的
            if (mobileMenuToggle) {
                mobileMenuToggle.style.display = 'none';
            }
            
            if (nav) {
                nav.style.visibility = 'visible';
                nav.style.height = 'auto';
                nav.style.maxHeight = 'none';
            }
        }
    }
    
    // 初始运行一次
    handleResponsiveLayout();
    
    // 窗口大小改变时重新设置
    window.addEventListener('resize', handleResponsiveLayout);
    
    // 滚动监听，更新导航高亮
    function onScroll() {
        // 获取所有内容板块
        const sections = document.querySelectorAll('section[id]');
        
        // 获取当前滚动位置
        let scrollPosition = window.scrollY + 100; // 添加偏移量以提前高亮
        
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
            
            // 点击logo后关闭移动导航
            closeMobileNav();
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
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.display = 'none';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = 'var(--primary-color)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '50%';
        button.style.cursor = 'pointer';
        button.style.zIndex = '99';
        button.style.boxShadow = 'var(--shadow)';
        
        document.body.appendChild(button);
        
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // 点击返回顶部按钮后关闭移动导航
            closeMobileNav();
        });
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
    };
    
    createBackToTopButton();
    
    // 新闻标签切换功能
    const newsTabs = document.querySelectorAll('.news-tab');
    if (newsTabs.length > 0) {
        newsTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 移除所有标签的active类
                newsTabs.forEach(t => t.classList.remove('active'));
                // 给当前点击的标签添加active类
                this.classList.add('active');
                
                // 这里可以添加按标签筛选新闻的逻辑
                const tabCategory = this.dataset.tab;
                console.log('切换到新闻分类:', tabCategory);
                
                // 如果有分类对应的新闻数据，可以在这里更新新闻卡片
            });
        });
    }
    
    // AI模型评测分类切换功能
    const evalCategories = document.querySelectorAll('.eval-category');
    if (evalCategories.length > 0) {
        evalCategories.forEach(category => {
            category.addEventListener('click', function() {
                // 移除所有分类的active类
                evalCategories.forEach(c => c.classList.remove('active'));
                // 给当前点击的分类添加active类
                this.classList.add('active');
                
                // 这里可以添加按分类显示不同模型评测数据的逻辑
                const modelCategory = this.dataset.category;
                console.log('切换到模型分类:', modelCategory);
                
                // 如果有不同分类的模型数据，可以在这里更新模型比较表格
            });
        });
    }
}); 