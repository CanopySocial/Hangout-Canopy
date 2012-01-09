(function(){
	var NotificationController = window.NotificationController = function()
	{
		this.background = chrome.extension.getBackgroundPage().getController();
		
		/*
			* Set up variables
		*/
		this.hangout = null;
		this.client = null;

		/*
			* Validate the notification can be shown
		*/
		this.setup();

		/*
			* bind Onload
		*/
		window.onload = this.onLoad.bind(this);
	}

	NotificationController.prototype.setup = function()
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

		/*
			* CID = Client ID
			* HID = Hangout ID
		*/

		if(!urlParams.cid || !urlParams.hid)
		{
			window.close();
		}

		/*
			* Validate the hangout exists and the client does as well
		*/
		var hangout = this.background.manager.getHangout(urlParams.hid);

		if(!hangout)
		{
			window.close();
		}

		var client = null;

		hangout.clients.forEach(function(value, index){
			if(value.id == urlParams.cid){ client = value; }
		});

		if(!client)
		{
			window.close();
		}

		/*
			* Set the data to the object
		*/
		this.client = client;
		this.hangout = hangout;
	}

	NotificationController.prototype.onLoad = function()
	{
		/*
			* Close the window
		*/
		setTimeout(window.close, 30000);

		/*
			* Generate layout
		*/
		document.getElementById('main_image').src = this.client.photo + '?sz=48';
		document.getElementById('primary_image_link').href = 'https://plus.google.com/' + this.client.id;
		document.getElementById('primary_name').innerHTML = this.client.name;
		document.getElementById('primary_count').innerHTML = (this.hangout.clients.length - 1);
		var list = document.getElementById('notification_list');
		
		for(var i = 0; i < this.hangout.clients.length; i++)
		{
			if(this.hangout.clients[i].id != this.client.id)
			{
				var li = document.createElement("li");
				var a = document.createElement("a");
				var img = document.createElement("img");
				
				/*
				 * Build image and link
				 * */
				img.src = this.hangout.clients[i].photo + '?sz=32';
				a.href = 'https://plus.google.com/' + this.hangout.clients[i].id
				a.title = this.hangout.clients[i].name;
				
				/*
				 * Append img > a > li > dom
				 * */
				 a.appendChild( img );
				 li.appendChild( a );
				 list.appendChild( li );
			}
		}
		
		/*
		 * Add teh join button
		 * */
		var li = document.createElement('li');
		li.id = 'join';
		li.innerHTML = 'Join';
		li.setAttribute('data-link', this.hangout.url);
		li.onclick = function()
		{
			chrome.tabs.create({url : this.getAttribute('data-link')});
			window.close();
		}
		
		list.appendChild( li );
		
		/*
		 * Bind the join button
		 * */
		document.getElementById('join').href = this.hangout.url;	
		
		/*
		 * bind all href's for onclick
		 * */
		var anchors = document.getElementsByTagName("a");
		for (var i=0; i<anchors.length; i++)
		{
			/*
			 * Do they start with http
			 * */
			var href = anchors[i].getAttribute('href');
			
			if(href.substr(0,4) == 'http')
			{
				anchors[i].onclick = function()
				{
					chrome.tabs.create({url : this.getAttribute('href')});
				}
			}
		}
	}
})()
