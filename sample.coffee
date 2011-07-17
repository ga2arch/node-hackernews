Hackernews = require './hackernews'

hn = new Hackernews()
hn.scrapeItem '2772387'

hn.on 'comment', (data) ->
	console.log data
