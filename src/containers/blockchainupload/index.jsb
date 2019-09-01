import React,  { Component } from 'react';
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
import { actions } from '../../reducers/AdminManagerTransactions'
import dateFormat from 'dateformat'
//import { actions2 } from '../../reducers/adminManagerArticle'
//import { updateWallet } from '../../sagas/AdminManagerTransactionsSaga';
const {add_transaction,update_wallet,txhash_find} = actions;



//api插件的引用
const ipfsAPI = require('ipfs-api');
//const contract = require('truffle-contract');
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const InputDataDecoder = require('input-data-decoder-ethereum');
//const simpleStorage = contract(SimpleStorageContract)
//设置IPFS参数
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
//使用的合约的abi信息
const tokenAbi = [
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
//发送账户的秘钥
const privateKey = Buffer.from('d80bd914a062b4e31e16cbb74c827fee0dcf76942ffb1df9416565b0a34ef0f9', 'hex')
//配置web3的httpprovider，采用infura
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
const decoder = new InputDataDecoder(tokenAbi);
//let txlogs;
let senddata; //发送数据
let gnonce; //nonce
let ttxhash;
let transaction;
let gasused;
let isWriteSuccess;
let readfile;
let transactiondata = {};
let doublecheck;
const contractAddr = '0xF9448B279F57AD5073d996b1BF65a7d18878A599';//合约地址
//"0xc411f680ae76e7457112ddd4a231a1ab71ed9b72";
//"0x6f12fbbc9eba17d78a357f042682d6a0db57a1ae";
web3.eth.defaultAccount = '0xc411f680ae76e7457112ddd4a231a1ab71ed9b72';//设置使用的账户
//初始化合约信息，便于后面合约交互的abi编码发送信息
const mycontract = new web3.eth.Contract(tokenAbi,contractAddr,{
  from: '0xc411f680ae76e7457112ddd4a231a1ab71ed9b72',
  gasPrice: '1000000000'
} );
// 定义存储文件到ipfs函数
let         saveImageOnIpfs = (reader) => {
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
let txsenddata

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
            readfile: null,
            cost:null,
            inibalance:null,
            doublecheck:null
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

                 {/* <h3>上传文件的文件名：{ this.refs.file.files[0].name}</h3>
                  <h3>上传文件的类型：{ this.refs.file.files[0].type}</h3>
                  <h3>上传文件的大小：{ this.refs.file.files[0].size}</h3> */}
              </div>


          <div>
          <br /><br />
          { this.props.userInfo.ipfsupload === 'true' ?
            <Button type="primary" shape="round" icon="upload" onClick={() => {
                const file = this.refs.file.files[0];
                const reader = new FileReader();
                // reader.readAsDataURL(file);
                const uploadfiledata=reader.readAsArrayBuffer(file)
                reader.onloadend = function(e) {
        
                  saveImageOnIpfs(reader).then((resdata) => {
                    console.log('ipfsresdata',resdata);
                    console.log('ipfs存储哈希值',resdata.hash);
                    senddata = resdata.hash;
                    //transaction = hash;
                   
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
        {/* <h3>上传权限1：{this.props.userInfo.ipfsupload}</h3>
        <h3>上传权限2：{this.props.userInfo.userType}</h3> */}
        <h3>上传文件的文件名：{this.state.filename}</h3>
        <h3>上传文件的类型：{this.state.filetype}</h3>
        <h3>上传文件的大小：{this.state.filesize}</h3>
        <h3>IPFS存储的文件Hash：{this.state.imgHash}</h3>
        <h3>IPFS存储的文件路径名：{this.state.ipfsname}</h3>
        <h3>IPFS存储的文件大小：{this.state.ipfsize}</h3>
        <br></br>
        {/* <Button  onClick={() => {
          this.props.addTransaction(this.state.imgHash);
        }}> 全新上传
        </Button> */}
        <br></br>
        {/* { this.props.userInfo.blockchainupload === 'true' ? */}
        <Button onClick={()=>{
        ipfs.get(this.state.imgHash, function (err, files) {
          files.forEach((file) => {
            console.log('路径',file.path)
            console.log(file.content.toString('utf8'))
            // ipfs.files.flush('/', (err) => {
            //   if (err) {
            //     console.error(err)
            //   }
            // })
          })
        })
        }}>下载</Button>
        <Button type="primary" shape="round" icon="upload" onClick={() => {
               walletmoney = this.props.userInfo.wallet;
              // this.setState({inibalance:walletmoney});
               console.log('钱包余额',walletmoney);
            //编码使用合约的函数及参数用于后续的交易
              const encoded = mycontract.methods.set(senddata).encodeABI();
              //获取账户的nonce
               web3.eth.getTransactionCount(web3.eth.defaultAccount,'pending', function (err, nonce) {
                 gnonce = nonce;
                 console.log("nonce value is ", gnonce);});
              //获取区块的gas限制
              const gasLimit = web3.eth.getBlock("latest").gasLimit;
              //估计交易花费的gas
               const estimategas = web3.eth.estimateGas({
                    to: contractAddr,
                    data: encoded
                });  
                gasused = web3.utils.hexToNumber(web3.utils.toHex(estimategas));
                transactiondata.cost = Math.ceil(gasused / 1000);
                const gascost = Math.ceil(gasused / 1000);
                console.log("估计花销的gas", gasused);
              //估计gas价格
              const gasPrice = web3.eth.getGasPrice();
             
              //let dgasprice = web3.utils.hexToNumber(gasPrice);
             // dgasprice = dgasprice/100;
              this.setState({cost:gascost})
              // if ( walletmoney >= (gasused/1000))
              // {
              //配置交易信息rawTx
                const rawTx = {
                    nonce: web3.utils.toHex(gnonce),
                    gasPrice: web3.utils.toHex(gasPrice),
                    //'0x3B9ACA00',
                    gasLimit: web3.utils.toHex(gasLimit),
                    gas: web3.utils.toHex(estimategas),
                    value: '0x00',
                    chainId: '0x2A',
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
                  this.props.updateWallet(transactiondata)
                  //transactiondata.sendata = serializedTx;
             
                  console.log('发送的ss数据！',serializedTx);


                  if(this.props.successshow === true){this.setState({inibalance:this.props.bcutxhash})}
                  else{ this.setState({inibalance:walletmoney});}
                  //console.log(serializedTx.toString('hex'));
                  if(this.props.successshow === true){
                  web3.eth.sendSignedTransaction("0x" + serializedTx.toString('hex'), function (err, hash) 
                  
                  
                  {
                       
                      setTimeout( ()=>{
                      console.log("交易的哈希值Tx: " + hash);
                      ttxhash = hash; 
                      transaction = hash;  }, 500  );                  
                  });  
                }
               

                  //isWriteSuccess = 'true'
                // }
                // else {
                //   walletshow = 'true'
                // }
               
              
              //this.props.addTransaction(ttxhash);
             // console.log('发送的数据gas！',gasused);
          
           //   console.log('发送的数据ttttttt！',transactiondata);
              
            //  let temptxhash = this.props.bcutxhash;
             // this.setState({txhash:temptxhash});
            //  console.log('文件的hash已经写入到区块链！',temptxhash);
              // this.setState({txhash: ttxhash});
              // //this.setState({isWriteSuccess: true});
              // this.setState({nonce: gnonce});
          
          
            }}
          >将文件hash写到区块链：</Button>
          {/* : <h3>没有区块链上传权限，请联系管理员获取</h3> */}
  }
      <br></br>
      <h3>本次花销：{this.state.cost}</h3>
       <h3>钱包余额：{this.state.inibalance }</h3>

      </div>
       :
    //  <div>
    // <br></br>
    // <h3>钱包余额：{this.props.bcutxhash}</h3>
    <div/>
}



          {/* {
            this.props.successshow === true
              ? <div>
                 <br></br>
                  <h1>文件的hash已经写入到区块链！</h1>
                  <br></br>
                  <Button type="primary" shape="round" icon="download" onClick={() => {
                      this.setState({txhash: ttxhash});
                      web3.eth.getTransaction(this.state.txhash).then (
                      (rdata) => {
                        console.log('tx hash查找到的交易:',rdata);
                        console.log('块哈希值:', rdata.blockHash);
                        const trdata = rdata.input;
                        console.log('解码前数据:', trdata);
                        const dedata = decoder.decodeData(trdata);
                        console.log('解码得到的哈希值', dedata.inputs);
                        this.setState({blockChainHash: dedata.inputs});
                        this.setState({gasused: rdata.gas});
                        this.setState({tblockhash: rdata.blockHash});
                        this.setState({msgshow: true});
                        gasused = this.state.gasused;
                        console.log('消耗的gas',gasused)
                      }
                      )
                    }}>交易信息读取</Button>
     
                </div>
              : <div/>
          }
    
           {
            this.state.msgshow
              ? <div>
                <h1>交易已经完成</h1>
                      <Button onClick={() => {
                      this.setState({readmsg: true});
                    }}>交易Hash值，存储数据等信息查询</Button>
    
                </div>
              : <div>
          } */}
           {
            this.state.msgshow
            ?    <div>
                   <br></br>
                  {/* <h1>交易已经完成</h1> */}

                  <br></br>
                        {/* <Button type="primary" shape="round" icon="download" onClick={() => {
                        this.setState({readmsg: true});
                      }}>交易Hash值，存储数据等信息</Button> */}
                 <Button onClick={()=>{
                    let data={};
                    data.transaction = this.state.txhash;
                    data.ipfshash = this.state.imgHash;
                    data.date =  dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                    this.props.addTransaction(data);
                    this.setState({readmsg: true});
                    }}>上传到数据库</Button>
                   <br></br>
                  </div>
                : <div>
                  {/* <h1>交易尚未完成，请稍后再查询</h1> */}
                    </div> 
       
                
             
          }
          {
            this.state.readmsg
              ? <div>
                 <br></br>
                 {/* <Button onClick={()=>{
                    this.props.updateWallet(this.state.gasused);
                    }}>扣费</Button> */}
                  <h2><font color="red">该交易的Hash：{this.state.txhash}</font></h2>
                  <h2>从区块链读取到的hash值：{this.props.txipfshash}</h2>
                  <h2>该交易的区块链Hash：{this.props.txbchash}</h2>
                  <h2>该交易消耗的gas：{this.props.gasused}</h2>
            
                </div>
              : <div/>
          }


{
            this.state.readmsg
              ? <div>
                 <br></br>
                  <Button onClick={()=>{
                   ipfs.cat(this.state.imgHash, function (err, file) {
                    if (err) {
                      throw err
                    }
                  
                    
                    readfile = file.toString('utf8')
                  })
                  this.setState({readfile:readfile})
                  console.log(this.state.readfile)
                    }}>IPFS存储内容</Button>
                </div>
              : <div/>
          }






          {
            this.state.readfile
              ? <div>
                 <br></br>               
                 <article>  
                <h1>IPFS存储内容</h1>             
                <p>{this.state.readfile}</p>
              </article>
                </div>
              : <div/>
          }
          {/* {
            this.state.readmsg
              ? <div>
                <div>   
                <Button onClick={()=>{
                    ipfs.cat(this.state.imgHash, function (err, file) {
                      if (err) {
                        throw err
                      }                
                      else{
                        console.log(file.toString('utf8'))
                        readfile = file.toString('utf8')
                        
                      }
                    })
                    }}>IPFS文件查询</Button>
                </div>
                  <h2>{readfile}</h2>
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


  //  uploadfileblockchain.propsTypes = {
  //     pageNUm: PropTypes.number.isRequired,
  //     list: PropTypes.arrayOf(PropTypes.object),
  //     total:PropTypes.number.isRequired
  // };
  
  // uploadfileblockchain.defaultProps = {
  //     pageNum: 1,
  //     list: [],
  //     total:0
  // };
//   S
  // const mapDispatchToProps = dispatch => {
  //   return {
  //     addTransaction: username => {
  //       dispatch(add_transaction(username))
  //     }
      
  //   }
  // }

function mapStateToProps(state) {
  let {bcutxhash,successshow,txbchash,txipfshash,txgasused} = state.admin.transactions;
  return {
      bcutxhash,
      successshow,
      userInfo:state.globalState.userInfo,
      txbchash,
      txipfshash,
      txgasused
  }
   
}

  function mapDispatchToProps(dispatch) {
      return {
          addTransaction: bindActionCreators(add_transaction, dispatch),
          updateWallet: bindActionCreators(update_wallet, dispatch),
          txfind: bindActionCreators(txhash_find, dispatch)
        
      }
  }
  
  export default connect(
      mapStateToProps,
      mapDispatchToProps
  )(uploadfileblockchain)    

