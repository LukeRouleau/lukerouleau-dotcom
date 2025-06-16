// Title Wave Animation
// Creates a fast, subtle wave effect on individual letters of h1 elements

document.addEventListener('DOMContentLoaded', function() {
    // Find all h1 elements
    const titles = document.querySelectorAll('h1');
    
    titles.forEach((title, titleIndex) => {
        // Store original text
        const originalText = title.textContent;
        
        // Clear the element
        title.innerHTML = '';
        
        // Split text into individual characters
        originalText.split('').forEach((char, charIndex) => {
            const span = document.createElement('span');
            
            // Handle spaces
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
            }
            
            // Add wave class with staggered delay
            span.classList.add('wave-letter');
            span.style.animationDelay = `${(charIndex * 0.02)}s`;
            
            title.appendChild(span);
        });
    });
}); 