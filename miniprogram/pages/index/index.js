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
    fileName: '',
    filePath: '',
    temperature: '',
    fileID: '',
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
      userName: e.detail.value.trim()
    });
    this.checkData();
  },
  onInputPhoneNumber: function(e) {
    this.setData({
      phoneNumber: e.detail.value.trim()
    });
    this.checkData();
  },
  onInputIDCard: function(e) {
    this.setData({
      idCard: e.detail.value.trim()
    });
    this.checkData();
  },
  onInputAddress: function(e) {
    this.setData({
      address: e.detail.value.trim()
    });
    this.checkData();
  },
  onInputGoToWhere: function(e) {
    this.setData({
      goToWhere: e.detail.value.trim()
    });
    this.checkData();
  },
  onInputTemperature: function(e) {
    this.setData({
      temperature: e.detail.value.trim()
    });
    this.checkData();
  },
  chooseFile: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        if (res.tempFiles.length > 0) {
          that.setData({
            fileName: "已选择",
            filePath: res.tempFiles[0].path
          });
        } else {
          that.setData({
            fileName: "请选择",
            filePath: ""
          });
        }
      }
    });
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

    var isSuccess = true;
    if (this.data.filePath.length > 0) {
      wx.showLoading({
        title: '上传中...',
      });
      var that = this;
      wx.cloud.uploadFile({
        cloudPath: this.data.userName + "_" + util.formatStortTime(new Date()) + "_" + util.wxuuid() + ".jpg",
        filePath: this.data.filePath, // 文件路径
        success: res => {
          // get resource ID
          wx.hideLoading();
          console.log('上传成功！');
          console.info("*******1");
          that.setData({
            fileID: res.fileID
          });
          console.info("*******2");
          that.uploadData(that);
          console.info("*******3");
        },
        fail: err => {
          isSuccess = false;
          wx.hideLoading();
          console.log('上传失败');
          wx.showToast({
            icon: 'none',
            title: '上传失败'
          })
        }
      });
    } else {
      this.uploadData(this);
    }
  },

  uploadData: function(that) {
    console.info("*******4");
    wx.cloud.callFunction({
      name: 'addReport',
      data: {
        userName: that.data.userName,
        idCard: that.data.idCard,
        phoneNumber: that.data.phoneNumber,
        goToWhere: that.data.goToWhere,
        address: that.data.address,
        fileID: that.data.fileID,
        temperature: that.data.temperature,
        fileName: that.data.fileName,
        addDate: util.formatTime(new Date())
      },
      success: res => {
        that.setData({
          userName: '',
          idCard: '',
          phoneNumber: '',
          goToWhere: '',
          address: '',
          fileID: '',
          fileName: '',
          filePath: '',
          temperature: '',
          btnDisabled: true
        });
        console.log('提交成功！')
        wx.showToast({
          duration: 4000,
          title: '提交成功！'
        })
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '出错啦！请稍后重试'
        })
        that.setData({
          btnDisabled: false
        });
      }
    });
  },

})