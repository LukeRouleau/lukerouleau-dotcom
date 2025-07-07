document.addEventListener('DOMContentLoaded', function () {
    const infoButton = document.querySelector('.info-button');
    const tooltip = document.querySelector('.info-tooltip');

    if (infoButton && tooltip) {
        infoButton.addEventListener('click', function (event) {
            event.stopPropagation();
            tooltip.classList.toggle('visible');
            infoButton.classList.toggle('active');
        });

        document.addEventListener('click', function (event) {
            if (!tooltip.contains(event.target) && !infoButton.contains(event.target)) {
                tooltip.classList.remove('visible');
                infoButton.classList.remove('active');
            }
        });
    }
}); 