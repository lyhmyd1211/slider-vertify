//;分号解决js合并时可能会产生的错误
; (function (undefined) {  //undefined在老的浏览器是不被支持，增加一个形参undefined，就算外部的 undefined 定义了，里面的 undefined 依然不受影响；
  "use strict"
  var _global;
  function  bindDom(dom){
    try {
      this.dom = document.getElementById(dom)
    } catch (error) {
      console.error("can not can dom '"+dom+"'")
    }
  }

  function  createCanvas(dom){
    console.log('canvas',Canvas)
  }

  function createSlider(dom){
    console.log('slider',Slider)
  }

  function Vertify(dom,conf){
    this._init(conf)
    bindDom(dom)
    createCanvas()
    createSlider()
  }


  Vertify.prototype = {
    constructor: this,
    dom:'',
     /** 初始化内置环境*/
     _init: function (config) {
      this._config = extend(true, this._defaultConfig, config)
    },
  }







  _global = (function () { return this || (0, eval)('this'); }());  // 将插件对象暴露给全局对象 取当前的全局this对象为作顶级对象用 ，间接表达式(0, eval)('this')，相当于eval('this')
  if (typeof module !== 'undefined' && module.exports) {      //有module.exports
    module.exports = Vertify;
  } else if (typeof define === 'function' && define.amd) {
    define(function () { return Vertify; });
  } else {
    !('Vertify' in _global) && (_global.Vertify = Vertify);
  }
}());