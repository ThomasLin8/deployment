import mongoose from 'mongoose'
import ipfstransactionSchema from '../schemas/ipfstransaction'


module.exports = mongoose.model("ipfstransaction",ipfstransactionSchema);
