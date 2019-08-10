import React from 'react'
import style from './style.css'
import {Button, Modal} from 'antd'
export default class UserInfo extends Component {
    constructor(props){
        super(props)

    }

    render() {
        const {
            visible, onCancel, onOk
          } = this.props;
          return(
              <div>
                <Modal
                visible={visible}
                title="用户信息"
                okText="完成"
                cancelText="退出"
                onCancel={onCancel}
                onOk={onOk}>
                    
                <div className={style.container}>
                    <img src={require('./logo.png')}/>
                    <p>用户名：{this.props.userInfo.username}</p>
                    <p className={style.centerP}>钱包余额：{this.props.userInfo.wallet}</p>
                    {/* <p className={style.centerP}>Hash code the world~</p> */}
                    <p>区块链上传权限：{this.props.userInfo.blockchainupload}</p>
                </div>
                </Modal>
            </div>
          )
    }

}
// export const userInfo = (props) => (
//     <Modal
//     visible={visible}
//     title="用户信息"
//     okText="完成"
//     cancelText="退出"
//     onCancel={onCancel}
//     onOk={onOk}>
        
//     <div className={style.container}>
//         <img src={require('./logo.png')}/>
//         <p>用户名：{props.userInfo.username}</p>
//         <p className={style.centerP}>钱包余额：{props.userInfo.wallet}</p>
//         {/* <p className={style.centerP}>Hash code the world~</p> */}
//         <p>区块链上传权限：{props.userInfo.blockchainupload}</p>
//     </div>
//     </Modal>
// );
