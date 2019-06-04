// var app = getApp()
// Page({
//   data: {
//     region: ['陕西省', '西安市', '长安区']
//   },
//   onLoad: function (options) {
//     var that = this
//     var from = options.from
//     that.setData({
//       from: from
//     })
//   },
//   bindRegionChange: function (e) {
//     this.setData({
//       region: e.detail.value
//     })
//   },
//   formSubmit: function (e) {
//     var that = this
//     var openid = app.globalData.openid
//     var formdata = e.detail.value
//     if (!formdata.receiver || !formdata.contact || !formdata.detail_address) {
//       wx.showToast({
//         title: '请完整填写收货信息',
//         image: '/images/img/tanhao.png',
//         duration: 1200,
//         mask: true
//       })
//     } else {
//       var postdata = {
//         openid: openid,
//         receiver: formdata.receiver,
//         contact: formdata.contact,
//         detail_address: formdata.detail_address,
//         address: formdata.address,
//         idno: formdata.idno
//       }

//       //添加到数据库
//       wx.request({
//         url: app.globalData.requestUrl + '/address/address',
//         data: postdata,
//         header: {
//           'content-type': ''
//         },
//         method: 'post',
//         success: function (res) {
//           var pages = getCurrentPages()
//           var prevPage = pages[pages.length - 2]
//           wx.request({
//             url: app.globalData.requestUrl + '/address/getAddressInfo',
//             data: { openid: app.globalData.openid },
//             header: {
//               'content-type': ''
//             },
//             method: 'post',
//             success: function (res) {
//               if (res.data.result.length == 0) {
//                 prevPage.setData({
//                   show_address: false,
//                   from: that.data.from
//                 })
//               } else {
//                 prevPage.setData({
//                   show_address: true,
//                   address_info: res.data.result,
//                   from: that.data.from
//                 })
//               }
//             }
//           })
//           //返回上一个页面
//           wx.navigateBack({
//             delta: 1
//           })
//         }
//       })
//     }

//   },
// })













var app = getApp()
Page({
  data: {
    region: ['陕西省', '西安市', '长安区']
  },
  onLoad: function () {
    // var that = this
    // var from = options.from
    // that.setData({
    //   from: from
    // })


    // console.log(options)
    // wx.cloud.init()
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  formSubmit: function (e) {
    // wx.cloud.init()
    const db = wx.cloud.database()
    // console.log(e)
    var formdata = e.detail.value
    if (!formdata.receiver || !formdata.contact || !formdata.detail_address) {
      wx.showToast({
        title: '请填写完整信息',
        image: '../../../images/img/me.jpg',
        duration: 2000,
        mask: true
      })
    }
    else {
      db.collection('address_manage').add({
        data: {
          receiver: formdata.receiver,
          idno: formdata.idno,
          contact: formdata.contact,
          detail_address: formdata.detail_address,
        }
      }).then(res => {
        wx.showToast({
          title: '信息填写成功',
          image: '../../../images/img/time_ic_select.png',
          duration: 2000,
          mask: true
        })

        //关闭当前页面返回上一级
        setTimeout(res => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
        

      }).catch(err => {
        console.log(err)
      })



    }

  },
})