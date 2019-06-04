// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
// exports.main = async (event, context) => {
//   var that = this
//   return await wx.getLocation({
//       type: 'gcj02',
//       // // 云函数的异步函数只能用promise风格
//       // success: function (res) {
//       //   var latitude = res.latitude
//       //   var longitude = res.longitude
//       //   var address
//       //   wx.request({
//       //     url: 'http://api.map.baidu.com/geocoder/v2/?ak=LClVsCTaW2aH8MzuviP1YMymrHWOIVvg&coordtype=gcj02ll&location=' + latitude + ',' + longitude + '&output=json&pois=0',
//       //     method: "get",
//       // // 云函数的异步函数只能用promise风格
//       //     success: function (res) {
//       //       address = res.data.result.formatted_address;
//       //       address = address.split('省')[1].split('市')[1];
//       //       that.setData({
//       //         address: address
//       //       })
//       //       // console.log(that.data.map_address)
//       //     }
//         }).then(res=>{
//           success: res=>{
//             var latitude = res.latitude
//             var longitude = res.longitude
//             var address
//             wx.request({
//               url: 'http://api.map.baidu.com/geocoder/v2/?ak=LClVsCTaW2aH8MzuviP1YMymrHWOIVvg&coordtype=gcj02ll&location=' + latitude + ',' + longitude + '&output=json&pois=0',
//               method: "get"
//             }).then(res=>{
//               address = res.data.result.formatted_address;
//               address = address.split('省')[1].split('市')[1];
//               that.setData({
//                 address: address
//               })
//             })
//           }
//   })
// }

exports.main = async (event, context) => {
  var that = this
  return await new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
    }).then(res => {
        var latitude = res.latitude
        var longitude = res.longitude
        var address
        wx.request({
          url: 'http://api.map.baidu.com/geocoder/v2/?ak=LClVsCTaW2aH8MzuviP1YMymrHWOIVvg&coordtype=gcj02ll&location=' + latitude + ',' + longitude + '&output=json&pois=0',
          method: "get"
        }).then(res => {
          address = res.data.result.formatted_address;
          address = address.split('省')[1].split('市')[1];
          resolve(address)
        })
    })
  })
}

  

}