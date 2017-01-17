$(document).ready(function(){
	$('input, textarea').placeholder();
	initTab ();
	function initTab () {
		$('.tab-control li a, .tab-block .paging li a').click(function(){
			var index = $(this).parent().index();
			$('.tab-control li, .tab-block .paging li').removeClass('active');
			$(this).parent().addClass('active');
			$('.tab-body .tab, .tab-box .tab').removeClass('active').eq(index).addClass('active');
			return false;
		});
	};
});