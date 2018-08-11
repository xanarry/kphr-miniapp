var app = getApp();
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeSessionID: '',
    employeeID: '',
    password: '',
    confirmPassword: '',
    phone: '',
    code: '',




    disabled: false,
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 61
  },


  employeeID: function(e) {
    this.setData({
      employeeID: e.detail.value
    })
  },
  password: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  confirmPassword: function(e) {
    this.setData({
      confirmPassword: e.detail.value
    })
  },
  phone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  code: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  employeeIDBlur: function(e) {
    var that = this;
    console.log(e.detail.value);
    wx.request({
      url: app.globalData.host + '/employee/detail?employeeID=' + that.data.employeeID,
      method: 'GET',
      success: function(res) {
        console.log(res.data);
        if (res.data != null) {
          that.setData({
            phone: res.data.phone
          })
        } else {
          wx.showModal({
            title: '错误',
            content: '您输入的工号不存在',
            showCancel: false
          })
        }
      },
      fail: function(res) {

      }
    })
  },

  submit: function() {
    var that = this;
    console.log(that.data);
    if (that.data.employeeID.length == 0) {
      wx.showToast({
        title: '工号不能为空',
        icon: 'none'
      })
      return;
    }
    if (that.data.password.length == 0) {
      wx.showToast({
        title: '密码长度不能少于8位',
        icon: 'none'
      })
      return;
    } else if (that.data.password != that.data.confirmPassword) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none'
      })
      return;
    }
    if (that.data.code == null || that.data.code.length == 0) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none'
      })
      return;
    }
    wx: wx.request({
      url: app.globalData.host + '/employee/retrieve-password',
      data: {
        'employeeID': that.data.employeeID,
        'password': that.data.password,
        'code': that.data.code
      },
      header: {
        'Cookie': 'JSESSIONID=' + that.data.codeSessionID,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        if (res.data.result == 'success') {
          wx.showModal({
            title: '操作成功',
            content: '恭喜您已经成功重设密码,点确定马上去登陆',
            success: function() {
              wx.redirectTo({
                url: '../login/login',
              })
            }
          })
        }
      },
      fail: function(res) {}
    })
  },

  getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime

    if (that.data.disabled == true) {
      return;
    }

    wx: wx.request({
      url: app.globalData.host + '/employee/send-code?employeeID=' + that.data.employeeID,
      success: function(res) {
        console.log(res.data);

        if (res.data.codeSessionID != "") {
          that.setData({
            codeSessionID: res.data.codeSessionID,
            disabled: true
          })

          wx.showToast({
            title: '验证码发送成功',
            icon: 'none'
          })

          interval = setInterval(function() {
            currentTime--;
            that.setData({
              time: currentTime + '秒'
            })
            if (currentTime <= 0) {
              clearInterval(interval)
              that.setData({
                time: '重新发送',
                currentTime: 61,
                disabled: false
              })
            }
          }, 1000)
        } else {
          wx.showToast({
            title: '验证码发送失败',
            icon: 'none'
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  sendCode: function() {
    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})