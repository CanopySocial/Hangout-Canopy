(function(){
	var HangoutParser = window.HangoutParser = function()
	{
	}

	HangoutParser.prototype.parseSingleHangout = function(response)
	{
		try
		{
			var initData = this.compileOZData(response);
			var post = initData[20];//20 = single post

			if(!post)
			{
				return false;
			}

			if(!this.isHangoutPost(post))
			{
				return false;
			}

			if(this.isHangoutClosed(post))
			{
				var obj = {type:'closed',id: post[82][2][1][0][0]};
				
				if((post[32] == "1" ? true : false) && post[82][2][1][0][6] == 2 && post[82][2][1][0][0] == "")
				{
					obj.id = this.getParsedQueryParams(post[82][2][1][0][13][2]).id;
				}

				return obj;
			}
			else
			{
				var data = {
					id 	: post[82][2][1][0][0],
					type	: 'open',
					time	: post[5],
					url	: post[82][2][1][0][1],
					clients	: this.normalizeClients(post[82][2][1][0][3]),
					is_stream : (post[82][2][1][0][6] == 2),
					public	: post[32] == "1" ? true : false,
					post_url: 'https://plus.google.com/' + post[21]
				}

				/*
				 * hangouts that are public and have hangout type id == 2 are public stream posts
				 * If there is no id and it's public, thats how we determain that it's a stream hangout
				*/
				if(data.public && post[82][2][1][0][6] == 2 && data.id == "")
				{
					/*
						* Get extra information regarding the stream object
					*/
					data.type = "stream";
					data.id = this.getParsedQueryParams(post[82][2][1][0][13][2]).id;
					data.flv_url = post[82][2][1][0][13][2];
					data.stream_url = 'https://video.google.com/get_player?ps=google-live&flvurl=' + encodeURIComponent(post[82][2][1][0][13][2]) + '&autoplay=1&autohide=1&border=0&wmode=opaque';
					data.stream_title = post[82][2][1][0][13][1];

					/*
					 * Get the hangoutID from parsing the URL
					*/
				}

				data.clients.push(this.collectOwnerInfo(post))
				
				return data;
			}
		}
		catch(e)
		{
			return false;
		}
	}

	HangoutParser.prototype.getParsedQueryParams = function(url)
	{
		var params = {};
		try
		{
			url.split("?")[1].split("&").forEach(function(value){
				var x = value.split("=");
				params[x[0]] = x[1];
			});
		}catch(e){}

		return params;
	}

	HangoutParser.prototype.parseHangouts = function(response, isSearch)
	{
		try
		{
			var initData = this.compileOZData(response);
			var postsets = isSearch ? initData[39][1][0][0] : initData[4][0];

			if(!postsets)
			{
				return [];
			}

			var hangouts = [];

			for(var p = 0; p < postsets.length; p++)
			{
				var post = postsets[p];

				if(!this.isHangoutPost(post))
				{
					continue;
				}

				if(this.isHangoutClosed(post))
				{
					hangouts.push({
						type:	'closed',
						id:	post[82][2][1][0][0]
					});
				}
				else
				{
					var data = {
						id 	: post[82][2][1][0][0],
						type	: 'open',
						time	: post[5],
						url	: post[82][2][1][0][1],
						clients	: this.normalizeClients(post[82][2][1][0][3]),
						is_stream : (post[82][2][1][0][6] == 2),
						public	: post[32] == "1" ? true : false,
						post_url: 'https://plus.google.com/' + post[21]
					}

					/*
					 * hangouts that are public and have hangout type id == 2 are public stream posts
					 * If there is no id and it's public, thats how we determain that it's a stream hangout
					*/
					if(data.public && post[82][2][1][0][6] == 2 && data.id == "")
					{
						/*
							* Get extra information regarding the stream object
						*/
						data.type = "stream";
						data.id = this.getParsedQueryParams(post[82][2][1][0][13][2]).id;
						data.flv_url = post[82][2][1][0][13][2];
						data.stream_url = 'https://video.google.com/get_player?ps=google-live&flvurl=' + encodeURIComponent(post[82][2][1][0][13][2]) + '&autoplay=1&autohide=1&border=0&wmode=opaque';
						data.stream_title = post[82][2][1][0][13][1];
					}

					data.clients.push(this.collectOwnerInfo(post));
					hangouts.push(data);
				}
			}

			return hangouts;
		}
		catch(e)
		{
			return [];
		}
	}

	HangoutParser.prototype.compileOZData = function(response)
	{
		var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
		var matches = [];
		var match;
		var AF_initDataQueue = [];

		/*
		 * Check here is a small protection method to prevent data leaking from where it should not be.
		*/
		var regex = /\<a.*?id\=\"gbg6\".*\>\<span.*?>.*?@google.com\<\/span\>\<\/a>/i
		if(regex.test(response))
		{
			throw "Unable to parse data, incorrect context";
		}

		/*
			* Take out all the script tags
		*/
		while (match = re.exec(response))
		{
			if(match[1] && match[1].indexOf('AF_initDataQueue') > -1)
			{
				eval(match[1]);
			}
		}

		/*
			* Thank you Google :)
		*/
		return function()
		{
			var initDataMap = {};
			for (var i = 0; i < AF_initDataQueue.length; i++)
			{
				var dataPair = AF_initDataQueue[i];
				if (dataPair.key != '-1')
				{
					initDataMap[dataPair.key] = dataPair.data;
				}
			}
			return initDataMap;
		}();
	}

	HangoutParser.prototype.isHangoutClosed = function(post)
	{
		//When the hangout url is empty, the hangout is no more
		return post[82][2][1][0][1] == "" ? true : false;
	}
	
	HangoutParser.prototype.isHangoutPost = function(post)
	{
		return post[2].toLowerCase() == 'hangout';
	}

	HangoutParser.prototype.collectOwnerInfo = function(post)
	{
		return {
				name : post[3],
				photo : post[18].indexOf('http') != -1 ? post[18] : 'https:' + post[18], //Some images don't have http(s)
				id : post[16]
		}
	}


	HangoutParser.prototype.normalizeClients = function(clients)
	{
		var c = [];

		for(var i = 0; i < clients.length; i++)
		{
			c.push({
				name : clients[i][0],
				photo : clients[i][1],
				id : clients[i][2]
			});
		}

		return c;
	}
})()
