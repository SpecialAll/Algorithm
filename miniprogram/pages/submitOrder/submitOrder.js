const app = getApp()
var db = wx.cloud.database()

Page({
  data: {
    block: false,
    restaurant: false,
    check: true,
    list: [],
    allMoney:0
  },


  onLoad: function(){
    var that = this

    //从哪个页面跳到这个页面的？这里需要记载一下，以便请求得到不同的数据！
    var pages = getCurrentPages()
    var formerPage = pages[pages.length-2]
    var url = formerPage.route
    // console.log(typeof (url))
    if (url === 'pages/shoppingcar/shoppingcar'){
      //此时加载购物车中的数据,即从cart中加载slected == true的数据
      db.collection('cart').where({
        selected: true
      }).get().then(res=>{
        console.log(res.data)
        that.setData({
          list: res.data
        })
        // console.log(this.data.list)
      })
      .catch(err=>{
        console.log(err)
      })
    }else if (url === 'pages/productdetails/productdetails'){
      //此时直接加载商品数据，即从shangpin数据表中加载数据，另外加上页面的app.golbalData.num
      db.collection('shangpin').where({
        spid: app.globalData.spid
      }).get()
      .then(res=>{
        // console.log(res)
        res.num = app.globalData.num 
        that.setData({
          'list': res,
          // 'list.num': app.globalData.num  
          // console.log(list)
        })
        console.log(this.data.list)
      })
      .catch(err=>{
        console.log(err)
      })

    }
  },


  calling: function() {
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
  Block: function() {
    this.setData({
      block: true
    })
  },
  takeOut: function(){
    this.setData({
      restaurant: false
    })
  },
  Cancel: function() {
    this.setData({
      block: false,
      check: true,
      restaurant: false
    })
  },
  Ok: function () {
    var that = this; 
    this.setData({
      block: false,
    })
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        that.setData({                    
          restaurant: true
        })
      },
      fail: (res) => {
        that.setData({
          restaurant: false,
          check: true
        });    
      }
    })
  },

  toMyAddress: function () {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  submitOrder () {
    // wx.requestPayment({
    //   'timeStamp': data.timeStamp.toString(),
    //   'nonceStr': data.nonceStr,
    //   'package': data.package,
    //   'signType': 'MD5',
    //   'paySign': data.sign,
    //   'success': function (res) {
    //     console.log('支付成功');
    //   },
    //   'fail': function (res) {
    //     console.log('支付失败');
    //     return;
    //   },
    //   'complete': function (res) {
    //     console.log('支付完成');
    //     var url = that.data.url;
    //     console.log('get url', url)
    //     if (res.errMsg == 'requestPayment:ok') {
    //       wx.showModal({
    //         title: '提示',
    //         content: '充值成功'
    //       });
    //       if (url) {
    //         setTimeout(function () {
    //           wx.redirectTo({
    //             url: '/pages' + url
    //           });
    //         }, 2000)
    //       } else {
    //         setTimeout(() => {
    //           wx.navigateBack()
    //         }, 2000)
    //       }
    //     }
    //     return;
    //   }

    // })
    wx.switchTab({
      url: '../order/order',
    })

  }




})