// ===== DATA MANAGEMENT MODULE =====
// Handles all blog data operations (CRUD operations and local storage)

class BlogDataManager {
    constructor() {
        this.blogs = this.loadBlogsFromStorage();
    }

    loadBlogsFromStorage() {
        return JSON.parse(localStorage.getItem('blogs')) || [];
    }

    saveBlogsToStorage() {
        localStorage.setItem('blogs', JSON.stringify(this.blogs));
    }

    addBlog(blogData) {
        const blog = {
            id: Date.now(),
            title: blogData.title.trim(),
            content: blogData.content.trim(),
            category: blogData.category,
            createdAt: new Date().toISOString()
        };
        this.blogs.unshift(blog);
        this.saveBlogsToStorage();
        return blog;
    }

    deleteBlog(blogId) {
        this.blogs = this.blogs.filter(blog => blog.id != blogId);
        this.saveBlogsToStorage();
    }

    getBlogById(blogId) {
        return this.blogs.find(b => b.id == blogId);
    }

    getAllBlogs() {
        return this.blogs;
    }

    getBlogCount() {
        return this.blogs.length;
    }

    loadSampleData() {
        if (this.blogs.length === 0) {
            const sampleBlogs = [
                {
                    id: Date.now() + 1,
                    title: "Building an Autonomous Robot with Arduino",
                    content: "In this comprehensive guide, we'll explore how to build an autonomous robot using Arduino. We'll cover sensor integration, motor control, and basic AI algorithms that enable the robot to navigate its environment independently.\n\nThe project requires basic knowledge of electronics and programming. We'll start with simple line-following capabilities and gradually add obstacle avoidance features.\n\nComponents needed:\n- Arduino Uno\n- Ultrasonic sensors\n- Servo motors\n- Chassis and wheels\n- Battery pack\n\nThis project is perfect for beginners who want to understand the fundamentals of robotics and autonomous systems.",
                    category: "robotics",
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: Date.now() + 2,
                    title: "Introduction to ROS (Robot Operating System)",
                    content: "ROS has become the de facto standard for robotics development. This tutorial introduces the core concepts of ROS and helps you get started with your first ROS project.\n\nWe'll cover:\n- ROS architecture and philosophy\n- Nodes, topics, and services\n- Setting up your development environment\n- Creating your first ROS package\n- Publishing and subscribing to topics\n\nBy the end of this tutorial, you'll have a solid foundation to build more complex robotic applications using ROS.",
                    category: "programming",
                    createdAt: new Date(Date.now() - 172800000).toISOString()
                },
                {
                    id: Date.now() + 3,
                    title: "Choosing the Right Sensors for Your Robot",
                    content: "Selecting appropriate sensors is crucial for any robotics project. This guide compares different types of sensors and their applications in robotics.\n\nWe'll examine:\n- Distance sensors (ultrasonic, LiDAR, infrared)\n- Vision sensors (cameras, depth cameras)\n- Motion sensors (IMU, encoders, gyroscopes)\n- Environmental sensors (temperature, humidity, gas)\n\nLearn how to make informed decisions about sensor selection based on your project requirements, budget, and performance needs.",
                    category: "hardware",
                    createdAt: new Date(Date.now() - 259200000).toISOString()
                },
                {
                    id: Date.now() + 4,
                    title: "Machine Learning in Robotics Applications",
                    content: "Artificial Intelligence and Machine Learning are revolutionizing robotics. This article explores practical applications of ML in robotics and provides implementation examples.\n\nTopics covered:\n- Computer vision for object recognition\n- Reinforcement learning for robot control\n- Path planning with neural networks\n- Speech recognition and natural language processing\n\nWe'll also discuss popular frameworks like TensorFlow and PyTorch for robotics applications, along with real-world case studies.",
                    category: "ai-ml",
                    createdAt: new Date(Date.now() - 345600000).toISOString()
                }
            ];
            
            this.blogs = sampleBlogs;
            this.saveBlogsToStorage();
        }
    }
}
// ===== FILTER AND SEARCH MODULE =====
// Handles all filtering, searching, and sorting operations

class BlogFilterManager {
    constructor() {
        this.currentSearchQuery = '';
        this.currentCategoryFilter = '';
        this.currentSortBy = 'newest'; // newest, oldest, title
    }

