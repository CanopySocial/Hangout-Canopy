(function(){
	var Ajax = window.Ajax = function()
	{
		this.ajaxObject = XMLHttpRequest;
	}

	Ajax.prototype.get = function(location, callback)
	{
		var Request = new this.ajaxObject();

		Request.open("GET", location, true);

		Request.onreadystatechange = function()
		{
			if(Request.readyState == 4)
			{
				callback(Request);
			}
		}

		Request.send(null);
	}
})()
