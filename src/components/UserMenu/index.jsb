import React, { Component } from 'react';
import { Menu, Icon } from 'antd';

const menus = [
    {url: '/', name: '首页', iconType: 'home'},
    {url: '/uploadfileblockchain', name: '上传文件到区块链', iconType: 'file-text'},
     {url: '/uploadfileipfs', name: '交易记录', iconType: 'file-text'},
    {url: '/localencryption', name: '本地文件加密存储', iconType: 'file-text'},
    {url: '/transactioninformation', name: '信息验证', iconType: 'message'},
];

export default class UserMenu extends Component {
    constructor(props){
        super(props)
        this.state = {
            url: '/user'
        }
    }

    render() {
        return(
            <div>
                <Menu
                    selectedKeys={[this.state.url]}
                    mode="inline"
                    theme="dark"
                    onClick={({key}) => {
                        this.props.history.push(`/user${key}`)
                        this.setState({
                            url: key
                        })
                    }}
                >
                {
                    menus.map( (item, index) =>
                        <Menu.Item key={item.url}>
                            <Icon type={item.iconType} />
                            <span>{item.name}</span>
                        </Menu.Item>
                    )
                }
                </Menu>
            </div>
        )
    }
}
