//index.js
var util = require('./../../lib/utils.js');
const app = getApp()

Page({
  data: {
    userName: '',
    phoneNumber: '',
    goToWhere: '',
    address: '',
    idCard: '',
    btnDisabled: true
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onInputUserName: function(e) {
    this.setData({
      userName: e.detail.value
    });
    this.checkData();
  },
  onInputPhoneNumber: function(e) {
    this.setData({
      phoneNumber: e.detail.value
    });
    this.checkData();
  },
  onInputIDCard: function(e) {
    this.setData({
      idCard: e.detail.value
    });
    this.checkData();
  },
  onInputAddress: function(e) {
    this.setData({
      address: e.detail.value
    });
    this.checkData();
  },
  onInputGoToWhere: function(e) {
    this.setData({
      goToWhere: e.detail.value
    });
    this.checkData();
  },

  checkData: function(e) {
    if (this.data.userName.length == 0 || this.data.idCard.length == 0 || this.data.phoneNumber.length == 0 || this.data.goToWhere.length == 0 || this.data.address.length == 0) {
      this.setData({
        btnDisabled: true
      });
    } else {
      this.setData({
        btnDisabled: false
      });
    }
    console.info(this.data.btnDisabled);
  },
  submitData: function(e) {
    this.setData({
      btnDisabled: true
    });
    console.info(this.data.userName);
    console.info(this.data.idCard);
    console.info(this.data.phoneNumber);
    console.info(this.data.goToWhere);
    console.info(this.data.address);
    wx.cloud.callFunction({
      name: 'addReport',
      data: {
        userName: this.data.userName,
        idCard: this.data.idCard,
        phoneNumber: this.data.phoneNumber,
        goToWhere: this.data.goToWhere,
        address: this.data.address,
        addDate: util.formatTime(new Date())
      },
      success: res => {
        console.log('已添加至订单')
        wx.showToast({
          duration: 4000,
          title: '提交成功！'
        })

        this.setData({
          btnDisabled: false
        });
      },
      fail: err => {
        app.globalData.followID = "";
        wx.showToast({
          icon: 'none',
          title: '出错啦！请稍后重试'
        })
        this.setData({
          btnDisabled: false
        });
      }
    });
  },
})