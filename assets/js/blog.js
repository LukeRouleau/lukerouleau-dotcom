document.addEventListener("DOMContentLoaded", function() {
    // Variables for filtering
    let allPosts = [];
    let filteredPosts = [];
    let activeType = 'all';
    const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds
    
    // DOM elements
    const blogContainer = document.getElementById('blog-container');
    const filterButtons = document.querySelectorAll('.filter-button');
    
    // Load all content types and display them
    loadAndDisplayContent();
    
    // Set up filter listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedType = this.dataset.type;
            
            if (activeType !== selectedType) {
                // Update active filter button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update active type
                activeType = selectedType;
                
                // Filter and redisplay posts
                filterPosts();
                displayAllPostsView();
            }
        });
    });
    
    async function loadAndDisplayContent() {
        try {
            // Clear the blog container
            blogContainer.innerHTML = '';
            
            // Show loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.textContent = 'Loading content...';
            blogContainer.appendChild(loadingIndicator);
            
            // Load all content types
            const contentItems = await loadAllContentTypes();
            
            // Remove loading indicator
            blogContainer.removeChild(loadingIndicator);
            
            // Sort all content by date (newest first)
            contentItems.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });
            
            // Create DOM elements for each content item
            contentItems.forEach(item => {
                const element = createContentElement(item);
                blogContainer.appendChild(element);
            });
            
            // Initialize filtering
            allPosts = Array.from(document.querySelectorAll('.post-card'));
            filteredPosts = [...allPosts];
            
            // Display with year separators
            displayAllPostsView();
            
        } catch (error) {
            console.error('Error loading content:', error);
            // Show error message to user
            blogContainer.innerHTML = '<div class="error-message">Failed to load content. Please try again later.</div>';
        }
    }
    
    async function loadAllContentTypes() {
        let allContent = [];
        
        // Check if we have cached content that's still valid
        const cachedContent = checkCache('blogContent');
        if (cachedContent) {
            return cachedContent;
        }
        
        // Use Promise.all to fetch all content in parallel
        try {
            const [posts, thoughts, quotes] = await Promise.all([
                fetchWithTimeout('./blog/posts/index.json', 5000),
                fetchWithTimeout('./blog/thoughts/index.json', 5000),
                fetchWithTimeout('./blog/quotes/index.json', 5000)
            ]);
            
            if (posts) {
                allContent.push(...posts.map(post => ({...post, type: 'post'})));
            }
            
            if (thoughts) {
                allContent.push(...thoughts.map(thought => ({...thought, type: 'thought'})));
            }
            
            if (quotes) {
                allContent.push(...quotes.map(quote => ({...quote, type: 'quote'})));
            }
            
            // Cache the combined content
            cacheContent('blogContent', allContent);
            
            return allContent;
        } catch (error) {
            console.error('Error loading content:', error);
            // Return empty array to handle gracefully
            return [];
        }
    }
    
    async function fetchWithTimeout(url, timeout) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const response = await fetch(url, { 
                signal: controller.signal,
                headers: { 'Cache-Control': 'no-cache' } 
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return null;
        }
    }
    
    function checkCache(key) {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        
        try {
            const { timestamp, data } = JSON.parse(cached);
            const now = new Date().getTime();
            
            if (now - timestamp < CACHE_EXPIRY) {
                return data;
            } else {
                // Cache expired
                localStorage.removeItem(key);
                return null;
            }
        } catch (error) {
            console.error('Error parsing cached data:', error);
            localStorage.removeItem(key);
            return null;
        }
    }
    
    function cacheContent(key, data) {
        try {
            const cacheObject = {
                timestamp: new Date().getTime(),
                data: data
            };
            localStorage.setItem(key, JSON.stringify(cacheObject));
        } catch (error) {
            console.error('Error caching content:', error);
            // If we can't cache (e.g., private browsing mode), just continue
        }
    }
    
    function createContentElement(item) {
        switch (item.type) {
            case 'post':
                return createPostElement(item);
            case 'thought':
                return createThoughtElement(item);
            case 'quote':
                return createQuoteElement(item);
            default:
                console.error('Unknown content type:', item.type);
                return document.createElement('div');
        }
    }
    
    function createPostElement(post) {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        
        postCard.innerHTML = `
            <h2 class="post-title"><a href="${post.url}">${post.title}</a></h2>
            <div class="post-meta">
                <span class="post-date">${post.date}</span>
                <span class="post-type post-type-post" data-type="post">Post</span>
            </div>
            <div class="post-excerpt">
                <p>${post.excerpt}</p>
            </div>
            <a href="${post.url}" class="read-more">Read more →</a>
        `;
        
        return postCard;
    }
    
    function createThoughtElement(thought) {
        const thoughtCard = document.createElement('div');
        thoughtCard.className = 'post-card';
        
        thoughtCard.innerHTML = `
            <h2 class="post-title">${thought.title}</h2>
            <div class="post-meta">
                <span class="post-date">${thought.date}</span>
                <span class="post-type post-type-thought" data-type="thought">Thought</span>
            </div>
            <div class="post-excerpt">
                <div class="thought-content">${thought.content}</div>
            </div>
        `;
        
        return thoughtCard;
    }
    
    function createQuoteElement(quote) {
        const quoteCard = document.createElement('div');
        quoteCard.className = 'post-card';
        
        // Prepare attribution with optional link
        let attribution = `— ${quote.author}`;
        if (quote.authorLink) {
            attribution = `— <a href="${quote.authorLink}" target="_blank" rel="noopener">${quote.author}</a>`;
        }
        
        quoteCard.innerHTML = `
            <h2 class="post-title">${quote.title}</h2>
            <div class="post-meta">
                <span class="post-date">${quote.date}</span>
                <span class="post-type post-type-quote" data-type="quote">Quote</span>
            </div>
            <div class="post-excerpt">
                <div class="quote-content">${quote.content}</div>
                <div class="quote-attribution">${attribution}</div>
            </div>
        `;
        
        return quoteCard;
    }
    
    function filterPosts() {
        if (activeType === 'all') {
            filteredPosts = [...allPosts];
        } else {
            filteredPosts = allPosts.filter(post => {
                const postTypeElement = post.querySelector('.post-type');
                return postTypeElement && postTypeElement.dataset.type === activeType;
            });
        }
    }
    
    function displayAllPostsView() {
        // Create year separators and show all posts in reverse chronological order
        
        // Hide all posts first
        allPosts.forEach(post => post.style.display = 'none');
        
        // Remove any existing year separators
        const existingYearSeparators = blogContainer.querySelectorAll('.year-separator');
        existingYearSeparators.forEach(separator => separator.remove());
        
        // Group posts by year
        const postsByYear = {};
        
        filteredPosts.forEach(post => {
            const dateText = post.querySelector('.post-date').textContent;
            const year = new Date(dateText).getFullYear();
            
            if (!postsByYear[year]) {
                postsByYear[year] = [];
            }
            
            postsByYear[year].push(post);
        });
        
        // Sort years in descending order
        const sortedYears = Object.keys(postsByYear).sort((a, b) => b - a);
        
        // Create a document fragment to reduce reflow/repaint operations
        const fragment = document.createDocumentFragment();
        
        // Display posts grouped by year
        sortedYears.forEach(year => {
            // Create year separator
            const yearSeparator = document.createElement('div');
            yearSeparator.className = 'year-separator';
            yearSeparator.innerHTML = `<h2>${year}</h2>`;
            fragment.appendChild(yearSeparator);
            
            // Show all posts for this year
            postsByYear[year].forEach(post => {
                post.style.display = 'block';
            });
        });
        
        // Append all at once
        blogContainer.appendChild(fragment);
    }
}); 