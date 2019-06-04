// component/feedbackcomp/feedbackcomp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sendmsg:{
      type:Object,
      value:""
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isShow:false,
    animationpop:null,
    feedmsg:"",
    iserror:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    textareinput(ev){
      console.log(ev)
      this.setData({
        feedmsg:ev.detail.value
      })
    },
    queren(){
      let tmpobj = {
        type: this.data.sendmsg.type,
        value: this.data.feedmsg
      }
      if (this.data.feedmsg !=""){
        this.setData({
          iserror: false
        })
        this.triggerEvent("querentap", tmpobj)
      }else{
        this.setData({
          iserror:true
        })
      }
     
    },
    showpop(){
      this.setData({
        isShow:true
      })
      this.animationpop.opacity(1).step()
      this.setData({
        animationpop: this.animationpop.export()
      })
    },
    hidepop() {
      this.animationpop.opacity(0).step()
      this.setData({
        animationpop: this.animationpop.export()
      })

      setTimeout(()=>{
        this.setData({
          isShow: false
        })
      },500)
    }
  },
  created(){
    var animationpop = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })

    this.animationpop = animationpop;
   
  },
  ready(){
   
  }
})
