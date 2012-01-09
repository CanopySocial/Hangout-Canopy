(function(){
	var Storage = window.Storage = function()
	{
		this.storage = window.localStorage;
	}

	Storage.prototype.set = function(key, value)
	{
		try
		{
			value = JSON.stringify(value);
		}catch(e){}

		this.storage.setItem(key, value);
	}

	Storage.prototype.get = function(key, _default)
	{
		var item = this.storage.getItem(key);
		try
		{
			item = JSON.parse(item);
		}catch(e){}

		return item ? item : _default;
	}

	Storage.prototype.remove = function(key)
	{
		this.storage.removeItem(key);
	}
})()
