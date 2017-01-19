$(function(){
    
    var anim_complete=true,
    i_sel = 1,
    i_sel_ = 1,
    i_sel_max,
    w = $(window),
    d = $(document),
    wh = w.height(),
    ww = w.width(),
    dw = d.width(),
    dh = d.height(),
    e_popular = $('#items-slider-popular'),
    e_popular_slider_c = e_popular.find('.items-inner-c').first(),
    e_popular_slider = e_popular.find('.items-inner').first(),
    e_items,
    popular_w = 102,
    popular_w_v = popular_w + 10,
    popular_c_v = Math.floor((ww - 60) / popular_w_v),
    popular_c_v_min = 7,
    popular_c_v_max = 14,    
    e_popular_w,
    popular_c;
    
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
    
    function rowLeft_v(){       
        anim_(e_popular_slider, {'left':'+=' + popular_c_v * popular_w_v + 'px'}, 600);
    }
    
    function rowRight_v(){
        anim_(e_popular_slider, {'left':'-=' + popular_c_v * popular_w_v + 'px'}, 600);
    }
    
    function selectContr(i){
        if(i == i_sel){
            return;
        }/*
        if(i < i_sel){
            anim_(e_popular_slider, {'left':'+=' + (i_sel - i) * (popular_w + 10) + 'px'}, 600);
        } else {
            anim_(e_popular_slider, {'left':'-=' + (i - i_sel) * (popular_w + 10) + 'px'}, 600);
        }*/
        i_sel = i;
        selectContr_v(i);
    }
    
    function selectContr_v(i){
        e_items.filter(function(){
            return $(this).hasClass('item-a');
        }).first().removeClass('item-a');
        e_items.filter(function(){
            return $(this).data('i') == i;
        }).first().addClass('item-a');
    }
    
    function init(){
        
        e_items = e_popular.find('.item');
        popular_c = e_items.length;
        i_sel_max = popular_c_v * Math.floor(popular_c / popular_c_v);
        
        e_items
            .each(function(i,e){
               $(e).data('i', i+1);
            })
            .on('mouseenter', function(){
                $(this).addClass('item-h');
            })
            .on('mouseleave', function(){
                $(this).removeClass('item-h');
            })
            .on('click', function(){
                selectContr($(this).data('i'));
            });
        
        e_popular_w = popular_c * popular_w_v;
        e_popular.css({'width': ww - 60 + 'px'});
        e_popular_slider_c.css({'width': popular_w_v * popular_c_v + 'px'});
        e_popular_slider.css({'width': e_popular_w + 'px'});
        
        if(ww < e_popular_w){
            e_popular.find('.arrow').show();
        }
        
        e_popular.find('.arrow-right').first().on('click', function(){
            if(i_sel_ >= i_sel_max){
                return;
            }
            i_sel_ += popular_c_v;
            rowRight_v();
        });
        e_popular.find('.arrow-left').first().on('click', function(){
            if(i_sel_ <= 1){
                return;
            }
            i_sel_ -= popular_c_v;
            rowLeft_v();
        });
        
        selectContr_v(i_sel);
        
        d.ready(function(){
            $('input, textarea').placeholder();
        });
        
    }
     
    init();
     
});