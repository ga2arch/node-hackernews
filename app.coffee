Hn = require './hn'

hn = new Hackernews()
hn.scrape hn.news, (docs) ->
	console.log docs

hn.on 'doc', (doc) ->
	console.log doc