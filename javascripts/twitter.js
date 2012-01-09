(function(){
	var TwitterFeed = window.TwitterFeed = function(username)
	{
		this.ajax	= new window.Ajax;

		this.username = username;

		this.updateInterval = (60 * 10); //10m, x1000 in monitor

		this.tweets = [];

		this.monitorTweets();
	}

	TwitterFeed.prototype.getTweets = function()
	{
		return this.tweets;
	}

	TwitterFeed.prototype.monitorTweets = function()
	{
		/*
			* Collect tweets every 20 mins
		*/
		//https://api.twitter.com/1/statuses/user_timeline/hangoutcanopy.json
		this.ajax.get('https://api.twitter.com/1/statuses/user_timeline/hangoutcanopy.json', (function(Request){

			/*
				* Check Request is ok
			*/
			if(Request.status != 200)
			{
				return;
			}


			/*
				* Parse the JSON result
			*/
			try
			{
				this.tweets = JSON.parse(Request.responseText);
			}catch(e)
			{
			}

		}).bind(this))

		/*
			* Timeouts
		*/
		setTimeout(this.monitorTweets.bind(this), this.updateInterval * 1000);
	}
})();
