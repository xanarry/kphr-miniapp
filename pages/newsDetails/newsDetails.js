// pages/details/details.js
var wxparse = require("../../wxParse/wxParse.js");
var util = require("../../utils/util.js");

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: {},
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.ID)
    var that = this
    wx.request({
      //newsID=11&employeeID=E10000
      url: app.globalData.host + '/news/detail?newsID=' + options.ID + '&employeeID=' + wx.getStorageSync('employee').ID, //上线的话必须是https，没有appId的本地请求貌似不受影响
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        var news = res.data;
        var t = util.timestampToTime(news.postTime); 
        news.postTime = t;
        //WxParse.wxParse('article', 'html', res.data, that, 5);
        that.setData({
          news: news
        }),
          wxparse.wxParse('article', 'html', res.data.content, that, 5);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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