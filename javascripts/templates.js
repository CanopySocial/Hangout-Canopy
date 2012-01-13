/*
	* templates for Popup
*/

var templates = {
	twitter		: '',
	hangouts	: {},
	streams 	: {}
};

/*
	* Dynamic Hangout Row
*/

templates.hangouts.row = '<article id="${htmlid}" class="hangout {{if public}}public{{else is_stream}}stream{{else}}limited{{/if}}" data-public="{{if public}}true{{else}}false{{/if}}">';
	/*
		* Main image
	*/
	templates.hangouts.row += '<div class="main_image rounded_image">';
		templates.hangouts.row += '<a title="${clients[0].name}" href="https://plus.google.com/${clients[0].id}" ><img alt="" width="48" height="48" src="${clients[0].photo}?sz=48" /></a>';
	templates.hangouts.row += '</div>';

	/*
		* Right content area
	*/
	templates.hangouts.row += '<div class="info">';
	
		/*
			* Client Images
		*/
		templates.hangouts.row += '<div class="clients">';
			/*
				* Text Logic
			*/
			templates.hangouts.row += '<p>';
				/*{{if extra}}<br />Title: <font style="font-weight:bold;">${title}</strong>{{/if}}*/
				templates.hangouts.row += '{{if extra}}<strong>${title}</strong>{{else}}';
						templates.hangouts.row += '<strong>${clients[0].name}</strong> is hanging out with ';
					templates.hangouts.row += '{{if clients.length == 1}} no one {{else}}${clients.length - 1} people{{/if}}';
				templates.hangouts.row += '{{/if}}';				
			templates.hangouts.row += '</p>';
			templates.hangouts.row +='<br class="clear" />';		
			templates.hangouts.row += '{{each(i,v) clients}}';
				templates.hangouts.row +='{{if i!=0 }}';
					templates.hangouts.row +='{{if i<10 }}';
				templates.hangouts.row += '<a title="${v.name}" href="https://plus.google.com/${v.id}"><img width="32" height="32" src="${v.photo}?sz=32" /></a>';
					templates.hangouts.row +='{{/if}}';
				templates.hangouts.row +='{{/if}}';
			templates.hangouts.row += '{{/each}}';
			templates.hangouts.row += '<a href="#" class="arrow"></a>';
		templates.hangouts.row += '</div>';
		templates.hangouts.row += '<div class="top_nav">';
				templates.hangouts.row += '<span class="public"><a href="${post_url}">{{if is_stream}}<strong style="color:#DF4B38;">ON AIR &#8226;</strong>{{else clients.length > 9}}<span style="color:orange">FULL</span>{{else public}}Public{{else}}Limited{{/if}}</a></span>';
		templates.hangouts.row += '</div>';
	templates.hangouts.row += '</div>';

templates.hangouts.row += '</article>';

/*
	* Single Hangout Preview
*/
templates.hangouts.single = '<div class="slideout_panel">';
	templates.hangouts.single +='<div class="panel_header">';
		templates.hangouts.single += '<a title="Close This Slidepanel"  href="#" class="close">Close</a>';
		templates.hangouts.single += '<a title="Link to the post" href="${post_url}" class="post">Post</a>';
		templates.hangouts.single += '<a title="Embed This Hangout" href="#" class="join button embed">Embed</a>';
		templates.hangouts.single += '<a title="Join This Hangout" href="${url}" class="join button">Join</a>';
		templates.hangouts.single += '{{if is_stream}}<a title="Watch This Hangout" href="${post_url}" class="join button">Watch</a>{{/if}}';
	templates.hangouts.single +='</div>';
	templates.hangouts.single += '<div class="panel_users">';
		templates.hangouts.single += '<ul>';
			templates.hangouts.single += '{{each(i,v) clients}}';
				templates.hangouts.single += '<li>';
					templates.hangouts.single += '<a href="https://plus.google.com/${v.id}"><img src="${v.photo}?sz=32" width="32" height="32" /></a>';
					templates.hangouts.single += '<span><a href="https://plus.google.com/${v.id}" title="${v.name}">${v.name}</span>';
					templates.hangouts.single += '<a href="https://plus.google.com/${v.id}" title="Profile" class="join profile button">Profile</a>';
					templates.hangouts.single += '<br class="clear" />';
				templates.hangouts.single += '</li>';
			templates.hangouts.single += '{{/each}}';
		templates.hangouts.single += '</ul>';
