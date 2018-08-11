//获取应用实例
var app = getApp()
Page({
  data: {
    newsList: []
  },
  onShow: function (res) {
    var that = this

    wx.request({
      url: app.globalData.host + '/news/list?employeeID=' + wx.getStorageSync('employee').ID,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        that.setData({
          newsList: res.data
        })
      },
      fail: function () {
        // fail
      },
    })
  }
})
