(function() {
  var Hackernews, events, fs, jsdom, request, _;
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
  request = require('request');
  _ = require('underscore');
  fs = require('fs');
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
          if (docs[i].info.postedBy != null) {
            docs[i].info.postedAgo = tmp.split(docs[i].info.postedBy + ' ')[1].split('ago')[0] + 'ago';
          }
          docs[i].info.postedAgo = tmp;
          self.emit('doc', docs[i]);
          return i++;
        });
        if (callback != null) {
          return callback(docs);
        }
      });
    };
    Hackernews.prototype.scrapeItem = function(itemId) {
      var html, self, url;
      self = this;
      url = this.base + '/item?id=' + itemId;
      html = fs.readFileSync('data.html', 'utf-8');
      return jsdom.env(html, ['jquery-1.5.min.js'], function(err, win) {
        var $, comments, i;
        $ = win.$;
        comments = [];
        i = 0;
        $('td.default').each(function() {
          var b, comment, n, pos, t, tmp;
          comment = {};
          comment.replies = [];
          pos = parseInt($(this).parent().get(0).childNodes[0].childNodes[0].attributes.getNamedItem('width').nodeValue);
          pos = pos / 40;
          comment.pos = pos;
          b = i + 1;
          $('span.comhead:eq(' + b + ') > a').each(function() {
            var text;
            text = $(this).text();
            if (text.indexOf('link') === -1) {
              return comment.postedBy = text;
            } else {
              return comment.itemId = $(this).attr('href').split('=')[1];
            }
          });
          tmp = $('span.comhead:eq(' + b + ')').text();
          comment.postedAgo = tmp.split(comment.postedBy + ' ')[1].split('ago')[0] + 'ago';
          $('span.comment:eq(' + i + ') > font').each(function() {
            return comment.text = $(this).text();
          });
          t = '_.last(comments)';
          if (pos > 0) {
            for (n = 1; 1 <= pos ? n <= pos : n >= pos; 1 <= pos ? n++ : n--) {
              if (n === pos) {
                t = t + '.replies';
              } else {
                t = '_.last(' + t + '.replies)';
              }
            }
            eval(t + '.push(comment)');
          } else {
            comments[i] = comment;
          }
          return i++;
        });
        return console.log(comments[0].replies[1].replies[1].replies[0]);
      });
    };
    return Hackernews;
  })();
  module.exports = Hackernews;
}).call(this);
