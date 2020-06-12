import React, { Component, PropTypes } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import style from './style.css';
import AdminMenu from '../../components/AdminMenu';
import AdminIndex from '../AdminIndex';
import AdminManagerUser from '../AdminManagerUser';
import AdminManagerTransactions from '../AdminManagerTransactions';
import AdminManagerLocal from '../AdminManagerLocal';
import AdminManagerProve from '../AdminManagerProve';
import blockchainupload from '../blockchainupload';
import Detail from '../Detail';
import NotFound from '../NotFound';
import { bindActionCreators } from 'redux'
import { actions } from '../../reducers/admin'
import { actions  as actions2} from '../../reducers/adminManagerUser';
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Headerbar from '../../components/Headerbar';

const { change_location_admin } = actions;
const { get_logout,update_password,get_userinfo } = actions2;
class Admin extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    }

    render() {
        const { url } = this.props.match;
        if(this.props.userInfo&&this.props.userInfo.userType){
            return (
                <div>
                    {

                        this.props.userInfo.userType === 'admin' ?
                        
                        <div>
                    
                       
                            <div className={style.container}>
                                <div className={style.menuContainer}>
                                <Headerbar 
                           
                                {...this.props}
                                ></Headerbar>
                                    <AdminMenu history={this.props.history} />
                                </div>
                                <div className={style.contentContainer}>
                                    <Switch>
                                        <Route exact path={url} component={AdminIndex}/>
                                        <Route path={`${url}/managerUser`} component={AdminManagerUser}/>
                                        <Route path={`${url}/uploadfileipfs`} component={AdminManagerTransactions}/>
                                        <Route path={`${url}/uploadfileblockchain`} component={blockchainupload}/>
                                        <Route path={`${url}/localencryption`} component={AdminManagerLocal}/>
                                        <Route path={`${url}/transactioninformation`} component={AdminManagerProve}/>
                                        <Route path={`${url}/detail`} component={Detail}/>
                                        <Route path={`${url}/logout`}/>
                                        <Route component={NotFound}/>
                                    </Switch>
                                </div>
                            </div>
                            </div>
                          :
                          <Redirect to='/' />
                    }
                </div>
            )
        } else {
            return <NotFound/>
        }

    }

    componentWillReceiveProps() {
        this.props.change_location_admin(window.location.pathname.replace(/\/admin/, "")||'/');
  
    }

}
Admin.defaultProps = {
    adminUrl: '/',
    utype:[],
    uwallet:[],
    ublockchainupload:[],
    uipfsupload:[],
    ulocalupload:[],
    ublockchaindownload:[],
    uipfsdownload:[],
    ulocaldownload:[],
};

Admin.propTypes = {
    adminUrl: PropTypes.string,
    change_location_admin: PropTypes.func,

};

function mapStateToProps(state) {
    const {url} = state.admin.adminGlobalState;
       const{utype,
    uwallet,
    ublockchainupload,
    uipfsupload,
    ulocalupload,
    ublockchaindownload,
    uipfsdownload,
    ulocaldownload}=state.admin.users;
    return {
        adminUrl: url,
        userInfo:state.globalState.userInfo,
             utype,
        uwallet,
        ublockchainupload,
        uipfsupload,
        ulocalupload,
        ublockchaindownload,
        uipfsdownload,
        ulocaldownload
    }
}

function mapDispatchToProps(dispatch) {
    return {
        change_location_admin: bindActionCreators(change_location_admin, dispatch),
        logout: bindActionCreators(get_logout, dispatch),
        updatePassword: bindActionCreators(update_password, dispatch),
        getUserInfo: bindActionCreators(get_userinfo, dispatch),
    
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Admin)
