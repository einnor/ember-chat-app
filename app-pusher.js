const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Pusher = require('pusher');
const Sentiment = require('sentiment');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ensure that your pusher credential are properly set in the .env file  
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true
});

app.set('port', process.env.PORT || 3000);

app.post('/messages', (req, res) => {
  const sentiment = new Sentiment();
  const sentimentScore = sentiment.analyze(req.body.text).score;
  const payload = {
    text: req.body.text,
    username: req.body.username,
    time: req.body.time,
    sentiment: sentimentScore
  }

  // Trigger message event on the chat channel
  pusher.trigger('chat', 'message', payload);
  res.send(payload)
});

// Start our server
app.listen(app.get('port'), () => {
  console.log("Listening on port " + app.get('port'));
});
