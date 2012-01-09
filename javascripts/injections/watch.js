(function(){
	var HangoutCanopyWatch = function()
	{
		/*
			* Monitor DOM Changes in the Content Pane
		*/
		document.getElementById('contentPane').addEventListener('DOMSubtreeModified', this.monitorChange.bind(this), false);
	}

	HangoutCanopyWatch.prototype.monitorChange = function(event)
	{
		if(document.getElementById('WatchProfileHangoutCanopy'))
		{
			return;
		}

		var entities = document.querySelectorAll('div[role="button"]');

		for(var i = 0; i < entities.length; i++)
		{
			if(entities[i].getAttribute('class') == 'a-l-k e-b n-Za-La-b-i n-Za-La-b e-b-na')
			{	
				var Watch = entities[i].cloneNode(false);
				Watch.setAttribute('id', 'WatchProfileHangoutCanopy');
				Watch.setAttribute('style','padding-right:5px;');
				Watch.setAttribute('class','a-l-k e-b e-b-G c-i-Ra-Hm aL nD e-b-bb');
				Watch.innerText = 'Watch';

				entities[i].parentElement.insertBefore(Watch, entities[i]);
			}
		}
	}

	new HangoutCanopyWatch();
})()
