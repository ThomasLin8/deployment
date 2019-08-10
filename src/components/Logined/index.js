import React from 'react'
import style from './style.css'
import {Button} from 'antd'

export const Logined = (props) => (
    <div className={style.container}>
        <img src={require('./logo.png')}/>
        <p>欢迎：{props.userInfo.username}</p>
        <p className={style.centerP}>钱包余额：{props.userInfo.wallet}</p>
        {/* <p className={style.centerP}>Hash code the world~</p> */}
        {props.userInfo.userType === 'admin' ?
            <Button onClick={() => props.history.push('/admin')} type="primary">点击进入管理员管理页面</Button> : null}
        {props.userInfo.userType === 'user' ?
            <Button onClick={() => props.history.push('/user')} type="primary">点击进入用户管理页面</Button> : null}
    </div>
);
