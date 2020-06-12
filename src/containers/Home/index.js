import React, { Component, PropTypes } from 'react';
import style from './style.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Pagination } from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as frontActions } from '../../reducers/frontReducer'
const { get_article_list, get_article_detail } = frontActions;
import { actions as IndexActions } from '../../reducers/globalStateReducer'
import Login from "../../components/Login";
import { Modal } from 'antd';
import { Logined } from "../../components/Logined";
import {
    Redirect
} from 'react-router-dom'
class Home extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
        this.state = ({
            showLogin: false
        })
    }

    render() {
        localStorage.setItem('userInfo', JSON.stringify(this.props.userInfo));
        return (
    
              <div className={style.container}>
                  <Header handleLogin={this.handleLogin}/>
                  <Footer />
                  <Modal visible={this.state.showLogin} footer={null} onCancel={this.onCancel}>
                  {this.props.userInfo.userId ?
                      <Logined history={this.props.history} userInfo={this.props.userInfo}/> :
                      <Login login={this.props.login} register={this.props.register}/>}
                  </Modal>
              </div>
        )
    }

    componentDidMount() {
        this.props.get_article_list(this.props.match.params.tag || '')
    }

    handleLogin = () => {
        const current = !this.state.showLogin;
        this.setState({ showLogin: current })
    }

    onCancel = () => {
      console.log('cancel')
      const current = !this.state.showLogin;
      this.setState({ showLogin: current })
    }

}


Home.defaultProps = {
    userInfo: {},
    pageNum: 1,
    total: 0,
    articleList: []
};

Home.propsTypes = {
    pageNum: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    articleList: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        //tags: state.admin.tags,
        pageNum: state.front.pageNum,
        total: state.front.total,
        articleList: state.front.articleList,
        userInfo: state.globalState.userInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        get_article_list: bindActionCreators(get_article_list, dispatch),
        get_article_detail:bindActionCreators(get_article_detail,dispatch),
        login: bindActionCreators(IndexActions.get_login, dispatch),
        register: bindActionCreators(IndexActions.get_register, dispatch)

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
