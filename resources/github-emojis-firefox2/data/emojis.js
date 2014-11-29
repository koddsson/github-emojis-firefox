var emojis;

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

var findEmoji = function(text, callback) {
  var results = _(emojis)
    .chain()
    .pairs()
    .filter(function(emoji) {
      // Search the list of descriptions for the given string
      var in_list = _(emoji[1]).reduce(function (last, desc) {
        return last || desc.startsWith(text);
      }, false);
      if (emoji[0].startsWith(text) || in_list) {
        return emoji[0];
      }
    })
    .map(_.first)
    .value();
  console.error(results);
  callback(results);
};
    
self.port.on('data', function(data) {
  emojis = JSON.parse(data);
  $('textarea.comment-form-textarea').textcomplete([{
    match: /(^|\s)\$(\w*)$/,
    replace: function (value) { return '$1:' + value + ':'; },
    template: function (value) {
      //return value;
      return '<img style="height: 20px; width: 20px;" src="chrome://github-emojis/content/emoji/' + value + '.png" />' + value;
    },
    search: findEmoji,
    maxCount: 5
  }]);
});

$(document).ready(function() {
  // If there are any valid input boxes on this page.
  if ($('textarea.comment-form-textarea').length > 0) {
    // Fetch the data we need.
    self.port.emit('needData', null);
  }
});
