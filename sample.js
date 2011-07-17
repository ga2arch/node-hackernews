(function() {
  var Hackernews, hn;
  Hackernews = require('./hackernews');
  hn = new Hackernews();
  hn.scrape(hn.news, function(docs) {
    return hn.scrapeItem(docs[1].itemId);
  });
}).call(this);