templates.hangouts.single += '</div>';

/*
 * Stream Row
*/
templates.streams.row = '<article id="${htmlid}" class="stream">';
	/*
		* Main image
	*/
	templates.streams.row += '<div class="main_image rounded_image">';
		templates.streams.row += '<a title="${clients[0].name}" href="https://plus.google.com/${clients[0].id}"><img alt="" width="48" height="48" src="${clients[0].photo}?sz=48" /></a>';
	templates.streams.row += '</div>';

	/*
		* Right content area
	*/
	templates.streams.row += '<div class="info">';
	
		/*
			* Client Images
		*/
		templates.streams.row += '<div class="clients">';
			/*
				* Text Logic
			*/
			templates.streams.row += '<p>';
				templates.streams.row += '{{if title}}<strong>${title}</strong>{{else}}<strong>${clients[0].name}</strong> is on air {{else}}  ${clients.length - 1} {{if clients.length == 2}}person{{else}}people{{/if}}{{/if}}';
			templates.streams.row += '</p>';
			templates.streams.row +='<br class="clear" />';
			templates.streams.row += '{{each(i,v) clients}}';
				templates.streams.row +='{{if i!=0 }}';
					templates.streams.row +='{{if i<10 }}';
				templates.streams.row += '<a title="${v.name}" href="https://plus.google.com/${v.id}"><img width="32" height="32" src="${v.photo}?sz=32" /></a>';
					templates.streams.row +='{{/if}}';
				templates.streams.row +='{{/if}}';
			templates.streams.row += '{{/each}}';
			templates.streams.row += '<a href="#" class="arrow"></a>';
		templates.streams.row += '</div>';
		templates.streams.row += '<div class="top_nav">';
		templates.streams.row += '<span class="public"><a href="${post_url}">Stream</a></span>';
		templates.streams.row += '</div>';
	templates.streams.row += '</div>';
templates.streams.row += '</article>';

/*
	* Plus Stream Feed
*/
templates.plusstream ='<div class="section_header plusstream_header">';
	templates.plusstream +='<h2>Google+ Page<a href="https://plus.google.com/115063434129506153403"><img src="/images/gplus.png" /></a></h2>';
	templates.plusstream += '</div>';
templates.plusstream += '<div class="plusstream_feed section_content">';
	templates.plusstream += '<ul class="plusstreams">';
		templates.plusstream += '{{each(index, item) items}}';
			templates.plusstream += '<li id="stream_${item.id}">';
				templates.plusstream += '<img src="${item.actor.image.url}" />';
				templates.plusstream +='<p>{{html item.object.content}}';
					//Loop Attachments
					templates.plusstream += '{{each(index, attachment) item.object.attachments}}';
						//Do something with attachments maybe.
					templates.plusstream += '{{/each}}';
				templates.plusstream += '</p>';
				templates.plusstream +='<br class="clear" />';
			templates.plusstream += '</li>';
		templates.plusstream += '{{/each}}';
	templates.plusstream += '<ul>';
templates.plusstream += '</div>';



/*
  * Watching Feed   
*/
templates.watching = '<li id="watching-${id}">';
	templates.watching += '<a href="https://plus.google.com/${id}" class="watch_thumbs"><img src="${image.url}?sz=32" alt=""></a>';
	templates.watching += '<a href="https://plus.google.com/${id}" class="watch_name">${displayName}</a>';
	templates.watching += '<a href="#" class="watch_remove_btn join button">Remove</a>';
	templates.watching += '<br class="clear">';
templates.watching += '</li>';
