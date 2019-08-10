import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import style from './style.css';


export default class Footer extends Component {

    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        return(
            <div className={style.footer}>
                <p className={style.copyright}>&copy; XMU Iotcas 厦门大学通信物联网实验室</p>
            </div>
        )
    }

}
