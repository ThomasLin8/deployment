import React, { Component, PropTypes } from 'react';
import './style.less'
import { Collapse,  Button, Modal, Icon, Input,Card } from  'antd';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from '../../reducers/AdminManagerTransactions'

 //crypt,blind加密组件导入
import crypto from 'crypto'
const Blind = require('blind');

 // antd组件的定义
const Search = Input.Search;
const Panel = Collapse.Panel;

//IPFS插件引用
const ipfsAPI = require('ipfs-api');
//const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');
const ipfs = ipfsAPI('/ip4/45.32.74.218/tcp/5001');
//web3 api插件的引用
const Web3 = require('web3');

 //配置web3的httpprovider,本地为127.0.0.1,云服务器为云服务器外网IP
const web3 = new Web3(new Web3.providers.HttpProvider("http://45.32.74.218:8546"));

//合约的abi编码,每次调用合约都必须有的,可用remix等获取合约编码
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

// 合约数据的加密插件导入和定义使用
     const InputDataDecoder = require('input-data-decoder-ethereum');
     const decoder = new InputDataDecoder(tokenAbi);


let senddata; //发送数据

// panel显示的标题
const classify = [
  "文件方式验证",
  "加密哈希值方式验证",
  "区块链存储信息查询"
];

//card中显示的文字
const text = [
"文件方式验证提供文件的存证,首先点击页面内验证按钮,在弹出的窗口中上传需要验证的文件,文件上传后,将弹出窗口,可选择IPFS验证和区块链验证,IPFS验证将验证文件是否已经存入IPFS,区块链验证将验证文件是否存入区块链中。",
"加密哈希值方式验证提供加密哈希值的存证,首先点击页面内验证按钮,在弹出的窗口中输入需要验证的哈希值,完成输入后将弹出窗口,可选择IPFS验证和区块链验证,IPFS验证将验证文件是否已经存入IPFS,区块链验证将验证文件是否存入区块链中。",
"区块链存储信息查询提供区块链存储信息的查询,首先将需要查询的哈希值输入下方搜索框,完成输入后即可获得相关存储信息。"
];

// reducer的action引入
const { get_all_transactions,ipfs_find,bc_find,txhash_find } = actions;

// 定义文件存储到IPFS的函数
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

// 定义解密函数
let aesDecrypt  = (encrypted) => {
const decipher = crypto.createDecipher('aes192', 'a password');
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
return decrypted;
}


class AdminManagerProve extends Component {

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
            visible11: false,
            visiblefile:false,
            visiblehash:false,
            
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
        // this.setState({
        //   visible6: false,
        // });
      }
      handleCancel = (e) => {
        console.log(e);
        this.setState({
          visible1: false,
        });
        // this.setState({
        //   visible6: false,
        // });
      }

      // 区块链交易信息查询的modal控制,showModal1是打开,handleok1是关闭,handleCancle1是取消
      showModal1 = () => {
        this.setState({
          visible11: true,
        });
      }
      handleOk1 = (e) => {
        console.log(e);
        this.setState({
          visible11: false,
        });

      }
      handleCancel1 = (e) => {
        console.log(e);
        this.setState({
          visible11: false,
        });

      }
      showModalfile = () => {
        this.setState({visiblefile:true})
      }

      handleCancelfile = () => {
        this.setState({visiblefile:false})
      }

      handleCancelhash = () => {
        this.setState({visiblehash:false})
      }

//文件存证方式的函数
      fileprove=() => {
        this.showModal1();
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
  
    }


