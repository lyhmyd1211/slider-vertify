// ;分号解决js合并时可能会产生的错误
; (function (undefined) {  //undefined在老的浏览器是不被支持，增加一个形参undefined，就算外部的 undefined 定义了，里面的 undefined 依然不受影响；
  "use strict"
  var _global;
  function  bindDom(dom){
    try {
      return  document.getElementById(dom)
    } catch (error) {
      console.error(error)
    }
  }

  /**深度合并对象 */
  function extend() {
    var extended = {};
    var deep = false;
    var i = 0;

    // 判断是否为深拷贝
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
      deep = arguments[0];
      i++;//如果为深拷贝则初始的i为1或者为0
    }

    // 将对象属性合并到已存在的对象中
    var merge = function (obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          // 如果属性为对象并且需要深拷贝时则使用函数递归、反之则将当前的属性替换现有的属性
          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            extended[prop] = extend(extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    // 遍历所有对象属性
    for (; i < arguments.length; i++) {
      merge(arguments[i]);
    }

    return extended;

  }



    /**创建图片 */
    const createImg = (url, onload) => {
      let img
      if (imgInstance.value) {
        img = imgInstance.value
      } else {
        img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = onload
      }

      img.onerror = () => {
        // ;(img as any).setSrc(url) // 图片加载失败的时候重新加载其他图片
      }
      ;(img ).setSrc = (src) => {
        const isIE = window.navigator.userAgent.indexOf('Trident') > -1
        if (isIE) {
          // IE浏览器无法通过img.crossOrigin跨域，使用ajax获取图片blob然后转为dataURL显示
          const xhr = new XMLHttpRequest()
          xhr.onloadend = function (e) {
            const file = new FileReader() // FileReader仅支持IE10+
            file.readAsDataURL(e.target.response)
            file.onloadend = function (e) {
              img.src = e?.target?.result 
            }
          }
          xhr.open('GET', src)
          xhr.responseType = 'blob'
          xhr.send()
        } else img.src = src
      }
      ;(img ).setSrc(url)
      return img
    }


  function  createCanvas(dom){
    let canvasMain = document.createElement('div')
    canvasMain.setAttribute('id','canvasPannel')
    
    /** sliderCanvas */
    let sCanvas = document.createElement('canvas')
    sCanvas.id ='sliderCanvas'
    sCanvas.width = this._config.width
    sCanvas.height = this._config.height

    /**blockCanvas */
    let bCanvas = document.createElement('canvas')
    bCanvas.id ='blockCanvas'
    bCanvas.width = this._config.width
    bCanvas.height = this._config.height
    bCanvas.style.transform = 'translateX(' + this.distance + 'px)'
    bCanvas.style.position = 'absolute'
    bCanvas.style.left = 0
    bCanvas.style.top = 0

    canvasMain.append(sCanvas)
    canvasMain.append(bCanvas)
    dom.append(canvasMain)
  }

  function createSlider(dom){
    // console.log('slider',Slider)
  }

  function Vertify(dom,conf){
    this._init(conf)
    this.dom = bindDom(dom)
    createSlider.call(this,this.dom)
    createCanvas.call(this,this.dom)
  }


  Vertify.prototype = {
    constructor: this,
    dom:'',
    _config: {
    },
    _defaultConfig: {
      width:420,
      height:210,
    },
    distance:0,
    setDistance:function(dis){
      this.distance = dis
    },
    getDistance:function(){
      return this.distance
    },
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