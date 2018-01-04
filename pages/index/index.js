// pages/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgPic:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  chooseImage(from){
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: [from.target.dataset.way],
      success:(res)=> {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        this.setData({
          bgPic:res.tempFilePaths[0]
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getAvatar(){
    if (app.globalData.userInfo) {
      this.setData({
        bgPic: app.globalData.userInfo.avatarUrl
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            bgPic: res.userInfo.avatarUrl
          })
        }
      })
    }
  },
  nextPage(){
    if (this.data.bgPic){
      app.globalData.bgPic=this.data.bgPic;
      wx.navigateTo({
        url: '../imageeditor/imageeditor',
      })
    }else{
      return
    }
  }
})