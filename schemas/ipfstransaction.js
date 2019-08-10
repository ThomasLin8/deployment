/**
 * 用户的表结构
 */
import mongoose from 'mongoose'
//var myDate = new Date(); 
module.exports = new mongoose.Schema({
    username:String,
    transaction:String,
    ipfshash:String,
    enipfshash:String,
    date : String
    // date: { type: Date, default: Date.now },
   //date: { type: Date, default: new Date().toLocaleTimeString() },

}

);
//module.exports = mongoose.model('Member', MemberSchema);