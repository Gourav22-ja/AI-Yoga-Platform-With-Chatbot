const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Use environment port or default to 3000

// --- Middleware ---

// 1. Enable CORS (Cross-Origin Resource Sharing)
// Allows requests from your front-end domain (or any domain in development)
app.use(cors());

// 2. Body Parser Middleware
// Parses incoming JSON request bodies
app.use(bodyParser.json());
// Parses incoming URL-encoded request bodies (for standard form submissions, though we use JSON)
app.use(bodyParser.urlencoded({ extended: true }));

// 3. Static File Serving
// Serve files from the 'public' directory (HTML, CSS, JS, images, video)
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes ---

// POST endpoint to handle contact form submissions
app.post('/send-message', (req, res) => {
    console.log('Received request body:', req.body); // Log the raw body for debugging

    const { name, email, message } = req.body;

    // Basic Server-Side Validation (you can add more complex checks)
    if (!name || !email || !message) {
        console.error('Validation Failed: Missing fields');
        // Send a bad request status code and error message
        return res.status(400).json({
            success: false,
            message: 'Please fill out all fields.'
        });
    }

    // **Action: Log the message (Replace this with actual email sending later)**
    console.log('--- New Contact Form Submission ---');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log('------------------------------------');

    // **Future Enhancement: Send Email using Nodemailer**
    // Here you would integrate Nodemailer to send the data via email.
    // This requires installing nodemailer (`npm install nodemailer`)
    // and configuring it with your email service credentials (e.g., Gmail, SendGrid).
    // Example structure (requires setup):
    // try {
    //   await sendEmail({ name, email, message }); // Your email sending function
    //   res.status(200).json({ success: true, message: 'Message received successfully!' });
    // } catch (error) {
    //   console.error('Error sending email:', error);
    //   res.status(500).json({ success: false, message: 'Failed to send message due to a server error.' });
    // }

    // Send a success response (since we just logged it for now)
    res.status(200).json({
        success: true,
        message: 'Message received successfully! (Logged on server)' // Modify message if actually sending email
    });
});

// --- Catch-all Route (Optional) ---
// If no API routes or static files match, serve the index.html.
// Useful for single-page applications with client-side routing.
// Keep this last.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});