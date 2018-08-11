var app = getApp();
var interval = null //倒计时函数
Page({
  data: {
    employeeID: "",
    employeeName: "",
    phone: "",
    code: "",


    disabled: false,
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 61
  },

  inputCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  onLoad: function() {
    var that = this;
    that.setData({
      employeeID: wx.getStorageSync('employee').ID,
      employeeName: wx.getStorageSync('employee').name,
      phone: wx.getStorageSync('employee').phone.substring(1, 100),
    })
    console.log(that.data);
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

          interval = setInterval(function () {
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


  checkPhone: function() {
    var that = this;
    console.log(that.data);
    wx.request({
      url: app.globalData.host + '/employee/codechk',
      method: 'POST',
      data: {
        employeeID: that.data.employeeID,
        code: that.data.code
      },
      header: {
        'Cookie': 'JSESSIONID=' + that.data.codeSessionID,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res);
        if (res.data.result == 'success') {
          wx.showModal({
            title: '验证成功',
            content: '恭喜您手机号码已经验证通过,点确认打开首页',
            showCancel: false,
            success: function(res) {
              var oldEmployee = wx.getStorageSync('employee');
              oldEmployee.phone = oldEmployee.phone.substring(1, 100);
              console.log(oldEmployee);
              wx.setStorageSync('employee', oldEmployee);
              wx.switchTab({
                url: '../index/index',
              })
            }
          })
        }
      },
      fail: function() {
      }
    })
  }


  // this.setData({
  //   checkboxItems: checkboxItems
  // });
});