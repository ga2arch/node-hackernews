(function() {
  var Hn, hn;
  Hn = require('./hn');
  hn = new Hn();
  hn.scrape(hn.news);
  hn.on('doc', function(doc) {
    return console.log(doc);
  });
}).call(this);
