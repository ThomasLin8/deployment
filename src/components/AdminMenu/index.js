import React, { Component } from 'react';
import { Menu, Icon } from 'antd';

// menus定义的是用户界面的路由索引,name是显示名字,iconType是显示图标
const menus = [
    {url: '/', name: '首页', iconType: 'home'},
    {url: '/managerUser', name: '用户管理', iconType: 'usergroup-delete'},
    {url: '/uploadfileblockchain', name: '文件存储', iconType: 'file-text'},
     {url: '/uploadfileipfs', name: '存储记录', iconType: 'file-text'},
    {url: '/transactioninformation', name: '信息验证', iconType: 'message'},
];

export default class AdminMenu extends Component {
    constructor(props){
        super(props)
        this.state = {
            url: '/admin'
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
                        this.props.history.push(`/admin${key}`)
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
