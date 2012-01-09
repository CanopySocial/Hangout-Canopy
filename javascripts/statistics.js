(function(){
	var Statistics = window.Statistics = function()
	{
		//this.Storage = new window.Storage(); //Overall
		this.stats = {
			hangoutsSent		: 0,
			hangoutsReceived	: 0,
			hangoutsClosed		: 0
		}
	}

	Statistics.prototype.incrHangoutsSent = function()
	{
		this.stats.hangoutsSent++;
	}

	Statistics.prototype.incrHangoutsReceived = function()
	{
		this.stats.hangoutsReceived++;
	}

	Statistics.prototype.incrHangoutsClosed = function()
	{
		this.stats.hangoutsClosed++;
	}
})()
