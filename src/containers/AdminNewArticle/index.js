import React, { Component, PropTypes } from 'react';
//import remark from 'remark';
//import reactRenderer from 'remark-react';
//import { Input, Select, Button, Modal } from 'antd';
import {Button} from 'antd';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
//import { actions } from '../../reducers/adminManagerUser'
import '../Detail/style.css';
import './style.css';
import { actions } from '../../reducers/adminManagerTags'
import dateFormat from 'dateformat'
import Downloader from 'js-file-downloader';
//import { saveAs } from 'file-saver';
import { generateShowHourMinuteSecond } from 'antd/lib/time-picker';
//import { actions2 } from '../../reducers/adminManagerArticle'
//import { updateWallet } from '../../sagas/adminManagerTagsSaga';
const {add_transaction,update_wallet,txhash_find} = actions;
const download = require('downloadjs')


//api插件的引用
const ipfsAPI = require('ipfs-api');
const  FileSaver = require('file-saver');
//const contract = require('truffle-contract');
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const InputDataDecoder = require('input-data-decoder-ethereum');
//const simpleStorage = contract(SimpleStorageContract)
//设置IPFS参数
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
//使用的合约的abi信息
const tokenAbi =[
	{
		"constant": false,
		"inputs": [
			{
				"name": "x",
				"type": "string"
			}
		],
		"name": "set",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
// const tokenAbi = [
// 	{
// 		"constant": false,
// 		"inputs": [
// 			{
// 				"name": "x",
// 				"type": "string"
// 			}
// 		],
// 		"name": "set",
// 		"outputs": [],
// 		"payable": false,
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"constant": true,
// 		"inputs": [],
// 		"name": "get",
// 		"outputs": [
// 			{
// 				"name": "",
// 				"type": "string"
// 			}
// 		],
// 		"payable": false,
// 		"stateMutability": "view",
// 		"type": "function"
// 	}
// ]
//发送账户的秘钥
//const privateKey = Buffer.from('d80bd914a062b4e31e16cbb74c827fee0dcf76942ffb1df9416565b0a34ef0f9', 'hex')
const privateKey = Buffer.from('061676AE52F57B2A90F859889C76FEFCF68EE4483A0E46D0E3D5BB4F4E620D13', 'hex')
//const keythereum = require('keythereum');
//const fromkey = keythereum.importFromFile("0xdafb2a283e90591bbefdf1a82b12f3f6e4b3102e", "/media/zyf/0A9AD66165F337621/gethprivate/data");
//recover输出为buffer类型的私钥
// const privateKey1 = keythereum.recover('123456', fromkey);
// console.log(privateKey1.toString('hex'));
// const privateKey = Buffer.from(privateKey1.toString('hex'), 'hex')
//配置web3的httpprovider，采用infura
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8546"));
const decoder = new InputDataDecoder(tokenAbi);
//let txlogs;
let senddata = []; //发送数据
let nonce; //nonce
let ttxhash;
let transaction =[];
let gasused;
let cost;
let isWriteSuccess;
const contractAddr = '0x84add4b9a76cafebede13d9b10eb0c290a67c3c3';//合约地址
//0xF9448B279F57AD5073d996b1BF65a7d18878A599
//"0xc411f680ae76e7457112ddd4a231a1ab71ed9b72";
//"0x6f12fbbc9eba17d78a357f042682d6a0db57a1ae";
web3.eth.defaultAccount = '0x1aB1DC744b964f5c5023d92666D7f738Eb04B203';//设置使用的账户

//0xc411f680ae76e7457112ddd4a231a1ab71ed9b72
//初始化合约信息，便于后面合约交互的abi编码发送信息
const mycontract = new web3.eth.Contract(tokenAbi,contractAddr,{
  from: '0x1aB1DC744b964f5c5023d92666D7f738Eb04B203',
  //0xc411f680ae76e7457112ddd4a231a1ab71ed9b72
  gasPrice: '1000000000'
} );
// 定义存储文件到ipfs函数
let saveImageOnIpfs = (reader) => {
  return new Promise(function(resolve, reject) {
    const buffer = Buffer.from(reader.result); //将存入的结果转成buff
    ipfs.add(buffer).then((response) => {
      console.log('response结构',response)
      resolve(response[0]);//传回第一个函数的哈希值 .hash,response[0].path,response[0].size
    }).catch((err) => {
      console.error(err)
      reject(err);
    })
  })
}
let walletmoney
let walletshow

class uploadfileblockchain extends Component {
    constructor(props) {
        super(props)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            blockChainHash: null,
            address: contractAddr,
            imgHash: null,
            isWriteSuccess: false,
            txhash:null,
            tblockhash:null,
            msgshow: false,
            gasused: null,
            blockhash: null,
            readmsg: false,
            filename: null,
            filesize: null,
            filetype: null,
            ipfsname: null,
            ipfsize: null,
            walletshow: null,
            cost:null
          }

    }

    componentWillMount() {
     
        ipfs.swarm.peers(function(err, res) {
          if (err) {
            console.error(err);
          } else {
            console.log(res);
          }
        });
      }
    
      render() {

        return (<div className="App">
          {
            this.state.address
              ? <h1>合约地址：{this.state.address}</h1>
              : <div/>
          }
    
    <h2>上传文件到IPFS：</h2>
          
          <div>
            <label id="file">选择上传文件</label>
            <input type="file" ref="file" id="file" name="file" multiple="multiple" onChange={() => {
              const Bdate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
              console.log("1时间",Bdate)
                const file = this.refs.file.files[0];
                //const uploadfiledata=reader.readAsArrayBuffer(file)
               // reader.onloadend = function(e) {
                  //console.log(reader);
                  console.log('文件名',file.name);
                  this.setState({filename:file.name});
                  console.log('大小size',file.size);
                  this.setState({filetype:file.type});
                  this.setState({filesize:file.size});
          
    
              }}/>
            
          </div>

              <div>
                <br></br>
                 <h3>上传文件的文件名：{this.state.filename}</h3>
                  <h3>上传文件的类型：{this.state.filetype}</h3>
                  <h3>上传文件的大小：{this.state.filesize}</h3>

    
              </div>


          <div>
          <br /><br />
          { this.props.userInfo.ipfsupload === 'true' ?
            <Button type="primary" shape="round" icon="upload" onClick={() => {
                const file = this.refs.file.files[0];
                const reader = new FileReader();
                // reader.readAsDataURL(file);
                const uploadfiledata=reader.readAsArrayBuffer(file)
                const Bdate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                console.log("2时间",Bdate)
                reader.onloadend = function(e) {
        
                  saveImageOnIpfs(reader).then((resdata) => {
                    console.log('ipfsresdata',resdata);
                    console.log('ipfs存储哈希值',resdata.hash);
                    senddata.hash = resdata.hash;
                    //transaction = hash;
                    const Bdate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                    console.log("3时间",Bdate)
                    this.setState({imgHash: resdata.hash})
                    this.setState({ipfsname: resdata.path })
                    this.setState({ipfsize: resdata.size });
                  });
    
                }.bind(this);
    
              }}>将文件上传到IPFS</Button>
            : <h3>没有IPFS上传权限，请联系管理员获取</h3>
            }
          </div>
          {
            this.state.imgHash
              ? <div>
                  <br></br>
           
                  <h3>IPFS存储的文件Hash：{this.state.imgHash}</h3>
                  <h3>IPFS存储的文件路径名：{this.state.ipfsname}</h3>
                  <h3>IPFS存储的文件大小：{this.state.ipfsize}</h3>
                  <br></br>
             
                  <br></br>
                  { this.props.userInfo.blockchainupload === 'true' ?
                  <div>
                    {/* <Button onClick={()=>{
                  ipfs.get(this.state.imgHash, function (err, files) {
                    files.forEach((file) => {
                      const fileUrl = "http://localhost:8080/ipfs/" + senddata;
 
                      new Downloader({ 
                          url: fileUrl
                      })
                      .then(function () {
                          console.log('完成')
                      })
                      .catch(function (error) {
                          console.log('失败')
                          // Called when an error occurred
                      });
                      // console.log('路径',file.path)
                      // console.log('O文件',file.content)
                      // console.log(file.content.toString('utf8'))
                      // // const blob = new Blob();
                      // // console.log(blob)
                      // download(file.content, 'download');
                      // ipfs.files.flush('/', (err) => {
                      //   if (err) {
                      //     console.error(err)
                      //   }
                      // })
                    })
                  })
                  }}>下载</Button> */}
                  <br></br>
                  <Button type="primary" shape="round" icon="upload" onClick={() => {
                        //  senddata.filename = this.state.filename;
                        //  senddata.filetype = this.state.filetype;
                        //  senddata.filesize = this.state.filesize;
                        //  senddata.username = this.props.userInfo.username;
                        //  senddata.date = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                        const tdate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                        senddata="用户名: "+this.props.userInfo.username+"  ;文件名: "+this.state.filename+"  ;文件类型: "+this.state.filetype+"  ;文件大小: "+this.state.filesize
                        +"  ;时间: "+tdate;
                         console.log('发送sendata',senddata)
                      //编码使用合约的函数及参数用于后续的交易
                        const encoded = mycontract.methods.set(senddata).encodeABI();
                        //获取账户的nonce
                         web3.eth.getTransactionCount(web3.eth.defaultAccount,'pending', function (err, gnonce) {
                           nonce = gnonce;
                           console.log("nonce value is ", nonce);
                         })
                        //获取区块的gas限制
                        
                        const gasLimit = web3.eth.getBlock("latest").gasLimit;
                        //估计交易花费的gas
                         const estimategas = web3.eth.estimateGas({
                              to: contractAddr,
                              data: encoded
                          });  
                          gasused = web3.utils.hexToNumber(web3.utils.toHex(estimategas));
                          gasused = 2*gasused;
                          console.log("sdfasf".gasused)
                          cost = gasused/1000;
                          setTimeout(() => {
                            console.log("估计花销的gas", gasused);
                            transaction.cost = cost;
                            
                            this.props.updateWallet(transaction);
                            console.log("估计花销的cost", transaction.cost);
                          }, 300);
                         
                         
                        //估计gas价格
                        const gasPrice = web3.eth.getGasPrice();
                       setTimeout(() => {
                         console.log('props余额',this.props.balance)
                         walletmoney = this.props.balance
                        if ( this.props.balance > 0)
                        {
                        //配置交易信息rawTx
                          const rawTx = {
                              nonce: web3.utils.toHex(nonce),
                              gasPrice: web3.utils.toHex(gasPrice),
                              //'0x3B9ACA00',
                              gasLimit: web3.utils.toHex(gasLimit),
                              gas: web3.utils.toHex(gasused),
                              value: '0x00',
                              chainId: '0x6e',
                              to: contractAddr,
                              data: encoded
                          };  
                          //  const rawTx = {
                          //     nonce: web3.utils.toHex(gnonce),
                          //     gasPrice: '0x3B9ACA00',
                          //     gasLimit: web3.utils.toHex(gasLimit),
                          //     gas: '0xEA60',
                          //     value: '0x00',
                          //     chainId: '0x2A',
                          //     to: contractAddr,
                          //     data: encoded
                          // }; 
                      
                          //tx交易签名
                            const tx = new Tx(rawTx);
                            tx.sign(privateKey);
                          //发送交易
                            const serializedTx = tx.serialize();
                            //console.log(serializedTx.toString('hex'));
                            web3.eth.sendSignedTransaction("0x" + serializedTx.toString('hex'), function (err, hash) {
                                console.log("交易的哈希值Tx: " + hash);
                                ttxhash = hash; 
                                transaction = hash;                     
                            });  
                            isWriteSuccess = 'true'
                          }
                          else {
                            walletshow = 'true'
                          }
                         
                       }, 1000);
                        //const dgasprice = web3.utils.hexToNumber(gasPrice);
                       
                         
                        
                        //this.props.addTransaction(ttxhash);
                        //this.props.updateWallet(gasused)
                        console.log('文件的hash已经写入到区块链！');
                        this.setState({txhash:ttxhash});
                        this.setState({cost:cost });
                        //this.setState({isWriteSuccess: true});
                        this.setState({msgshow: true});
                    
                    
                      }}
                    >将文件hash写到区块链：</Button>
                    <br></br>
                      
                    </div>  
                    : <h3>没有区块链上传权限，请联系管理员获取</h3>
            }
                </div>
                   
              : <div/>
          }

{
              this.state.msgshow
              ? <div>
                  <br></br>
                  <h3>本次花销:{this.state.cost}</h3>
                  <h3>用户余额:{walletmoney}</h3> 
                  <br></br>
                  <Button type="primary" shape="round" icon="download" onClick={() => {
                   
                      this.setState({readmsg:true})
                      this.props.TxFind(ttxhash);

                    }}>交易信息读取</Button>
                    <br></br>
                    <h2><font color='red'>该交易的Hash：{ttxhash}</font></h2>
                    <br></br>
                    <h2>从区块链读取的存储内容：{this.props.txipfshash}</h2>
   
                  <h2>该交易的区块链Hash：{this.props.txbchash}</h2>
                  <h2>该交易消耗的gas：{this.props.txgasused}</h2>
     
                </div>
              : <div/>
          }
    
          {
            this.state.readmsg
              ? <div>
                 <br></br>
                 {/* <Button onClick={()=>{
                    this.props.updateWallet(this.state.gasused);
                    }}>扣费</Button> */}
                 <br></br>
                  
                       <Button onClick={()=>{
                         setTimeout(() => {
                          if(ttxhash) {
                            let data={};
                        data.transaction = ttxhash;
                        data.ipfshash = this.state.imgHash;
                        data.date =  dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                        this.props.addTransaction(data);
                          }
                         }, 300);
                        
                        //this.setState({readmsg: true});
                        }}>上传到数据库</Button>
                  
                </div>
              : <div/>
          }
          {/* {
            this.state.readmsg
              ? <div>
                  <h2>浏览器访问：{"http://localhost:8080/ipfs/" + this.state.imgHash}</h2>
                  <img alt="" style={{
                      width: 1600
                    }} src={"http://localhost:8080/ipfs/" + this.state.imgHash}/>
                </div>
              : <img alt=""/>
          } */}
        </div>);
      }
    }


   uploadfileblockchain.propsTypes = {
    txipfshash: PropTypes.string.isRequired,
    txbchash: PropTypes.string.isRequired,
    txgasused: PropTypes.number.isRequired,
    balance: PropTypes.number.isRequired,
  };
  
  uploadfileblockchain.defaultProps = {
    txipfshash:[],
    txbchash:[],
    txgasused:[],
    balance:[]
  };
//   S
  // const mapDispatchToProps = dispatch => {
  //   return {
  //     addTransaction: username => {
  //       dispatch(add_transaction(username))
  //     }
      
  //   }
  // }
//   function mapStateToProps(state) {
//    // let {pageNum, list,total} = state.admin.transactions;
//     // return {
//     //     transactions:state.admin.transactions,
//     //     //wallet:state.admin.wallet
//     // }
//     const {url} = state.admin.adminGlobalState;
//     return {
//         userInfo:state.globalState.userInfo
//     }
// }
function mapStateToProps(state) {
  // let {pageNum, list,total} = state.admin.transactions;
   // return {
   //     transactions:state.admin.transactions,
   //     //wallet:state.admin.wallet
   // }
   let {txipfshash,txbchash,txgasused,balance} = state.admin.transactions;
   return {
       userInfo:state.globalState.userInfo,
       txipfshash,
       txbchash,
       txgasused,
       balance
   }
}
  function mapDispatchToProps(dispatch) {
      return {
          addTransaction: bindActionCreators(add_transaction, dispatch),
          updateWallet: bindActionCreators(update_wallet, dispatch),
          TxFind: bindActionCreators(txhash_find, dispatch),
      }
  }
  
  export default connect(
      mapStateToProps,
      mapDispatchToProps
  )(uploadfileblockchain)    
