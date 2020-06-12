/**
 * 用户的表结构
 */
import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    username:String,//用户名
    password:String,//密码
    type:String,//管理员、普通用户
    wallet:Number,//钱包余额
    blockchainupload:String,//区块链上传权限
    ipfsupload:String,//ipfs上传权限
    localupload:String,//本地上传权限
    blockchaindownload:String,//区块链验证权限
    ipfsdownload:String,//ipfs验证权限
    localdownload:String//本地验证权限
});