function Internationalization()
{
	$(document).ready(this.init.bind(this));
}

Internationalization.prototype.init = function()
{
	$('*[data-locale-val]').each(function(){
		$(this).html	( chrome.i18n.getMessage( $(this).data('locale-val') ) )
	});
}
