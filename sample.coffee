Hackernews = require './hackernews'

hn = new Hackernews()
hn.scrape hn.news, (docs) ->
	hn.scrapeItem docs[1].itemId
