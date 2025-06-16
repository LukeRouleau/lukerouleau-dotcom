// Title Wave Animation
// Creates a fast, subtle wave effect on individual letters of h1 elements

document.addEventListener('DOMContentLoaded', function() {
    // Single vibrant color for all letters
    const waveColor = '#dd6b20'; // Site's accent orange
    
    // Find all h1 elements
    const titles = document.querySelectorAll('h1');
    
    titles.forEach((title, titleIndex) => {
        // Check if there's a favicon/logo image
        const faviconImg = title.querySelector('.inline-logo');
        
        // Store original text (excluding any HTML elements)
        const originalText = title.textContent;
        
        // Clear the element
        title.innerHTML = '';
        
        // Re-add the favicon if it existed
        if (faviconImg) {
            title.appendChild(faviconImg.cloneNode(true));
            title.appendChild(document.createTextNode(' ')); // Add space after favicon
        }
        
        // Split text into individual characters (excluding the favicon text)
        const textToAnimate = faviconImg ? originalText.replace(/^\s*/, '').trim() : originalText;
        textToAnimate.split('').forEach((char, charIndex) => {
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
            
            // Set the same vibrant color for all letters
            span.style.setProperty('--wave-letter-color', waveColor);
            
            title.appendChild(span);
        });
    });
}); 