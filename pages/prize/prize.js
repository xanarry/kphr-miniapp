var app = getApp()
var banner = require("../../pages/banner/banner.js");
Page({
  data: {
    isShowFrom1: false,
    isShowFrom2: false,
    isShowFrom3: false,
    indicatorDots: true,

    
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 800,
    banner_url: banner.bannerList,
    remark: "",
    lotteryID: "",
    records: [],
    awardsConfig: {},
    awardsList: {},
    animationData: {},
    winAwards: "",
    btnDisabled: ''
  },

  showFrom(e) {
    var param = e.target.dataset.param;
    this.setData({
      isShowFrom1: param == 1 ? (!this.data.isShowFrom1) : false,
      isShowFrom2: param == 2 ? (!this.data.isShowFrom2) : false,
      isShowFrom3: param == 3 ? (!this.data.isShowFrom3) : false
    });

  },

  getLottery: function() {
    var that = this

    // 获取奖品配置
    var awardsConfig = that.data.awardsConfig;

    var runNum = 8;

    // 初始化 rotate
    /*  var animationInit = wx.createAnimation({
        duration: 10
      })
      this.animationInit = animationInit;
      animationInit.rotate(0).step()
      this.setData({
        animationData: animationInit.export(),
        btnDisabled: 'disabled'
      })*/


    wx.request({
      url: app.globalData.host + '/lottery/hit?employeeID=' + wx.getStorageSync('employee').ID,
      method: 'GET',
      success: function(res) {

        console.log(res.data);
        if (res.data.error != "") {
          wx.showModal({
            title: '抱歉',
            content: res.data.error,
            showCancel: false,
            success: function() {
              return;
            }
          })
          return;
        }

        var award = res.data.award;
        var index = 0;
        for (var i = 0; i < awardsConfig.awards.length; i++) {
          console.log(awardsConfig.awards[i].name + " " + award + "  " + (awardsConfig.awards[i].name == award));
          if (awardsConfig.awards[i].name === award) {
            index = i;
            break;
          }
        }


        // 旋转抽奖
        app.runDegs = app.runDegs || 0
        console.log('deg', app.runDegs)
        app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (360 * runNum - index * (360 / 6))
        console.log('deg', app.runDegs)

        var animationRun = wx.createAnimation({
          duration: 4000,
          timingFunction: 'ease'
        })


        that.animationRun = animationRun
        animationRun.rotate(app.runDegs).step()
        that.setData({
          animationData: animationRun.export(),
          btnDisabled: 'disabled',
          winAwards: awardsConfig.awards[index].name
        })

      },
      fail: function() {

      },
      complete: function(res) {
        // 中奖提示
        if (res.data.error == "") {
          setTimeout(function() {
            var title = "恭喜";
            var content = '获得' + (that.data.winAwards);

            if (that.data.winAwards == "谢谢参与") {
              title = "抱歉";
              content = "谢谢参与"
            }
            wx.showModal({
              title: title,
              content: content,
              showCancel: false
            })
            if (awardsConfig.chance) {
              that.setData({
                btnDisabled: ''
              })
            }
          }, 4000);
        }
      }
    })




    /*wx.request({
      url: '../../data/getLottery.json',
      data: {},
      header: {
          'Content-Type': 'application/json'
      },
      success: function(data) {
        console.log(data)
      },
      fail: function(error) {
        console.log(error)
        wx.showModal({
          title: '抱歉',
          content: '网络异常，请重试',
          showCancel: false
        })
      }
    })*/
  },


  onShow: function(e) {

    var that = this;
    console.log("23124")

    wx: wx.request({
      url: app.globalData.host + '/lottery/award-list?employeeID=' + wx.getStorageSync('employee').ID,
      method: 'GET',
      success: function(res) {
        console.log(res.data);

        var awardsConfig = {
          chance: true,
          awards: []
        }

        for (var i = 0; i < res.data.awardList.length; i++) {
          awardsConfig.awards.push({
            'index': i,
            'name': res.data.awardList[i]
          })
        }

        console.log(awardsConfig);
        that.setData({
          remark: res.data.remark,
          lotteryID: res.data.lotteryID,
          records: res.data.records,
          awardsConfig: awardsConfig
        })
        // 绘制转盘
        var awards = awardsConfig.awards,
          len = awards.length,
          rotateDeg = 360 / len / 2 + 90,
          html = [],
          turnNum = 1 / len // 文字旋转 turn 值
        console.log("len=" + len)
        that.setData({
          btnDisabled: awardsConfig.chance ? '' : 'disabled'
        })
        var ctx = wx.createContext()
        for (var i = 0; i < len; i++) {
          // 保存当前状态
          ctx.save();
          // 开始一条新路径
          ctx.beginPath();
          // 位移到圆心，下面需要围绕圆心旋转
          ctx.translate(150, 150);
          // 从(0, 0)坐标开始定义一条新的子路径
          ctx.moveTo(0, 0);
          // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
          ctx.rotate((360 / len * i - rotateDeg) * Math.PI / 180);
          // 绘制圆弧
          ctx.arc(0, 0, 150, 0, 2 * Math.PI / len, false);

          // 颜色间隔
          if (i % 2 == 0) {
            ctx.setFillStyle('rgba(255,184,32,.1)');
          } else {
            ctx.setFillStyle('rgba(255,203,63,.1)');
          }

          // 填充扇形
          ctx.fill();
          // 绘制边框
          ctx.setLineWidth(0.5);
          ctx.setStrokeStyle('rgba(228,55,14,.1)');
          ctx.stroke();

          // 恢复前一个状态
          ctx.restore();

          // 奖项列表
          html.push({
            turn: i * turnNum + 'turn',
            lineTurn: i * turnNum + turnNum / 2 + 'turn',
            award: awards[i].name
          });
        }
        that.setData({
          awardsList: html
        });


      },
      fail: function(res) {}
    })

  }

})