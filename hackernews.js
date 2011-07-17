(function() {
  var Hackernews, events, jsdom;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  events = require('events');
  jsdom = require('jsdom');
  Hackernews = (function() {
    __extends(Hackernews, events.EventEmitter);
    function Hackernews() {
      this.base = 'http://news.ycombinator.com';
      this.news = this.base + '/news';
      this.newest = this.base + '/newest';
      this.ask = this.base + '/ask';
    }
    Hackernews.prototype.scrape = function(url, callback) {
      var self;
      self = this;
      return jsdom.env(url, ['http://code.jquery.com/jquery-1.5.min.js'], function(err, win) {
        var $, docs, i;
        $ = win.$;
        docs = [];
        i = 0;
        $('td.title:not(:last) > a').each(function() {
          var title, tmp;
          title = $(this).text();
          url = $(this).attr('href');
          docs[i] = {
            title: title,
            url: url,
            info: {}
          };
          $('td.subtext:eq(' + i + ') > *').each(function() {
            var data, raw;
            raw = $(this).text();
            data = raw.split(' ')[0];
            if (raw.indexOf('points') !== -1) {
              return docs[i].info.points = data;
            } else if (raw.indexOf('comments') !== -1) {
              docs[i].itemId = $(this).attr('href').split('=')[1];
              return docs[i].info.comments = data;
            } else if (raw.indexOf('discuss') === -1) {
              return docs[i].info.postedBy = data;
            }
          });
          tmp = $('td.subtext:eq(' + i + ')').text();
          docs[i].info.postedAgo = tmp.split(docs[i].info.postedBy + ' ')[1].split('ago')[0] + 'ago';
          self.emit('doc', docs[i]);
          return i++;
        });
        if (callback != null) {
          return callback(docs);
        }
      });
    };
    Hackernews.prototype.scrapeItem = function(itemId) {
      var self, url;
      self = this;
      url = this.base + '/item?id=' + itemId;
      return jsdom.env(url, ['http://code.jquery.com/jquery-1.5.min.js'], function(err, win) {
        var $, comments, i;
        $ = win.$;
        comments = [];
        i = 0;
        $('td.default').each(function() {
          var b, tmp;
          comments[i] = {};
          comments[i].pos = $(this).parent().get(0).childNodes[0].childNodes[0].attributes.getNamedItem('width').nodeValue;
          b = i + 1;
          $('span.comhead:eq(' + b + ') > a').each(function() {
            var text;
            text = $(this).text();
            if (text.indexOf('link') === -1) {
              return comments[i].postedBy = text;
            } else {
              return comments[i].itemId = $(this).attr('href').split('=')[1];
            }
          });
          tmp = $('span.comhead:eq(' + b + ')').text();
          comments[i].postedAgo = tmp.split(comments[i].postedBy + ' ')[1].split('ago')[0] + 'ago';
          $('span.comment:eq(' + i + ') > font').each(function() {
            return comments[i].text = $(this).text();
          });
          return i++;
        });
        return console.log(comments);
      });
    };
    return Hackernews;
  })();
  module.exports = Hackernews;
}).call(this);
