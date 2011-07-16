(function() {
  var Hn, events, jsdom;
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
  Hn = (function() {
    __extends(Hn, events.EventEmitter);
    function Hn() {
      this.base = 'http://news.ycombinator.com';
      this.news = this.base + '/news';
      this.newest = this.base + '/newest';
      this.ask = this.base + '/ask';
    }
    Hn.prototype.scrape = function(url, callback) {
      var self;
      self = this;
      return jsdom.env(url, ['http://code.jquery.com/jquery-1.5.min.js'], function(err, win) {
        var $, docs, i;
        $ = win.$;
        docs = [];
        i = 0;
        $('td.title:not(:last) > a').each(function() {
          var title;
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
              docs[i].info.points = data;
            } else if (raw.indexOf('comments') !== -1) {
              docs[i].itemId = $(this).attr('href').split('=')[1];
              docs[i].info.comments = data;
            } else {
              docs[i].info.postedBy = data;
            }
            return self.emit('doc', docs[i]);
          });
          return i++;
        });
        if (callback != null) {
          return callback(docs);
        }
      });
    };
    return Hn;
  })();
  module.exports = Hn;
}).call(this);
