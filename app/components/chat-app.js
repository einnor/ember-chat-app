import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  activeUserService: service('active-user'),
  nameIsSet: computed('activeUserService.user',function() {
    return this.get('activeUserService').hasUser();
  })
});
