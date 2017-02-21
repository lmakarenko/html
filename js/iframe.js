$(function(){
    
    var anim_complete=true,
    w = $(window),
    d = $(document),
    wh = /*w.height()*/730,
    ww = /*w.width()*/1024,
    dw = 1024/*d.width()*/,
    dh = 730/*d.height()*/,
    img_loading = $('#slide-loading')/*,
    div_contr_name = $('#contr-name'),
    div_exchange_descr = $('#exchange-descr'),
    input_user_login = $('#bonus-cnt'),
    label_user_login = $('#label-user-login'),
    input_bonus_cnt = $('#user-login'),
    div_exchange_currency = $('.exchange-currency'),
    div_currency_cnt = $('#currency-cnt')*/;
    
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
    
    function loading_v(){
        img_loading.css({
            'top': parseInt((wh - 50) / 2) + 'px',
            'left': parseInt((ww - 50) / 2) + 'px'
        });
        img_loading.fadeIn(200);
    }
    
    function loadSlide(p){
        $.ajax({
            type: 'post',
            url: '/promocodes/iframe/slide',
            //data: {ukey: p.ukey, slide_num: p.slide_num},
            data: p,
            beforeSend: function(){
                loading_v();
            },
            success: function(html){
                if(!html) return;
                $('#slide_' + p.slide_num).html(html);
                init();
                switch(p.slide_num){
                    case 1: {
                        slide_1_init();
                        break;
                    }
                    case 2: {
                        slide_2_init();
                        goToSlide_v();
                        break;
                    }
                    case 3: {
                        slide_3_init();
                        goToSlide_v();
                    }
                }
                if(p.callback){
                    p.callback();
                }
                img_loading.fadeOut(200);
            }
        });
    }
    
    function goToSlide_v(){
        anim_($('#slides-w'), {'left':'-=' + ww +'px'}, 600);
    }
    
    function slide_1_init(){
        
        function checkPromo(p){
            $.ajax({
                type: 'post',
                url: '/promocodes/validate',
                data: {ukey: p.ukey, code: p.code},
                dataType: 'json',
                beforeSend: function(){
                    $('#error-promo').hide();
                    loading_v();
                },
                success: function(d){
                    if(d.status){
                        if(p.callback){
                            p.callback();
                        }
                    } else if(d.error){
                        $('#error-promo').html(d.error.descr).fadeIn(400);
                    }
                    img_loading.fadeOut(200);
                }
            });
        }
        
        function validatePromo(code){
            var c_ = $.trim(code);
            if(c_.length < 1){
                return false;
            }
            return true;
        }
        
        var code_valid = false;
        $('#promo-code').mask('SSSSS-SSSSS-SSSSS-SSSSS', {
            onComplete: function(cep) {
                //alert('CEP Completed!:' + cep);
                promo_error_v(false);
                code_valid = true;
            },
            onKeyPress: function(cep, event, currentField, options){
              /*console.log('An key was pressed!:', cep, ' event: ', event,
                          'currentField: ', currentField, ' options: ', options);*/
                code_valid = false;
            },
            onChange: function(cep){
              //console.log('cep changed! ', cep);
              code_valid = false;
            },
            onInvalid: function(val, e, f, invalid, options){
              //var error = invalid[0];
              //console.log ("Digit: ", error.v, " is invalid for the position: ", error.p, ". We expect something like: ", error.e);
              code_valid = false;
              //$('#error-promo').html('Неверный формат промокода!').fadeIn(400);
            },
            'translation': {
                S: {
                    pattern: /[A-Za-z0-9]/
                }
            },
            //placeholder: "     -     -     -     "
        });
        
        function promo_error_v(f){
            if(f){
                $('#promo-code').addClass('error-border');
                $('#error-promo').html('Промо-код введен не полностью!').fadeIn(400);
            } else {
                $('#error-promo').hide();
                $('#promo-code').removeClass('error-border');
            }
        }
        
        $('#enter-promo-btn').on('click', function(e){
            e.preventDefault();
            promo_error_v(false);
            var code = $('#promo-code').cleanVal();
            if(code.length < 20){
               promo_error_v(true);
               return;
            } else if(!code_valid){
               return;
            }
            
            slide_2_init(); goToSlide_v(); return;
            
            checkPromo({
                'ukey': ukey,
                'code': code,
                'callback': function(){
                    loadSlide({
                        'ukey': ukey,
                        'slide_num': 2,
                        'code': code
                    });
                }
            });
        });
    }
    
    function slide_2_init(){
        
        var form_hidden = true;
        function show_game_form(){
            $('#select-game-info').fadeOut(400, function(){
                $('#game-info-form').fadeIn(400, function(){
                    form_hidden = false;
                });
            });
        }
        
        /* POPULAR SLIDER */
        
        var i_sel,
        i_sel_,
        i_sel_max,
        e_popular = $('#items-slider-popular'),
        e_popular_slider_c = e_popular.find('.items-inner-c').first(),
        e_popular_slider = e_popular.find('.items-inner').first(),
        e_items,
        popular_w = 102,
        popular_w_v = popular_w + 10,
        popular_c_v = Math.floor((ww - 60) / popular_w_v),
        popular_c_v_min = 7,
        popular_c_v_max = 7,    
        e_popular_w,
        popular_c;
   
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
            
            if(form_hidden){
                show_game_form();
            }
            
            if(e_filter_slider_items){
                filter_i_sel = 0;
                e_filter_slider_items.filter(function(){
                    return $(this).hasClass('item-a');
                }).first().removeClass('item-a');
            }
            
            e_items.filter(function(){
                return $(this).hasClass('item-a');
            }).first().removeClass('item-a');
            var e = e_items.filter(function(){
                return $(this).data('i') == i;
            }).first(),
            exchange_rate = e.data('p-3'),
            currency_cnt = Math.floor(bonus_cnt * exchange_rate);
            e.addClass('item-a');
            $('#contragent-id').val(e.data('id'));
            $('#contr-name').html(e.data('p-1'));
            $('.exchange-currency').html(e.data('p-4'));
            //$('#bonus-cnt').val(bonus_cnt);
            $('#label-user-login').html(e.data('p-6'));
            $('#currency-cnt').html(currency_cnt.toFixed(0));
        }
        
        $('#bonus-exchange-form').on('submit', function(e){
            e.preventDefault();
        });
        
        function validateOut(){
            var contr_id = $('#contragent-id').val(),
                promo_code = $('#promo-code').cleanVal(),
                user_login = $('#user-login').val();
            $('#user-login').removeClass('error-border');
            $('#error-out').hide();
            if(1 > parseInt(contr_id)){
                /*$('#user-login').addClass('error-border');
                $('#error-out').html('Не выбран контрагент').fadeIn(400);*/
                return false;
            }
            if(0 == $.trim(promo_code).length){
                /*$('#user-login').addClass('error-border');
                $('#error-out').html('Не указан промокод').fadeIn(400);*/
                return false;
            }
            if(0 == $.trim(user_login).length){
                $('#user-login').addClass('error-border');
                $('#error-out').html('Не указан логин').fadeIn(400);
                return false;
            }
            return true;
        }
        
        var out_process = false;
        $('#exchange-btn').on('click', function(){
           if(out_process){
               return false;
           }
           if(!validateOut()){
               return false;
           }
           
           slide_3_init(); goToSlide_v(); return;
           
           out_process = true;
           $.ajax({
                type: 'post',
                url: '/promocodes/iframe/out',
                data: {
                    ukey: ukey,
                    contragent_id: $('#contragent-id').val(),
                    promo_code: $('#promo-code').cleanVal(),
                    user_login: $('#user-login').val()
                },
                dataType: 'json',
                success: function(d){
                    if(d.status){
                        loadSlide({
                            'ukey': ukey,
                            'slide_num': 3,
                            'out_id': d.id
                        });
                    }
                    out_process = false;
                }
           });
        });
        
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
        e_popular.css({'width': (popular_w_v * popular_c_v + 60) + 'px'});
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
        
        //selectContr_v(i_sel);
        
        /* FILTER SLIDER */
        
        var filter_process = false,
            e_filter = $('#items-slider'),
            e_filter_slider_c = e_filter.find('.items-inner-c').first(),
            e_filter_slider = e_filter.find('.items-inner').first(),
            e_filter_slider_items,
            filter_w = 102,
            filter_w_v = filter_w + 10,
            filter_c_v = Math.floor((ww - 60) / filter_w_v),
            filter_c_v_min = 7,
            filter_c_v_max = 14,
            e_filter_slider_item_tpl = _.template('<div class="item" data-id="<%= id %>" data-p-1="<%= p1 %>" data-p-3="<%= p3 %>" data-p-4="<%= p4 %>" data-p-5="<%= p5 %>" data-p-6="<%= p6 %>" data-p-7="<%= p7 %>"><img src="/site/skins/promocodes_iframe/public/images/contr-logo/<%= id %>.png" /><div class="item-title"><%= p1 %></div></div>'),
            e_filter_w,
            filter_c,
            filter_i_sel,
            filter_i_sel_,
            filter_i_sel_max;
            
        function e_filter_init_v(){
            
            filter_i_sel = 1;
            filter_i_sel_ = 1;
            e_filter_slider.css({'left': '0px'});
            
            function rowLeft_v(){       
                anim_(e_filter_slider, {'left':'+=' + filter_c_v * filter_w_v + 'px'}, 600);
            }

            function rowRight_v(){
                anim_(e_filter_slider, {'left':'-=' + filter_c_v * filter_w_v + 'px'}, 600);
            }

            function selectContr(i){
                if(i == filter_i_sel){
                    return;
                }
                filter_i_sel = i;
                selectContr_v(i);
            }

            function selectContr_v(i){
                
                if(form_hidden){
                    show_game_form();
                }
                
                i_sel = 0;
                e_items.filter(function(){
                    return $(this).hasClass('item-a');
                }).first().removeClass('item-a');
                
                e_filter_slider_items.filter(function(){
                    return $(this).hasClass('item-a');
                }).first().removeClass('item-a');
                var e = e_filter_slider_items.filter(function(){
                    return $(this).data('i') == i;
                }).first(),
                exchange_rate = e.data('p-3'),
                currency_cnt = Math.floor(bonus_cnt * exchange_rate);
                e.addClass('item-a');
                
                $('#contragent-id').val(e.data('id'));
                $('#contr-name').html(e.data('p-1'));
                $('.exchange-currency').html(e.data('p-4'));
                //$('#bonus-cnt').val(bonus_cnt);
                $('#label-user-login').html(e.data('p-6'));
                $('#currency-cnt').html(currency_cnt.toFixed(0));
                
            }

           e_filter_slider_items = e_filter_slider.find('.item');
           filter_c = e_filter_slider_items.length;
           filter_i_sel_max = filter_c_v * Math.floor(filter_c / filter_c_v);

           e_filter_slider_items
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

            e_filter_w = filter_c * filter_w_v;
            e_filter.css({'width': (filter_w_v * filter_c_v + 130) + 'px'});
            e_filter_slider_c.css({'width': filter_w_v * filter_c_v + 'px'});
            e_filter_slider.css({'width': e_filter_w + 'px'});

            if(ww < e_filter_w){
                e_filter.find('.arrow').show();
            }

            e_filter.find('.arrow-right').first().on('click', function(){
                if(filter_i_sel_ >= filter_i_sel_max){
                    return;
                }
                filter_i_sel_ += filter_c_v;
                rowRight_v();
            });
            e_filter.find('.arrow-left').first().on('click', function(){
                if(filter_i_sel_ <= 1){
                    return;
                }
                filter_i_sel_ -= filter_c_v;
                rowLeft_v();
            });

            //selectContr_v(filter_i_sel);
        }
        
        function filter_process_v_on(){
            filter_process = true;
            loading_v();
            $('#filter_s').prop('disabled', true);
        }
        function filter_process_v_off(){
            img_loading.fadeOut(200);
            filter_process = false;
            $('#filter_s').prop('disabled', false);
        }
        
        $('#filter_s').on('keyup', function(e){
            if(filter_process) return;
            /*if (e.which === 0 || e.ctrlKey || e.metaKey || e.altKey) {
                return;
            }*/
            filter_process_v_on();
            setTimeout(function(){
                $.ajax({
                   type: 'post',
                   url: '/promocodes/iframe/contragents',
                   data: {ukey: ukey, 'filter_s': $('#filter_s').val()},
                   dataType: 'json',
                   success: function(d){
                       if(typeof d.length !== 'undefined' && d.length == 0){
                           filter_process_v_off();
                           return;
                       }
                       var tpl_p, cid, pid;
                       e_filter_slider.html('');
                       for(cid in d){
                        tpl_p = {'id': cid};
                        for(pid in d[cid]){
                            tpl_p['p' + pid] = d[cid][pid];
                        }
                        e_filter_slider.append(e_filter_slider_item_tpl(tpl_p));
                       }
                       
                       e_filter_init_v();
                       filter_process_v_off();
                       
                   }
                });
            }, 2000);
        });
        
        e_filter_init_v();
               
    }
    
    function slide_3_init(){
        
    }
    
    function init(){
        
        $('#slides-w').width(ww * 3).height(510);
        $('.slide-c').width(ww);

        d.ready(function(){
            $('input, textarea').placeholder();
        });
        
    }

    init(); slide_1_init(); return;

    loadSlide({
        'ukey': ukey,
        'slide_num': 1
    });
     
});