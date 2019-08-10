import React, { Component, PropTypes } from 'react';
import style from './style.css';
import { Table, Pagination, Button, Popconfirm, Input, Modal, Form, Radio,
    DatePicker, Col, TimePicker, Select, Cascader, InputNumber } from  'antd';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from '../../reducers/adminManagerTags'
import crypto from 'crypto'
import Downloader from 'js-file-downloader';
const Blind = require('blind');
const Search = Input.Search;
const download = require('downloadjs')
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
//api插件的引用
const Web3 = require('web3');
const InputDataDecoder = require('input-data-decoder-ethereum');
//const simpleStorage = contract(SimpleStorageContract)
//配置web3的httpprovider，采用infura
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
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

let senddata;
const decoder = new InputDataDecoder(tokenAbi);


const { get_all_transactions,ipfs_find,bc_find,delete_transction } = actions;


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

// let  aesDecrypt = (encrypted) => {
//     const decipher = crypto.createDecipher('aes192', '叶上初阳干宿雨，水面清圆，一一风荷举。')
//     var decrypted = decipher.update(encrypted, 'hex', 'utf8')
//     decrypted += decipher.final('utf8')
//     return decrypted
// }

let aesDecrypt  = (encrypted) => {
const decipher = crypto.createDecipher('aes192', 'a password');
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
return decrypted;
}


class adminManagerTags extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
        this.state = {
            blockChainHash: null,
            txhash:null,
            tblockhash:null,
            msgshow: false,
            gasused: null,
            blockhash: null,
           
          }
    }
   
    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: '_id',
                key: 'ID',
            },
            {
            title: '用户',
            dataIndex: 'username',
            key: 'name'
        },  {
            title: '存储的区块链地址',
            dataIndex: 'transaction',
            key: 'transaction',
        }, 
        {
            title: '数据的哈希值(加密后)',
            dataIndex: 'enipfshash',
            key: 'enipfshash',
        }, {
            title: '时间',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title:'操作',
            // width: 100,
            // fixed: 'left',
            key:'action',
            render:(text) => {
                return(
                <div>
                    <span>
                    <a href="javascript:;" onClick={() => {
                         const deipfshash = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).decrypt(text.enipfshash);
                         console.log('解密后hash',deipfshash)
                         ipfs.get(deipfshash, function (err, files) {
                             
                            files.forEach((file) => {
                                const fileUrl = "http://localhost:8080/ipfs/" + deipfshash;
 
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
                            //  console.log('路径',file.path)
                            //   console.log('O文件',file.content)
                            //  // console.log(file.content.toString('utf8'))
                            //  const blob = new Blob([new Uint8Array(file)]);
                            //  console.log(blob)
                            //   // const blob = new Blob();
                            //   // console.log(blob)
                            //   download(file.content,text._id);
                              // ipfs.files.flush('/', (err) => {
                              //   if (err) {
                              //     console.error(err)
                              //   }
                              // })
                            })
                          })
                    }}>Download</a>
                   
                   
                    <span className="ant-divider" />
                    <Popconfirm title="Sure to delete?" onConfirm={() => {
                        console.log('发送ID',text.ID)
                        console.log('text数据',text)
                        this.props.DeleteTransaction(text._id)
                    }}>
                    <a href="javascript:;">Delete</a>
                    </Popconfirm>
                    </span>
                </div>    
                )
            }
        }
        ];
        return (
            <div>
           

  

 
                <h2>存储记录</h2>
                
                  <Table
                      className={style.table}
                      pagination={false}
                      columns={columns}
                      dataSource={this.props.list}
                      scroll={{ x: 1300 }}
                      />
                  <div>
                      <Pagination
                          onChange={(pageNum)=>{
                              this.props.getAllTransactions(pageNum);
                          }}
                          current={this.props.pageNum}
                          total={this.props.total}/>
                  </div>
            </div>
        )
    }

    componentDidMount() {
        //缓存
        if(this.props.list.length===0)
            this.props.getAllTransactions();
    }
}


adminManagerTags.propsTypes = {
    pageNUm: PropTypes.number.isRequired,
    list: PropTypes.arrayOf(PropTypes.object),
    total:PropTypes.number.isRequired
}; 

adminManagerTags.defaultProps = {
    pageNum: 1,
    list: [],
    total:0
};

function mapStateToProps(state) {
    let {pageNum, list,total} = state.admin.transactions;
    return {
        pageNum,
        list,
        total,
        userInfo:state.globalState.userInfo
        
    }
     
  }

function mapDispatchToProps(dispatch) {
    return {
        getAllTransactions: bindActionCreators(get_all_transactions, dispatch),
        ipfsFind: bindActionCreators(ipfs_find, dispatch),
        bcFind: bindActionCreators(bc_find, dispatch),
        DeleteTransaction:bindActionCreators(delete_transction, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(adminManagerTags)