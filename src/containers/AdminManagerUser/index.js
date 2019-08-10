import React, { Component, PropTypes } from 'react';
import style from './style.css';
import { Table, Pagination, Button, Popconfirm, Input, Modal, Form, Radio,
    DatePicker, Col, TimePicker, Select, Cascader, InputNumber } from  'antd';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from '../../reducers/adminManagerUser'
import {CollectionCreateForm } from './CollectionCreateForm';
//import { Button } from 'antd/lib/radio';
//import DeleteButton from '../../components/DeleteButton'
const { get_all_users,delete_user,update_user,update_password } = actions;
const FormItem = Form.Item;
const Option = Select.Option;

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




class AdminManagerUser extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
     
        this.state = {
            visible: false,
            confirmLoading: false,
            text:null
          };
       
        
    }
      editClick = (text) => {
          //this.Child.handleValue();

          this.setState({
              text: text,
          });
          console.log("状态里的值",this.state.text)
          this.setState({
              visible: true,
          });
          
      };
      
      showModal = () => {
          this.setState({ visible: true });
        }
      
      handleCancel = () => {
        this.setState({ visible: false });
      }
      handleOk = () => {
        this.setState({
          ModalText: 'The modal will be closed after two seconds',
          confirmLoading: true,
        });
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false,
          });
        }, 2000);
      }
      handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
    
          console.log('Received values of form: ', values);
          form.resetFields();
          this.setState({ visible: false });
        });
      }
    //   onRef = (ref) => {
    //     this.Child = ref
    // }
    
      saveFormRef = (formRef) => {
        this.formRef = formRef;
      }
    handleDelete  (username)  {
        this.props.deleteUser(username)
    }
    // handleUpdate  (value)  {
    //     this.props.updateUser(value)
    // }

    

    render() {
      const columns = [{
        title: '姓名',
        width: 100,
      //  fixed: 'left',
        dataIndex: 'username',
        key: 'name'
    }, {
        title: 'ID',
        width: 100,
      //  fixed: 'left',
        dataIndex: '_id',
        key: 'ID',
    }, {
        title: '密码',
        width: 100,
       // fixed: 'left',
        dataIndex: 'password',
        key: 'password',
    }, {
        title: '身份',
        width: 100,
        fixed: 'left',
        dataIndex: 'type',
        key: 'address',
    },
    {
      title: '钱包余额',
      width: 100,
     // fixed: 'left',
      dataIndex: 'wallet',
      key: 'wallet',
  },
    {
        title: '区块链上传权限',
        width: 100,
     //   fixed: 'left',
        dataIndex: 'blockchainupload',
        key: 'blockchainupload',
    }, {
        title: 'IPFS上传权限',
        width: 100,
     //   fixed: 'left',
        dataIndex: 'ipfsupload',
        key: 'ipfsupload',
    }, {
        title: '本地上传权限',
        width: 100,
      //  fixed: 'left',
        dataIndex: 'localupload',
        key: 'localupload',
    }, {
      title: '区块链查阅权限',
      width: 100,
     // fixed: 'left',
      dataIndex: 'blockchaindownload',
      key: 'blockchaindownload',
  },
  {
    title: 'Hash查阅权限',
    width: 100,
    //fixed: 'left',
    dataIndex: 'ipfsdownload',
    key: 'ipfsdownload',
 },
  {
    title: '交易查阅权限',
    width: 100,
    //fixed: 'left',
    dataIndex: 'localdownload',
    key: 'localdownload',
},
    {
        title:'操作',
        // width: 100,
        // fixed: 'left',
        key:'action',
        render:(text,record,index) => {
            return(
            <div>
                <span>
                <a href="javascript:;" onClick={() => this.editClick(text)}>Edit</a>
               
               
                <span className="ant-divider" />
                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(text.username)}>
                <a href="javascript:;">Delete</a>
                </Popconfirm>
                </span>
            </div>    
            )
        }
    }
]
        return (
            <div>
                
                <h2>用户管理</h2>
                <div>
                    <Input size="large"  placeholder="请输入删除的用户名,回车结束输入" 
                    onPressEnter={(e) => {
                        const username= e.target.value;
                        console.log("输入的值",username);
                        this.props.updatePassword(username);}}

                    />
                    </div>
                
                  <Table
                  
                      className={style.table}
                      pagination={false}
                      columns={columns}
                      dataSource={this.props.list}
                      scroll={{ x: 1300 }}
                      
                      />
                     
                  <div>
                      <div>
                      
                      {this.state.visible 
                    ? <CollectionCreateForm
                    defaultvalue={this.state.text}
                    wrappedComponentRef={this.saveFormRef}
                    confirmLoading={this.props.confirmLoading}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onOk={this.props.handleOk}
                    onCreate={this.handleCreate}
                    updateUser={this.props.updateUser}  
                    deleteUser={this.props.deleteUser}                  
                    /> 
                    :<br></br>
                }
                      </div>
                      <Pagination
                          onChange={(pageNum)=>{
                              this.props.getAllUsers(pageNum);
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
            this.props.getAllUsers();
           
    }
}


AdminManagerUser.propsTypes = {
    pageNUm: PropTypes.number.isRequired,
    list: PropTypes.arrayOf(PropTypes.object),
    total:PropTypes.number.isRequired
};

AdminManagerUser.defaultProps = {
    pageNum: 1,
    list: [],
    total:0
};

function mapStateToProps(state) {
    let {pageNum, list,total} = state.admin.users;
    return {
        pageNum,
        list,
        total
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllUsers: bindActionCreators(get_all_users, dispatch),
        deleteUser: bindActionCreators(delete_user, dispatch),
        updateUser: bindActionCreators(update_user, dispatch),
        updatePassword: bindActionCreators(update_password, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminManagerUser)
