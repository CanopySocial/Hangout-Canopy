(function(){
	var Settings = window.Settings = function()
	{
		this.settings = {};
	}
	
	Settings.prototype.init = function(object)
	{
		this.settings = object;
	}
	
	Settings.prototype.get = function(key)
	{
		if(key in this.settings)
		{
			return this.settings[key];
		}
		
		return null;
	}
})()
