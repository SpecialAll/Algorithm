//index.js
var app = getApp()
var db = wx.cloud.database()
Page({
  data: {
    imgUrls: [
      '/images/more/1.jpg',
      '/images/more/2.jpg',
      '/images/more/3.jpg'
    ],
    pageType: 1,
    userInfo: {},
    newOrold: 'new',
    autoplay: true,
    interval: 10000,
    duration: 10000,
    vertical: true,
    circular: true,
    xd: 0,
    chooseAll: false,
    source1: [],
    source2:[]
  },
  onLoad: function () {
    const _ = db.command
    var that = this

    db.collection('shangjia').where({
      sjid:_.in([1,3,5,7,9,11,13])
    }).get({
      success: res => {
        // console.log(res.data)
        that.setData({
          source1: res.data
        })
      }
    })
    db.collection('shangjia').where({
      sjid:_.in([2,4,6,8,10,12,14])
    }).get({
      success: res => {
        // console.log(res.data)
        that.setData({
          source2: res.data
        })
      }
    })
  },

  turnMenu: function(e){
    var type = e.target.dataset.index;
    console.log(type)
    this.setData({
      orderType: type
    })
  },
  // searchKey: function (e) {
  //   this.setData({
  //     searchKey: e.detail.value
  //   })
  // },

  // searchBtn: function(){
  //   var keyWork = this.data.searchKey;
  //   wx.redirectTo({
  //     url: '../test/test',
  //   })

  //   wx.request({
  //     url: '',
  //     data: {

  //     },
  //     success: function (res) {

  //     }
  //   })
  // },
  tabChange: function (e) {
    var type = e.currentTarget.dataset.id;
    this.setData({
      newOrold: type
    })
  },
  shopper: function (e) {
    //此处先获得对应商家的sjid,并设置为全局变量!!!!!
    // console.log(e.currentTarget.dataset.sjid)
    
    app.globalData.sjid = e.currentTarget.dataset.sjid
    

    wx.navigateTo({
      url: '../shopper/shopper',
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