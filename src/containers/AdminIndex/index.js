import React,  { Component,PropTypes } from 'react';
import style from './style.css';
import { Button, Input, Card, Col, Row} from 'antd';
import { actions  } from '../../reducers/adminManagerUser';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const { get_logout } = actions;
const Search = Input.Search;
const cardstyle = {
    width: '400px',
    margin: '30px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    border: '1px solid #e8e8e8',
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
            
            <div>
                <h1>使用帮助</h1>
                <br /><br />


                <div style={{ background: '#ECECEC', padding: '30px', margin:0 ,}}>
    <Row gutter={16}>
      <Col span={8}>

        <Card title="区块链文件存储" bordered={false}>
        <font color='red'>该模块首先将文件的存储到IPFS,然后再存储到区块链,最后将存储记录存储到数据库,若无对应权限请联系管理员获取.</font>
          </Card>
      </Col>

      <Col span={8}>
      <Card title="存储记录" bordered={false}>
        <font color='red'>该模块可以查阅存储的记录,下载对应存储的文件,若无对应权限请联系管理员获取.</font>
          </Card>
      </Col>

    
    </Row>

  </div>
                <div style={{ background: '#ECECEC', padding: '30px' }}>
    <Row gutter={16}>
      <Col span={8}>

        <Card title="信息验证" bordered={false}>
        <font color='red'>该模块提供两种方式进行验证,分别为文件方式进行存储验证和加密哈希值进行存储验证,还提供区块链信息查询.若无对应权限请联系管理员获取.</font>
          </Card>
      </Col>
      <Col span={8}>
      <Card title="本地文件加密存储" bordered={false}>
        <font color='red'>该模块可以将本地文件加密存储到IPFS,返回加密后的文件哈希值,若无对应权限请联系管理员获取.</font>
          </Card>
      </Col>
      {/* <Col span={8}>
        <Card title="" bordered={false}>Card content</Card>
      </Col>
      
      <Col span={8}>
        <Card title="" bordered={false}>Card content</Card>
      </Col> */}
    </Row>

  </div>
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

