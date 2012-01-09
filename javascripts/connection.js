(function(){
	/*
		* Hangout Canopy V2
		* http://hangoutcanopy.com
	*/

	var Connection = window.Connection = function()
	{
		this.io;
		this.socket;
		this.protocol	= 'ws';
		this.domain		= 'server1.hangoutcanopy.com';
		this.port		= 2006;
		this.options	= {
			'max reconnection attempts'	: 10,
			'reconnection delay'		: 2000
		}
		this.serverdown = false;

		/*
			* Validate IO Has Loaded
		*/
		if(typeof io != 'object')
		{
			this.serverdown = true;
			return;
		}

		/*
			* Setuo IO
		*/
		this.io = io;
	}

	Connection.prototype.connect = function()
	{
		if(this.serverdown)
		{
			return false;
		}

		this.socket = this.io.connect(this.protocol + '://' + this.domain + ':' + this.port, this.options);
	}

	Connection.prototype.isConnected = function()
	{
		return this.socket.socket.connected;
	}

	Connection.prototype.isReconnecting = function()
	{
		return this.socket.socket.reconnecting;
	}

	Connection.prototype.bindEventListener = function(namespace, callback)
	{
		this.socket.on(namespace, callback);
	}

	Connection.prototype.send = function(namespace, data)
	{
		this.socket.emit(namespace, data);
	}
})()
