var app = getApp();
Page({
  data: {
    employeeID: null,
    newPassword: null,
    confirmNewPassword: null
  },

  onLoad: function (options) {
    console.log(options);
    this.data.employeeID = options.employeeID;
  },

  onShow: function() {
    wx.showToast({
      title: '首次登陆,请在更改设置新密码之后使用!',
      icon: 'none',
      duration: 2000
    })
  },

  newPassword: function(e) {
    this.data.newPassword = e.detail.value;
  },

  confirmNewPassword: function (e) {
    this.data.confirmNewPassword = e.detail.value;
  },

  resetPassword:function() {
    var that = this;
    if (that.data.newPassword.length < 8) {
      wx.showToast({
        title: '密码长度不能少于8为字符',
        icon: 'none'
      })
    } else if (that.data.newPassword != that.data.confirmNewPassword) {
      wx.showToast({
        title: '您两次输入的密码不一致,请检查',
        icon: 'none'
      })
    }  else {
      wx.request({
        url: app.globalData.host + '/employee/reset-password',
        data: {
          employeeID: that.data.employeeID,
          password: that.data.newPassword
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.result == 'success') {
            wx.redirectTo({
              url: '../login/login?resetPassword=true',
            })
          } else {
            wx.showToast({
              title: res.result,
              icon: 'none'
            })
          }
        },
        fail: function(res) {
          wx.showModal({
            title: '请求服务器错误',
            content: res,
          })
        }
      })
    }
  }
});