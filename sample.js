(function() {
  var Hackernews, hn;
  Hackernews = require('./hackernews');
  hn = new Hackernews();
  hn.scrapeItem('2772387');
}).call(this);
