import React,  { Component } from 'react';

import { Upload, Button, Input, Card, Modal } from 'antd';

import '../Detail/style.css';
import style from './style.css';

import { actions } from '../../reducers/AdminManagerTransactions'

const Blind = require('blind');
const ipfsAPI = require('ipfs-api');
//设置IPFS参数
const ipfs = ipfsAPI('/ip4/39.106.213.201/tcp/5001');
//使用的合约的abi信息
let senddata
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



class AdminManagerLocal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            blockChainHash: null,
            imgHash: null,
            readmsg: false,
            filename: null,
            filesize: null,
            filetype: null,
            loading:false,
            visible:false
          }
      
    }

    showModal = () => {
      this.setState({
        visible: true,
      });
    }
    handleOk = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }
    handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
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
        
    <div>
          <h2>上传文件到本地：</h2>
          <div className={style.test}>
          <Card title="本地文件加密存储" extra={<a href="#">More</a>} style={{ width: 300 }}>

<input  type="file" ref="file"  multiple="multiple" onChange={() => {
    // const Bdate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    // console.log("1时间",Bdate)
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
       <br></br>
       <h3>上传文件的文件名：{this.state.filename}</h3>
        <h3>上传文件的类型：{this.state.filetype}</h3>
        <h3>上传文件的大小：{this.state.filesize}</h3>
        <br></br>
        <Button type="primary" shape="round" icon="upload" loading={this.state.loading} onClick={() => {
              this.setState({loading:true})
                const file = this.refs.file.files[0];
                const reader = new FileReader();
               // reader.readAsDataURL(file);
                reader.readAsArrayBuffer(file)
                //reader.readAsBinaryString(file)
                reader.onloadend = function(e) {
                
                  saveImageOnIpfs(reader).then((hash) => {

                    console.log('ipfs存储哈希值',hash);
                    senddata = hash;
                    console.log(senddata);
                    let encrypted1 = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).encrypt(hash);
                  console.log('内容为测试二字的加密:',encrypted1);
                    this.showModal()
                    this.setState({imgHash: encrypted1})
                    this.setState({loading:false})
                    //this.setState({visible:true})
                    
                  });
    
                }.bind(this);
    
              }}>文件上传</Button>
</Card>
          </div>
      
          <Modal
          title="文件已上传,相关信息如下"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
       <font color='red'> <p>加密后的数据哈希值：{this.state.imgHash}</p> </font> 
        </Modal>

  
  }
        </div>
        ); 
      }
    }
    
export default AdminManagerLocal;
