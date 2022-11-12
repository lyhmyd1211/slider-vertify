// ;分号解决js合并时可能会产生的错误
; (function (undefined) {  //undefined在老的浏览器是不被支持，增加一个形参undefined，就算外部的 undefined 定义了，里面的 undefined 依然不受影响；
  "use strict"
  var _global;

  const l = 25 //拼图正方形部分边长
  const r = 6 //拼图圆形部分半径
  const PI = Math.PI //PI值
  const L = l + r * 2 //整个拼图的边长
  let imgUrl = 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
  let sliderActive = false //是否是激活滑动的状态
  let isSliding = false //是否正在移动滑块
  let success = false //是否对上位置 滑动成功
  let finished = false //是否完成滑动的动作
  let moveEvent = null //滑块移动的事件
  let moveDistance = 0 //滑块移动的距离
  let randomX = 0
  let sliderMain = null
  let isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)

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


    function init() {
      isSliding = false
      moveDistance = 0
      success = false
      finished = false
      reset.call(this)
    }

    /**重置canvas */
    function reset() {
      let ins = document.getElementById('sliderCanvas')
      const canvasCtx = ins.getContext('2d')

      let blTack = document.getElementById('block-track')
      blTack.style.width = '60px'
      // 清空画布
      canvasCtx.clearRect(0, 0, this._config.width, this._config.height)
      this.blockCanvas.width = this._config.width //通过改变canvas宽度重置画布更有效
      this.blockCanvas.style.transform = 'translateX(' + 0 + 'px)'
      // x = randomX
      imgUrl = this._config.bgImage[getRandom(0,this._config.bgImage.length-1)]
      
      // 重新加载图片
      if (this.imgInstance) {
        this.imgInstance.setSrc(imgUrl)
      }
    }

    /**
       * 判断是否滑对位置 误差在±5个px
       * @param mDistance 移动的距离
       * @param blockPos 真实随机生成的位置
       */
     function judgeComplete(mDistance, blockPos) {
      return blockPos - 5 <= mDistance && mDistance <= blockPos + 5
    }

    /**随机函数 */
    const getRandom = (start, end,random) => {
      return random&&start<=random&&random<=end?
      random:
      Math.round(Math.random() * (end - start) + start)
    }


   /**
       * 根据线段画拼图
       * @param ctx canvas
       * @param xVal 起始点x坐标
       * @param yVal 起始点y坐标
       * @param operation  操作 'fill' | 'clip'  填充还是裁剪
       */
    const drawPath = (ctx, xVal, yVal, operation) => {
      // ctx.save()
      ctx.beginPath()
      ctx.moveTo(xVal, yVal)
      ctx.arc(xVal + l / 2, yVal - r + 2, r, 0.72 * PI, 2.26 * PI)
      ctx.lineTo(xVal + l, yVal)
      ctx.arc(xVal + l + r - 2, yVal + l / 2, r, 1.21 * PI, 2.78 * PI)
      ctx.lineTo(xVal + l, yVal + l)
      ctx.lineTo(xVal, yVal + l)
      // anticlockwise为一个布尔值。为true时，是逆时针方向，否则顺时针方向
      ctx.arc(xVal + r - 2, yVal + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
      ctx.lineTo(xVal, yVal)
      ctx.lineWidth = 2
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
      ctx.stroke()
      ctx.globalCompositeOperation = 'destination-over'
      // 判断是填充还是裁剪, 裁剪主要用于生成图案滑块
      operation === 'fill' ? ctx.fill() : ctx.clip()
    }


    //设置随机位置
    function setRandomPos(img) {
      let sliderCtx = this.sliderCanvas.getContext('2d')
      let blockCtx = this.blockCanvas.getContext('2d')
      let canvasWidth = this._config.width
      let canvasHeight = this._config.height
      randomX= getRandom(L, canvasWidth - 60,this.randomX)
      let y = getRandom(r * 2, canvasHeight - L,this.randomY)
      drawPath(sliderCtx, randomX, y, 'fill') //画拼图
      drawPath(blockCtx, randomX, y, 'clip') //裁剪拼图图片为滑块

      sliderCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight)
      blockCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight)

      // 提取滑块并放到最左边
      const y1 = y - r * 2
      const ImageData = blockCtx.getImageData(randomX, y1, L, L)
      this.blockCanvas.width = L
      blockCtx.putImageData(ImageData, 0, y1)
    }

    /**创建图片 */
    function createImg(url, onload) {
      let img
      if (this&&this.imgInstance) {
        img = this.imgInstance
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
              if (e&&e.target) {
                img.src = e.target.result 
              }
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

    function draw(url) {
      const img = createImg.call(this,url, () => {
        //加载图片onload完成后的回调开始设置随机位置以及画拼图
        setRandomPos.call(this,img)
      })
      this.imgInstance = img
    }


  function  createCanvas(dom){
    let canvasMain = document.createElement('div')
    canvasMain.setAttribute('id','canvasPannel')
    canvasMain.style.position='relative'
    /** sliderCanvas */
    this.sliderCanvas = document.createElement('canvas')
    this.sliderCanvas.id ='sliderCanvas'
    this.sliderCanvas.width = this._config.width
    this.sliderCanvas.height = this._config.height

    /**blockCanvas */
    this.blockCanvas = document.createElement('canvas')
    this.blockCanvas.id ='blockCanvas'
    this.blockCanvas.width = this._config.width
    this.blockCanvas.height = this._config.height
    console.log('bloack',this.distance)
    this.blockCanvas.style.transform = 'translateX(' + 0 + 'px)'
    this.blockCanvas.style.position = 'absolute'
    this.blockCanvas.style.left = 0
    this.blockCanvas.style.top = 0

    canvasMain.appendChild(this.sliderCanvas)
    canvasMain.appendChild(this.blockCanvas)
    dom.appendChild(canvasMain)
  }

  function mouseUpFn(callback) {
    console.log('移动结束')
    if (sliderActive) {
      if (moveDistance !== 0) {
        //有实际移动距离
        finished = true //完成滑动
        sliderActive = false //设置为不激活状态
        if (judgeComplete(moveDistance, randomX)) {
          //判断是否滑对位置
          //成功
          success = true
          setTimeout(() => {
            // endVertify()
            callback&&callback('success')
          }, 500)
        } else {
          success = false
          let that = this
          setTimeout(() => {
            //失败 调用父组件初始化滑块和canvas的方法
            // parentInit()
            callback&&callback('fail')
            init.call(this)
          }, 500)
        }
      } else {
        console.log('firstmoveDistance',moveDistance)
        init.call(this)
      }
      document.removeEventListener('mouseup', mouseUpFn.bind(this))
      document.removeEventListener('mousemove', moveEvent)
      document.removeEventListener('touchmove',moveEvent);
      document.removeEventListener('touchend',mouseUpFn.bind(this));
    }
    
  }

  function createSlider(dom,callback){
    // console.log('slider',Slider)
    sliderMain = document.createElement('div')
    sliderMain.className = 'slider-main'
    sliderMain.style.width = this._config.width+'px'
    let track = document.createElement('div')
    track.className = 'track'
    track.id = 'block-track'
    let sliderBlock = document.createElement('div')
    sliderBlock.className = 'slider-block'
    let that = this
    console.log('isMobile',isMobile)
    sliderBlock.ontouchstart = function (e) {
      console.log('开始触摸')
      if (finished) {
        //如果是完成的状态不响应事件
        return
      }
      const moveStart = e.clientX||e.touches[0].clientX
      const moveStartY = e.clientY
      sliderActive = true //按下滑块激活状态
      
      moveEvent = (ev) => {
        if (sliderActive) {
          //滑块移动的事件
          isSliding = true //移动滑块 正在移动的状态
          const moveEnd = ev.clientX||ev.touches[0].clientX
          const movingY = ev.clientY
          console.log('开始移动',moveEnd,sliderMain)
          // console.log('moveStartY', moveStartY, movingY)
          // console.log('moveEnd', moveEnd)
          let moving = moveEnd - moveStart //移动的距离
          if (sliderMain) {
            //移动的距离不能小于0和大于主滑块的长度
            moveDistance =
              moving <= 0
                ? 0
                : moving + 60 > sliderMain.clientWidth
                ? sliderMain.clientWidth - 60
                : moving

          }
          console.log('moveDistance',moveDistance)
          track.style.width = moveDistance+60+'px'
          that.blockCanvas.style.transform = 'translateX(' + moveDistance + 'px)'
          // document.addEventListener('mouseup', mouseUpFn.bind(that)) //移动之后开始监听鼠标抬起事件
        }
      }
      document.addEventListener('mousemove', moveEvent)
      document.addEventListener('touchmove',moveEvent);
    }
    let triangle = document.createElement('div')
    triangle.className = 'triangle'

    sliderBlock.appendChild(triangle)
    track.appendChild(sliderBlock)
    sliderMain.appendChild(track)
    dom.appendChild(sliderMain)
    document.addEventListener('mouseup', mouseUpFn.bind(that,callback)) //移动之后开始监听鼠标抬起事件
    document.addEventListener('touchend',mouseUpFn.bind(that,callback));
  }


  function create(dom,callback){
    this.dom = this._bindDom(dom)
    createSlider.call(this,this.dom,callback)
    createCanvas.call(this,this.dom)
    imgUrl = this._config.bgImage[getRandom(0,this._config.bgImage.length-1)]
    draw.call(this,imgUrl)
  }
  function Vertify(dom,conf,callback){
    this.setDom(dom)
    this.callback = callback
    this._init(conf)
    conf.auto&&create.call(this,dom,callback)
  }


  Vertify.prototype = {
    constructor: this,
    dom:'',
    callback:null,
    _config: {
    },
    _defaultConfig: {
      width:420,
      height:210,
      auto:true,
      bgImage:['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg']
    },
    distance:0,
    randomX:0,
    randomY:0,
    setDom:function(dom){
      this.dom = dom
    },
    getDom:function(){
      return this.dom
    },
    setDistance:function(dis){
      this.distance = dis
    },
    getDistance:function(){
      return moveDistance
    },
    setData:function(x,y){
      this.randomX = x + L;
      this.randomY = y + r*2 ;
      create.call(this,this.dom,this.callback)
    },
     /** 初始化内置环境*/
     _init: function (config) {
      this._config = extend(true, this._defaultConfig, config)
    },
    _bindDom:function (dom){
      try {
        return  document.getElementById(dom)
      } catch (error) {
        console.error(error)
      }
    }
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