// Panel 面板
      Panel(){
        let panel = text.map(function(item,index){
            return(
                <Panel header={classify[index]} key={index}>
                    <div>{item}</div>
                    <p className="author">{author[index]}</p>
                </Panel>
            )
        });
        return panel;
      }
      
    render() {
        return (
         
         
            <div>

              
          <h1 style={{textAlign:'center',color:'gray'}}>信息存证</h1>
                           <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                    
                       
                        <Card className="testcards"
                            >
                      
                           
                            <div className="collapse">
                                <Collapse accordion defaultActiveKey={"0"}>
  
                                <Panel header={classify[0]} >
                                    <div>文件方式验证提供文件的存证,首先点击页面内验证按钮,在弹出的窗口中上传需要验证的文件,文件上传后,将弹出窗口,可选择IPFS验证和区块链验证,IPFS验证将验证文件是否已经存入IPFS,区块链验证将验证文件是否存入区块链中。</div>
                                    <br></br>
                                    <Button type="dashed" style={{float:"right",height:40,width:80}} 
                                    onClick={() => {  
                                    this.showModalfile()
                                    }}
                                    >验证</Button>
                            
                                </Panel>

                                <Panel header={classify[1]} >
                                    <div>加密哈希值方式验证提供加密哈希值的存证,首先点击页面内验证按钮,在弹出的窗口中输入需要验证的哈希值,完成输入后将弹出窗口,可选择IPFS验证和区块链验证,在对应的验证搜索框输入加密哈希值即可完成验证.IPFS验证将验证文件是否已经存入IPFS,区块链验证将验证文件是否存入区块链中。</div>
                                    <br></br>
                                    <Button type="dashed" style={{float:"right",height:40,width:80}} 
                                    onClick={() => {  
                                    this.setState({visiblehash:true})
                                    }}
                                    >验证</Button>
                            
                                </Panel>

                                <Panel header={classify[2]} >
                                    <div>区块链存储信息查询提供区块链存储信息的查询,首先将需要查询的哈希值输入下方搜索框,完成输入后即可获得相关存储信息。</div>
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
                            
                                </Panel>
                                </Collapse>
                            </div>
                        </Card>


          <br></br>
                            <div>



          <Modal
                title="文件方式验证"
                visible={this.state.visiblefile}
                onOk={this.fileprove}
                onCancel={this.handleCancelfile}
                >      
      
        <input className='ui-uploads' type="file" ref="file" id="file" name="file" multiple="multiple" onChange={() => {
            const file = this.refs.file.files[0];
              console.log('文件名',file.name);
              this.setState({filename:file.name});
              console.log('大小size',file.size);
              this.setState({filetype:file.type});
              this.setState({filesize:file.size});

          }}/>

                <br></br>
              <h2 style={{marginLeft:'0px'}}>上传文件的文件名：{this.state.filename}</h2>
               <h2 style={{marginLeft:'0px'}}>上传文件的类型：{this.state.filetype}</h2>
               <h2 style={{marginLeft:'0px'}}>上传文件的大小：{this.state.filesize}</h2>
               <br></br>
         
       </Modal> 
   
       <Modal
                title="加密哈希值方式验证"
                visible={this.state.visiblehash}
                onOk={this.handleCancelhash}
                onCancel={this.handleCancelhash}
                >   
        
       
<h2 style={{marginLeft:'0px'}}> <font color='black'>加密后的哈希值查询IPFS存储</font> </h2> 
<br></br>

{ this.props.userInfo.localdownload === 'true' ?
  <div style={{marginLeft:'0px'}}>
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

<br></br>
<br></br>
<h2 style={{marginLeft:'0px'}}> <font color='black'>加密后的哈希值查询区块链存储 </font> </h2> 
<br></br>
  { this.props.userInfo.localdownload === 'true' ?
  <div style={{marginLeft:'0px'}}>
           <Search  
                placeholder="输入加密过后的数据哈希值"
                onSearch={value => {
                  const encrypted = value
                  console.log('搜索数据',encrypted)
                  if(encrypted.length === 64){
                  const deipfshash = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).decrypt(encrypted);
                  //const deipfshash = aesDecrypt(encrypted)
                  this.props.bcFind(deipfshash)
                 console.log('111解码数据',deipfshash)
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

  <br></br>
                                              
  </div>
  :<h3>没有对应权限，请联系管理员获取</h3>

                  }
</Modal>  
         
          <Modal className='avatar' title="区块链信息验证 " >
            <br></br>
<div style={{marginLeft:'510px'}}>
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
</div>
</Modal>

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

                <br></br>
                <div >

        <Modal
      title="验证"
      visible={this.state.visible11}
      onOk={this.handleOk1}
      onCancel={this.handleCancel1}
    >

  
{ this.props.userInfo.ipfsdownload === 'true' ?
      <div>

          <br></br>

          <Button  onClick={() => {    
           const ipfshash = this.state.imgHash;
            console.log('ipfs存储哈希值imghash',ipfshash);
            this.props.ipfsFind(senddata)
          }
        }
          >查询IPFS是否有存储</Button>
      </div>:
      <h3>没有对应权限，请联系管理员获取</h3>
   }

   <br></br>

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

                </Modal>
            
                      </div>







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


AdminManagerProve.propsTypes = {
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

AdminManagerProve.defaultProps = {
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
)(AdminManagerProve)