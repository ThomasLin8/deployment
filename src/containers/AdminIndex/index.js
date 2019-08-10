import React,  { Component,PropTypes } from 'react';
import style from './style.css';
import { Button, Input, Icon, Menu, Dropdown, message  } from 'antd';
import { actions  } from '../../reducers/adminManagerUser';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const { get_logout } = actions;
const Search = Input.Search;
const divStyle = {
    //color: 'blue',
    backgroundImage: 'url(http://img.netbian.com/file/20130419/b56c37a145e561a24413eb5ab2946f5b.jpg)',

  };
  
// const menu = (
//     <Menu onClick={handleMenuClick}>
//       <Menu.Item key="1">
//         <Icon type="user" />
//         1st menu item
//       </Menu.Item>
//       <Menu.Item key="2">
//         <Icon type="user" />
//         2nd menu item
//       </Menu.Item>
//       <Menu.Item key="3">
//         <Icon type="user" />
//         3rd item
//       </Menu.Item>
//     </Menu>
//   );

//   function handleButtonClick(e) {
//     message.info('Click on left button.');
//     console.log('click left button', e);
//   }
  
//   function handleMenuClick(e) {
//     message.info('Click on menu item.');
//     console.log('click', e);
//   }

class AdminIndex extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return  (
            
            <div style={divStyle}>
                <h1>首页</h1>
                <br /><br />

                 {/* <Button onClick={()=>{
                this.props.logout('logout');
                
                }}
                >
                  登出
                </Button>  */}
                  {/* <div id="components-dropdown-demo-dropdown-button">
                   
                    <Dropdown.Button overlay={menu} icon={<Icon type="user" />}>
                 登出
                    </Dropdown.Button>
                   
                   
                </div>, */}
            </div>
            
        )
    }
}
AdminIndex.propsTypes = {
    pageNUm: PropTypes.number.isRequired,
    list: PropTypes.arrayOf(PropTypes.object),
    total:PropTypes.number.isRequired
};

AdminIndex.defaultProps = {
    pageNum: 1,
    list: [],
    total:0
};

function mapStateToProps(state) {
    let {pageNum, list,total} = state.admin.users;
    return {
        pageNum,
        list,
        total
    }
}

function mapDispatchToProps(dispatch) {
    return {
        
        logout: bindActionCreators(get_logout, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminIndex)