    filterBlogs(blogs, searchQuery = '', categoryFilter = '') {
        let filteredBlogs = [...blogs]; // Create a copy to avoid mutating original array

        // Apply search filter
        if (searchQuery) {
            filteredBlogs = filteredBlogs.filter(blog =>
                blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (categoryFilter) {
            filteredBlogs = filteredBlogs.filter(blog => blog.category === categoryFilter);
        }

        return filteredBlogs;
    }

    sortBlogs(blogs, sortBy = 'newest') {
        const sortedBlogs = [...blogs]; // Create a copy to avoid mutating original array

        switch (sortBy) {
            case 'newest':
                return sortedBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return sortedBlogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'title':
                return sortedBlogs.sort((a, b) => a.title.localeCompare(b.title));
            case 'category':
                return sortedBlogs.sort((a, b) => a.category.localeCompare(b.category));
            default:
                return sortedBlogs;
        }
    }

    filterAndSort(blogs, searchQuery = '', categoryFilter = '', sortBy = 'newest') {
        let result = this.filterBlogs(blogs, searchQuery, categoryFilter);
        result = this.sortBlogs(result, sortBy);
        return result;
    }

    updateSearchQuery(query) {
        this.currentSearchQuery = query;
    }

    updateCategoryFilter(category) {
        this.currentCategoryFilter = category;
    }

    updateSortBy(sortBy) {
        this.currentSortBy = sortBy;
    }

    getCurrentSearchQuery() {
        const searchInput = document.getElementById('searchInput');
        return searchInput ? searchInput.value.toLowerCase() : '';
    }

    getCurrentCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        return categoryFilter ? categoryFilter.value : '';
    }

    getCurrentSortBy() {
        const sortSelect = document.getElementById('sortSelect');
        return sortSelect ? sortSelect.value : 'newest';
    }

    // Advanced filtering methods
    filterByDateRange(blogs, startDate, endDate) {
        return blogs.filter(blog => {
            const blogDate = new Date(blog.createdAt);
            return blogDate >= startDate && blogDate <= endDate;
        });
    }

    filterByContentLength(blogs, minLength = 0, maxLength = Infinity) {
        return blogs.filter(blog => 
            blog.content.length >= minLength && blog.content.length <= maxLength
        );
    }

    searchByTags(blogs, tags) {
        if (!tags || tags.length === 0) return blogs;
        
        return blogs.filter(blog => {
            const blogContent = (blog.title + ' ' + blog.content + ' ' + blog.category).toLowerCase();
            return tags.some(tag => blogContent.includes(tag.toLowerCase()));
        });
    }

    getUniqueCategories(blogs) {
        const categories = blogs.map(blog => blog.category);
        return [...new Set(categories)].sort();
    }

    getBlogStats(blogs) {
        const stats = {
            total: blogs.length,
            categories: {},
            averageContentLength: 0,
            newestBlog: null,
            oldestBlog: null
        };

        if (blogs.length === 0) return stats;

        // Category statistics
        blogs.forEach(blog => {
            stats.categories[blog.category] = (stats.categories[blog.category] || 0) + 1;
        });

        // Average content length
        const totalLength = blogs.reduce((sum, blog) => sum + blog.content.length, 0);
        stats.averageContentLength = Math.round(totalLength / blogs.length);

        // Newest and oldest blogs
        const sortedByDate = this.sortBlogs(blogs, 'newest');
        stats.newestBlog = sortedByDate[0];
        stats.oldestBlog = sortedByDate[sortedByDate.length - 1];

        return stats;
    }
}
// ===== UI RENDERING MODULE =====
// Handles all UI rendering, display updates, and visual elements

class BlogUIRenderer {
    constructor() {
        this.currentView = 'grid';
        this.animationDelay = 100; // ms between card animations
    }

