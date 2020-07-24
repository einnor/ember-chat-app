import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

const SAD_EMOJI = [55357, 56864];
const HAPPY_EMOJI = [55357, 56832];
const NEUTRAL_EMOJI = [55357, 56848];

export default Component.extend({
  websockets: service(),
  socketRef: null,
  activeUserService: service('active-user'),
  messages: ['Welcome to your chat app!'].map((message) => {
    return {
      username: 'Admin',
      time: new Date(),
      text: message,
    };
  }),

  didInsertElement() {
    this._super(...arguments);

    const socket = this.websockets.socketFor('ws://localhost:8999/');
    // socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.messageHandler, this);
    socket.on('close', this.reconnect, this);

    this.set('socketRef', socket);
  },

  /*
    This will remove the old socket and try and connect to a new one on the same url.
    NOTE: that this does not need to be in a Ember.run.later this is just an example on
    how to reconnect every second.
  */
  reconnect() {
    const socket = this.websockets.socketFor('ws://localhost:8999/');
    later(this, () => {
      socket.reconnect();
    }, 1000);
  },

  messageHandler(event) {
    console.log(event);
    const data = JSON.parse(event.data);
    const analysis = data.sentiment > 0 ? HAPPY_EMOJI : (data.sentiment === 0 ? NEUTRAL_EMOJI : SAD_EMOJI);
    const response = {
      text: data.text,
      username: data.username,
      time: data.time,
      mood: String.fromCodePoint(...analysis)
    }
    console.log(response);
    this.get('messages').pushObject(response);
  },

  actions: {
    newMessage() {
      const text = this.get('newMessage');
      const username = this.get('activeUserService').get('user');
      const time = new Date();

      this.socketRef.send({ text, username, time }, true);
      this.set('newMessage', '');
    },
  },

  /*
    To close a websocket connection simply call the closeSocketFor method. NOTE: it is good
    practice to close any connections after you are no longer in need of it. A good
    place for this clean up is in the willDestroyElement method of the object.
  */
  willDestroyElement() {
    this._super(...arguments);
    this.socketService.closeSocketFor('ws://localhost:8999/');
  }
});
