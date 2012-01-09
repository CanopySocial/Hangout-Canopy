(function(){
	var Notifications = window.Notifications = function()
	{
	}

	Notifications.prototype.displayMessage = function(message)
	{
	}

	Notifications.prototype.displayNotice = function(message)
	{
	}

	Notifications.prototype.displayError = function(message)
	{
	}

	Notifications.prototype.triggerWatchedHangoutNotification = function(hangoutId, clientId)
	{
		/*
			* Check to see if the notification has been shown
		*/

		/*
			* Generate the notification
		*/
		var n = webkitNotifications.createHTMLNotification("/html/watched_alert.html?hid=" + encodeURI(hangoutId) + "&cid=" + encodeURI(clientId));

		/*
			* Display and bind required events
		*/
		n.show();
	}

	Notifications.prototype.__generateNotification = function(options)
	{
	}
})()
