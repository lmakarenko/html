$('document').ready(function(){

var anim_complete = true, i_sel = 1, e_sel, w = $(window), d = $(document), m = $('#main'), c, wh, ww, dh, ch, mh, hh,
slide_params = {
1: {
completed: true
},
2: {
completed: false
},
3: {
completed: false
},
4: {
completed: false
}
};


function rescale(){
    c = $('.center.sel').first();
    wh = w.height();
    ww = w.width();
    dh = d.height();
    ch = c.height();
    mh = m.height();
    hh = 48;
    //var h__ = (wh < dh ? dh : wh);
    //h__ = (h__ < ch ? ch : h__);
    //var h__ = slide_params[i_sel].height;
    /*var h_ = parseInt(ch) + 100;
    h_ = (h_ < 587 ? 587 : h_);*/
    //var h_ = mh;
    var m_ = parseInt((mh - ch)/2);
    /*m_ = (m_ < 0 ? 0 : m_);
    m.css({
            'height': h_ + 'px'
    });*/
    c.css({
            'margin-top': m_ + 'px'
    });
}

function init(){

    $('#form-promo').on('submit', function(e){
        e.preventDefault();
        var code = $.trim($('#code').val());
        if('' == code){
        var ae = $('#alert-error'), ah = ae.height(), aw = ae.width();
            ae
                .css({
                'top': parseInt((wh - ah)/2) + 'px',
                'left': parseInt((ww - aw)/2) + 'px'
                })
                .fadeIn(200);
        } else {
            enableStep(2);
            goToStep(2);
        }
    });

    $('#alert-error .alert-btn').on('click', function(e){
            e.preventDefault();
            $('#alert-error').fadeOut(200);
    });

    $('.top-menu a').on('click', function(e){
            e.preventDefault();
            var $this = $(this), i_ = parseInt($this.data('slide'));
            goToStep(i_);
    });

    $('.orgs-grid-e').on('click', function(){
            var $this = $(this), id = $this.data('id');
            if(e_sel){
            e_sel.removeClass('orgs-grid-e-h');
            }
            $this.addClass('orgs-grid-e-h');
            e_sel = $this;
            enableStep(3);
            goToStep(3);
    });

    $('.orgs-grid-row-b').on('mouseenter', function(){
    $(this).addClass('orgs-grid-row-b-h');
    }).on('mouseleave', function(){
    $(this).removeClass('orgs-grid-row-b-h');
    });
    $('.orgs-grid-row-t').on('mouseenter', function(){
    $(this).addClass('orgs-grid-row-t-h');
    }).on('mouseleave', function(){
    $(this).removeClass('orgs-grid-row-t-h');
    });

    $('.orgs-grid-nav-dot').on('mouseenter', function(){
    $(this).addClass('h');
    }).on('mouseleave', function(){
    $(this).removeClass('h');
    });

    $('#frame3-data').on('submit', function(e){
        e.preventDefault();
        var ae = $('#alert2'), ah = ae.height(), aw = ae.width();
        ae
            .css({
            'top': parseInt((wh - ah)/2) + 'px',
            'left': parseInt((ww - aw)/2) + 'px'
            })
            .fadeIn(200);
    });
    $('#alert-btn2').on('click', function(e){
        $('#alert2').fadeOut(200);
        enableStep(4); 
    });
    
    $(window).on('resize', rescale);
    
    rescale();

    $('#data-slides-w').width(ww * 4);
    $('.data-slide-c').css({
'width': ww + 'px',
'height': mh + 'px'
});

// Checking for CSS 3D transformation support
$.support.css3d = supportsCSS3D();
//mouseenter mouseout
$('.token').on('mouseenter mouseleave', function(e){
if(!anim_complete || !$(e.target).hasClass('token')){
	return;
}
anim_complete = false;
var $this = $(this), p = $this.parent(), i = p.data('i');
// Flipping the forms
p.toggleClass('flipped');
// If there is no CSS3 3D support, simply
// hide the login form (exposing the recover one)
if(!$.support.css3d){
	$('.token' + i + '-p').first().toggle();
}
anim_complete = true;
});

}

function anim_(el, params, delay, callback){
    if(!anim_complete){
        return;
    }
    anim_complete = false;
    el.animate(params, delay, function(){
        if(typeof callback !== 'undefined'){
            callback();
        }
        anim_complete = true;
    });
}

function canGo(i_){
        return slide_params[i_].completed;
}

function enableStep(i_){
    slide_params[i_].completed = true;
}

function goToStep(i_){
    if(i_ == i_sel){
            return;
    }
    if(!canGo(i_)){
            return;
    }
    $('.top-menu a[data-slide="' + i_sel + '"]').removeClass('sel');
    $('.top-menu a[data-slide="' + i_ + '"]').addClass('sel');
    //m.removeClass().addClass('frame'+i_);
    $('.center[data-slide="' + i_sel + '"]').removeClass('sel');
    $('.center[data-slide="' + i_ + '"]').addClass('sel');

    rescale();

if(i_ < i_sel){
    anim_($('#data-slides-w'), {'left':'+=' + (i_sel - i_) * ww +'px'}, 600);
} else {
    anim_($('#data-slides-w'), {'left':'-=' + (i_ - i_sel) * ww +'px'}, 600);
}

    i_sel = i_;

}

// A helper function that checks for the 
// support of the 3D CSS3 transformations.
function supportsCSS3D() {
	var props = [
		'perspectiveProperty', 'WebkitPerspective', 'MozPerspective'
	], testDom = document.createElement('a');
	  
	for(var i=0; i<props.length; i++){
		if(props[i] in testDom.style){
			return true;
		}
	}
	
	return false;
}

init();

});
