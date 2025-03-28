import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add scroll animation functionality
document.addEventListener('DOMContentLoaded', function() {
  // Function to handle scroll animations
  function handleScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight;
      
      if (elementPosition < screenPosition - 100) {
        element.classList.add('visible');
      }
    });
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScrollAnimations);
  
  // Run once to check for elements already in view
  // Delay the initial check to make sure React has rendered the components
  setTimeout(handleScrollAnimations, 300);
}); // <-- Kurung tutup yang hilang