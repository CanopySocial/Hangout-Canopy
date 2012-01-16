(function(){
	var StreamController = window.StreamController = function()
	{
		this.background = chrome.extension.getBackgroundPage().getController();
		
		/*
			* Set up variables
		*/
		this.stream = null;

		/*
			* Validate the notification can be shown
		*/
		this.setup();

		/*
			* bind Onload
		*/
		window.onload = this.onLoad.bind(this);
	}

	StreamController.prototype.setup = function()
	{
		var urlParams = {};
		(function () {
		    var e,
			a = /\+/g,  // Regex for replacing addition symbol with a space
			r = /([^&=]+)=?([^&]*)/g,
			d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
			q = window.location.search.substring(1);

		    while (e = r.exec(q))
		       urlParams[d(e[1])] = d(e[2]);
		})();
		if(!urlParams.id){window.close();return;}

		/*
		 * Get the stream from teh background
		*/
		var streams = this.background.manager.getStreams();
		for(var i = 0; i < streams.length; i++)
		{
			if(streams[i].id == urlParams.id)
			{
				this.stream = streams[i];
			}
		}
		if(!this.stream){window.close();return;}
	}

	StreamController.prototype.onLoad = function()
	{
		//this.stream contains all the information for the stream
		console.log(this.stream);
	}
})()
