
  function Canvas(dom,conf){
    this._init(conf)
    bindDom(dom)
  }


  Canvas.prototype = {
    constructor: this,
    dom:'',
     /** 初始化内置环境*/
     _init: function (config) {
      this._config = extend(true, this._defaultConfig, config)
    },
  }

export { Canvas}