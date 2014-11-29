// Import the page-mod API
var pageMod = require("sdk/page-mod");
var self = require('sdk/self');

console.error('here ye');

pageMod.PageMod({
  include: "https://github.com/*",
  contentStyleFile: self.data.url('jquery.textcomplete.css'),
  contentScriptFile: [
    self.data.url('jquery-2.1.1.min.js'),
    self.data.url('jquery.textcomplete.min.js'),
    self.data.url('lodash.min.js'),
    self.data.url('emojis.js')],
  onAttach: function(worker) {
    console.error('Attached');
    worker.port.on('needData', function() {
      console.error('needData fired!');
      worker.port.emit('data', self.data.load('emojis.json'));
    });
  },
});
