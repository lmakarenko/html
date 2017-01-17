$(function(){
    
    var anim_complete=true;
    
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
    function init(){
       $(document).ready(function(){
           $('input, textarea').placeholder();
       });
    }
     
    init();
     
});