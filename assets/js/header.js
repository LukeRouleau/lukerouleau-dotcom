document.addEventListener("DOMContentLoaded", function() {
    // Get the current page path to determine if we're in a post or main page
    const currentPath = window.location.pathname;
    const isInBlogDir = currentPath.includes('/blog/');
    
    // Determine the correct header path and base path for links
    let basePath = '';
    let headerPath = '';
    
    if (isInBlogDir) {
        // From blog/ directory back to root
        basePath = '../';
        headerPath = '../assets/components/header.html';
        
        // Add blog.css for post pages if not already loaded
        if (!document.querySelector('link[href$="blog.css"]')) {
            const blogCssLink = document.createElement('link');
            blogCssLink.rel = 'stylesheet';
            blogCssLink.href = '../assets/css/blog.css';
            document.head.appendChild(blogCssLink);
        }
        
        // Add highlight.js resources if not already loaded
        if (!document.querySelector('link[href*="highlight.js"]')) {
            // Add CSS
            const highlightCssLink = document.createElement('link');
            highlightCssLink.rel = 'stylesheet';
            highlightCssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css';
            document.head.appendChild(highlightCssLink);
            
            // Add JS
            const highlightJsScript = document.createElement('script');
            highlightJsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js';
            document.head.appendChild(highlightJsScript);
            
            // Initialize highlight.js
            highlightJsScript.onload = function() {
                document.querySelectorAll('pre code').forEach((el) => {
                    hljs.highlightElement(el);
                });
            };
        }
    } else {
        // From root
        headerPath = './assets/components/header.html';
    }
    
    // Load the header
    fetch(headerPath)
        .then(response => response.text())
        .then(data => {
            // Insert the header
            document.getElementById('header-placeholder').innerHTML = data;
            
            // Fix relative paths for post pages
            if (isInBlogDir) {
                // Update nav links to point to correct parent directory
                const homeLink = document.getElementById('nav-home');
                const musingsLink = document.getElementById('nav-musings');
                
                if (homeLink) {
                    homeLink.setAttribute('href', '../');
                }
                
                if (musingsLink) {
                    musingsLink.setAttribute('href', '../musings');
                }
                
                // Update resume link to point to correct path from posts directory
                const resumeLink = document.querySelector('.resume-link');
                if (resumeLink) {
                    resumeLink.setAttribute('href', '../assets/files/luke_rouleau_resume.pdf');
                }
            }
            
            // Set active class based on current page
            if (currentPath.includes('musings')) {
                document.getElementById('nav-musings').classList.add('active');
            } else if (!isInBlogDir) {
                document.getElementById('nav-home').classList.add('active');
            }

            // Dark-mode toggle. The active theme was already resolved before
            // paint by the inline <head> script; here we just flip + persist it.
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', function () {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const current = document.documentElement.getAttribute('data-theme')
                        || (prefersDark ? 'dark' : 'light');
                    const next = current === 'dark' ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', next);
                    try { localStorage.setItem('theme', next); } catch (e) {}
                });
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
});

// Follow the OS theme live, but only until the visitor makes an explicit choice.
try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
} catch (e) {}