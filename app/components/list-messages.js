import Component from '@ember/component';
import { inject as service } from '@ember/service';
import axios from 'axios';
import Pusher from 'pusher-js';

import config from 'ember-chat-app/config/environment';

const SAD_EMOJI = [55357, 56864];
const HAPPY_EMOJI = [55357, 56832];
const NEUTRAL_EMOJI = [55357, 56848];

export default Component.extend({
  activeUserService: service('active-user'),
  messages: ['Welcome to your chat app!'].map((message) => {
    return {
      username: 'Admin',
      time: new Date(),
      text: message,
    };
  }),
  init() {
    this._super(...arguments);
    let pusher = new Pusher(config.PUSHER_APP_KEY, {
      cluster: config.PUSHER_APP_CLUSTER,
      encrypted: true
    });
    const channel = pusher.subscribe('chat');
    channel.bind('message', this.messageHandler, this);
  },

  messageHandler(data) {
    const analysis = data.sentiment > 0 ? HAPPY_EMOJI : (data.sentiment === 0 ? NEUTRAL_EMOJI : SAD_EMOJI);
    const response = {
      text: data.text,
      username: data.username,
      time: data.time,
      mood: String.fromCodePoint(...analysis)
    }
    this.get('messages').pushObject(response);
  },

  actions: {
    newMessage() {
      const text = this.get('newMessage');
      const username = this.get('activeUserService').get('user');
      const time = new Date();

      axios.post('http://localhost:3000/messages', { text, username, time });
      this.set('newMessage', '');
    }
  }
});
