
// User authentication
document.addEventListener('DOMContentLoaded', () => {

    // Define DOM elements
    const loginForm = document.getElementById('loginForm');
    const loginStatus = document.getElementById('loginStatus');

    // Event listener for form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get username and password from the form
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Mock authentication check
        if (username === 'admin' && password === 'abcd') {
            // If credentials are correct, set session and redirect
            loginStatus.textContent = 'Login successful!';
            loginStatus.style.color = 'green';
            
            // Store user session
            sessionStorage.setItem('user', username);

            // Redirect to the dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000); // 1-second delay for the status message
        } else {
            // If credentials are incorrect, show an error message
            loginStatus.textContent = 'Invalid username or password!';
            loginStatus.style.color = 'red';
        }
    });
});
