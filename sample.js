(function() {
  var Hackernews, hn;
  Hackernews = require('./hackernews');
  hn = new Hackernews();
  hn.scrapeItem('2772387');
  hn.on('comment', function(data) {
    return console.log(data);
  });
}).call(this);
