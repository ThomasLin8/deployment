import React, { Component, PropTypes } from 'react';
import {Steps, Button, message,Input,Card,Modal,Radio,Form,notification} from 'antd';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import  './index.less';
import { actions } from '../../reducers/AdminManagerTransactions'
import dateFormat from 'dateformat'
import {Blockchainuploadform} from './Blockchainuploadform';
const {add_transaction,update_wallet,txhash_find} = actions;
const FormItem = Form.Item;
//api插件的引用
const ipfsAPI = require('ipfs-api');

//const contract = require('truffle-contract');
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const InputDataDecoder = require('input-data-decoder-ethereum');

//设置IPFS参数
const ipfs = ipfsAPI('/ip4/39.99.215.93/tcp/5001');
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

//发送账户的秘钥
const privateKey = Buffer.from('061676AE52F57B2A90F859889C76FEFCF68EE4483A0E46D0E3D5BB4F4E620D13', 'hex')

//配置web3的httpprovider
const web3 = new Web3(new Web3.providers.HttpProvider("http://39.99.215.93:8546"));

let senddata = []; //发送数据
let nonce; //nonce
let ttxhash;
let transaction =[];
let gasused;
let cost;
let keysize;
let walletmoney
let keyhash
let formdata
let isWriteSuccess

//合约地址
const contractAddr = '0xe0A2318f72fCe73AE9Cc207014fF361Cf3E05680';
//设置使用的账户
web3.eth.defaultAccount = '0x1aB1DC744b964f5c5023d92666D7f738Eb04B203';

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

