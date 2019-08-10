    import React, { Component, PropTypes } from 'react';
    import style from './style.css';
    import { Table, Pagination, Button, Modal, Icon, Input } from  'antd';
    import PureRenderMixin from 'react-addons-pure-render-mixin'
    import { bindActionCreators } from 'redux'
    import { connect } from 'react-redux'
    import { actions } from '../../reducers/adminManagerTags'
    import crypto from 'crypto'
    const Blind = require('blind');
    const Search = Input.Search;
    const ipfsAPI = require('ipfs-api');
    //const Hash = require('ipfs-only-hash');
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
    let txfindata = [];
    let senddata;
    const decoder = new InputDataDecoder(tokenAbi);
    
    
    const { get_all_transactions,ipfs_find,bc_find,txhash_find } = actions;
    
    let  saveImageOnIpfs = (reader) => {
      return new Promise(function(resolve, reject) {
        const buffer = Buffer.from(reader.result); //将存入的结果转成buff
        ipfs.add(buffer,{ onlyHash: true }).then((response) => {
          console.log('response结构',response)
          resolve(response[0]);//传回第一个函数的哈希值 .hash,response[0].path,response[0].size
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


    class AdminManagerComment extends Component {
    
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
                filename: null,
                filesize: null,
                filetype: null,
                ipfsname: null,
                ipfsize: null,
                visible1: false,
                visible2: false,
                visible3: false,
                visible4: false,
                visible5: false,
                visible6: false,
              }
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
            this.setState({
              visible6: false,
            });
          }
          handleCancel = (e) => {
            console.log(e);
            this.setState({
              visible1: false,
            });
            this.setState({
              visible6: false,
            });
          }
        render() {
            return (
                <div>
                    <h3>交易存证</h3>
                    <br></br>
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

    
              </div>
       { this.props.userInfo.ipfsdownload === 'true' ?
          <div>
          <br /><br />
            <Button type="primary" shape="round" icon="upload" onClick={() => {
                const file = this.refs.file.files[0];
                const reader = new FileReader();
                // reader.readAsDataURL(file);
                reader.readAsArrayBuffer(file)
                reader.onloadend = function(e) {
                  console.log(reader);
                  
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
                const ipfshash = this.state.imgHash;
                console.log('ipfs存储哈希值imghash',typeof ipfshash);
               //alert(ipfshash)
            
              }}>上传</Button>
             {/* <Button type="primary" shape="round" icon="upload" onClick={() => {
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
    
              }}>将文件上传到IPFS</Button> */}
<br></br>

              {/* 
              <h3>IPFS存储的文件Hash：{this.state.imgHash}</h3>
                  <h3>IPFS存储的文件路径名：{this.state.ipfsname}</h3>
                  <h3>IPFS存储的文件大小：{this.state.ipfsize}</h3> */}
              <br></br>
              <Button  onClick={() => {    
               const ipfshash = this.state.imgHash;
                console.log('ipfs存储哈希值imghash',ipfshash);
               // alert(ipfshash); 
               // alert(ipfshash.toString(''));   
                this.props.ipfsFind(senddata)
                //const show = this.props.ipfsshow
                this.setState({visible2:true});
                this.setState({visible3:false});
                this.setState({visible4:false});
                this.setState({visible5:false});
              }
            }
              >查询IPFS是否有存储</Button>
          </div>:
          <h3>没有对应权限，请联系管理员获取</h3>
       }

       {
         this.state.visible2 === true ?
         <div>
         <br></br>
         <h3>上传文件的数据哈希值: {this.props.uploadipfs}</h3>
         <h3>对应存储中的数据哈希值: {this.props.savedipfs}</h3>
         </div>
         :<div></div>
       }
 
       { this.props.userInfo.localdownload === 'true' ?

      <div> 
      <br></br>
      <Button onClick={()=>{
       this.props.bcFind(senddata);
      // const show = this.props.bcshow;
       this.setState({visible2:false});
       this.setState({visible3:true});
       this.setState({visible4:false});
       this.setState({visible5:false});
      }}>
      区块链验证
      </Button>
     <h3></h3>
      </div>
      :<h3>没有对应权限，请联系管理员获取</h3>
      
      }

        {
         this.state.visible3 === true  ?
         <div>
         <br></br>
         <h3>上传文件的数据哈希值: {this.props.bcuipfs}</h3>
         <h3>对应存储的区块链地址: {this.props.bctxhash}</h3>
         <h3>区块链存储中的数据哈希值: {this.props.bcipfs}</h3>
         </div>
         :<div></div>
       }
 


  <br></br>
 <h3>加密后的哈希值查询IPFS存储</h3>
 <br></br>
{ this.props.userInfo.localdownload === 'true' ?
      <div>
       <Search
                    placeholder="输入加密过后的数据哈希值"
                    onSearch={value => {
                      const encrypted = value
                      console.log('搜索数据',encrypted)
                      if(encrypted.length === 64){
                      const deipfshash = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).decrypt(encrypted);
                      //const deipfshash = aesDecrypt(encrypted)
                      this.props.ipfsFind(deipfshash)
                     console.log('解码数据',deipfshash)
                     this.setState({visible2:false});
                    this.setState({visible3:false});
                    this.setState({visible4:true});
                    this.setState({visible5:false});
                    }
                    else{this.props.ipfsFind(encrypted)}
                      }
                        }
                        
                      style={{ width: 500 }}
                    />      
      <br></br>

   
                                                  
      </div>
      :<h3>没有对应权限，请联系管理员获取</h3>
            
            }

     {
         this.state.visible4 === true ?
         <div>
         <br></br>
         <h3>上传文件的数据哈希值: {this.props.uploadipfs}</h3>
         <h3>对应存储中的数据哈希值: {this.props.savedipfs}</h3>
         </div>
         :<div></div>
       }



      <br></br>
       <h3>加密后的哈希值查询区块链存储</h3>
       <br></br>
      { this.props.userInfo.localdownload === 'true' ?
      <div>
               <Search
                    placeholder="输入加密过后的数据哈希值"
                    onSearch={value => {
                      const encrypted = value
                      console.log('搜索数据',encrypted)
                      if(encrypted.length === 64){
                      const deipfshash = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).decrypt(encrypted);
                      //const deipfshash = aesDecrypt(encrypted)
                      this.props.bcFind(deipfshash)
                     console.log('解码数据',deipfshash)
                     this.setState({visible2:false});
                     this.setState({visible3:false});
                     this.setState({visible4:false});
                     this.setState({visible5:true});
                    }
                    else{this.props.bcFind(encrypted)}
                      }
                        }
                        
                      style={{ width: 500 }}
                    /> 
      {/* <Search
                    placeholder="输入加密过后的数据哈希值"
                    onSearch={value => {
                      const encrypted = value
                      console.log('搜索数据长度',encrypted.length)
                      const deipfshash = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).decrypt(encrypted);
                      //const deipfshash = aesDecrypt(encrypted)
                      this.props.bcFind(deipfshash)
                    console.log('解码数据',deipfshash)
                    this.setState({visible2:false});
                    this.setState({visible3:false});
                    this.setState({visible4:false});
                    this.setState({visible5:true});
                      }
                        }
                        
                      style={{ width: 500 }}
                    />       */}
      <br></br>
                                                  
      </div>
      :<h3>没有对应权限，请联系管理员获取</h3>

                      }

              {
                this.state.visible5 === true  ?
                <div>
                <br></br>
                <h3>上传文件的数据哈希值: {this.props.bcuipfs}</h3>
                <h3>对应存储的区块链地址: {this.props.bctxhash}</h3>
                <h3>区块链存储中的数据哈希值: {this.props.bcipfs}</h3>
                </div>
                :<div></div>
              }

                <br></br>
               <h3>信息验证</h3>
                <br></br>
                <Search
                    placeholder="输入区块链交易哈希值"
                    onSearch={value => {
                        this.setState({txhash: value});
                        this.props.TxFind(value);
                        this.setState({visible1:true});
                        
                      }
                        }
                        
                      style={{ width: 500 }}
                    />

                    <Modal
                    title="区块链交易信息查询"
                    visible={this.state.visible1}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                  <h3><font color="red">该交易的Hash：{this.state.txhash}</font></h3>
                  <br></br>
                  <h3>从区块链读取到的hash值：{this.props.txipfshash}</h3>
                  <br></br>
                  <h3>该交易的区块链Hash：{this.props.txbchash}</h3>
                  <br></br>
                  <h3>该交易消耗的gas：{this.props.txgasused}</h3>
             
                    </Modal>
                    <Modal
                    title="区块链交易信息查询"
                    visible={this.state.visible6}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                  <h3>没有查询到相关的交易，请确认填写是否无误，交易是否存在</h3>
                  
                    </Modal>
                   <br></br>
                   <br></br>
                    
                </div>
            )
        }
    
        componentDidMount() {
            //缓存
            if(this.props.list.length===0)
                this.props.getAllTransactions();
        }
    }
    
    
    AdminManagerComment.propsTypes = {
        pageNUm: PropTypes.number.isRequired,
        list: PropTypes.arrayOf(PropTypes.object),
        total:PropTypes.number.isRequired,
        uploadipfs: PropTypes.string.isRequired,
        savedipfs: PropTypes.string.isRequired,
        bcuipfs: PropTypes.string.isRequired,
        bcipfs: PropTypes.string.isRequired,
        bctxhash: PropTypes.string.isRequired,
        ipfsshow: PropTypes.string.isRequired,
        bcshow: PropTypes.string.isRequired,
        txipfshash: PropTypes.string.isRequired,
        txbchash: PropTypes.string.isRequired,
        txgasused: PropTypes.number.isRequired,
    };
    
    AdminManagerComment.defaultProps = {
        pageNum: 1,
        list: [],
        total:0,
        uploadipfs:[],
        savedipfs:[],
        bcuipfs:[],
        bcipfs:[],
        bctxhash:[],
        ipfsshow:[],
        bcshow:[],
        txipfshash:[],
        txbchash:[],
        txgasused:[]
       
    };
    
    function mapStateToProps(state) {
        let {pageNum, list,total,savedipfs,uploadipfs,bcuipfs,bcipfs,bctxhash,
          ipfsshow,bcshow,txipfshash,txbchash,txgasused} = state.admin.transactions;
        return {
            pageNum,
            list,
            total,
            userInfo:state.globalState.userInfo,
            savedipfs,
            uploadipfs,
            bcuipfs,
            bcipfs,
            bctxhash,
            ipfsshow,
            bcshow,
            txipfshash,
            txbchash,
            txgasused
        }
         
      }
    
    function mapDispatchToProps(dispatch) {
        return {
            getAllTransactions: bindActionCreators(get_all_transactions, dispatch),
            ipfsFind: bindActionCreators(ipfs_find, dispatch),
            bcFind: bindActionCreators(bc_find, dispatch),
            TxFind: bindActionCreators(txhash_find, dispatch),
        }
    }
    
    export default connect(
        mapStateToProps,
        mapDispatchToProps
    )(AdminManagerComment)