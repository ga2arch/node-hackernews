(function() {
  var Hackernews, hn;
  Hackernews = require('./hackernews');
  hn = new Hackernews();
  hn.scrape(hn.news, function(docs) {
    return console.log(docs);
  });
  hn.on('doc', function(doc) {
    return console.log(doc);
  });
}).call(this);
