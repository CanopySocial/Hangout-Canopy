/*
 * Tab Manager
*/
$(document).ready(function(){
	var last_selected = 'none';

	// When a link is clicked
	$("#menu li a").click(function(){
	
		// slide this content up
		var content_show = $(this).parent().attr("id");

		if(content_show == last_selected)
		{
			return;
		}

		last_selected = content_show;

		// switch all tabs off
		$("#menu li").removeClass("selected");
	
		// switch this tab on
		$(this).parent().addClass("selected");
	
		// slide all content up
		$(".tab_area").hide();

		$('#tab_' + content_show).fadeIn();

		if($('.slideout_panel').size() != 0)
		{
			$('.slideout_panel').animate({left: '+=400'}, 400, function(){$('.slideout_panel').remove();});
		}
	});
});


