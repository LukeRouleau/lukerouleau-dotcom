document.addEventListener('DOMContentLoaded', function () {
    const infoButton = document.querySelector('.info-button');
    const tooltip = document.querySelector('.info-tooltip');

    if (infoButton && tooltip) {
        infoButton.addEventListener('click', function (event) {
            event.stopPropagation();
            
            // Toggle tooltip visibility
            tooltip.classList.toggle('visible');
            
            // Set button active state based on tooltip visibility
            if (tooltip.classList.contains('visible')) {
                infoButton.classList.add('active');
            } else {
                infoButton.classList.remove('active');
            }
        });

        document.addEventListener('click', function (event) {
            if (!tooltip.contains(event.target) && !infoButton.contains(event.target)) {
                // Hide tooltip and deactivate button
                tooltip.classList.remove('visible');
                infoButton.classList.remove('active');
            }
        });
    }
}); 