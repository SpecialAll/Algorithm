var app = getApp()
var db = wx.cloud.database()
Page({
  data: {
    foodtype: 0,
    num: 1,
    buycar_num: 0,
    totalMoney: 0,
    block: false,
    arr: [
      { count: 0, value: "香辣味" },
      { count: 1, value: "盐焗味" },
      { count: 2, value: "蒜香味" },
      { count: 3, value: "姜葱味" },
    ]
  },

  onLoad: function () {
    var that = this
    db.collection('shangpin').where({
      spid: app.globalData.spid
    }).get().then(res=>{
      // console.log(res)
      that.setData({
        shangpin: res
      })
    })

    // this.setData({
    //   buycar_num: app.globalData.buycar_num,
    //   totalMoney: app.globalData.totalMoney
    // })
  },


  resetNum: function (e) {
    var type = e.currentTarget.dataset.count;
    this.setData({
      foodtype: type
    })
    // console.log(this.data.arr[this.data.foodtype])
  },


  reduce: function () {
    if (this.data.num > 1) {
      app.globalData.buycar_num--;
      app.globalData.totalMoney -= this.data.price;
      var totalMoney = app.globalData.totalMoney.toFixed(2)
      this.setData({
        num: this.data.num - 1,
        buycar_num: app.globalData.buycar_num,
        totalMoney: totalMoney,
        'app.globalData.num': this.data.num - 1
      })
    }
  },


  add: function () {
    app.globalData.buycar_num++;
    app.globalData.totalMoney += this.data.price;
    var totalMoney = app.globalData.totalMoney.toFixed(2)
    this.setData({
      num: this.data.num + 1,
      buycar_num: app.globalData.buycar_num,
      totalMoney: totalMoney,
      'app.globalData.num': this.data.num + 1
    })
    // console.log(this.data.num)
  },
  close: function () {
    this.setData({
      block: false
    })
  },
  open: function () {
    this.setData({
      block: true
    })
  },

  
  submit: function () {
    var that = this;
    var i = this.data.foodtype;
    var id;  //哪种食物
    wx.request({
      url: '',
      data: {
        type: that.data.arr[i].value,
        num: that.data.num
      },
      success: function (res) {
        that.setData({
          block: false
        })
        console.log(res.data)
      }
    })
  },
  /**
   * 加入购物车
   */
  addCar: function (e) {
    // var goods = this.data.goods;
    // // goods.isSelect = true;
    // var count = this.data.goods.count;
    // var title = this.data.goods.title;

//现在需要向cart数据表中添加数据了,包括商品的名称 数量 味道
    // console.log(this.data.shangpin.data[0].name)
    // console.log(this.data.arr[this.data.foodtype].value)
    var that = this

    var sum_money = this.data.shangpin.data[0].price * this.data.num
    db.collection('cart').add({
      data: {
        name: this.data.shangpin.data[0].name,
        sjid: this.data.shangpin.data[0].sjid,
        spid: this.data.shangpin.data[0].spid,
        taste: this.data.arr[this.data.foodtype].value,
        num: this.data.num,
        price: this.data.shangpin.data[0].price,
        sum_money: sum_money,
        fileid: this.data.shangpin.data[0].fileid,
        selected: false
      }
    }).then(res=>{
      //添加到cart数据库成功，此时应该去掉小页面了！！！我觉得这里需要一个属性的否定形式即可！！
      that.setData({
        block: false
      })
      //关闭窗口
      wx.showToast({
        title: '加入购物车成功！',
        icon: 'success',
        duration: 2000
      })
    }).catch(err=>{
      console.log(err)
    })

    
    // if (title.length > 13) {
    //   goods.title = title.substring(0, 13) + '...';
    // }
    // // 获取购物车的缓存数组（没有数据，则赋予一个空数组）  
    // var arr = wx.getStorageSync('cart_list') || [];
    // // console.log("arr,{}", arr);
    // if (arr.length > 0) {
    //   // 遍历购物车数组  
    //   for (var j in arr) {
    //     // 判断购物车内的item的id，和事件传递过来的id，是否相等  
    //     if (arr[j].goodsId == goodsId) {
    //       // 相等的话，给count+1（即再次添加入购物车，数量+1）  
    //       arr[j].count = arr[j].count + 1;
    //       // 最后，把购物车数据，存放入缓存（此处不用再给购物车数组push元素进去，因为这个是购物车有的，直接更新当前数组即可）  
    //       try {
    //         wx.setStorageSync('cart', arr)
    //       } catch (e) {
    //         console.log(e)
    //       }
    //       //关闭窗口
    //       wx.showToast({
    //         title: '加入购物车成功！',
    //         icon: 'success',
    //         duration: 2000
    //       });
    //       this.closeDialog();
    //       // 返回（在if内使用return，跳出循环节约运算，节约性能） 
    //       return;
    //     }
    //   }
    //   // 遍历完购物车后，没有对应的item项，把goodslist的当前项放入购物车数组  
    //   arr.push(goods);
    // } else {
    //   arr.push(goods);
    // }
    // // 最后，把购物车数据，存放入缓存  
    // try {
    //   wx.setStorageSync('cart', arr)
    //   // 返回（在if内使用return，跳出循环节约运算，节约性能） 
    //   //关闭窗口
    //   wx.showToast({
    //     title: '加入购物车成功！',
    //     icon: 'success',
    //     duration: 2000
    //   });
    //   this.closeDialog();
    //   return;
    // } catch (e) {
    //   console.log(e)
    // }

  },

  buyNow: function (e) {
    // console.log(e.currentTarget.dataset.num)
    //购买数量为e.currentTarget.dataset.num
    app.globalData.num = e.currentTarget.dataset.num
                // 使用getCurrentPages可以获取当前加载中所有的页面对象的一个数组，数组最后一个就是当前页面。
                // var pages = getCurrentPages() //获取加载的页面
                // var currentPage = pages[pages.length - 1] //获取当前页面的对象
                // var url = currentPage.route //当前页面url
                // var options = currentPage.options //如果要获取url中所带的参数可以查看options

    // var pages = getCurrentPages()
    // var currentPage = pages[pages.length-1]
    // var url = currentPage.route
    // console.log(url)  
    // app.globalData.url = 

    wx.navigateTo({
      url: '../submitOrder/submitOrder'
    })
  }

})