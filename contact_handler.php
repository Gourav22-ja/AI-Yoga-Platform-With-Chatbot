<?php
header('Content-Type: application/json'); // Indicate we're sending JSON back

// Basic Security: Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

// --- Configuration ---
$receiving_email_address = 'your_receiving_email@example.com'; // IMPORTANT: Change this!
$email_subject_prefix = 'New Yoga Website Message';

// --- Get Data & Sanitize ---
// Use filter_input for safer data retrieval
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS);

// --- Validation ---
$errors = [];
if (empty($name)) {
    $errors[] = 'Name is required.';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}
if (empty($message)) {
    $errors[] = 'Message cannot be empty.';
}

// If validation errors exist, return them
if (!empty($errors)) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// --- Prepare Email ---
$subject = $email_subject_prefix . ' from ' . $name;

$body = "You received a new message from your website contact form:\n\n";
$body .= "Name: " . $name . "\n";
$body .= "Email: " . $email . "\n";
$body .= "Message:\n" . wordwrap($message, 70, "\n") . "\n"; // wordwrap for line breaks

// Basic headers - IMPORTANT for deliverability and showing the sender's email
$headers = "From: \"$name\" <noreply@yourdomain.com>\r\n"; // Use a no-reply from your domain
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// --- Send Email ---
// The built-in mail() function's success depends heavily on server configuration.
// It might not work reliably on all hosts, especially local development.
// Using libraries like PHPMailer is recommended for production.
if (mail($receiving_email_address, $subject, $body, $headers)) {
    http_response_code(200); // OK
    echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
} else {
    http_response_code(500); // Internal Server Error
    // Don't expose detailed errors to the user
    error_log("Mail failed to send from $email to $receiving_email_address"); // Log error server-side
    echo json_encode(['success' => false, 'message' => 'Sorry, there was an error sending your message. Please try again later.']);
}

exit; // End script execution
?>