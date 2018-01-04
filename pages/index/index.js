//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    // catX: 100,
    // catY: 80,
    width: 150,
    avataPath:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    touching:false,
    imageTop:0,
    imageLeft:38,
    dotTop:90,
    dotLeft:130,
    // startX:0,
    // startY:0,
    // endX:0,
    // endY:0,
    scale:1,
    rotate:0,
    // xMove:0,
    // yMove:0
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.draw();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.draw();
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.draw();
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.draw()
  },
  // slider1change(e) {
  //   this.setData({
  //     width: e.detail.value
  //   })
  //   this.draw();
  // },
  // sliderxchange(e) {
  //   this.setData({
  //     catX: e.detail.value
  //   })
  //   this.draw();
  // },
  // sliderychange(e) {
  //   this.setData({
  //     catY: e.detail.value
  //   })
  //   this.draw();
  // },
  onReady() {
    this.image_top = 0;
    this.image_left = 38;
    this.dot_top=90;
    this.dot_left=130;
    this.hat_size=100;
    this.draw();
  },
  draw() {

    if (app.globalData.userInfo||this.data.userInfo.avatarUrl) {
      if(this.data.avataPath){
        this._draw()
      }else{
        wx.getImageInfo({
          src: app.globalData.userInfo.avatarUrl,
          success:(res)=>{
               this.setData({avataPath:res.path});
               this._draw()
          }
      })
      }
    }
  },
  _draw(){
    var context = wx.createCanvasContext('firstCanvas')
    context.clearRect(0, 0, 300, 300);
    context.drawImage(this.data.avataPath, 0, 0, 300, 300)
    context.drawImage('/image/1.png', this.data.catX, this.data.catY, this.data.width, this.data.width)
    context.draw();          //在可以使用`res.path`将网络图片绘制到自`canvas`上了
  },
  canvasToImageFile() {
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: function (res) {
       
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res)
          }, fail(e) {
           
          }
        })
      }
    });
  },
  
  touchstart(e){
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    // this.origindata_top = this.data_top||90;
    // this.origindata_left = this.data_left|| 130;
    if(e.target.id=='redDot'){
        this.enableDrag = true;
    }
    if(e.target.id=='cat'){
      this.enableCatDrag = true;
  }
   
  },
  touchend(e){
    this.enableDrag = false;
    this.enableCatDrag = false;
    this.setData({
      touching:false
    });
    //this.hat_size=this.hat_size*this.data.scale;
    // this.image_top=this.data.imageTop;
    // this.image_left=this.data.imageLeft;
     this.dot_top=this.data.dotTop;
     this.dot_left=this.data.dotLeft;
  },
  touchmove(e){
    var endX= e.touches[0].clientX;
    var endY = e.touches[0].clientY;

    var xMove=endX-this.startX;
    var yMove=endY-this.startY;
    if(this.enableDrag ){
       var orginX=this.image_left+this.hat_size/2;
       var orginY=this.image_top+this.hat_size/2;
       var dotX_start=this.dot_left+10;
       var dotY_start=this.dot_top+10;
       var dotX_end=endX+10;
       var dotY_end=endY+10;
      
       
        var distanceX0=dotX_start-orginX;
        var distanceY0=dotY_start-orginY;
        var distanceX1=dotX_end-orginX;
        var distanceY1=dotY_end-orginY;
        var angle0=Math.atan2(distanceY0,distanceX0)/Math.PI*180;
        var angle1=Math.atan2(distanceY1,distanceX1)/Math.PI*180;
        var distance0=Math.sqrt(distanceX0 * distanceX0 + distanceY0 * distanceY0);
        var distance1=Math.sqrt(distanceX1 * distanceX1 + distanceY1 * distanceY1);
        
        
       this.setData({
        //rotate:Math.atan2(this.yMove,xMove)*2*Math.PI,
        dotTop:endY,
        dotLeft:endX,
        rotate:angle1-angle0,
        scale:distance1/distance0
       });
  
    }
    if(this.enableCatDrag){
     
      this.image_top = this.image_top + yMove;
      this.image_left = this.image_left + xMove;
      this.dot_top = this.dot_top + yMove;
      this.dot_left = this.dot_left + xMove;
      //设置帽子的位置
      this.setData({
        imageTop:this.image_top,
        imageLeft:this.image_left,
        dotTop:this.dot_top,
        dotLeft:this.dot_left,
      });
    }
    this.startX = endX;
    this.startY = endY;
  }
})