    createBlogCard(blog, index) {
        const date = this.formatDate(blog.createdAt);
        const preview = this.createPreview(blog.content, 150);
        const category = this.formatCategory(blog.category);

        return `
            <div class="blog-card ${this.currentView}-view" 
                 style="animation-delay: ${index * 0.1}s" 
                 data-blog-id="${blog.id}">
                <div class="blog-content">
                    <div class="blog-header">
                        <div>
                            <div class="blog-title">${this.escapeHtml(blog.title)}</div>
                            <div class="blog-meta">
                                <span><i class="fas fa-calendar-alt"></i> ${date}</span>
                                <span><i class="fas fa-folder"></i> ${category}</span>
                            </div>
                        </div>
                        <div class="blog-category">${category}</div>
                    </div>
                    
                    <div class="blog-preview">${this.escapeHtml(preview)}</div>
                    
                    <div class="blog-actions">
                        <button class="read-more" title="Read full blog">
                            <i class="fas fa-book-open"></i> Read More
                        </button>
                        <button class="delete-btn" title="Delete blog">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderBlogsToDOM(blogs) {
        const container = document.getElementById('blogsContainer');
        const noBlogsMessage = document.getElementById('noBlogsMessage');
        
        if (!container) {
            console.error('Blogs container not found');
            return;
        }

        if (blogs.length === 0) {
            this.showNoBlogsMessage(container, noBlogsMessage);
            return;
        }

        this.hideBlogsMessage(noBlogsMessage);
        this.renderBlogCards(container, blogs);
    }

    showNoBlogsMessage(container, noBlogsMessage) {
        container.innerHTML = '';
        if (noBlogsMessage) {
            noBlogsMessage.style.display = 'block';
        }
    }

    hideBlogsMessage(noBlogsMessage) {
        if (noBlogsMessage) {
            noBlogsMessage.style.display = 'none';
        }
    }

    renderBlogCards(container, blogs) {
        // Clear container with fade effect
        container.style.opacity = '0';
        
        setTimeout(() => {
            container.innerHTML = blogs.map((blog, index) => 
                this.createBlogCard(blog, index)
            ).join('');
            
            // Fade in with staggered animation
            container.style.opacity = '1';
            
            // Trigger entrance animations
            this.animateCardsEntrance();
        }, 150);
    }

    animateCardsEntrance() {
        const cards = document.querySelectorAll('.blog-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    updateBlogCountDisplay(count) {
        const countElement = document.getElementById('blogCount');
        if (countElement) {
            const text = `${count} blog${count !== 1 ? 's' : ''}`;
            countElement.textContent = text;
            
            // Add a subtle animation
            countElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                countElement.style.transform = 'scale(1)';
            }, 150);
        }
    }

    toggleView(view) {
        this.currentView = view;
        
        // Update button states
        this.updateViewButtons(view);
        
        // Update container class
        this.updateContainerView(view);
        
        // Re-apply view class to existing cards
        this.updateExistingCards(view);
    }

    updateViewButtons(activeView) {
        document.querySelectorAll('.view-btn').forEach(btn => {
            const isActive = btn.dataset.view === activeView;
            btn.classList.toggle('active', isActive);
            
            // Update aria-pressed for accessibility
            btn.setAttribute('aria-pressed', isActive);
        });
    }

    updateContainerView(view) {
        const container = document.getElementById('blogsContainer');
        if (container) {
            container.className = `blogs-container ${view}-view`;
        }
    }

    updateExistingCards(view) {
        document.querySelectorAll('.blog-card').forEach(card => {
            // Remove old view classes
            card.classList.remove('grid-view', 'list-view');
            // Add new view class
            card.classList.add(`${view}-view`);
        });
    }

    renderModalContent(blog) {
        if (!blog) return '';

        const date = this.formatDateDetailed(blog.createdAt);
        const category = this.formatCategory(blog.category);

        return `
            <div class="modal-blog-title">${this.escapeHtml(blog.title)}</div>
            <div class="modal-blog-meta">
                <div class="modal-blog-category">${category}</div>
                <span><i class="fas fa-calendar-alt"></i> ${date}</span>
            </div>
            <div class="modal-blog-content">${this.formatBlogContent(blog.content)}</div>
            <div class="modal-blog-stats">
                <span><i class="fas fa-align-left"></i> ${blog.content.length} characters</span>
                <span><i class="fas fa-clock"></i> ${this.estimateReadTime(blog.content)} min read</span>
            </div>
        `;
    }

    renderSearchResults(results, searchQuery) {
        if (results.length === 0) {
            return `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>No blogs found for "${this.escapeHtml(searchQuery)}"</p>
                    <p>Try different keywords or browse all blogs.</p>
                </div>
            `;
        }

        return results.map((blog, index) => this.createBlogCard(blog, index)).join('');
    }

    renderCategoryFilter(categories) {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        categoryFilter.innerHTML = `
            <option value="">All Categories</option>
            ${categories.map(category => 
                `<option value="${category}">${this.formatCategory(category)}</option>`
            ).join('')}
        `;
    }

    // Utility methods for formatting
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatDateDetailed(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatCategory(category) {
        const categoryMap = {
            'robotics': 'Robotics',
            'programming': 'Programming', 
            'hardware': 'Hardware',
            'ai-ml': 'AI/ML',
            'projects': 'Projects',
            'tutorials': 'Tutorials',
            'news': 'News',
            'events': 'Events'
        };
        return categoryMap[category] || this.capitalizeFirst(category);
    }

    formatBlogContent(content) {
        // Convert line breaks to paragraphs for better modal display
        return this.escapeHtml(content)
            .split('\n\n')
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0)
            .map(paragraph => `<p>${paragraph}</p>`)
            .join('');
    }

    createPreview(content, maxLength = 150) {
        if (content.length <= maxLength) return content;
        
        // Try to cut at a word boundary
        const trimmed = content.substring(0, maxLength);
        const lastSpace = trimmed.lastIndexOf(' ');
        
        if (lastSpace > maxLength * 0.8) {
            return trimmed.substring(0, lastSpace) + '...';
        }
        
        return trimmed + '...';
    }

    estimateReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return Math.max(1, readTime);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Animation utilities
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }

    fadeOut(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    slideDown(element, duration = 300) {
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease`;
        
        const fullHeight = element.scrollHeight;
        setTimeout(() => {
            element.style.height = fullHeight + 'px';
        }, 10);
        
        setTimeout(() => {
            element.style.height = 'auto';
            element.style.overflow = 'visible';
        }, duration);
    }

