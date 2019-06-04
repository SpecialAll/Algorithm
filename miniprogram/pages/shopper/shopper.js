//shopper.js
var app = getApp()
var db = wx.cloud.database()
Page({
  data: {
    pageType: 1,
    userInfo: {},
    orderOrBusiness: 'order',
    map_address: '',
    autoplay: true,
    interval: 10000,
    duration: 10000,
    vertical: true,
    circular: true,
    xd: 0,
    chooseAll: false,
    source: [
      // {
      //   imgsrc: '/images/img/food2.jpg',
      //   content: '菜品一'
      // },
      // {
      //   imgsrc: '/images/img/food2.jpg',
      //   content: '菜品二'
      // },
      // {
      //   imgsrc: '/images/img/food2.jpg',
      //   content: '菜品三'
      // },
      // {
      //   imgsrc: '/images/img/food2.jpg',
      //   content: '菜品四'
      // },
      // {
      //   imgsrc: '/images/img/food2.jpg',
      //   content: '菜品五'
      // },
    ]
  },
  saoma: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        that.setData({
          restaurant: true
        })
        wx.setNavigationBarTitle({ title: '点餐' })
      },
      fail: (res) => {
        that.setData({
          restaurant: false
        });
      }
    })
  },
  getAddress: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        if (res.address.length > 10) {
          res.address = res.address.substr(0, 10) + '...'
        }
        that.setData({
          map_address: res.address
        })
      },
    })
  },
  onLoad: function () {
    var that = this
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     var address
    //     wx.request({
    //       url: 'http://api.map.baidu.com/geocoder/v2/?ak=LClVsCTaW2aH8MzuviP1YMymrHWOIVvg&coordtype=gcj02ll&location=' + latitude + ',' + longitude + '&output=json&pois=0',
    //       method: "get",
    //       success: function (res) {
    //         address = res.data.result.formatted_address;
    //         address = address.split('省')[1].split('市')[1];
    //         // that.setData({
    //         //   map_address: address
    //         // })
    //         // console.log(that.data.map_address)
    //       }
    //     })
    //   }
    // })

    // wx.cloud.callFunction({
    //   name: 'get_location'
    // }).then(res => {
    //   // that.setData({
    //   //   map_address: address
    //   // })
    //   console.log(res)
    // })

    app.getUserInfo(function (userInfo) {
      // console.log(userInfo)
      that.setData({
        userInfo: userInfo,
        img: userInfo.avatarUrl
      })
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: (res.windowHeight * .57) + 'px'
        })
      }
    })

    //我要开始渲染对应商家的商品信息了
    // console.log(app.globalData.sjid)       //数据没毛病

    db.collection('shangpin').where({
      sjid: app.globalData.sjid
    }).get({
      success: res => {
        // console.log(res.data)
        that.setData({
          source: res.data
        })
      }
    })



  },
  takeOut: function () {
    this.setData({
      restaurant: false
    })
    wx.setNavigationBarTitle({ title: '外卖' })
  },
  turnMenu: function (e) {
    var type = e.target.dataset.index;
    console.log(type)
    this.setData({
      orderType: type
    })
  },
  searchKey: function (e) {
    this.setData({
      searchKey: e.detail.value
    })
  },
  searchBtn: function () {
    var keyWork = this.data.searchKey;
    wx.redirectTo({
      url: '../test/test',
    })
    wx.request({
      url: '',
      data: {

      },
      success: function (res) {

      }
    })
  },
  tabChange: function (e) {
    var type = e.currentTarget.dataset.id;
    this.setData({
      orderOrBusiness: type
    })
  },
  tofooddetails:function(e){
    app.globalData.spid = e.currentTarget.dataset.spid;
    wx.navigateTo({
      url: '../productdetails/productdetails',
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