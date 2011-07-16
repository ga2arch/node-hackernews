events = require 'events'
jsdom = require 'jsdom'

class Hackernews extends events.EventEmitter
	constructor: ->
		@base = 'http://news.ycombinator.com'
		@news = @base+'/news'
		@newest = @base+'/newest'
		@ask = @base+'/ask'
		
	scrape: (url, callback) ->
		self = @
		jsdom.env url, [ 'http://code.jquery.com/jquery-1.5.min.js' ], (err, win) ->
			$ = win.$
			docs = []
			i = 0
			$('td.title:not(:last) > a').each ->
				title = $(@).text()
				url = $(@).attr 'href'
				docs[i] = { title: title, url: url, info: {} }
				$('td.subtext:eq('+i+') > *').each ->
					raw = $(@).text()
					data = raw.split(' ')[0]
					if raw.indexOf('points') isnt -1	
						docs[i].info.points = data
					else if raw.indexOf('comments') isnt -1
						docs[i].itemId = $(@).attr('href').split('=')[1]
						docs[i].info.comments = data
					else 
						docs[i].info.postedBy = data
					self.emit 'doc', docs[i]
				i++
			if callback?
				callback docs
				
module.exports = Hn