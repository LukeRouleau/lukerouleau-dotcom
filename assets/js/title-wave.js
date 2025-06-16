// Title Wave Animation
// Creates a fast, subtle wave effect on individual letters of h1 elements

document.addEventListener('DOMContentLoaded', function() {
    // Single vibrant color for all letters
    const waveColor = '#dd6b20'; // Site's accent orange
    
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
            
            // Set the same vibrant color for all letters
            span.style.setProperty('--wave-letter-color', waveColor);
            
            title.appendChild(span);
        });
    });
}); 