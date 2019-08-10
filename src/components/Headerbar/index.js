import style from './style.css';
import React, { Component } from 'react';
import { Link } from 'react-router'
import { Icon, Menu, Dropdown, message , Popconfirm, Form,Modal} from 'antd'
import { UpdateModal } from './UpdateModal';
import { userInfo } from 'os';

// const onClick = function ({ key, ...other }) {
//   message.info(`Click on item ${key}`)
// }
const FormItem = Form.Item;
const WrappedApp = Form.create({ name: 'coordinated' })(Headerbar);


export default class Headerbar extends Component {
    constructor(props){
        super(props)
      this.state = { 
      visible: false,
      visible1:false };

    }

    
  

   
    showModal = () => {
      this.setState({
        visible: true,
      });
    };
    showModal1 = () => {
      this.setState({
        visible1: true,
      });
    };
    handleOk = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    };
    handleOk1 = e => {
      console.log(e);
      this.setState({
        visible1: false,
      });
    };
    handleCancel = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    };
    handleCancel1 = e => {
      console.log(e);
      this.setState({
        visible1: false,
      });
    };
    // handleSubmit = e => {
    //   e.preventDefault();
    //   this.props.form.validateFields((err, values) => {
    //     if (!err) {
    //       console.log('Received values of form: ', values);
    //     }
    //   });
    // };
    render()
     {
   
    
    const menu = (
        <Menu >
          
          <Menu.Item> 
          <span>
            
            <a href="javascript:;"  
            //onClick={this.showModal1}
            onClick={() => 
            {this.showModal1();
              const username =this.props.userInfo.username;
              console.log('caidanm用户名',username)
              if(username){
              setTimeout(() => {
                this.props.getUserInfo(username)
              }, 300);
            }
            //
          }
            }
          >个人信息</a>
            
         </span>
         </Menu.Item> 

         <Menu.Item> 
          <span>
            
             <a href="javascript:;"  onClick={this.showModal}>修改密码</a>
             
          </span>
            </Menu.Item>

            <Menu.Item>  
            <span>
             <Popconfirm title="确定注销?" onConfirm={() => this.props.logout()}>
             <a href="javascript:;">注销</a>
              </Popconfirm>
          </span>
            </Menu.Item>

        </Menu>
      )

      return(
   <div >
     {/* <Link to='/'>
       <h1>ANTD ADMIN</h1>
     </Link> */}
    {/* <userInfo 
    visible={this.state.visible1}
    onOk={this.handleOk}
    onCancel={this.handleCancel}
    ></userInfo> */}
     <Modal
                visible={this.state.visible1}
                title="用户信息"
                okText="完成"
                cancelText="退出"
                onCancel={this.handleCancel1}
                onOk={this.handleOk1}>
                    
                <div className={style.container}>
                    <img src={require('./logo.png')}/>
                    <br></br>
                    <h4>用户名：{this.props.userInfo.username}</h4>
                    <h4>钱包余额：{this.props.uwallet}</h4>
                    <h4>IPFS上传权限：{this.props.userInfo.ipfsupload}</h4>
                    <h4>区块链上传权限：{this.props.ublockchainupload}</h4>
                    <h4>本地上传权限：{this.props.userInfo.localupload}</h4>                 
                    <h4>IPFS查询权限：{this.props.userInfo.ipfsdownload}</h4>
                    <h4>区块链查询权限：{this.props.ublockchaindownload}</h4>
                    <h4>本地查询权限：{this.props.userInfo.localdownload}</h4>     
                    {/* <p className={style.centerP}>钱包余额：{this.props.userInfo.wallet}</p> */}
                    {/* <p className={style.centerP}>Hash code the world~</p> */}
                    {/* <p>区块链上传权限：{this.props.userInfo.blockchainupload}</p> */}
                </div>
                </Modal>
    <div >
    <UpdateModal
   
                    
                    wrappedComponentRef={this.saveFormRef}
                   // defaultvalue={this.props.user}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onOk={this.props.handleOk}
                    // onCreate={this.handleCreate}
                    updatePassword={this.props.updatePassword}  
                    deleteUser={this.props.deleteUser}                  
                    /> 

      <Dropdown overlay={menu}>
        <span><Icon type='user' /> 用户 </span>
      </Dropdown>
    </div>
   </div>
)
    }
    
  }
  


