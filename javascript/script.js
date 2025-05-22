document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const body = document.body;
    const navButtons = document.querySelectorAll('.nav-button');
    const moduleContents = document.querySelectorAll('.module-content');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const chatMessagesContainer = document.getElementById('chat-messages');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCountSpan = document.getElementById('cart-count');
    const notificationBell = document.getElementById('notification-bell');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const notificationList = document.getElementById('notification-list');
    const notificationCountSpan = document.getElementById('notification-count');
    const noNotificationsMessage = document.getElementById('no-notifications-message');
    const clearNotificationsBtn = document.getElementById('clear-notifications');

    let cartItemCount = 0;
    let notificationCount = 0;
    let notifications = [];

    // --- Utility Functions ---

    /**
     * Sanitizes user input to prevent basic Cross-Site Scripting (XSS) attacks.
     * This is a basic client-side sanitization. Server-side validation is crucial for security.
     * @param {string} input - The raw string input from the user.
     * @returns {string} The sanitized string.
     */
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(input));
        return div.innerHTML;
    }

    /**
     * Adds a new notification to the list and updates the count.
     * @param {string} message - The notification message.
     * @param {string} type - Type of notification (e.g., 'info', 'success', 'warning', 'error').
     */
    function addNotification(message, type = 'info') {
        const sanitizedMessage = sanitizeInput(message);
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item p-3 border-b border-card last:border-b-0 text-sm flex items-center space-x-2`;

        let iconClass = 'fas fa-info-circle text-blue-500';
        if (type === 'success') iconClass = 'fas fa-check-circle text-green-500';
        if (type === 'warning') iconClass = 'fas fa-exclamation-triangle text-yellow-500';
        if (type === 'error') iconClass = 'fas fa-times-circle text-red-500';

        notificationItem.innerHTML = `<i class="${iconClass}"></i><span>${sanitizedMessage}</span>`;
        notificationList.prepend(notificationItem); // Add to top

        notifications.push({ message: sanitizedMessage, type: type });
        notificationCount++;
        updateNotificationCount();
        noNotificationsMessage.classList.add('hidden'); // Hide "No new notifications" message
    }

    /**
     * Updates the displayed notification count and visibility of the badge.
     */
    function updateNotificationCount() {
        if (notificationCount > 0) {
            notificationCountSpan.textContent = notificationCount;
            notificationCountSpan.classList.remove('hidden');
        } else {
            notificationCountSpan.classList.add('hidden');
            noNotificationsMessage.classList.remove('hidden'); // Show "No new notifications" message
        }
    }

    // --- Event Handlers ---

    // Navigation handler to switch modules
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all nav buttons and module contents
            navButtons.forEach(btn => btn.classList.remove('active', 'text-primary'));
            moduleContents.forEach(content => content.classList.remove('active'));

            // Add 'active' class to the clicked nav button and corresponding module content
            const targetModule = button.dataset.module;
            button.classList.add('active', 'text-primary'); // Highlight active button
            document.getElementById(`${targetModule}-module`).classList.add('active');
        });
    });

    // Dark Mode Toggle
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        body.classList.toggle('light'); // Ensure light class is also toggled
        // Store preference in localStorage (optional, for persistence)
        if (body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Apply saved theme preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.remove('light', 'dark'); // Remove existing classes
        body.classList.add(savedTheme); // Add saved theme
    } else {
        // Default to light if no preference saved
        body.classList.add('light');
    }


    // Chat message sending
    sendMessageBtn.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            const sanitizedMessage = sanitizeInput(message); // Sanitize input
            const messageDiv = document.createElement('div');
            messageDiv.className = 'flex items-start justify-end mb-4';
            messageDiv.innerHTML = `
                <div>
                    <p class="font-semibold text-sm text-right">You <span class="text-gray-500 dark:text-gray-400 text-xs ml-2">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
                    <div class="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 p-2 rounded-lg max-w-xs ml-auto">
                        ${sanitizedMessage}
                    </div>
                </div>
                <img src="https://placehold.co/32x32/4CAF50/FFFFFF?text=You" alt="Your Avatar" class="rounded-full w-8 h-8 ml-3">
            `;
            chatMessagesContainer.appendChild(messageDiv);
            chatInput.value = ''; // Clear input
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll to bottom
            addNotification(`You sent a message: "${sanitizedMessage.substring(0, 30)}..."`, 'info');
        }
    });

    // Allow sending message with Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });

    // Add to Cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartItemCount++;
            cartCountSpan.textContent = cartItemCount;
            addNotification(`Item added to cart! Total: ${cartItemCount}`, 'success');
        });
    });

    // Notification bell click to toggle dropdown
    notificationBell.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from immediately closing the dropdown
        notificationDropdown.classList.toggle('hidden');
    });

    // Close notification dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!notificationDropdown.contains(event.target) && !notificationBell.contains(event.target)) {
            notificationDropdown.classList.add('hidden');
        }
    });

    // Clear all notifications
    clearNotificationsBtn.addEventListener('click', () => {
        notificationList.innerHTML = ''; // Clear all displayed notifications
        notifications = []; // Clear notifications array
        notificationCount = 0;
        updateNotificationCount();
    });

    // --- Initial Setup/Demo Notifications ---
    // Add some demo notifications on load
    addNotification('Welcome to Interface! Explore all modules.', 'info');
    addNotification('New course "Cyber Security Fundamentals" is now available!', 'success');
    addNotification('You have a new message from John Doe.', 'info');
    addNotification('Your freelancing bid for "Website Redesign" has been accepted!', 'success');
    updateNotificationCount(); // Ensure count is updated after adding initial notifications
});