(function(){
	/*
		* General Utilities
	*/
	var Utilities = window.Utilities = function(){}

	/**
	 * Overwrites base's values with _new's and adds _new's if non existent in base
	 * @param base<Object>
	 * @param _new<Object>
	 * @returns result<Object> a new object based on base and _new
	 */
	Utilities.prototype.mergeObject = function (base, _new)
	{
	    var result = {};
	    for (var attrname in base) { result[attrname] = base[attrname]; }
	    for (var attrname in _new) { result[attrname] = _new[attrname]; }
	    return result;
	}
})()
