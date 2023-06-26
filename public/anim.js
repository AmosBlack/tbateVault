// Run the funky loading animation until the page completely loads
window.addEventListener('load', function () {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.add('fade-out');
  });
  
  // Fades out the loading overlay after 1.5 seconds
  setTimeout(function () {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'none';
  }, 1500);
  