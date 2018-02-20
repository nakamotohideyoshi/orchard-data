let config = require('config')

module.exports = {
  'DATABASE': (() => {
    if (config.util.getEnv('NODE_ENV') === 'test') {
      return 'analysis-lib-test';
    }

    return 'analysis-lib';
  })(),
  'REPORTS-DIR': ['.', 'src', 'reports']
};
