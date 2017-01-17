function sendPost(url,data,success,fail) {
	return $.post(url,data,function(ret) {
		if (ret['error']!='') {
			alert(ret['error']);
			if (fail!==undefined) fail(ret);
			return false;
		}else {
			if (success!==undefined) success(ret);
			return true;
		}
	},'json');
}

function sendPostAjax(url, elementId, success, fail) {
    var formElement = document.getElementById(elementId);
    $.ajax({
        url: url,
        type: 'POST',
        data: new FormData(formElement),
        processData: false,
        contentType: false,
        dataType: 'json'
    }).done(function (ret) {
        if (ret['error'] != '') {
            alert(ret['error']);
            if (fail !== undefined)
                fail(ret);
            return false;
        } else {
            if (success !== undefined)
                success(ret);
            return true;
        }
    });
}



function hideLoadingProcessLayer(){
    $("#progress_layer").parent().remove();
}

function showLoadingProcessLayer(message,update_progess) {
	var did = "loader_"+Math.floor(Math.random() * (1000 - 1) + 1);
	var lpdiv= document.createElement("DIV");

	lpdiv.id=did;

	var h = $(document).height();
	var w = $(document).width();

	var st = $(document).scrollTop();

	lpdiv.className='ui-widget-overlay';
	lpdiv.style.width=w+'px';
	lpdiv.style.height=h+'px';
	lpdiv.style.opacity="0.5";

	lpdiv.style.zIndex='5000';

	document.getElementsByTagName('body')[0].appendChild(lpdiv);

	var left = parseInt( $(window).width()/2-50 );
	var top = parseInt( ($(window).height()/2)-10+st );

	var mess = (message!=undefined) ? message : 'Загрузка...';

	var b_u = '/';

	if (typeof base_url!='undefined') {
		b_u = base_url;
	}

	$(lpdiv).html('<div class="loadingprocesslayer" style="left:'+left+'px;top:'+top+'px;" id="progress_layer">'+((typeof message!='undefined' && message!='') ? '<span>'+mess+'</span><br /><img src="'+b_u+'cms/public/images/loading.gif" align="center" />' : '')+'</div>');

	$("div.loadingprocesslayer",lpdiv).css("left",parseInt($(window).width()/2-parseInt($("div.loadingprocesslayer",lpdiv).width()/2)));

	if (update_progess!==undefined && update_progess==true)
		progressUpdate("progress_layer");

	return did;
}

var po_update_timer=undefined;

function in_array(needle, haystack, strict) {
	var found = false, key, strict = !!strict;
	for (key in haystack) {
		if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
			found = true;
			break;
		}
	}

	return found;
}

var sedialog=false;

// @docs at http://cms.glenn.ru/docs/StandartEdit
function seEdit(object,object_id,controller,plugin,dialog_width,modal) {

	var add_params = '';

	if (typeof params!='undefined') {
		for (key in params)
			add_params += '/'+key+'/'+params[key];
	}

	var cntrl = (controller==undefined) ? current_controller : controller;
	var plgn = (plugin==undefined) ? current_plugin : plugin;
	var obj_params = '';

	if (typeof object_id == 'object') {
		for (key in object_id)
			obj_params  += '/'+key+'/'+object_id[key];
	}else obj_params = '/objectid/'+object_id;

	if (typeof dialog_type!='undefined' && dialog_type=='bootstrap') {
		sedialog = bsAjaxDialog('/'+plgn+'/'+cntrl+'/seeditobject/object/'+object+obj_params+add_params, 'Редактирование', {
			'Сохранить': 'seSaveData("'+object+'","'+object_id+'", "'+cntrl+'", "'+plgn+'")'
		});
	}else {

		var w = (dialog_width!==undefined) ? dialog_width : 600;

		sedialog = ajaxDialog('/'+plgn+'/'+cntrl+'/seeditobject/object/'+object+obj_params+add_params, 'Редактирование', w, 'auto', {
			'Сохранить': function(){seSaveData(object,object_id, cntrl, plgn);}
		},null,modal);
	}
}

