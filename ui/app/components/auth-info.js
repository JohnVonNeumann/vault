import { inject as service } from '@ember/service';
import { or } from '@ember/object/computed';
import Component from '@ember/component';
import { run } from '@ember/runloop';
export default Component.extend({
  auth: service(),
  wizard: service(),
  router: service(),

  transitionToRoute: function() {
    this.get('router').transitionTo(...arguments);
  },

  classNames: 'user-menu auth-info',

  isRenewing: or('fakeRenew', 'auth.isRenewing'),

  actions: {
    restartGuide() {
      this.get('wizard').restartGuide();
    },
    renewToken() {
      this.set('fakeRenew', true);
      run.later(() => {
        this.set('fakeRenew', false);
        this.get('auth').renew();
      }, 200);
    },

    revokeToken() {
      this.get('auth')
        .revokeCurrentToken()
        .then(() => {
          this.transitionToRoute('vault.cluster.logout');
        });
    },
  },
});
