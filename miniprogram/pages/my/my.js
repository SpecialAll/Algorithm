//my.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    sendnei: null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    var that = this
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      that.setData({
        userInfo: app.globalData.userInfo,
        rec_id: app.globalData.rec_id,
        openid: app.globalData.openid
      })
    }
  },
  myOrderTap: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.switchTab({
        url: '../order/order',
      })
    }
  },
  myAddressTap: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../address/address',
      })
    }
  },
  
  //点击跳转到个人资料界面
  jumpBtn: function (options) {
    wx.navigateTo({
      url: '/pages/personaldata/personaldata',
    })
  },
  //联系客服电话
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '13619219220',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
 //点击跳转到意见反馈
  advice: function (options) {
    wx.navigateTo({
      url: '/pages/advice/advice',
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '食客',
      path: '/pages/list/list?id=' + that.data.scratchId,
      success: function (res) {
        // 转发成功
        that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
