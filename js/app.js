// app.js - App initialization
// Populate datalist and setup distance autofill when DOM is ready

document.addEventListener('DOMContentLoaded', function() {
  try {
    if (typeof CONFIG !== 'undefined' && CONFIG.populateDetails) {
      CONFIG.populateDetails();
    }

    if (typeof CONFIG !== 'undefined' && CONFIG.setupDistanceAutofill) {
      CONFIG.setupDistanceAutofill();
    }
  } catch (err) {
    console.error('Error during app initialization:', err);
  }
});