// openNotification和openNotificationp都是打开通知消息
const openNotification = () => {
  notification.open({
    message: '请同意服务条款,不然无法继续使用',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};

const openNotificationp = () => {
  notification.open({
    message: '请请输入正确的登入密码,否则无法上传',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};

//定义进度条相关函数
const { Step } = Steps;

const steps = [
  {
    title: 'IPFS上传',
    content: 'First-content',
  },
  {
    title: '区块链上传',
    content: 'Second-content',
  },
  {
    title: '保存存储记录',
    content: 'Last-content',
  },
];

//格式布局
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};



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
            visible1: false,
            visible2: false,
            visible3: false,
            visiblef: false,
            visibleb: false,
            visilblefile: false,
            walletshow: null,
            cost:null,
            loading1:false,
            loading2:false,
            current:0,
            formdata:null,

          }

    }
// showmodal 对应modal的打开,handleok表示下一步,handlecancel取消关闭model
    showModal2 = () => {
      this.setState({
        visible2: true,
      });
    }
    handleOk2 = (e) => {
      console.log(e);
      this.setState({
        visible2: false,
      });
      let data={};
      data.transaction = ttxhash;
      data.filename = formdata.filename;
      data.ipfshash = this.state.imgHash;
      data.date =  dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      
      this.props.addTransaction(data);

     
      setTimeout(() => {
     
        this.setState({current:0})
        
       }, 4000);
    }

    handleCancel2 = (e) => {
      console.log(e);
      this.setState({
        visible2: false,
      });
    }


    showModal = () => {
      this.setState({
        visible1: true,
      });
    }
    handleOk = (e) => {
      console.log(e);
      this.setState({
        visible1: false,
      });
    }
    handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible1: false,
      });
    }


    showModalb = () => {
      this.setState({
        visibleb: true,
      });
    }
    handleOkb = (e) => {
      console.log(e);
      this.setState({
        visibleb: false,
      });
    }
    handleCancelb = (e) => {
      console.log(e);
      this.setState({
        visibleb: false,
      });
    }


    showModalf = () => {
      this.setState({
        visiblef: true,
      });
    }
    handleOkf = (e) => {
      console.log(e);
      this.setState({
        visiblef: false,
      });
    }
    handleCancelf = (e) => {
      console.log(e);
      this.setState({
        visiblef: false,
      });
    }


    showModal3 = () => {
      this.setState({
        visible3: true,
      });
    }
    handleOk3 = (e) => {
      console.log(e);
      this.setState({
        visible3: false,
      });

    }
    handleCancel3 = (e) => {
      console.log(e);
      this.setState({
        visible3: false,
      });
    }


    showModalfile = () => {
        this.setState({
          visiblefile: true,
        });
      }
      handleOkfile = (e) => {
        console.log(e);
        this.setState({
          visiblefile: false,
        });
  
      }
      handleCancelfile = (e) => {
        console.log(e);
        this.setState({
          visiblefile: false,
        });
      }


    saveFormRef = (form) => {
        this.form = form;
    }

    handleupload = (values) => {
        console.log('是否上传内容',values)
        console.log('有调用函数')
        formdata = values
        console.log('上传内容',formdata.remember)
        if(formdata.remember == true && formdata.password == this.props.userInfo.password)
        {
            this.setState({visiblef:true})
            console.log('判断无误,然而')
        }
        else if(formdata.password != this.props.userInfo.password)
        {openNotificationp()}
        
        else
        {openNotification()}
    }

    uploadipfs =() => {
        const file = this.refs.file.files[0];
        const reader = new FileReader();
        const uploadfiledata=reader.readAsArrayBuffer(file)
        const Bdate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        console.log("2时间",Bdate)
        reader.onloadend = function(e) {

        saveImageOnIpfs(reader).then((resdata) => {
            console.log('ipfsresdata',resdata);
            console.log('ipfs存储哈希值',resdata.hash);
            senddata.hash = resdata.hash;
            const Bdate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
            console.log("3时间",Bdate)
            keyhash = resdata.hash
            keysize = resdata.size
            const current = this.state.current + 1;
            this.setState({ current });
            this.setState({imgHash: resdata.hash})
            this.setState({ipfsname: resdata.path })
            this.setState({ipfsize: resdata.size });
            this.blockchainupload()
        
        });

        }.bind(this);

    }



    //定义区块链上传函数
    blockchainupload = () => {
      this.setState({loading2:true})
      const tdate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      senddata="用户名: "+this.props.userInfo.username+"  ;文件名: "+this.state.filename+"  ;文件类型: "+this.state.filetype+"  ;文件大小: "+keysize
      +"  ;IPFS哈希值: "+keyhash+"  ;时间: "+tdate;
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
        
//定时获取该交易的预估gas
      setTimeout(() => {
        gasused = 2*gasused;
     
        cost = gasused/1000;
          console.log("估计花销的gas", gasused);
          transaction.cost = cost;
          console.log("估计花销的cost", transaction.cost);
       
      //估计gas价格
      const gasPrice = web3.eth.getGasPrice();

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
   
    
        //tx交易签名
          const tx = new Tx(rawTx);
          tx.sign(privateKey);
        //发送交易
          const serializedTx = tx.serialize();
          transaction.serializedTx = serializedTx.toString('hex');
          console.log("发送的seri",transaction.serializedTx)
          ttxhash = this.props.keyhash;
          isWriteSuccess = 'true'
        
          this.props.updateWallet(transaction);

      setTimeout(() => {
        walletmoney = this.props.balance
        ttxhash = this.props.keyhash
        this.setState({
          visible1: false,
        });
        
        this.uploadfinish();
        if(this.props.userInfo.blockchainupload === 'true')
        {this.showModal2();}
        const current = this.state.current + 1;
        this.setState({ current });
      }, 600);
     
      
      console.log('文件的hash已经写入到区块链！');
      this.setState({txhash:ttxhash});
      this.setState({cost:cost });
      this.setState({msgshow: true});

     }, 300);  
  
    }
    uploadfinish = () => {
      this.setState({loading2:false})
      this.setState({visiblef:false})
    };

    //读取ipfs的节点
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

        return(
            <div>
                 <div >
                    <Steps  current={this.state.current}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                    </Steps>

                    <br></br>
                
                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>

                    <div>

                    <Blockchainuploadform handleupload={this.handleupload}></Blockchainuploadform>  
                  
                   </div>

                    <Modal  
                    title="文件上传"
                    visible={this.state.visiblef}
                    onOk={this.uploadipfs}
                    onCancel={this.handleCancelf}>
                        
                        <input  type="file" ref="file"  multiple="multiple" onChange={() => {
                            const Bdate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                            console.log("1时间",Bdate)
                                const file = this.refs.file.files[0];
                        
                                this.setState({filename:file.name});
                                this.setState({filetype:file.type});
                                this.setState({filesize:file.size});
                        
                    
                            }}/>
                                <br></br>
                    <br></br>
                                <h2 style={{marginLeft:'0px'}}>上传文件的文件名：{this.state.filename}</h2>
                                <h2 style={{marginLeft:'0px'}}>上传文件的类型：{this.state.filetype}</h2>
                                <h2 style={{marginLeft:'0px'}}>上传文件的大小：{this.state.filesize}</h2>
                            
                                <br></br>
                                <br></br>
          
                
                    </Modal>
    
                    <Modal
          title="文件已上传到IPFS,相关信息如下"
          visible={this.state.visible1}
          onOk={this.blockchainupload}
          onCancel={this.handleCancel}
        >

         <h3>IPFS存储的文件Hash：{keyhash}</h3>
         <br></br>
         <h3>IPFS存储的文件大小：{keysize}</h3>
        </Modal>

        <Modal
          title="已成功上传到区块链,相关信息如下"
          visible={this.state.visible2}
          onOk={this.handleOk2}
          okText="保存存储记录"
          onCancel={this.handleCancel2}
        >

         <h3>本次花销:{this.state.cost}</h3>
         <br></br>
         <h3>用户余额:{walletmoney}</h3>
         <br></br>
         <h3><font color='red'>该交易的Hash：{ttxhash}</font></h3>
         <br></br>
       
        </Modal>

        <Modal
          title="所查询的对应区块链信息"
          visible={this.state.visible3}
          onOk={this.handleOk3}
          onCancel={this.handleCancel3}
        >
         <h3><font color='red'>该交易的Hash：{ttxhash}</font></h3>
                    <br></br>
                    <h3>从区块链读取的存储内容：{this.props.txipfshash}</h3>
                    <br></br>
                    <h3>该交易的区块链Hash：{this.props.txbchash}</h3>
                    <br></br>
                    <h3>该交易消耗的gas：{this.props.txgasused}</h3>

        </Modal>
     
                </div>
           
        )

      }

    }

   uploadfileblockchain.propsTypes = {
    txipfshash: PropTypes.string.isRequired,
    txbchash: PropTypes.string.isRequired,
    txgasused: PropTypes.number.isRequired,
    balance: PropTypes.number.isRequired,
    keyhash:PropTypes.string.isRequired,
  };
  
  uploadfileblockchain.defaultProps = {
    txipfshash:[],
    txbchash:[],
    txgasused:[],
    balance:[],
    keyhash:[],
  };
function mapStateToProps(state) {
   let {txipfshash,txbchash,txgasused,balance,keyhash} = state.admin.transactions;
   return {
       userInfo:state.globalState.userInfo,
       txipfshash,
       txbchash,
       txgasused,
       balance,
       keyhash,
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
