(function(){
	var Profiles = window.Profiles = function()
	{
		/*
		 * Cache, Ajax, Storage
		 * */
		this.Ajax		= new window.Ajax();
		this.Storage	= new window.Storage();
		this.Cache 		= this.Storage.get('profiles', {});
	}
	
	Profiles.prototype.get = function(userid, callback)
	{
		/*
		 * See if the profile information is in the cache/storage
		 * if not fetch a fresh copy and add to cache
		 * */
		if(userid in this.Cache)
		{
			return callback(null, this.Cache[userid]);
		}
		
		/*
		 * Grab the authorization key for google
		 * */
		var requestKey = 'AIzaSyD9OVT14rdxn1OD2OITu_ygzQ_plai7JUk';
		 
		if(!requestKey)
		{
			return callback(new Error('Unable to get access token'));
		}
		
		/*
		 * Have access token so let's build the url and make the request
		 * */
		var url = 'https://www.googleapis.com/plus/v1/people/' + userid + '?fields=tagline%2CdisplayName%2Cid%2Cimage&pp=1&key=' + requestKey;
		
		this.Ajax.get(url, (function(Request){
			/*
			 * Validate the request was successfull
			 * */
			if(Request.status != 200)
			{
				return callback(new Error('Unable to access profile data'));
			}
			
			/*
			 * Success, Parse the JSON Data
			 * */
			var userData = JSON.parse(Request.responseText);
			
			/*
			 * Store the userData in the cache
			 * */
			this.Cache[userid] = userData;
			this.updateCache();
			
			/*
			 * Send the userData back to the callback
			 * */
			callback(null, userData);
		}).bind(this));
	}
	
	Profiles.prototype.updateCache = function()
	{
		this.Storage.set('profiles', this.Cache);
	}
})()
