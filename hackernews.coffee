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
					else if raw.indexOf('discuss') is -1
						docs[i].info.postedBy = data
						
				tmp = $('td.subtext:eq('+i+')').text()
				console.log docs[i].info.postedBy
				docs[i].info.postedAgo = tmp.split(docs[i].info.postedBy+' ')[1].split('ago')[0]+'ago'
				self.emit 'doc', docs[i]
				i++
				
			if callback?
				callback docs
		
	scrapeItem: (itemId) ->
		self = @
		url = @base+'/item?id='+itemId
		jsdom.env url, [ 'http://code.jquery.com/jquery-1.5.min.js' ], (err, win) ->
			$ = win.$
			$('td + table > ')
				
module.exports = Hackernews