// @docs at http://cms.glenn.ru/docs/StandartEdit
function seSaveData(object, object_id, controller, plugin) {

	if (typeof CKEDITOR!=="undefined") {
		$('#'+sedialog+' form textarea').each(function() {
			var textareaId = $(this).attr('id');
			if (textareaId && CKEDITOR.instances[textareaId]) {
				$('#' + textareaId).val(CKEDITOR.instances[textareaId].getData());
			}
		});
	}
	
	
	//////check all fields for require////////
	var ret = false;
	$('#'+sedialog+' form input[required=true]').each(function(){
		if ($(this).val()=='') {
			alert('Не заполнено одно из обязательных полей!');
			
			$(this).delay(100).fadeOut().fadeIn('slow').delay(100).fadeOut().fadeIn('slow');
			
			ret = true;
			return false;
		};
	});
	
	if (ret) return false;
	//////////////////////////////////////////
	

	var data = $('#'+sedialog+' form').serializeArray();

	var add_params = '';

	if (typeof params!='undefined') {
		for (key in params)
			add_params += '/'+key+'/'+params[key];
	}

	var cntrl = (controller==undefined) ? current_controller : controller;
	var plgn = (plugin==undefined) ? current_plugin : plugin;
	var obj_params = '';

	if (typeof object_id == 'object') {
		for (key in object_id)
			obj_params  += '/'+key+'/'+object_id[key];
	}else obj_params = '/objectid/'+object_id;

	var target_url = '/'+plgn+'/'+cntrl+'/seeditobject/object/'+object+obj_params+add_params;

	var file_input_count = $('#'+sedialog+' form input[type=file]').length;

	showLoadingProcessLayer('Сохраняю');

	if (file_input_count>0 && $('#'+sedialog+' form input[type=file]').attr('seIgnore')!="true") {

		$('#'+sedialog+' form').after('<iframe onload="seEditFilishSave(this)" id="ifr'+sedialog+'" name="ifr'+sedialog+'" style="display:none;"></iframe>');

		$('#'+sedialog+' form').attr('enctype','multipart/form-data');
		$('#'+sedialog+' form').attr('method','post');
		$('#'+sedialog+' form').attr('action',target_url);
		$('#'+sedialog+' form').attr('target','ifr'+sedialog);

		$('#'+sedialog+' form').submit();
	}else {
		sendPost(target_url, data,
			function() {
				document.location.reload();
			},
                        function(){
                            hideLoadingProcessLayer();
                        }
		);
	}
}

function seEditFilishSave(frame) {
	try {
		var content = $(frame).contents().find('body').text();

		var data = JSON.parse(content);
		if (data['finish']) {
			if (data['error']!=''){
				alert(data['error']);
                hideLoadingProcessLayer();
            }else document.location.reload();
		}
	}catch (e) {}
}



function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function ckeditorInit(callbackFunction) {
    
    if (typeof CKEDITOR=='undefined') {
            var script = document.createElement( 'script' );
            script.type = 'text/javascript';
            script.src = '/cms/public/js/ckeditor/ckeditor.js';

            $(script).load(callbackFunction);

            document.body.appendChild(script);
    }else callbackFunction();
    
}


function checkFormElement(el,type) {
    var val = $(el).val();
    
    switch (type) {
        case 'email':
            return /[a-zа-я0-9_.-]+\@[a-zа-я0-9_.-]+\.[a-zа-я0-9_.-]+/i.test(val);
            break;
    }
    return false;
}

function checkValidForm(form_el) {
    
    $('input',form_el).each(function(index,elem){
        if ($(elem).attr('checkfor')) {
            if (!checkFormElement(elem,$(elem).attr('checkfor'))) {
                $(elem).addClass('form_incorrect');
                return false;
            }
        }
    });
    
}

function showAlert(text){
    $('.default_alert_msg').html(text);
    document.getElementsByClassName('default_alert_border')[0].style.margin = (window.innerHeight / 2 - 100) + 'px auto 0 auto';
    $('#default_alert_popup').toggle();
}

$(document).keyup(function(e) {
     if (e.keyCode == 27) { // escape key maps to keycode `27`
        if ($('#default_alert_popup').css('display') == 'block')
        $('.default_alert_background').click();
    }
});