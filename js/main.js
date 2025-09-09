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
