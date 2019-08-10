const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class Child extends React.Component {
       defaultProps = {
          defaultvalue: [ ]
       }
      //  handleUpdate  (value)  {
      //      this.props.handleUpdate(value)
      //  }

      handleSubmit = (e) => {
          e.preventDefault();
         
          this.props.form.validateFields((err, values) => {
            if (!err) {
             //let userdata ={username : values.用户名, password : values.密码, type : values.用户类型,
             // blockchainupload : values.区块链上传权限, type : values.IPFS上传权限, type : values.本地上传权限}
              let userdata = {};
              userdata.username = this.props.defaultvalue.username;
              userdata.password = values.密码;
              userdata.type = values.用户类型;
              userdata.wallet = values.钱包余额;
              userdata.blockchainupload = values.区块链上传权限;
              userdata.ipfsupload = values.IPFS上传权限;
              userdata.localupload = values.本地上传权限;
              console.log('Received values of form: ', userdata);
              this.props.updateUser(userdata);
              this.props.handleOk;
              //this.props.deleteUser(userdata);
            }
          });
        }
        
        handleChange = () => { 
          
          this.props.form.setFieldsValue({
              用户名: this.props.defaultvalue.username,
              密码: this.props.defaultvalue.password,
              用户类型: this.props.defaultvalue.type,
              区块链上传权限: this.props.defaultvalue.blockchainupload,
              IPFS上传权限: this.props.defaultvalue.ipfsupload,
              本地上传权限: this.props.defaultvalue.localupload,
  
          });
        }
      //   componentWillUpdate (){
      //     //通过pros接收父组件传来的方法
      //     this.handleSelectChange()
      // }
       

    render() {
      const {
        visible, onCancel, onCreate, form,editClick
      } = this.props;
      const { getFieldDecorator } = this.props.form;
      //const { defaultvalue} = this.props;
     // this.handleSelectChange;
      
      return (
         
        <Modal
          visible={visible}
          title="用户编辑"
          okText="完成"
          onCancel={onCancel}
          onOk={this.handleSubmit}
          
        >
          <Form onSubmit={this.handleSubmit} >
          
      {/* <FormItem
        
        label="用户名"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
       
      >
       {this.handleSelectChange}
       
        {getFieldDecorator('用户名', {
          rules: [{ required: true, message: 'Please input your username!' }],
          
          initialValue:this.props.defaultvalue.username,
        })(
          <Input />
        )}
      </FormItem> */}
      <FormItem
        label="密码"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
      >
        {getFieldDecorator('密码', {
          rules: [{ required: true, message: 'Please input your password!' }],
          initialValue:this.props.defaultvalue.password,
        })(
          <Input />
        )}
      </FormItem>
      <FormItem
        label="用户类型"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
      >
        {getFieldDecorator('用户类型', {
          rules: [{ required: true, message: 'Please select your usertype!' }],
          initialValue:this.props.defaultvalue.type,
        })(
          <Select
            placeholder="Select a option and change input text above"
            
          >
            <Option value="admin">admin</Option>
            <Option value="user">user</Option>
          </Select>
        )}
      </FormItem>

      <FormItem
        label="钱包余额"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
      >
        {getFieldDecorator('钱包余额', {
          rules: [{ required: true, message: 'Please input your 钱包余额!' }],
          initialValue:this.props.defaultvalue.wallet,
        })(
          <Input />
        )}
      </FormItem>


      <FormItem
        label="区块链上传权限"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
      >
        {getFieldDecorator('区块链上传权限', {
          rules: [{ required: true, message: 'Please select your permission!' }],
          initialValue:this.props.defaultvalue.blockchainupload,
        })(
          <Select
            placeholder="Select a option and change input text above"
            
          >
            <Option value="true">true</Option>
            <Option value="false">flase</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        label="IPFS上传权限"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
      >
        {getFieldDecorator('IPFS上传权限', {
          rules: [{ required: true, message: 'Please select your permission!' }],
          initialValue:this.props.defaultvalue.ipfsupload,
        })(
          <Select
            placeholder="Select a option and change input text above"
            onChange={this.handleSelectChange}
          >
            <Option value="true">true</Option>
            <Option value="false">flase</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        label="本地上传权限"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
      >
        {getFieldDecorator('本地上传权限', {
          rules: [{ required: true, message: 'Please select your permission!' }],
          initialValue:this.props.defaultvalue.localupload,
        })(
          <Select
            placeholder="Select a option and change input text above"
            onChange={this.handleSelectChange}
          >
            <Option value="true">true</Option>
            <Option value="false">flase</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        wrapperCol={{ span: 8, offset: 4 }}
      >
      
        {/* <Button type="primary" htmlType="submit">
          Submit
        </Button> */}
        {/* <Button  onClick={this.handleChange}>
          Read
        </Button> */}
        
      </FormItem>
      
    </Form>
        </Modal>
      );
    }
   
  }
);