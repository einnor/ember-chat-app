import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  activeUserService: service('active-user'),
  actions: {
    userSubmittedName() {
      const user = this.get('userName');
      this.get('activeUserService').setUser(user);
    }
  }
});
