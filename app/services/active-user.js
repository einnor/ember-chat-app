import Service from '@ember/service';

export default Service.extend({
  user: null,
  setUser(username) {
    this.set('user', username);
  },
  hasUser() {
    return this.get('user') != undefined;
  },
});