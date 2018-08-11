var app = getApp();
Page({
  data: {
    tabs: ["您本月的工资"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    
    
    //工资概要
    salaryOverview: {
      'employeeID': 0,
      'employeeName': 0,
      'yearMonth': 0,
      'days': 0,
      'total': 0,
      'basicSalary': 0,
      'moneyForOverTime': 0,
      'deductionOfOffTime': 0,
      'moneyForRecommend': 0,
      'moneyForContinuedWork': 0,
      'moneyOfLottery': 0,
      'moneyOfBorrow': 0
    },

    //未读新闻数量
    unReadCount: 0,

    //员工的详细信息
    employee: {},

    routers: [{
        name: '打卡',
        url: '../../pages/card/card',
        icon: '../../images/0001.png'
      },
      {
        name: '借支',
        url: '../../pages/borrow/borrow',
        icon: '../../images/0004.png'
      },
      {
        name: '推荐',
        url: '../../pages/recommend/recommend',
        icon: '../../images/0008.png'
      },
      {
        name: '消息',
        url: '../../pages/news/news',
        icon: '../../images/0003.png'
      }
    ]
  },

  onLoad: function(options) {
    var that = this;

    var employee = wx.getStorageSync("employee");
    console.log("employee = " + employee.ID + " phone:" + employee.phone);


    //检查是否登陆, 没有登陆则重定向到登陆页面
    if (employee == undefined || employee == '' || employee == null) {
      //缓存没有数据则一定没有登陆
      wx.redirectTo({
        url: '../login/login',
      })
    } else {
      //检查登陆是否已经过期
      wx.request({
        url: app.globalData.host + '/employee/sessionchk/',
        method: 'GET',
        header: {
          'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionID'),
        },
        success: function(res) {
          if (res.data.result == 'success') {
            //检查手机号是否已经验证
            if (employee.phone.lastIndexOf("u") === 0) {
              wx.redirectTo({
                url: '../phoneCheck/phoneCheck',
              })
            }
          } else {
            //如果会话验证失效,重定向到登陆页
            wx.redirectTo({
              url: '../login/login',
            })
          }
        },
        fail: function(res) {
          wx.redirectTo({
            url: '../login/login',
          })
        }
      })
    }
  },

  onShow: function(options) {
    var that = this;
    var employee = wx.getStorageSync("employee");
    if (employee == undefined || employee == '' || employee == null) {
      //缓存没有数据则一定没有登陆
      wx.redirectTo({
        url: '../login/login',
      })
    } else {
      //登陆成功,向服务器请求工资数据
      wx.request({
        url: app.globalData.host + '/employee/overview?ID=' + wx.getStorageSync('employee').ID,
        method: 'GET',
        success: function(res) {
          console.log(res.data)
          if (res.data.salaryOverview != null) {
            that.setData({
              salaryOverview: res.data.salaryOverview,
              employee: employee
            })
          }
          that.setData({
            unReadCount: res.data.unReadCount
          })
        },
        fail: function() {},
        complete: function() {}
      })
    }
  }
});