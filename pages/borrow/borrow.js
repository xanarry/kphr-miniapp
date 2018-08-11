var app = getApp();
Page({
  data: {
    amount: 0,
    reason: ""
  },

  amount: function (e) {
    this.setData({
      amount: e.detail.value
    })
  },
  reason: function (e) {
    console.log(e.detail.value);
    this.setData({
      reason: e.detail.value || ''
    })
  },

  submit: function () {
    var that = this;
    wx.showLoading({
      title: '提交数据中',
    })
    if (that.data.reason.length > 10) {
      wx.showToast({
        title: '原因不能超过10个字',
        icon: 'none'
      })
      return
    }
    wx.request({
      url: app.globalData.host + '/employee/borrow/add',
      method: 'POST',
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionID'),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'employeeID': wx.getStorageSync('employee').ID,
        'amount': that.data.amount,
        'reason': that.data.reason
      },
      success: function (res) {
        if (res.data.result == 'success') {
          wx.showModal({
            title: '提交成功',
            content: '点确认返回首页',
            showCancel: false,
            success: function () {
              wx.switchTab({
                url: '../index/index',
              })
            }
          })
        } else {
          wx.showModal({
            title: '提交失败',
            content: '登陆过期或者网络请求失败',
            showCancel: false
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提交失败',
          showCancel: false
        })
      },
      complete: function () {
        wx: wx.hideLoading();
      }
    })
  }
  ///work-record/add
});