/**
 * requires all sass files so webpack can transpile and compress them on build/deploy
 */
if (process.env.BROWSER) {
  require('./sass/admin.scss');
  require('./sass/config.scss');
  require('./sass/machine.scss');
  require('./sass/department.scss');
  require('./sass/host.scss');
  require('./sass/style.scss');
  require('./sass/navbar.scss');
  require('./sass/main.scss');
  require('./sass/modal.scss');
  require('./sass/loading.scss');
}