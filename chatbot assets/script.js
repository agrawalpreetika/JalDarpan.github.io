// Event listener for the Send button
document.getElementById('send-btn').addEventListener('click', sendMessage);

// Function to send the user's message to the server and handle the response
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === "") return;

    appendMessage(userInput, 'user-message');
    document.getElementById('user-input').value = "";

    try {
        const API_URL = 'https://jaldarpan.vercel.app/fulfillment'; // Replace this after deployment
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: userInput })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        appendMessage(data.fulfillmentText, 'bot-message');
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        appendMessage('Sorry, there was an error processing your request.', 'bot-message');
    }
}

// Function to append messages to the chat log
function appendMessage(message, className) {
    const chatLog = document.getElementById('chat-log');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// Event listener for the Chatbot toggle button
document.getElementById('chatbot-toggle-btn').addEventListener('click', function() {
    const chatbotContainer = document.getElementById('chatbot-container');
    chatbotContainer.classList.toggle('hidden');  // Toggle the hidden class to show/hide the chatbot
});
