const express = require('express');
const dialogflow = require('@google-cloud/dialogflow'); // Updated import
const uuid = require('uuid');
const cors = require('cors'); // Import the cors package
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Enable CORS

// Load service account key
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

app.get('/', (req, res) => {
  res.send('Welcome to the Dialogflow Chatbot Server!');
});

app.post('/fulfillment', async (req, res) => {
  const sessionId = uuid.v4();
  const sessionPath = sessionClient.projectAgentSessionPath('waterwatch-nfle', sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.query,
        languageCode: 'en-US',
      },
    },
  };

  try {
    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;
    res.json({ fulfillmentText: result.fulfillmentText });
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).send('Error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
