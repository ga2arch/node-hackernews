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
			comments = []
			i = 0
			$('td.default').each ->
				comments[i] = {}
				comments[i].pos = $(@).parent().get(0).childNodes[0].childNodes[0].attributes.getNamedItem('width').nodeValue
				b = i+1
				$('span.comhead:eq('+b+') > a').each ->
					text = $(@).text()
					if text.indexOf('link') is -1
						comments[i].postedBy = text
					else
						comments[i].itemId = $(@).attr('href').split('=')[1]
				
				tmp = $('span.comhead:eq('+b+')').text()
				comments[i].postedAgo = tmp.split(comments[i].postedBy+' ')[1].split('ago')[0]+'ago'
				
				$('span.comment:eq('+i+') > font').each ->
					comments[i].text = $(@).text()
				i++
			console.log comments
			
module.exports = Hackernews