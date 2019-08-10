import React,  { Component } from 'react';
//import remark from 'remark';
//import reactRenderer from 'remark-react';
//import { Input, Select, Button, Modal } from 'antd';
import { Upload, Button, Input } from 'antd';

import '../Detail/style.css';
import './style.css';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from '../../reducers/adminManagerTags'

const Blind = require('blind');
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
const { add_local } = actions;
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
let saveImageOnIpfs = (reader) => {
  return new Promise(function(resolve, reject) {
    const buffer = Buffer.from(reader.result); //将存入的结果转成buff
    ipfs.add(buffer).then((response) => {
      console.log(response)
      resolve(response[0].hash);//传回第一个函数的哈希值
    }).catch((err) => {
      console.error(err)
      reject(err);
    })
  })
}


class AdminManagerArticle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            blockChainHash: null,
            address: contractAddr,
            imgHash: null,
            readmsg: false
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
        return (
        
    <div className="App">
          <h2>上传文件到本地：</h2>
          <div>
            <label id="file">选择上传文件</label>
            <input type="file" ref="file" id="file" name="file" multiple="multiple"/>
          </div>
          <div>
          <br /><br />
            <Button type="primary" shape="round" icon="upload" onClick={() => {
                const file = this.refs.file.files[0];
                const reader = new FileReader();
               // reader.readAsDataURL(file);
                reader.readAsArrayBuffer(file)
                //reader.readAsBinaryString(file)
                reader.onloadend = function(e) {
                
                // let decrypted1 = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).decrypt(encrypted1);
                //   console.log('内容应为测试的解密:',decrypted1);
                //   console.log('需要加密的文件:',reader);
                // let encrypted2 = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).encrypt(reader);
                //   console.log('加密文件:',encrypted2);
                // let decrypted2 = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).decrypt(encrypted2);
                //   console.log('解密',decrypted2);
                // new Blind().hash(reader, 'PZ3oXv2v6Pq5HAPFI9NFbQ==', function (err, hash) {
                //   console.log('jiami',hash);
                //})
                  saveImageOnIpfs(reader).then((hash) => {
                    console.log('ipfs存储哈希值',hash);
                    senddata = hash;
                    console.log(senddata);
                    let encrypted1 = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).encrypt(hash);
                  console.log('内容为测试二字的加密:',encrypted1);
                    this.setState({imgHash: encrypted1})
                    this.setState({readmsg: true})
                    
                  });
    
                }.bind(this);
    
              }}>将文件上传到本地并返回文件HASH</Button>
          </div>
          {
            this.state.imgHash
              ? <div>
                  <h2>加密后的数据哈希值：{this.state.imgHash}</h2>

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
        </div>
        ); 
      }
    }
    
export default AdminManagerArticle;
