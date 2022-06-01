
  
   define(function(){
      function Slider(dom,conf){
        this._init(conf)
        bindDom(dom)
      }


      Slider.prototype = {
        constructor: this,
        dom:'',
        /** 初始化内置环境*/
        _init: function (config) {
          this._config = extend(true, this._defaultConfig, config)
        },
      }
   })