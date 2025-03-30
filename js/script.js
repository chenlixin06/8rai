document.addEventListener('DOMContentLoaded', function() {
    // 获取搜索框元素
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');

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
    
    // 滚动监听，更新导航高亮
    function onScroll() {
        // 获取所有内容板块
        const sections = document.querySelectorAll('section[id]');
        
        // 获取当前滚动位置
        let scrollPosition = window.scrollY + 100; // 添加偏移量以提前高亮
        
        // 检查每个板块的位置
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // 如果当前滚动位置在这个板块内
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // 移除所有导航链接的active类
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // 给对应导航链接添加active类
                const correspondingLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
        
        // 如果滚动到顶部，则激活首页链接
        if (scrollPosition < 300) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector('nav ul li a[href="#"]').classList.add('active');
        }
    }
    
    // 添加滚动事件监听
    window.addEventListener('scroll', onScroll);
    
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
}); 