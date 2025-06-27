document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('#main-header nav');

    // --- Smooth Scrolling for Nav Links ---
    const navLinks = document.querySelectorAll('#main-header nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Check if it's an internal link
            if (href.startsWith('#')) {
                e.preventDefault(); // Prevent default anchor jump
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start' // Scrolls so the top of the target is at the top of the viewport
                    });

                    // Close mobile nav if open after clicking a link
                    if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                    }
                }
            }
            // If it's not an internal link (e.g., href="schedule.html"), let the browser handle it
        });
    });

    // --- Mobile Navigation Toggle ---
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // --- Contact Form Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the default form submission

            // Clear previous status messages and styles
            formStatus.textContent = '';
            formStatus.className = 'form-status'; // Reset classes

            // Show sending message
            formStatus.textContent = 'Sending message...';
            formStatus.classList.add('sending');
            formStatus.style.display = 'block'; // Make sure it's visible

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // IMPORTANT: Make sure the backend server is running!
                // The URL '/send-message' assumes the backend is running on the same origin (domain/port)
                // or is configured with CORS to allow requests from the frontend's origin.
                const response = await fetch('/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json(); // Try to parse the response as JSON

                if (response.ok && result.success) {
                    formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
                    formStatus.className = 'form-status success'; // Add success class
                    contactForm.reset(); // Clear the form fields
                } else {
                    // Handle errors reported by the server (e.g., validation errors)
                    formStatus.textContent = result.message || 'An error occurred. Please try again.';
                    formStatus.className = 'form-status error'; // Add error class
                }
            } catch (error) {
                // Handle network errors or if the server is down
                console.error('Form submission error:', error);
                formStatus.textContent = 'Could not send message. Please check your connection or try again later.';
                formStatus.className = 'form-status error'; // Add error class
            } finally {
                // Ensure the status message remains visible after the fetch operation completes
                 formStatus.style.display = 'block';
            }
        });
    } else {
        console.log("Contact form not found"); // Debugging
    }

    // --- Basic Video Autoplay Check/Attempt (Browsers might still block it) ---
    const video = document.getElementById('bg-video');
    if(video) {
        video.play().catch(error => {
            console.warn("Video autoplay was prevented:", error);
            // Optionally, show a play button or fallback image if autoplay fails
        });
    }

}); // End DOMContentLoaded