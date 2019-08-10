import React, { Component, PropTypes } from 'react';
import style from './style.css';
import { Input, Modal, Form } from  'antd';

//import { Button } from 'antd/lib/radio';
//import DeleteButton from '../../components/DeleteButton'

const FormItem = Form.Item;

export const UpdateModal = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class  extends React.Component {
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
                let userdata = {};
                //  userdata.username = this.props.defaultvalue.username;
                  userdata.password = values.旧密码;
                  userdata.newpassword = values.新密码;
                  userdata.passwordRe = values.新密码确认;
                 this.props.updatePassword(userdata);
                 console.log('Received values of form: ', userdata);
                //this.props.handleOk;          
              }
            });
          }
          


      render() {
        const {
          visible, onCancel
        } = this.props;
        const { getFieldDecorator } = this.props.form;

        
        return (
          
            <Modal
            visible={visible}
            title="修改密码"
            okText="更新"
            cancelText="退出"
            onCancel={onCancel}
            onOk={this.handleSubmit}
            
          >
          
          
      <Form onSubmit={this.handleSubmit}>
  
          <FormItem
              label="旧密码"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('旧密码', {
              rules: [{ required: true, message: '请输入你的旧密码!' }],
            })(
              <Input />
            )}
          </FormItem>
  
          <FormItem
            label="新密码"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('新密码', {
              rules: [{ required: true, message: '请输入你的新密码!' }],
            })(
              <Input />
            )}
          </FormItem>
          
          <FormItem
            label="新密码确认"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('新密码确认', {
              rules: [{ required: true, message: '请输入你的新密码确认!' }],
            })(
              <Input />
            )}
          </FormItem>
  
        </Form>
          </Modal>
        );
      }
     
    }
  );
