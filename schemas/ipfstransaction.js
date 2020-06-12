/**
 * 存储记录的表结构
 */
import mongoose from 'mongoose'
module.exports = new mongoose.Schema({
    username:String,//用户名
    filename:String,//文件名
    transaction:String,//存储地址
    ipfshash:String,//IPFS哈希值
    enipfshash:String,//加密IPFS哈希值
    date : String//时间

}

);