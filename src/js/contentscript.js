(function() {
    "use strict"

    $(window).bind("mouseup", function() {
        var keyword = validator.getKeyword();

        if(keyword !== "") {
            dicCont.show(keyword);
        }
    });

    var config = {
        URL_DIC: "http://endic.naver.com/popManager.nhn?m=search&searchOption=&query=",
        TAG_INPUT: "INPUT"
    };

    var validator = (function() {
        var checker = {
            hasSelectedTxt: function(selectedTxt) {
                return (selectedTxt === "") ? false : true;
            },
            hasInput: function(selection) {
                var i = 0,
                    nodeArr = selection.baseNode.childNodes,
                    len = nodeArr.length,
                    rtnValue = false;

                for(; i<len; i++) {
                    if(nodeArr[i].tagName === config.TAG_INPUT) {
                        rtnValue = true;
                        break;
                    }
                }
                return rtnValue;
            }
        };

        var extractor = {
            getKeyword: function() {
                var selection = window.getSelection(),
                    selectedTxt = selection.toString(),
                    existInput;

                var existTxt = checker.hasSelectedTxt(selectedTxt);

                if(existTxt) {
                    existInput = checker.hasInput(selection);
                    if(existInput){
                        // input창은 단어검색하지 않음
                        selectedTxt = "";
                    }
                }

                return selectedTxt;
            }
        };

        return {
            getKeyword: function() {
                return extractor.getKeyword();
            }
        };
    }());

    var dicCont = (function() {
        var $dic, $dicWrap, timeObj,
            extCssObj = {top:"20px", height:"400px"},
            reduCssObj = {top:"20px", height:"100px"};

        var frameCtrl = {
            show: function(query) {

                this.createCont(query);

                if($dic) {
                    var _this = this;
                    $dic.load(function() {
                        $dicWrap.show();
                        _this.ani(extCssObj);
                        _this.setTime();
                    });
                }
            },
            createCont: function(query) {
                var _this = this,
                    url = config.URL_DIC +encodeURIComponent(query);

                if(!$dic) {
                    $dic =  $("<iframe/>", {id: "dic", src:url}).on("mouseenter mouseleave", function(evt) {

                        var sizeObj = reduCssObj;
                        if(evt.type === "mouseenter") {
                            clearTimeout(timeObj);
                            sizeObj = extCssObj;
                        }
                        _this.ani(sizeObj);
                    });

                    dicWrapCtrl.appendBody($dic);

                } else {
                    $dic.attr("src", url);
                }
            },
            setTime: function() {
                var _this = this;
                clearTimeout(timeObj);
                timeObj = setTimeout(function() {
                    _this.ani(reduCssObj);
                }, 4000);
            },
            ani: function(opt, extObj) {
                var option = {top: opt.top, height: opt.height, duration: 50},
                    option = (extObj) ? $.extend(option, extObj) : option;

                $dicWrap.stop().animate(option);
            }
        };

        var dicWrapCtrl = (function(){
            var create = function($dic){
                $dicWrap = $("<div/>", {id:"dicWrap"}).append($dic);
                var $positinoWrap = $("<div/>", {id:"ctrller"}).append("<div id='left'>좌</div> | <div id='right'>우</div>");
                //evtHandler($positinoWrap);
                //$("body").append($dicWrap.append($positinoWrap));
                $("body").append($dicWrap);
            };

            var evtHandler = function($positinoWrap){
                $positinoWrap.on("click", "span", function(evt){
                    var id = $(evt.target).id,
                        direction = (id === "left") ? {left: "15px"} : {right: "15px"};
                    frameCtrl.ani(extCssObj, direction);
                });
            };
            return {
                appendBody: function($dic){
                    create($dic);
                }
            };
        }());

        return {
            show: function(query){
                frameCtrl.show(query);
            }
        };
    }());

}());