    slideUp(element, duration = 300) {
        element.style.height = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.height = '0';
        }, 10);
        
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }
}
// ===== MODAL MANAGEMENT MODULE =====
// Handles modal functionality and interactions

class BlogModalManager {
    constructor(uiRenderer) {
        this.uiRenderer = uiRenderer;
        this.isModalOpen = false;
        this.currentBlog = null;
    }

    openModal(blog) {
        if (!blog) {
            console.error('Blog not found for modal');
            return;
        }

        this.currentBlog = blog;
        this.isModalOpen = true;

        const modal = document.getElementById('blogModal');
        const modalBody = document.getElementById('modalBody');
        
        if (!modal || !modalBody) {
            console.error('Modal elements not found');
            return;
        }

        // Render modal content
        modalBody.innerHTML = this.uiRenderer.renderModalContent(blog);

        // Show modal with animation
        this.showModal(modal);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        this.setModalFocus();
        
        // Track modal open event
        this.trackModalOpen(blog);
    }

    closeModal() {
        if (!this.isModalOpen) return;

        const modal = document.getElementById('blogModal');
        if (!modal) return;

        this.isModalOpen = false;
        this.currentBlog = null;

        // Hide modal with animation
        this.hideModal(modal);
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
        
        // Return focus to trigger element
        this.restoreFocus();
        
        // Track modal close event
        this.trackModalClose();
    }

    showModal(modal) {
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        
        // Add show class for CSS animations
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    hideModal(modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        
        // Hide after animation completes
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    setModalFocus() {
        const modal = document.getElementById('blogModal');
        const closeButton = document.getElementById('closeModal');
        
        if (closeButton) {
            closeButton.focus();
        } else if (modal) {
            modal.focus();
        }
    }

    restoreFocus() {
        // Focus back to the element that opened the modal
        const activeCard = document.querySelector('.blog-card:focus');
        if (activeCard) {
            activeCard.focus();
        }
    }

    handleKeyboardNavigation(event) {
        if (!this.isModalOpen) return;

        switch (event.key) {
            case 'Escape':
                this.closeModal();
                break;
            case 'Tab':
                this.handleTabKeyInModal(event);
                break;
        }
    }

    handleTabKeyInModal(event) {
        const modal = document.getElementById('blogModal');
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    isModalCurrentlyOpen() {
        return this.isModalOpen;
    }

    getCurrentBlog() {
        return this.currentBlog;
    }

    // Analytics/tracking methods
    trackModalOpen(blog) {
        // Track modal open for analytics
        console.log(`Modal opened for blog: ${blog.title}`);
        
        // Could send to analytics service
        // analytics.track('blog_modal_opened', {
        //     blogId: blog.id,
        //     blogTitle: blog.title,
        //     category: blog.category
        // });
    }

    trackModalClose() {
        // Track modal close for analytics
        console.log('Modal closed');
        
        // Could send to analytics service
        // analytics.track('blog_modal_closed');
    }

    // Modal utility methods
    updateModalContent(blog) {
        if (!this.isModalOpen || !blog) return;

        const modalBody = document.getElementById('modalBody');
        if (modalBody) {
            modalBody.innerHTML = this.uiRenderer.renderModalContent(blog);
            this.currentBlog = blog;
        }
    }

    addModalLoadingState() {
        const modalBody = document.getElementById('modalBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="modal-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading blog content...</p>
                </div>
            `;
        }
    }

    addModalErrorState(error = 'Failed to load blog content') {
        const modalBody = document.getElementById('modalBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="modal-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error</h3>
                    <p>${error}</p>
                    <button onclick="blogDashboard.modalManager.closeModal()" class="btn btn-primary">
                        Close
                    </button>
                </div>
            `;
        }
    }
}
// ===== NOTIFICATION MODULE =====
// Handles all notifications, alerts, and user feedback

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 3000; // 3 seconds
        this.setupNotificationStyles();
    }

    showNotification(message, type = 'info', duration = null) {
        const notification = this.createNotification(message, type, duration || this.defaultDuration);
        this.addNotificationToDOM(notification);
        this.manageNotificationQueue();
        
        return notification.id;
    }

    createNotification(message, type, duration) {
        const id = 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        const notification = {
            id,
            message,
            type,
            duration,
            element: null,
            timestamp: Date.now()
        };

        this.notifications.push(notification);
        return notification;
    }

    addNotificationToDOM(notification) {
        const element = this.createNotificationElement(notification);
        notification.element = element;
        
        document.body.appendChild(element);
        
        // Animate in
        requestAnimationFrame(() => {
            element.classList.add('show');
        });
        
        // Auto remove after duration
        if (notification.duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, notification.duration);
        }
    }

