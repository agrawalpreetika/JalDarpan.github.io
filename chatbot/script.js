document.getElementById('send-btn').addEventListener('click', sendMessage);

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    const sendButton = document.getElementById('send-btn');
    
    if (userInput.trim() === "") return;

    appendMessage(userInput, 'user-message');
    document.getElementById('user-input').value = "";

    // Disable the Send button while processing
    sendButton.disabled = true;
    appendMessage('Loading...', 'loading-message');

    try {
        const response = await fetch('http://localhost:3000/fulfillment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: userInput })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        appendMessage(data.fulfillmentText, 'bot-message');
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        appendMessage('Sorry, there was an error processing your request.', 'bot-message');
    } finally {
        // Re-enable the Send button and remove loading message
        sendButton.disabled = false;
        removeLoadingMessage();
    }
}

function appendMessage(message, className) {
    const chatLog = document.getElementById('chat-log');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function removeLoadingMessage() {
    const loadingMessages = document.querySelectorAll('.loading-message');
    loadingMessages.forEach(msg => msg.remove());
}

// Event listener for the Chatbot toggle button
document.getElementById('chatbot-toggle-btn').addEventListener('click', function() {
    const chatbotContainer = document.getElementById('chatbot-container');
    chatbotContainer.classList.toggle('hidden');  // Toggle the hidden class to show/hide the chatbot
});

