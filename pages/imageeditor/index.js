//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    imageResource:"",
    combine:false,
    imgList:[1,2,3,4,5,6,7,8,9,10],
    currentHatId:1,

    hatCenterX:wx.getSystemInfoSync().windowWidth/2,
    hatCenterY:150,
    cancelCenterX:wx.getSystemInfoSync().windowWidth/2-50-2,
    cancelCenterY:100,
    handleCenterX:wx.getSystemInfoSync().windowWidth/2+50-2,
    handleCenterY:200,

    hatSize:100,

    scale:1,
    rotate:0
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      
      this.setData({
        userInfo: app.globalData.userInfo,
        combine:false
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
  },
  onReady(){
    this.hat_center_x=this.data.hatCenterX;
    this.hat_center_y=this.data.hatCenterY;
    this.cancel_center_x=this.data.cancelCenterX;
    this.cancel_center_y=this.data.cancelCenterY;
    this.handle_center_x=this.data.handleCenterX;
    this.handle_center_y=this.data.handleCenterY;

    this.scale=this.data.scale;
    this.rotate=this.data.rotate;
    
    this.touch_target="";
    this.start_x=0;
    this.start_y=0;
  },
  touchStart(e){
    if(e.target.id=="hat"){
      this.touch_target="hat";
    }else if(e.target.id=="handle"){
      this.touch_target="handle"
    }else{
      this.touch_target=""
    };
    
    if(this.touch_target!=""){
      this.start_x=e.touches[0].clientX;
      this.start_y=e.touches[0].clientY;
    }
  },
  touchEnd(e){
      this.hat_center_x=this.data.hatCenterX;
      this.hat_center_y=this.data.hatCenterY;
      this.cancel_center_x=this.data.cancelCenterX;
      this.cancel_center_y=this.data.cancelCenterY;
      this.handle_center_x=this.data.handleCenterX;
      this.handle_center_y=this.data.handleCenterY;
    // }
    this.touch_target="";
    this.scale=this.data.scale;
    this.rotate=this.data.rotate;
  },
  touchMove(e){
      var current_x=e.touches[0].clientX;
      var current_y=e.touches[0].clientY;
      var moved_x=current_x-this.start_x;
      var moved_y=current_y-this.start_y;
      if(this.touch_target=="hat"){
        this.setData({
          hatCenterX:this.data.hatCenterX+moved_x,
          hatCenterY:this.data.hatCenterY+moved_y,
          cancelCenterX:this.data.cancelCenterX+moved_x,
          cancelCenterY:this.data.cancelCenterY+moved_y,
          handleCenterX:this.data.handleCenterX+moved_x,
          handleCenterY:this.data.handleCenterY+moved_y
        })
      };
      if(this.touch_target=="handle"){
        this.setData({
          handleCenterX:this.data.handleCenterX+moved_x,
          handleCenterY:this.data.handleCenterY+moved_y,
          cancelCenterX:2*this.data.hatCenterX-this.data.handleCenterX,
          cancelCenterY:2*this.data.hatCenterY-this.data.handleCenterY
        });
        var diff_x_before=this.handle_center_x-this.hat_center_x;
        var diff_y_before=this.handle_center_y-this.hat_center_y;
        var diff_x_after=this.data.handleCenterX-this.hat_center_x;
        var diff_y_after=this.data.handleCenterY-this.hat_center_y;
        var distance_before=Math.sqrt(diff_x_before*diff_x_before+diff_y_before*diff_y_before);
        var distance_after=Math.sqrt(diff_x_after*diff_x_after+diff_y_after*diff_y_after);
        var angle_before=Math.atan2(diff_y_before,diff_x_before)/Math.PI*180;
        var angle_after=Math.atan2(diff_y_after,diff_x_after)/Math.PI*180;
        this.setData({
          scale:distance_after/distance_before*this.scale,
          rotate:angle_after-angle_before+this.rotate,
        })
      }
      this.start_x=current_x;
      this.start_y=current_y;
  },
  combinePic(e){
    this.setData({
      combine:true
    });
    wx.getImageInfo({
      src: this.data.userInfo.avatarUrl,
      success:res=>{
        this.setData({
          imageResource:res.path
        });
        this.draw();
      }
    })
  },
  draw(){
    const pc=wx.createCanvasContext('myCanvas');
    const windowWidth=wx.getSystemInfoSync().windowWidth;
    const hat_size=this.data.hatSize*this.scale;


    pc.clearRect(0, 0, windowWidth, 300);
    pc.drawImage(this.data.imageResource,windowWidth/2-150,0,300,300);
    pc.translate(this.hat_center_x,this.hat_center_y);
    pc.rotate(this.rotate* Math.PI / 180);
    pc.drawImage("../../image/"+this.data.currentHatId+".png",-hat_size/2,-hat_size/2,hat_size,hat_size);
    pc.draw();
  },
  savePic(){
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    wx.canvasToTempFilePath({
      x: windowWidth / 2 - 150,
      y:0,
      height:300,
      width:300,
      canvasId: 'myCanvas',
      success:  (res) =>{
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:(res)=> {
            this.setData({
              combine:false
            })
          }, fail(e) {
            console.log("err:"+e);
          }
        })
      }
    });
  },

  chooseImg(e){
    console.log(e);
    this.setData({
      currentHatId:e.target.dataset.hatId
    })
  }
})