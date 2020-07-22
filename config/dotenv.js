/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function(/* env */) {
  return {
    clientAllowedKeys: [
      'PUSHER_APP_ID',
      'PUSHER_APP_KEY',
      'PUSHER_APP_SECRET',
      'PUSHER_APP_CLUSTER',
    ],
    fastbootAllowedKeys: [],
    failOnMissingKey: true,
    path: path.join(path.dirname(__dirname), '.env')
  }
};
