const npm = require('npm');

npm.load((err) => {
  // handle errors
  console.log(err);

  // install module ffi
  npm.commands.run(['t'], function(er, data) {
    console.log(data);
  });

  npm.on('log', (message) => {
    // log installation progress
    console.log(message);
  });
});