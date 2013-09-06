(function() {
    "use strict"

    $(window).bind("mouseup", function(evt) {
        if(evt.altKey) {
            var keyword = validator.getKeyword();

            if(keyword !== "") {
                dicCont.show(keyword);
            }
        }
    });

    var config = {
        URL_DIC: "http://endic.naver.com/popManager.nhn?m=search&searchOption=&query=",
        TAG_INPUT: "INPUT",
        TAG_TEXTAREA: "TEXTAREA"
    };

    var validator = (function() {
        var checker = {
            hasSelectedTxt: function(selectedTxt) {
                return (selectedTxt === "") ? false : true;
            },
            hasInput: function(selection) {
                return this.chkFormTag(selection, config.TAG_INPUT);
            },
            hasTextarea: function(selection) {
                return this.chkFormTag(selection, config.TAG_TEXTAREA);
            },
            chkFormTag: function(selection, tag) {
                var i = 0,
                    nodeArr = selection.baseNode.childNodes,
                    len = nodeArr.length,
                    rtnValue = false;

                for(; i<len; i++) {
                    if(nodeArr[i].tagName === tag) {
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
                    selectedTxt = $.trim(selection.toString()),
                    existInput, existTextarea;

                var existTxt = checker.hasSelectedTxt(selectedTxt);

                if(existTxt) {
                    existInput = checker.hasInput(selection);
                    existTextarea = checker.hasTextarea(selection);
                    if(existInput || existTextarea){
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
        var $dic, $dicWrap, timeObj = {},
            extCssObj = {width:"405px", height:"420px"},
            redCssObj = {height:"100px"};

        var frameCtrl = {
            show: function(query) {
                this.createCont(query);

                if($dic) {
                    $dic.load(function() {
                        $dicWrap.show();
                        animation.ani(extCssObj);
                        animation.setTimeAni({name:"extension", sec: 4000, cssObj: redCssObj});
                        animation.setTimeAni({name:"hiding", sec: 5000, cssObj: {width:"25px"}});
                    });
                }
            },
            createCont: function(query) {
                var cssObj,
                    url = config.URL_DIC + encodeURIComponent(query);

                if(!$dic) {
                    $dic =  $("<iframe/>", {id: "dic", src:url}).on("mouseenter mouseleave", function(evt) {

                        cssObj = redCssObj;

                        if(evt.type === "mouseenter") {
                            animation.clearTimeoutAll();
                            cssObj = extCssObj;

                        } else {
                            animation.setTimeAni({name:"hiding", sec: 2000, cssObj: {width:"25px"}});
                        }
                        animation.ani(cssObj);
                    });

                    dicWrapCtrl.appendBody($dic);

                } else {
                    $dic.attr("src", url);
                }
            }
        };

        var animation = {
            setTimeAni: function(configObj) {
                var _this = this,
                    name = configObj.name,
                    css = configObj.cssObj,
                    sec = configObj.sec;

                clearTimeout(timeObj[name]);

                timeObj[name] = setTimeout(function() {
                    _this.ani(css);
                }, sec);
            },
            ani: function(opt, extObj) {
                var option = {top: opt.top, width: opt.width, height: opt.height, duration: 50},
                    option = (extObj) ? $.extend(option, extObj) : option;

                $dicWrap.stop().animate(option);
            },
            clearTimeoutAll: function() {
                var arr = Object.keys(timeObj);
                $(arr).each(function(){
                    clearInterval(timeObj[this]);
                });
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
