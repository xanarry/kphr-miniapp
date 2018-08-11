var app = getApp();
Page({
  data: {
      employeeID: null,
      password: null
  },

  onLoad: function(options) {
    if (options.resetPassword == 'true') {
      wx.showToast({
        title: '密码修改成功,请登录!',
        icon: 'none'
      })
    }
  },

  employeeID: function(e) {
    this.data.employeeID = e.detail.value;
  },

  password: function(e) {
    this.data.password = e.detail.value;
  },

  login: function(e) {
    var that = this;
    console.log("++++" + that.data.employeeID)
    wx: wx.request({
      url: app.globalData.host + '/employee/login',
      data: {
        employeeID: that.data.employeeID,
        password: that.data.password
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res.data);
        var result = res.data.result;
        if (result == '登陆密码错误' || result == '工号不存在') {
          wx.showToast({
            title: result,
            icon: 'none',
            duration: 2000
          })
        } else if (result == '首次登陆,请设置新密码') {
          wx.redirectTo({
            url: '../resetPassword/resetPassword?employeeID=' + that.data.employeeID,
          })
        } else {
          //登陆成功
          console.log("登陆成功");
          wx.setStorageSync("sessionID", res.data.sessionID);
          wx.setStorageSync("employee", res.data.employee);
          wx.switchTab({
            url: '../index/index',
          })
        }
      },
      fail: function(res) {
        console.log(res.data);
      },
    })
  }
});