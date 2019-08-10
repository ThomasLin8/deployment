import React, { Component, PropTypes } from 'react';
import style from './style.css';
import {  Input, Modal, Form, Select } from  'antd';


const FormItem = Form.Item;
const Option = Select.Option;


export const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
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
                let userdata = {};
                userdata.username = this.props.defaultvalue.username;
                userdata.password = values.密码;
                userdata.type = values.用户类型;
                userdata.wallet = values.钱包余额;
                userdata.blockchainupload = values.区块链上传权限;
                userdata.ipfsupload = values.IPFS上传权限;
                userdata.localupload = values.本地上传权限;
                userdata.blockchaindownload = values.文件查阅权限;
                userdata.ipfsdownload= values.HASH查阅权限;
                userdata.localdownload = values.区块链交易查阅权限;
                console.log('Received values of form: ', userdata);
                this.props.updateUser(userdata);
                this.props.handleOk;          
              }
            });
          }
          


      render() {
        const {
          visible, onCancel, 
        } = this.props;
        const { getFieldDecorator } = this.props.form;

        
        return (
           
          <Modal
            visible={visible}
            title="用户编辑"
            okText="更新"
            cancelText="退出"
            onCancel={onCancel}
            onOk={this.handleSubmit}
            
          >
            <Form onSubmit={this.handleSubmit} >
            
 
        
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
          label="文件查阅权限"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        >
          {getFieldDecorator('文件查阅权限', {
            rules: [{ required: true, message: 'Please select your permission!' }],
            initialValue:this.props.defaultvalue.blockchaindownload,
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
          label="HASH查阅权限"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        >
          {getFieldDecorator('HASH查阅权限', {
            rules: [{ required: true, message: 'Please select your permission!' }],
            initialValue:this.props.defaultvalue.ipfsdownload,
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
          label="区块链交易查阅权限"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        >
          {getFieldDecorator('区块链交易查阅权限', {
            rules: [{ required: true, message: 'Please select your permission!' }],
            initialValue:this.props.defaultvalue.localdownload,
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
