import Component from '@ember/component';
import { computed } from '@ember/object';
import strftime from 'strftime';
import he from 'he';

export default Component.extend({
  timestamp: computed('message.time', function() {
    return strftime('%H:%M:%S %P', new Date(this.get('message').time));
  }),
  text: computed('message.text', function() {
    return he.decode(this.get('message').text);
  }),
});
