(function(){
	/*
		* Watching Manager
	*/
	var WatchingManager = window.WatchingManager = function()
	{
		this.notifications	= new window.Notifications();
		this.storage	  	= new window.Storage();
		this.clients 		= this.storage.get('watching', {});
		this.hangoutMap = {};
	}

	WatchingManager.prototype.onHangout = function(hangout)
	{
		hangout.clients.forEach((function(value, i){

			if(value.id in this.clients)
			{
				if(!(value.id in this.hangoutMap) || this.hangoutMap[value.id] != hangout.id)
				{
					this.notifications.triggerWatchedHangoutNotification(hangout.id, value.id);
					this.hangoutMap[value.id] = hangout.id;
				}
			}

		}).bind(this));
	}
	
	WatchingManager.prototype.getWatched = function()
	{
		return this.clients;
	}
	
	WatchingManager.prototype.isWatched = function(id)
	{
		return (id in this.clients);
	}

	WatchingManager.prototype.watchClient = function(id)
	{
		this.clients[id] = true;

		//udpate Storage
		this.storage.set('watching', this.clients);
	}

	WatchingManager.prototype.unwatchClient = function(id)
	{
		if((id in this.clients))
		{
			delete this.clients[id];

			//udpate Storage
			this.storage.set('watching', this.clients);
		}
	}
})()