    createNotificationElement(notification) {
        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        element.id = notification.id;
        element.setAttribute('role', 'alert');
        element.setAttribute('aria-live', 'polite');
        
        element.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon fas fa-${this.getIconForType(notification.type)}"></i>
                <span class="notification-message">${this.escapeHtml(notification.message)}</span>
                <button class="notification-close" onclick="notificationManager.removeNotification('${notification.id}')" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-progress"></div>
        `;

        // Position notification
        this.positionNotification(element);
        
        // Add progress bar animation if has duration
        if (notification.duration > 0) {
            this.animateProgressBar(element, notification.duration);
        }

        return element;
    }

    positionNotification(element) {
        const existingNotifications = document.querySelectorAll('.notification.show');
        let topPosition = 20; // Base top position
        
        existingNotifications.forEach(existing => {
            topPosition += existing.offsetHeight + 10; // 10px gap between notifications
        });
        
        element.style.top = topPosition + 'px';
        element.style.right = '20px';
    }

    animateProgressBar(element, duration) {
        const progressBar = element.querySelector('.notification-progress');
        if (progressBar) {
            progressBar.style.animationDuration = duration + 'ms';
            progressBar.classList.add('animate');
        }
    }

    removeNotification(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (!notification || !notification.element) return;

        const element = notification.element;
        
        // Animate out
        element.classList.add('hide');
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            
            // Remove from array
            this.notifications = this.notifications.filter(n => n.id !== id);
            
            // Reposition remaining notifications
            this.repositionNotifications();
        }, 300);
    }

    repositionNotifications() {
        const visibleNotifications = document.querySelectorAll('.notification.show:not(.hide)');
        let topPosition = 20;
        
        visibleNotifications.forEach(element => {
            element.style.top = topPosition + 'px';
            topPosition += element.offsetHeight + 10;
        });
    }

    manageNotificationQueue() {
        // Remove oldest notifications if we exceed max
        while (this.notifications.length > this.maxNotifications) {
            const oldest = this.notifications[0];
            this.removeNotification(oldest.id);
        }
    }

    clearAllNotifications() {
        this.notifications.forEach(notification => {
            this.removeNotification(notification.id);
        });
    }

    getIconForType(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupNotificationStyles() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                right: 20px;
                min-width: 300px;
                max-width: 400px;
                padding: 0;
                border-radius: 8px;
                color: white;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                transform: translateX(400px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                overflow: hidden;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.hide {
                transform: translateX(400px);
                opacity: 0;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                padding: 15px 20px;
                gap: 12px;
            }
            
            .notification-icon {
                font-size: 16px;
                flex-shrink: 0;
            }
            
            .notification-message {
                flex: 1;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background-color 0.2s;
                flex-shrink: 0;
            }
            
            .notification-close:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            .notification-progress {
                height: 3px;
                background-color: rgba(255, 255, 255, 0.3);
                position: relative;
                overflow: hidden;
            }
            
            .notification-progress.animate::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background-color: rgba(255, 255, 255, 0.7);
                animation: progress-bar linear forwards;
            }
            
            @keyframes progress-bar {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
            }
            
            .notification-success {
                background: linear-gradient(135deg, #4caf50, #45a049);
            }
            
            .notification-error {
                background: linear-gradient(135deg, #f44336, #d32f2f);
            }
            
            .notification-warning {
                background: linear-gradient(135deg, #ff9800, #f57c00);
            }
            
            .notification-info {
                background: linear-gradient(135deg, #2196f3, #1976d2);
            }
            
            @media (max-width: 480px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                    max-width: none;
                    transform: translateY(-100px);
                }
                
                .notification.show {
                    transform: translateY(0);
                }
                
                .notification.hide {
                    transform: translateY(-100px);
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Convenience methods for different notification types
    showSuccess(message, duration) {
        return this.showNotification(message, 'success', duration);
    }

    showError(message, duration) {
        return this.showNotification(message, 'error', duration);
    }

    showWarning(message, duration) {
        return this.showNotification(message, 'warning', duration);
    }

    showInfo(message, duration) {
        return this.showNotification(message, 'info', duration);
    }

    // Persistent notifications (don't auto-close)
    showPersistent(message, type = 'info') {
        return this.showNotification(message, type, 0);
    }
}
// ===== INPUT HANDLER MODULE =====
// Handles all user inputs, form submissions, and user interactions

class BlogInputHandler {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.isFormVisible = true;
    }

    setupAllEventListeners() {
        this.setupFormEventListeners();
        this.setupSearchAndFilterEventListeners();
        this.setupViewToggleEventListeners();
        this.setupModalEventListeners();
        this.setupKeyboardShortcuts();
    }

    setupFormEventListeners() {
        const blogForm = document.getElementById('blogForm');
        const toggleFormBtn = document.getElementById('toggleFormBtn');

        if (blogForm) {
            blogForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        if (toggleFormBtn) {
            toggleFormBtn.addEventListener('click', () => this.handleToggleForm());
        }

        // Real-time form validation
        this.setupFormValidation();
    }

    setupSearchAndFilterEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortSelect = document.getElementById('sortSelect');

        if (searchInput) {
            // Debounced search for better performance
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300); // 300ms debounce
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => this.handleFilter(e.target.value));
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));
        }
    }

    setupViewToggleEventListeners() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewToggle(e.target.dataset.view));
        });
    }

    setupModalEventListeners() {
        const closeModal = document.getElementById('closeModal');
        const blogModal = document.getElementById('blogModal');

        if (closeModal) {
            closeModal.addEventListener('click', () => this.handleCloseModal());
        }

        if (blogModal) {
            blogModal.addEventListener('click', (e) => {
                if (e.target.id === 'blogModal') this.handleCloseModal();
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close modal
            if (e.key === 'Escape') {
                this.handleCloseModal();
            }

            // Ctrl/Cmd + N to toggle form
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.handleToggleForm();
            }

            // Ctrl/Cmd + F to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.focus();
            }
        });
    }

    setupFormValidation() {
        const titleInput = document.getElementById('blogTitle');
        const contentInput = document.getElementById('blogContent');
        const categorySelect = document.getElementById('blogCategory');

        // Real-time validation
        if (titleInput) {
            titleInput.addEventListener('input', () => this.validateTitle(titleInput));
        }

        if (contentInput) {
            contentInput.addEventListener('input', () => this.validateContent(contentInput));
        }

        if (categorySelect) {
            categorySelect.addEventListener('change', () => this.validateCategory(categorySelect));
        }
    }

    setupCardEventListeners() {
        // This will be called after each render
        document.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open modal if clicking on buttons
                if (e.target.closest('button')) return;
                
                const blogId = card.dataset.blogId;
                this.handleCardClick(blogId);
            });
        });

        // Setup delete button listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const blogCard = e.target.closest('.blog-card');
                const blogId = blogCard ? blogCard.dataset.blogId : null;
                if (blogId) this.handleDeleteClick(blogId);
            });
        });
    }

    // Event Handlers
    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const blogData = {
            title: formData.get('title'),
            content: formData.get('content'),
            category: formData.get('category')
        };

        // Validate form data
        if (!this.validateFormData(blogData)) {
            return;
        }

        // Add blog through dashboard
        this.dashboard.addNewBlog(blogData);
        
        // Reset form
        e.target.reset();
        this.removeValidationClasses();
    }

    handleToggleForm() {
        const container = document.getElementById('blogFormContainer');
        const btn = document.getElementById('toggleFormBtn');
        
        if (container && btn) {
            this.isFormVisible = !this.isFormVisible;
            container.classList.toggle('collapsed');
            btn.classList.toggle('collapsed');
            
            // Update button icon
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = this.isFormVisible ? 'fas fa-chevron-down' : 'fas fa-chevron-right';
            }
        }
    }

    handleSearch(query) {
        this.dashboard.filterManager.updateSearchQuery(query);
        this.dashboard.renderFilteredBlogs();
    }

    handleFilter(category) {
        this.dashboard.filterManager.updateCategoryFilter(category);
        this.dashboard.renderFilteredBlogs();
    }

    handleSort(sortBy) {
        this.dashboard.filterManager.updateSortBy(sortBy);
        this.dashboard.renderFilteredBlogs();
    }

    handleViewToggle(view) {
        this.dashboard.toggleView(view);
    }

    handleCardClick(blogId) {
        this.dashboard.openModal(blogId);
    }

    handleDeleteClick(blogId) {
        this.dashboard.deleteBlog(blogId);
    }

    handleCloseModal() {
        this.dashboard.closeModal();
    }

    // Validation Methods
    validateFormData(blogData) {
        let isValid = true;
        
        if (!blogData.title || blogData.title.trim().length < 3) {
            this.dashboard.notificationManager.showNotification('Title must be at least 3 characters long', 'error');
            isValid = false;
        }

        if (!blogData.content || blogData.content.trim().length < 10) {
            this.dashboard.notificationManager.showNotification('Content must be at least 10 characters long', 'error');
            isValid = false;
        }

        if (!blogData.category) {
            this.dashboard.notificationManager.showNotification('Please select a category', 'error');
            isValid = false;
        }

        return isValid;
    }

    validateTitle(input) {
        const value = input.value.trim();
        const isValid = value.length >= 3;
        
        this.toggleValidationClass(input, isValid);
        return isValid;
    }

    validateContent(input) {
        const value = input.value.trim();
        const isValid = value.length >= 10;
        
        this.toggleValidationClass(input, isValid);
        
        // Update character count if element exists
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent = `${value.length} characters`;
            charCount.className = isValid ? 'char-count valid' : 'char-count invalid';
        }
        
        return isValid;
    }

    validateCategory(select) {
        const isValid = select.value !== '';
        this.toggleValidationClass(select, isValid);
        return isValid;
    }

    toggleValidationClass(element, isValid) {
        element.classList.remove('invalid', 'valid');
        element.classList.add(isValid ? 'valid' : 'invalid');
    }

    removeValidationClasses() {
        document.querySelectorAll('.invalid, .valid').forEach(element => {
            element.classList.remove('invalid', 'valid');
        });
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}
// ===== MAIN DASHBOARD CLASS =====
// Orchestrates all modules and handles main application logic

class BlogDashboard {
    constructor() {
        this.dataManager = new BlogDataManager();
        this.filterManager = new BlogFilterManager();
        this.uiRenderer = new BlogUIRenderer();
        this.modalManager = new BlogModalManager(this.uiRenderer);
        this.notificationManager = new NotificationManager();
        this.inputHandler = new BlogInputHandler(this);
        
        this.init();
    }

    init() {
        // Load sample data if needed
        this.dataManager.loadSampleData();
        
        // Setup all event listeners
        this.inputHandler.setupAllEventListeners();
        
        // Initial render
        this.renderBlogs();
        this.updateBlogCount();
        
        // Setup dynamic category filter
        this.updateCategoryFilter();
        
        // Setup global error handling
        this.setupErrorHandling();
        
        console.log('Blog Dashboard initialized successfully');
    }

    // Main rendering method
    renderBlogs() {
        const blogs = this.dataManager.getAllBlogs();
        const searchQuery = this.filterManager.getCurrentSearchQuery();
        const categoryFilter = this.filterManager.getCurrentCategoryFilter();
        const sortBy = this.filterManager.getCurrentSortBy();
        
        const filteredBlogs = this.filterManager.filterAndSort(
            blogs, 
            searchQuery, 
            categoryFilter, 
            sortBy
        );
        
        this.uiRenderer.renderBlogsToDOM(filteredBlogs);
        this.inputHandler.setupCardEventListeners();
    }

    // Render with current filters applied
    renderFilteredBlogs() {
        this.renderBlogs();
    }

    // Blog management methods
    addNewBlog(blogData) {
        try {
            const blog = this.dataManager.addBlog(blogData);
            this.renderBlogs();
            this.updateBlogCount();
            this.updateCategoryFilter();
            
            this.notificationManager.showSuccess('Blog published successfully!');
            
            // Animate the new blog card
            this.animateNewBlogCard();
            
            return blog;
        } catch (error) {
            this.notificationManager.showError('Failed to add blog. Please try again.');
            console.error('Error adding blog:', error);
        }
    }

    deleteBlog(blogId) {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        
        try {
            this.dataManager.deleteBlog(blogId);
            this.renderBlogs();
            this.updateBlogCount();
            this.updateCategoryFilter();
            
            this.notificationManager.showSuccess('Blog deleted successfully!');
        } catch (error) {
            this.notificationManager.showError('Failed to delete blog. Please try again.');
            console.error('Error deleting blog:', error);
        }
    }

    // Modal methods
    openModal(blogId) {
        const blog = this.dataManager.getBlogById(blogId);
        if (blog) {
            this.modalManager.openModal(blog);
        } else {
            this.notificationManager.showError('Blog not found');
        }
    }

    closeModal() {
        this.modalManager.closeModal();
    }

    // View management
    toggleView(view) {
        this.uiRenderer.toggleView(view);
        this.renderBlogs(); // Re-render with new view
    }

    // UI update methods
    updateBlogCount() {
        const count = this.dataManager.getBlogCount();
        this.uiRenderer.updateBlogCountDisplay(count);
    }

    updateCategoryFilter() {
        const blogs = this.dataManager.getAllBlogs();
        const categories = this.filterManager.getUniqueCategories(blogs);
        this.uiRenderer.renderCategoryFilter(categories);
    }

    // Animation helpers
    animateNewBlogCard() {
        setTimeout(() => {
            const newCard = document.querySelector('.blog-card');
            if (newCard) {
                newCard.style.animation = 'none';
                newCard.offsetHeight; // Trigger reflow
                newCard.style.animation = 'fadeInUp 0.5s ease forwards';
            }
        }, 100);
    }

    // Form management
    toggleForm() {
        this.inputHandler.handleToggleForm();
    }

    // Search and filter handlers
    handleSearch(query) {
        this.inputHandler.handleSearch(query);
    }

    handleFilter(category) {
        this.inputHandler.handleFilter(category);
    }

    handleSort(sortBy) {
        this.inputHandler.handleSort(sortBy);
    }

    // Error handling
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.notificationManager.showError('An unexpected error occurred');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.notificationManager.showError('An unexpected error occurred');
        });
    }

    // Utility methods
    getBlogStats() {
        const blogs = this.dataManager.getAllBlogs();
        return this.filterManager.getBlogStats(blogs);
    }

    exportBlogs() {
        try {
            const blogs = this.dataManager.getAllBlogs();
            const dataStr = JSON.stringify(blogs, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `blog-export-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            this.notificationManager.showSuccess('Blogs exported successfully!');
        } catch (error) {
            this.notificationManager.showError('Failed to export blogs');
            console.error('Export error:', error);
        }
    }

    importBlogs(file) {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedBlogs = JSON.parse(e.target.result);
                    
                    if (Array.isArray(importedBlogs)) {
                        // Add imported blogs to existing ones
                        importedBlogs.forEach(blog => {
                            blog.id = Date.now() + Math.random();
                            this.dataManager.blogs.push(blog);
                        });
                        
                        this.dataManager.saveBlogsToStorage();
                        this.renderBlogs();
                        this.updateBlogCount();
                        
                        this.notificationManager.showSuccess(`${importedBlogs.length} blogs imported successfully!`);
                    } else {
                        throw new Error('Invalid file format');
                    }
                } catch (parseError) {
                    this.notificationManager.showError('Invalid file format');
                }
            };
            
            reader.readAsText(file);
        } catch (error) {
            this.notificationManager.showError('Failed to import blogs');
            console.error('Import error:', error);
        }
    }

    // Search functionality
    performAdvancedSearch(options) {
        const blogs = this.dataManager.getAllBlogs();
        let results = blogs;

        if (options.tags) {
            results = this.filterManager.searchByTags(results, options.tags);
        }

        if (options.dateRange) {
            results = this.filterManager.filterByDateRange(
                results, 
                options.dateRange.start, 
                options.dateRange.end
            );
        }

        if (options.contentLength) {
            results = this.filterManager.filterByContentLength(
                results,
                options.contentLength.min,
                options.contentLength.max
            );
        }

        this.uiRenderer.renderBlogsToDOM(results);
        this.inputHandler.setupCardEventListeners();
    }

    // Theme management (if needed)
    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('blog-theme', theme);
        this.notificationManager.showInfo(`Theme changed to ${theme}`);
    }

    // Accessibility helpers
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    window.blogDashboard = new BlogDashboard();
    window.notificationManager = window.blogDashboard.notificationManager;
    
    console.log('Blog Dashboard application loaded successfully');
});
