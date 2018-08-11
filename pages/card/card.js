var app = getApp();
Page({
  data: {
    date: "2018-07-01",
    overAndOffTime: {},
    overTime: ["0h", "0.25h", "0.5h", "0.75h", "1h", "1.25h", "1.5h", "1.75h", "2h", "2.25h", "2.5h", "2.75h", "3h", "3.25h", "3.5h", "3.75h", "4h", "4.25h", "4.5h", "4.75h", "5h", "5.25h", "5.5h", "5.75h", "6h", "6.25h", "6.5h", "6.75h", "7h", "7.25h", "7.5h", "7.75h", "8h"],
    overTimeIndex: 0,

    offTime: ["0h", "0.25h", "0.5h", "0.75h", "1h", "1.25h", "1.5h", "1.75h", "2h", "2.25h", "2.5h", "2.75h", "3h"],
    offTimeIndex: 0,
    
    routers: [{
      name: '10h',
      url: '',
      icon: '../../images/work1.png'
    },
    {
      name: '20h',
      url: '',
      icon: '../../images/work2.png'
    },
    {
      name: '30h',
      url: '',
      icon: '../../images/work3.png'
    },
    {
      name: '40h',
      url: '',
      icon: '../../images/work4.png'
    }
    ]
  },
  

  onShow: function () {
    var that = this;
    var now = new Date();
    var y = now.getFullYear();
    var m = (now.getMonth() + 1);
    var d = now.getDate()
    var date = y + "-" + (m >= 10 ? m : '0' + m) + "-" + (d >= 10 ? d : '0' + d);
    var overTime = ["0h", "0.25h", "0.5h", "0.75h", "1h", "1.25h", "1.5h", "1.75h", "2h", "2.25h", "2.5h", "2.75h", "3h", "3.25h", "3.5h", "3.75h", "4h", "4.25h", "4.5h", "4.75h", "5h", "5.25h", "5.5h", "5.75h", "6h", "6.25h", "6.5h", "6.75h", "7h", "7.25h", "7.5h", "7.75h", "8h", "8.25h", "8.5h", "8.75h", "9h", "9.25h", "9.5h", "9.75h", "10h", "10.25h", "10.5h", "10.75h", "11h"];
    var offTime = ["0h", "0.25h", "0.5h", "0.75h", "1h", "1.25h", "1.5h", "1.75h", "2h", "2.25h", "2.5h", "2.75h", "3h", "3.25h", "3.5h", "3.75h", "4h", "4.25h", "4.5h", "4.75h", "5h", "5.25h", "5.5h", "5.75h", "6h", "6.25h", "6.5h", "6.75h", "7h", "7.25h", "7.5h", "7.75h", "8h"];
    var week = "0123456".charAt(new Date(date).getDay())
    console.log(week)
    //如果星期在周末, 更换小时选项
    if (week == '0' || week == '6') {
      that.setData({
        overTime: overTime,
        offTime: offTime
      })
    }
    wx.request({
      url: app.globalData.host + '/employee/overofftime?employeeID=' + wx.getStorageSync('employee').ID,
      method: 'GET',
      success: function (res) {
        console.log(res.data);

        that.data.routers[0].name = res.data.offTime + "";
        that.data.routers[1].name = res.data.overTimeOfOffDay + "";
        that.data.routers[2].name = res.data.overTimeOfWeekDay + "";
        that.data.routers[3].name = res.data.overTimeOfWeekend + "";        
        console.log(that.data.routers);

        that.setData({
          overAndOffTime: res.data
        })
      }
    })

    that.setData({
      date: date
    })
  },


  bindDateChange: function (e) {
    var overTime = ["0h", "0.25h", "0.5h", "0.75h", "1h", "1.25h", "1.5h", "1.75h", "2h", "2.25h", "2.5h", "2.75h", "3h", "3.25h", "3.5h", "3.75h", "4h", "4.25h", "4.5h", "4.75h", "5h", "5.25h", "5.5h", "5.75h", "6h", "6.25h", "6.5h", "6.75h", "7h", "7.25h", "7.5h", "7.75h", "8h", "8.25h", "8.5h", "8.75h", "9h", "9.25h", "9.5h", "9.75h", "10h", "10.25h", "10.5h", "10.75h", "11h"];
    var offTime = ["0h", "0.25h", "0.5h", "0.75h", "1h", "1.25h", "1.5h", "1.75h", "2h", "2.25h", "2.5h", "2.75h", "3h", "3.25h", "3.5h", "3.75h", "4h", "4.25h", "4.5h", "4.75h", "5h", "5.25h", "5.5h", "5.75h", "6h", "6.25h", "6.5h", "6.75h", "7h", "7.25h", "7.5h", "7.75h", "8h"];
    var date = e.detail.value;
    var week = "0123456".charAt(new Date(date).getDay())
    console.log(week)
    //如果星期在周末, 更换小时选项
    if (week == '0' || week == '6') {
      this.setData({
        overTime: overTime,
        offTime: offTime
      })
    }
    this.setData({
      date: date
    })
  },

  bindOverTimeChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      overTimeIndex: e.detail.value
    })
  },
  bindOffTimeChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    this.setData({
      offTimeIndex: e.detail.value
    })
  },
  submit: function () {
    var that = this;
    console.log(this.data.date);
    console.log(this.data.offTime[this.data.offTimeIndex]);
    console.log(this.data.overTime[this.data.overTimeIndex]);
    wx.showLoading({
      title: '提交数据中',
    })
    wx.request({
      url: app.globalData.host + '/employee/work-record/add',
      method: 'POST',
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionID'),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'employeeID': wx.getStorageSync('employee').ID,
        'date': that.data.date,
        'overTime': that.data.overTime[that.data.overTimeIndex].replace('h', ''),
        'offTime': that.data.offTime[that.data.offTimeIndex].replace('h', '')
      },
      success: function (res) {
        if (res.data.result == 'success') {
          wx.showModal({
            title: '打卡成功',
            content: '点确认返回首页',
            showCancel: false,
            success: function () {
              wx.switchTab({
                url: '../index/index',
              })
            }
          })
        } else if (res.data.result == '不能重复打卡') {
          wx.showModal({
            title: '提示',
            content: '您已经打过卡,不能重复打卡',
            showCancel: false,
          })
        } else {
          wx.showModal({
            title: '打卡失败',
            content: res.data.result,
            showCancel: false,
            success: function () {
              if (res.data.result == '登陆会话已过期') {
                wx.redirectTo({
                  url: '../login/login',
                })
              } else {
                //do nothing
              }
            }
          })
        }
      },
      fail: function (res) {

      },
      complete: function () {
        wx: wx.hideLoading();
      }
    })
  }
  ///work-record/add
});