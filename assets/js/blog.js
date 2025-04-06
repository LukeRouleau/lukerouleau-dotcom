document.addEventListener("DOMContentLoaded", function() {
    // Variables for filtering
    let allPosts = [];
    let filteredPosts = [];
    let activeType = 'all';
    
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
            
            // Load all content types
            const contentItems = await loadAllContentTypes();
            
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
        }
    }
    
    async function loadAllContentTypes() {
        let allContent = [];
        
        try {
            // Load posts
            const postsResponse = await fetch('./blog/posts/index.json');
            const posts = await postsResponse.json();
            allContent.push(...posts.map(post => ({...post, type: 'post'})));
        } catch (error) {
            console.error('Error loading posts:', error);
        }
        
        try {
            // Load thoughts
            const thoughtsResponse = await fetch('./blog/thoughts/index.json');
            const thoughts = await thoughtsResponse.json();
            allContent.push(...thoughts.map(thought => ({...thought, type: 'thought'})));
        } catch (error) {
            console.error('Error loading thoughts:', error);
        }
        
        try {
            // Load quotes
            const quotesResponse = await fetch('./blog/quotes/index.json');
            const quotes = await quotesResponse.json();
            allContent.push(...quotes.map(quote => ({...quote, type: 'quote'})));
        } catch (error) {
            console.error('Error loading quotes:', error);
        }
        
        return allContent;
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
            attribution = `— <a href="${quote.authorLink}" target="_blank">${quote.author}</a>`;
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
        
        // Display posts grouped by year
        sortedYears.forEach(year => {
            // Create year separator
            const yearSeparator = document.createElement('div');
            yearSeparator.className = 'year-separator';
            yearSeparator.innerHTML = `<h2>${year}</h2>`;
            
            // Find the position to insert the year separator
            // (before the first post of that year)
            const firstPostOfYear = postsByYear[year][0];
            blogContainer.insertBefore(yearSeparator, firstPostOfYear);
            
            // Show all posts for this year
            postsByYear[year].forEach(post => {
                post.style.display = 'block';
            });
        });
    }
}); 