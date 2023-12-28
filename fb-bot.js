const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

// Parse application/json
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = 'YOUR_PAGE_ACCESS_TOKEN'; // Replace with your Page Access Token

// Webhook endpoint to receive messages
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);

      const senderPsid = webhookEvent.sender.id;

      if (webhookEvent.message) {
        handleMessage(senderPsid, webhookEvent.message);
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Handle messages sent to the bot
function handleMessage(senderPsid, receivedMessage) {
  const message = {
    text: `Echo: ${receivedMessage.text}`
  };

  callSendAPI(senderPsid, message);
}

// Send response messages via the Send API
function callSendAPI(senderPsid, message) {
  const requestBody = {
    recipient: {
      id: senderPsid
    },
    message: message
  };

  request({
    uri: 'https://graph.facebook.com/v13.0/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: requestBody
  }, (err, res, body) => {
    if (!err) {
      console.log('Message sent successfully');
    } else {
      console.error('Unable to send message:', err);
    }
  });
}

// Set up the webhook verification
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'YOUR_VERIFY_TOKEN'; // Replace with your Verify Token

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Start the Express server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
