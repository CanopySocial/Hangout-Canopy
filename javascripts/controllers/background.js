(function(){
	/*
		* Hangout Canopy V2
		* http://hangoutcanopy.com
		* Developers : Robert Pit, Mohammed Eshbeata
	*/

	BackgroundController = window.BackgroundController = function()
	{
		this.logger	= new window.Logger();
		this.connection	= new window.Connection();
		this.storage	= new window.Storage();
		this.manager	= new window.HangoutManager();
		this.settings	= new window.Settings();
		this.plusapi	= new window.GooglePlusAPI('AIzaSyD9OVT14rdxn1OD2OITu_ygzQ_plai7JUk');

		/*
			* Color ENUM
		*/
		this.colorEnum = {
			GREEN 	: [89, 185, 11, 255],
			RED	: [187, 10, 10, 255],
			ORANGE	: [242, 171, 35, 255]
		}

		/*
			* Get settings from storage
		*/
		this.notifications = this.storage.get('notifications', false);


		/*
			* Connect to the server
		*/
		this.connection.connect();
		
		/*
			* Bind Namespaces
		*/
		this.connection.bindEventListener('connect'		, this.onSocketConnected.bind(this));
		this.connection.bindEventListener('disconnect'		, this.onSocketDisconnect.bind(this));
		this.connection.bindEventListener('reconnect'		, this.onSocketReconnect.bind(this));
		this.connection.bindEventListener('reconnect_failed'	, this.onSocketReconnectFailed.bind(this));

		this.connection.bindEventListener('announce'		, this.onHangoutLive.bind(this));
		this.connection.bindEventListener('announce_stream'	, this.onStreamLive.bind(this));
		this.connection.bindEventListener('update'		, this.onHangoutDoUpdate.bind(this));
		this.connection.bindEventListener('update_stream'	, this.onStreamDoUpdate.bind(this));
		this.connection.bindEventListener('closed'		, this.onHangoutClosed.bind(this));
		this.connection.bindEventListener('closed_stream'	, this.onStreamClosed.bind(this));

		/*
			* Set loop for the badge
		*/
		this.displayBadge();
	}

	BackgroundController.prototype.displayBadge = function()
	{
		setTimeout(this.displayBadge.bind(this), 500);

		if(this.connection.isConnected())
		{
			// x/y Next Release
			var text = this.manager.getTotalhangouts().toString() + (this.manager.getTotalStreams() > 0 ? ("/" + this.manager.getTotalStreams()) : "");
			chrome.browserAction.setBadgeText({text : this.manager.getTotalhangouts().toString()});
			chrome.browserAction.setBadgeBackgroundColor({color: this.colorEnum.GREEN});
			chrome.browserAction.setTitle({title: 'You are currently connected to Hangout Canopy'});
			return;
		}else
		{
			if(this.connection.isReconnecting())
			{
				chrome.browserAction.setBadgeText({text : 'R'});
				chrome.browserAction.setBadgeBackgroundColor({color: this.colorEnum.ORANGE});
				chrome.browserAction.setTitle({title: 'We are currently trying to reconnect you to Hangout Canopy'});
				return;
			}

			chrome.browserAction.setBadgeText({text : 'D'});
			chrome.browserAction.setBadgeBackgroundColor({color: this.colorEnum.RED});
			chrome.browserAction.setTitle({title: 'Your are currenty disconnected from Hangout Canopy'});
			return;
		}
	}

	BackgroundController.prototype.getHangoutManager = function()
	{
		return this.manager;
	}

	/*
		* Send hangout to the server
	*/
	BackgroundController.prototype.sendHangout = function(hangout)
	{
		this.logger.notice('Sending new hangout to server: ' + hangout.id);
		this.connection.send('discovery', hangout);
	}

	/*
		* Send stream to the server
	*/
	BackgroundController.prototype.sendStream = function(stream)
	{
		this.logger.notice('Sending new stream to server: ' + stream.id);
		this.connection.send('discovery_stream', stream);
	}

	/*
		* inform server hangout has closed
	*/
	BackgroundController.prototype.sendHangoutClosed = function(hangout)
	{
		this.logger.notice('Informing server of Hangout Closed: ' + hangout.id);
		this.connection.send('closed', hangout.id);
	}

	BackgroundController.prototype.onHangoutDoUpdate = function(hangout)
	{
		this.manager.getHangoutInformation(hangout, (function(data){
			this.connection.send('update', data);
		}).bind(this));
	}

	BackgroundController.prototype.onStreamDoUpdate = function(stream)
	{
		this.logger.notice("Updating stream for SERVER:", stream);

		this.manager.getStreamInformation(stream, (function(data){
			this.connection.send('update_stream', data);
		}).bind(this));
	}

	/*
		* On Connect Event
	*/
	BackgroundController.prototype.onSocketConnected = function()
	{
		this.connection.send('extension_info', chrome.app.getDetails());

		/*
		 * Start the system
		 * */
		this.manager.start();
		this.logger.notice('Connected to server');
		_gaq.push(['_trackEvent', "network", 'connected']);
	}

	/*
		* On Disconnect Event
	*/
	BackgroundController.prototype.onSocketDisconnect = function()
	{
		this.logger.notice('Disconnected from Server');
		chrome.browserAction.setBadgeText({text : 'D'});
		_gaq.push(['_trackEvent', "network", 'disconnected']);
		this.manager.external = [];
		this.manager.internal = [];
	}

	/*
		* On Reconnect Event
	*/
	BackgroundController.prototype.onSocketReconnect = function()
	{
		this.logger.notice('Reconnected to Server');
		_gaq.push(['_trackEvent', "network", 'reconnect']);
		this.manager.external = [];
		this.manager.streams = [];
	}

	/*
		* On Reconnect Failure Event
	*/
	BackgroundController.prototype.onSocketReconnectFailed = function()
	{
		this.logger.notice('Reconnect Attempt Failed');
		_gaq.push(['_trackEvent', "network", 'reconnected_failed']);
	}

	/*
		* On New Hangout Event
	*/
	BackgroundController.prototype.onHangoutLive = function(hangout)
	{
		this.logger.notice('Got Hangout from Server: ' + hangout.id);
		this.manager.addExternalHangout(hangout);
	}

	/*
		* On New Stream Event
	*/
	BackgroundController.prototype.onStreamLive = function(stream)
	{
		this.logger.notice("Got stream from server:" + stream.id);
		this.manager.addStream(stream);
	}

	/*
		* On Hangout Closed
	*/
	BackgroundController.prototype.onHangoutClosed = function(id)
	{
		this.logger.notice('Got Hangout closed from Server: ' + id);
		this.manager.removeExternalHangout(id);
	}

	BackgroundController.prototype.onStreamClosed = function(id)
	{
		this.manager.removeStream(id);
	}
})()
