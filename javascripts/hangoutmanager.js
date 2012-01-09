(function(){
    /*
     * Manages hangouts, internal and external, monitoring and the detection
     */
    var HangoutManager = window.HangoutManager = function()
    {
        /*
         * Required libraries required to function
         */
        this.ajax       = new window.Ajax();
        this.parser     = new window.HangoutParser();
        this.storage	= new window.Storage();
        this.logger     = new window.Logger();
        this.watching   = new window.WatchingManager();
        
        /*
         * Setup local variables
         */
        this.internal	= new Array();
		this.external	= new Array();
		this.streams 	= new Array();
        this.active		= false;
        
        /*
         * Settings for the object
         */
        this.detectionTimeout    		= this.storage.get('detection_timeout', 60000 * 5);
		this.detectionStreamTimeout    	= this.storage.get('detection_timeout-stream', 60000 * 5); //5 Min
        this.monitorTimeout      		= this.storage.get('monitor_timeout', 30000);
    }

	/*
	 * HangoutManager Redisign
	 * Methods Required for paretn calls:
	 * - getHangouts:	called by popup controller
	 * - start:			called by background
	 * - getHangouts
	 * - getHangouts
	 * - getHangouts
	 */

	/*
	 * @getHangouts
	 * Returns Array <Hangout>
	*/
    HangoutManager.prototype.getHangouts = function()
    {
        var hangouts = this.internal.concat( this.external );

		/*
		 * Sort them client length
		*/
		hangouts.sort(function(a, b){
	
			/*
			 * Place Live hangouts at the top
			*/
			if(a.is_stream || b.is_stream)
			{
				return (!a.is_stream && b.is_stream) ? -1 : (a.is_stream && !b.is_stream) ? 1 : 0;
			}

			return (a.clients.length < b.clients.length) ? -1 : (a.clients.length > b.clients.length) ? 1 : 0;
		});

		return hangouts;
    }

	/*
	 * @start
	 * Returns null
	 * Starts the monitoring and detecting of hangouts
	*/
	HangoutManager.prototype.start = function()
	{
		
		this.logger.notice("Activating Detection and Monitoring loops");

		setInterval(this.monitor.bind(this), this.monitorTimeout);
		setInterval(this.detection.bind(this), this.detectionTimeout);
		setInterval(this.detectionStream.bind(this), this.detectionStreamTimeout);

		/*
		 * Fire the detection off straigt away
		*/
		this.detectionStream();
	}

	/*
	 * @getLocalUpdateCandidate
	 * Returns Array <Hangout>
	*/
    HangoutManager.prototype.getLocalUpdateCandidate = function()
    {
		/*
		 * Reverse the KEYS so we do not effect the array in memory
		*/
		var keys = Object.keys(this.internal).reverse();

		for(var i = 0; i < keys.length; i++)
		{
			var key = keys[ i ];

			return this.internal[ key ];
		}

		return false;
    }

	/*
	 * @monitor
	 * Returns Null
	 * Used as a loop to monitor the local hangouts in the stack that are not public
	*/
    HangoutManager.prototype.monitor = function()
    {
		/*
		 * Get a local hangout canditate for updating
		*/
		var hangout = this.getLocalUpdateCandidate();

		/*
		 * Make sure we have a hangout to work with
		*/
		if(false === hangout)
		{
			return;
		}

		/*
		 * Fetch the post
		*/
		this.ajax.get(hangout.post_url, (function(Request){

			this.logger.notice("Response for: (" + hangout.id + ") was (" + Request.status + ")");

			/*
			 * if the response code was != 200, assume it's closed
			*/
			if(Request.status != 200)
			{
				this.removeInternalHangout(hangout.id);
				return;
			}

			/*
			 * Parse the hangout into an object
			*/
            var newHangout;
            if((newHangout = this.parser.parseSingleHangout(Request.responseText)))
			{
                /*
                 * if the hangout is closed, remove it from the stack
                 */
                if(newHangout.type == 'closed')
                {
                    this.removeInternalHangout(newHangout.id);
                }
                
                /*
                 * if the hangout is open, send it to the addInternalHangout method
                 */
                if(newHangout.type == 'open')
                {
                    this.addInternalHangout(newHangout);
                }
			}

		}).bind(this) );
    }

	/*
	 * @detection
	 * Returns Null
	 * Used as a loop to monitor the stream for hangouts
	*/
    HangoutManager.prototype.detection = function()
    {
		this.ajax.get('https://plus.google.com/', (function(Request){

			/*
			 * If the request != 200, ignore the request
			*/
			if(Request.status != 200)
			{
				return;
			}

            /*
             * Parse the stream for hangouts, and return an arary
            */
            var hangouts;
            if((hangouts = this.parser.parseHangouts(Request.responseText)))
			{
				/*
				 * makre sure we have some hangouts to work with
				*/
				if(hangouts.length == 0)
				{
					return;
				}

				for(var i = 0; i < hangouts.length; i++)
				{
					console.log("Got Hangout of type: " + hangouts[i].type);
                    /*
                     * if the hangout is open, send it to the addInternalHangout method
                     */
                    if(hangouts[i].type == 'open')
                    {
						if(hangouts[i].is_stream)
						{
							console.log("Hangout is being streamed");
						}

                        this.addInternalHangout(hangouts[i]);
                    }
                    
                    /*
                     * if the hangout is closed, remove it from the stack
                     */
                    if(hangouts[i].type == 'closed')
                    {
                        this.removeInternalHangout(hangouts[i]);
                    }

					/*
					 * handle streams a little stream
					*/	

					if(hangouts[i].type == 'stream')
					{
						console.log("Detected Stream: " + hangouts[i].id);
						getController().sendStream(hangouts[i]);
					}
				}
			}

		}).bind(this) );
    }

	/*
	 * @detection
	 * Returns Null
	 * Used as a loop to monitor the stream for hangouts
	*/
    HangoutManager.prototype.detectionStream = function()
    {
		this.ajax.get('https://plus.google.com/s/hanging%7Changout/hangouts?r=' + (new Date().getTime()), (function(Request){

			/*
			 * If the request != 200, ignore the request
			*/
			if(Request.status != 200)
			{
				return;
			}

            /*
             * Parse the stream for hangouts, and return an arary
            */
            var hangouts;
            if((hangouts = this.parser.parseHangouts(Request.responseText, true)))
			{
				/*
				 * makre sure we have some hangouts to work with
				*/
				if(hangouts.length == 0)
				{
					return;
				}

				for(var i = 0; i < hangouts.length; i++)
				{
	                /*
	                 * if the hangout is open, send it to the addInternalHangout method
	                 */
	                if(hangouts[i].type == 'open')
	                {
	                    this.addInternalHangout(hangouts[i]);
						continue;
	                }
	                
	                /*
	                 * if the hangout is closed, remove it from the stack
	                 */
	                if(hangouts[i].type == 'closed')
	                {
	                    this.removeInternalHangout(hangouts[i]);
						continue;
	                }

					/*
					 * handle streams a little stream
					*/
					if(hangouts[i].type == 'stream')
					{
						getController().sendStream(hangouts[i]);
					}
				}
			}

		}).bind(this) );
    }

	/*
	 * @hangoutExists
	 * Returns Bool
	 * Checks if a hangout exists
	*/
	HangoutManager.prototype.hangoutExists = function(id)
	{
		return this.getHangout(id) !== false;
	}

	/*
	 * @getHangoutInformation
	 * Returns Null
	 * Fetches single hangout information and calls the 2nd param callback
	*/
    HangoutManager.prototype.getHangoutInformation = function(hangout, callback)
	{
		console.log(hangout);
		this.ajax.get(hangout.post_url, (function(Request){
            /*
             * validate we get a 200 OK from Google.
             */
            if(Request.status != 200)
            {
				callback({status: 'closed', hangout : hangout});
                return;
            }

            /*
             * Parse the hangout page to get the meta data.
             */
            var newHangout;
            if((newHangout = this.parser.parseSingleHangout(Request.responseText)))
            {
                /*
                 * if the hangout is closed, remove it from the stack
                 */
                if(newHangout.type == 'closed')
                {
                    callback({status: 'closed', hangout : hangout});
                }
                
                /*
                 * if the hangout is open, send it to the addInternalHangout method
                 */
                if(newHangout.type == 'open')
                {
                    callback({status: 'open', hangout : newHangout});
                }
            }

		}).bind(this));
	}

    HangoutManager.prototype.getStreamInformation = function(stream, callback)
	{
		this.ajax.get(stream.post_url, (function(Request){
            /*
             * validate we get a 200 OK from Google.
             */
            if(Request.status != 200)
            {
				callback({status: 'closed', id : stream.id});
                return;
            }

            /*
             * Parse the hangout page to get the meta data.
             */
            var newStream;
            if((newStream = this.parser.parseSingleHangout(Request.responseText)))
            {
                /*
                 * if the hangout is closed, remove it from the stack
                 */
                if(newStream.type == 'closed')
                {
                    callback({status: 'closed', id : newStream.id});
                }
                
                /*
                 * if the hangout is open, send it to the addInternalHangout method
                 */
                if(newStream.type == 'stream')
                {
                    callback({status: 'open', stream : newStream});
                }
            }

		}).bind(this));
	}

	/*
	 * External Methods, Used to add data for external hangouts
	*/

	/*
	 * @removeExternalHangout
	 * Returns null
	 * Removes a hangout from the stack as long as it's public and 
	*/
    HangoutManager.prototype.removeExternalHangout = function(id)
    {
		for(var pointer = 0; pointer < this.external.length; pointer++)
		{
			if(this.external[pointer].id == id)
			{
				this.external.splice(pointer, 1);
			}
		}
    }

	/*
	 * @addExternalHangout
	 * Returns null
	 * Adds a hangout to the external stack
	*/
    HangoutManager.prototype.addExternalHangout = function(hangout)
    {
        
        /*
         * Let the Watching Manager know about the hangout
         */
        this.watching.onHangout(hangout);

		/*
		 * Force the hangout to be public.
		 */
		hangout.public = true;
        
        /*
         * Check to see if the hangout already exists, if so remove it
         */
		for(var pointer = 0; pointer < this.external.length; pointer++)
		{
			if(this.external[pointer].id == hangout.id)
			{
				this.external.splice(pointer, 1);
			}
		}
        
        /*
         * Add the hangout to the top of the stack
         */
        this.external.unshift(hangout);

		/*
		 * it it exists insdie the internal, remove it
		*/
		for(var pointer_i = 0; pointer_i < this.internal.length; pointer_i++)
		{
			if(this.internal[pointer_i].id == hangout.id)
			{
				this.internal.splice(pointer_i, 1);
			}
		}
    }

	/*
	 * Internal Methods, Used to add data for internal hangouts
	*/

	/*
	 * @removeInternalHangout
	 * returns null
	 * Removes a hangout from the internal stack that matches the ID
	*/
    HangoutManager.prototype.removeInternalHangout = function(id)
    {
        if(!id)
        {
            throw "removeInternalHangout: No id passed or invalid";
        }
        
        /*
         * Loop the hangouts to find what index contains the id
         */
        for(var pointer = 0; pointer < this.internal.length; pointer++)
        {
            if(this.internal[pointer].id == id)
            {
                this.internal.splice(pointer, 1);
                return;
            }
        }
    }

	/*
	 * @addInternalHangout
	 * returns null
	 * If the hangout is a limited hangout, it will get added to the internal stack, otherwise sent of to the server to handle
	*/
    HangoutManager.prototype.addInternalHangout = function(hangout)
    {
		/*
		 * First we need to remove it from the internal stack
		*/
		var oldHangout = false;
		for(var pointer = 0; pointer < this.internal.length; pointer++)
		{
			if(this.internal[pointer].id == hangout.id)
			{
				oldHangout = this.internal.splice(pointer, 1);
			}
		}

		/*
		 * See if it's a public hangout, if so we send it of to the server and do no more
		*/
		if(hangout.public == true)
		{
			/*
			 * See if it already exists in the external stack, if so, do not stress the server
			*/
			for(var pointer_e = 0; pointer_e < this.external.length; pointer_e++)
			{
				if(this.external[pointer_e].id == hangout.id)
				{
					return;
				}
			}

			/*
			 * Let the server know about the hangout
			*/
			getController().sendHangout(hangout);

			/*
			 * track the public hangout
			*/
			_gaq.push(['_trackEvent',  "hangouts", 'public', hangout.id]);
			return;
		}

		/*
		 *Tracking limited hangouts ID's Only, this has been varified and passed by Google
		*/
		_gaq.push(['_trackEvent',  "hangouts", 'limited', hangout.id]);

		/*
		 * The hangout must not be public, therefor we let the Watching Manager know about the hangout
		*/
        this.watching.onHangout(hangout);

		/*
		 * Add the hangout to the internal stack
		*/
		this.internal.unshift(hangout);
    }

	/*
	 * @getHangout
	 * returns object / false
	 * Checks both internal and external for a hangout and returns it if it exists
	*/
    HangoutManager.prototype.getHangout = function(id)
    {
		/*
		 * Check the external hangouts
		*/
		for(var pointer_e = 0; pointer_e < this.external.length; pointer_e++)
		{
			if(this.external[pointer_e].id == id)
			{
				return this.external[pointer_e];
			}
		}

		/*
		 * Check the internal hangouts
		*/
		for(var pointer_i = 0; pointer_i < this.internal.length; pointer_i++)
		{
			if(this.internal[pointer_i].id == id)
			{
				return this.internal[pointer_i];
			}
		}

		return false;
    }

	/*
	 * @getTotalhangouts
	 * returns int
	 * Returns the total of hangouts combining internal + external
	*/
	HangoutManager.prototype.getTotalhangouts = function()
	{
		return this.internal.length + this.external.length;
	}

	/*
	 * Stream Specificss
	*/
	HangoutManager.prototype.getTotalStreams = function()
	{
		return this.streams.length;
	}

	HangoutManager.prototype.getStreams = function()
	{
		return this.streams;
	}

	HangoutManager.prototype.addStream = function(stream)
	{
		var isUpdate = this.removeStream(stream.id);		
		this.streams.unshift(stream);
	}

	HangoutManager.prototype.removeStream = function(id)
	{
		for(var i = 0; i < this.streams.length; i++)
		{
			if(this.streams[i].id == id)
			{
				this.streams.splice(i, 1);
				return true;
			}
		}

		return false;
	}	
})();
