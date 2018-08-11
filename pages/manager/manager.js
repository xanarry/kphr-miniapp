var util = require("../../utils/util.js")
var app = getApp();
Page({
  /**
   * 统一满分为5星
   */
  data: {
    manager: {},
    dayOfMonth: new Date().getDate(),
    preMonth: util.preMonth(),
    starInServer: 0,
    star: 0,
    unStar: 5
  },


  submit: function() {
    var that = this;
    var score = that.data.star
    console.log(score);
    if (score == 0) {
      wx.showToast({
        title: '评分必须大于零',
        icon: 'none'
      })
    } else {
      wx.request({
        url: app.globalData.host + '/middleman/score',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          middlemanID: that.data.manager.ID,
          employeeID: wx.getStorageSync('employee').ID,
          score: that.data.star
        },
        success: function(res) {
          if (res.data.result == 'success') {
          wx.showToast({
            title: '打分成功',
            success: function() {
              that.setData({
                starInServer: that.data.star
              })
            }
          })
          } else {
            wx.showToast({
              title: '打分失败',
              icon: 'none'
            })
          }
        },
        fail: function() {
          wx.showToast({
            title: '打分失败',
            icon: 'none'
          })
        }
      })
    }
  },


  onLoad: function (options) {
    var that = this;
    console.log(that.data);
    wx.request({
      url: app.globalData.host + '/middleman/detail?middlemanID=' + wx.getStorageSync('employee').middlemanID + '&employeeID=' + wx.getStorageSync('employee').ID,
      method: 'GET', 
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          manager: res.data.middleman,
          starInServer: res.data.score,
          star: res.data.score,
          unStar: 5 - res.data.score
        })
      },
      fail: function () {
        // fail
      }
    })

  
  },

  copyWechat: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.manager.wechat
    });
  },

  copyQQ: function () {
    var self = this;
    wx.setClipboardData({
      data: self.data.manager.QQ
    });
  },

  phoneCall: function() {
    var self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.manager.phone,
    })
  },


  //情况二:用户给评分
  in_xin: function (e) {
    var that = this;
    //如果服务器上已经有评分或者日期超过7号则不让打分
    if (that.data.starInServer != 0 || new Date().getDate() > 7) {
      return;
    }
    var in_xin = e.currentTarget.dataset.in;
    var star;
    if (in_xin === 'use_sc2') {
      star = Number(e.currentTarget.id);
    } else {
      star = Number(e.currentTarget.id) + this.data.star;
    }
    this.setData({
      star: star,
      unStar: 5 - star
    })
  }
})

