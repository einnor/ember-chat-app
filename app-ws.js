const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const Sentiment = require('sentiment');

const app = express();

// Initialize a simple http server
const server = http.createServer(app);

// Initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const messageObject = JSON.parse(message);
    console.log(messageObject);
    const sentiment = new Sentiment();
    const sentimentScore = sentiment.analyze(message.text).score;
    const payload = {
      text: messageObject.text,
      username: messageObject.username,
      time: messageObject.time,
      sentiment: sentimentScore
    }
    // Broadcast message to connected clients
    wss.clients.forEach(client => {
      if (client != ws) {
        client.send(JSON.stringify(payload));
      }    
    });
    ws.send(JSON.stringify(payload));
  });
});

// Start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});