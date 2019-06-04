// pages/shoppingcar/shoppingcar.js
//此页面需要在后台数据库建立之后修改
const app = getApp()
var db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cart_list: [],
    totalPrice: 0,
    selectAllStatus: false,
    startX: 0, //开始坐标
    startY: 0         //现在对startX和startY还没进行操作
  },
  goIndex() {
    wx.switchTab({
      url: "../index/index"
    })
  },
  //点击结算事件？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
  checkOut() {
    // wx.showToast({
    //   title: '此功能尚未开放',
    //   icon: 'loading',
    //   duration: 3000,
    // });

    //首先判断客户是否选择了购物车中的商品
    // var hava_selected = false
    // for(var i=0; i<this.data.cart_list.length; i++){
    //   if (this.data.cart_list[i].selected)

    // }
    wx.navigateTo({
      url: '../submitOrder/submitOrder'
    })
  },
  //
  selectList(e) {
    let selectAllStatus = this.data.selectAllStatus;
    const index = e.currentTarget.dataset.index;
    let cart_list = this.data.cart_list;
    // console.log(cart_list[index].selected);
    const selected = cart_list[index].selected;
    // console.log(cart_list[index].selected);
    cart_list[index].selected = !selected;

    //首先通过index获取对应商品的sjid或_id
    // console.log(e.currentTarget.dataset.id)
    //更新数据库id商品的selected为cart_list[index].selected
    db.collection('cart').doc(e.currentTarget.dataset.id).update({
      data:{
        selected: cart_list[index].selected
      }
    })

    // console.log(selected);
    //购物车列表里的条目只要有一个取消，全选就取消
    const symbol = cart_list.some(cart => {
      return cart.selected === false;
    });
    if (symbol) {
      this.data.selectAllStatus = false;
    } else {
      this.data.selectAllStatus = true;
    }
    this.setData({
      cart_list,
      selectAllStatus: this.data.selectAllStatus
    });
    this.getTotalPrice();
  },
  //
  getTotalPrice() {
    let cart_list = this.data.cart_list;
    let totalPrice = 0;
    for (let i = 0; i < cart_list.length; i++) {
      if (cart_list[i].selected) {
        totalPrice += cart_list[i].sum_money
      }
    }
    // console.log(totalPrice);
    this.setData({
      totalPrice: totalPrice
    });
  },
  //
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let cart_list = this.data.cart_list;
    for (let i = 0; i < cart_list.length; i++) {
      cart_list[i].selected = selectAllStatus;
    }
    this.setData({
      cart_list,
      selectAllStatus
    });
    this.getTotalPrice();
  },
  //？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
  touchstart: function (e) {
    this.data.cart_list.map(item => {
      if (item.isTouchMove) {
        item.isTouchMove = false;
      }
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cart_list: this.data.cart_list
    })
  },
  //滑动事件处理？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
  touchmove(e) {
    var
      index = e.currentTarget.dataset.index, //当前索引
      startX = this.data.startX, //开始X坐标
      startY = this.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = this.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    this.data.cart_list.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    this.setData({
      cart_list: this.data.cart_list
    })
  },
  //？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
  angle(start, end) {
    var X = end.X - start.X,
      Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(Y / X) / (2 * Math.PI);
  },
  //
  delCartItem(e) {
    const index = e.currentTarget.dataset.index;
    // console.log(index);
    this.data.cart_list.splice(index, 1);
    wx.clearStorageSync("select_num");
    this.setData({
      cart_list: this.data.cart_list
    });
    //此处需要删除数据库中的对应项
    db.collection('cart').doc(e.currentTarget.dataset.id).remove({
      success:res=>{
        console.log(res)
      }
    })
  },


  onLoad: function (options) {
    var that = this
    db.collection('cart').where({
      _openid: app.globalData.openid
    }).get({
      success: res =>{
        that.setData({
          cart_list: res.data   //这个数组里边的元素是一个对象
        })
      }
    })
    
    //另外需要定义一个云函数来批量初始化购物车中商品的selected选项为false
    wx.cloud.callFunction({
      name: 'set_selected'
    })

    totalPrice
  },


  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const attr_item = wx.getStorageSync('attr_item');
    // console.log(attr_item)
     return
    let cart_list = this.data.cart_list;
     arr = [attr_item, ...arr]
    cart_list = [...attr_item];
     arr.push(temp);
    // console.log(cart_list);
    const select_num = cart_list.map(item => {
      return item.select_num;
    })
    //  console.log(select_num);
    let goods_sum = 0;
    for (let i = 0, len = select_num.length; i < len; i++) {
      goods_sum += select_num[i];
    }
    wx.setStorageSync('goods_sum', goods_sum);
    // console.log(goods_sum);
    //  console.log(temp)
    this.setData({
      cart_list
    });
    // console.log(this.data.cart_list);
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

  }
})
