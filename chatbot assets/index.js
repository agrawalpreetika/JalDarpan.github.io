const express = require('express');
const dialogflow = require('@google-cloud/dialogflow'); 
const uuid = require('uuid');
const cors = require('cors'); 

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); 

// Load service account key
const sessionClient = new dialogflow.SessionsClient({ 
  keyFilename: 'waterwatch-nfle-01b71ac9c58e.json'
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