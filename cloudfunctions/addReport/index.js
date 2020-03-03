// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')
cloud.init();
const db = cloud.database(); //注意，不是wx.cloud.database()，这种是小程序端操作数据库的写法。云端没有“wx.”

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('report').add({
    data: {
      userName: event.userName,
      phoneNumber: event.phoneNumber,
      idCard: event.idCard,
      goToWhere: event.goToWhere,
      address: event.address,
      temperature: event.temperature,
      fileName: event.fileName,
      fileID: event.fileID,
      addDate: event.addDate
    }
  })
}