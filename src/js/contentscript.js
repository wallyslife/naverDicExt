(function(){

    $(window).bind("mouseup dblclick", function(evt){
        if(evt.target.tagName === "INPUT") return;

        var selectedTxt = window.getSelection().toString();
        if(selectedTxt === "") return;

        DicCont.show(selectedTxt);
    });

    var DicCont = (function(){
        var $dic, $dicWrap, extCssObj = {top:"20px", height:"400px"}, reduCssObj = {top:"20px", height:"100px"}, timeObj;
        var frameCtrl = {
            show: function(query){

                this.createCont(query);

                if($dic){
                    var _this = this;
                    $dic.load(function(){
                        $dicWrap.show();
                        _this.ani(extCssObj);
                        _this.setTime();
                    });
                }
            },
            createCont: function(query){
                var _this = this, url = "http://endic.naver.com/popManager.nhn?m=search&searchOption=&query="+encodeURIComponent(query) ;

                if(!$dic){
                    $dic =  $("<iframe/>", {id: "dic", src:url}).on("mouseenter mouseleave", function(evt){

                        var sizeObj = reduCssObj;
                        if(evt.type === "mouseenter"){
                            clearTimeout(timeObj);
                            sizeObj = extCssObj;
                        }
                        _this.ani(sizeObj);
                    });

                    DicWrapCtrl.appendBody($dic);

                } else {
                    $dic.attr("src", url);
                }
            },
            setTime: function(){
                var _this = this;
                clearTimeout(timeObj);
                timeObj = setTimeout(function(){
                    _this.ani(reduCssObj);
                }, 4000);
            },
            ani: function(opt, extObj){
                var option = {top: opt.top, height: opt.height, duration: 50},
                    option = (extObj) ? $.extend(option, extObj) : option;

                $dicWrap.stop().animate(option);
            }
        };

        var DicWrapCtrl = (function(){
            var create = function($dic){
                $dicWrap = $("<div/>", {id:"dicWrap"}).append($dic);
                var $positinoWrap = $("<div/>", {id:"ctrller"}).append("<div id='left'>좌</div> | <div id='right'>우</div>");
                //evtHandler($positinoWrap);
                //$("body").append($dicWrap.append($positinoWrap));
                $("body").append($dicWrap);
            };

            var evtHandler = function($positinoWrap){
                $positinoWrap.on("click", "span", function(evt){
                    var id = $(evt.target).id, direction = (id === "left") ? {left: "15px"} : {right: "15px"};
                    frameCtrl.ani(extCssObj, direction);
                });
            };
            return {
                appendBody: function($dic){
                    create($dic);
                }
            };
        })();

        return {
            show: function(query){
                frameCtrl.show(query);
            }
        };
    })();

})();
