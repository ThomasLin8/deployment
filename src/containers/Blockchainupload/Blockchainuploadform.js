import React  from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

import  './index.less';
const FormItem = Form.Item;
class bcform extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.handleupload(values)
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    //const {for} = this.props;
    return (
      <div className="login">
      <div className="login-form">
          <div className="login-logo">
              <div className="login-name">MSPA</div>
          </div>

      <Form onSubmit={this.handleSubmit} >
         <h3>文件保存名(必填)</h3>
         <br></br>
        <FormItem>
          {getFieldDecorator('filename', {
            rules: [{ required: true, message: 'Please input your filename that you!' }],
          })(
            <Input prefix={<Icon type="file" style={{ fontSize: 13 }} />} placeholder="Filename" />
          )}
        </FormItem>
        <h3>登入密码(必填)</h3>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <h3>备注(选填)</h3>
        <FormItem>
          {getFieldDecorator('remark', {
            rules: [{  message: 'Please input your remarks!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="remark" placeholder="Remark" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>同意服务条款</Checkbox>
          )}
          <br></br>
          <br></br>
          {/* <a className="login-form-forgot" href="">Forgot password</a> */}
          <div className='login-form-button'>
          <Button size="large" type="primary" htmlType="submit"  >
            文件上传
          </Button>
          </div>
       
        </FormItem>
      </Form>
   
                </div>
            </div>

    );
  }
}

export const Blockchainuploadform = Form.create()(bcform);