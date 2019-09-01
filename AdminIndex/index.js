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


  {/* <Card title="Card title" extra={<a href="#">More</a>} style={{ width: 300 }}>
    <p>Card content</p>
    <p>Card content</p>
    <p>Card content</p>
  </Card> */}

  <div style={{ background: '#ECECEC', padding: '30px' }}>
    <Row gutter={16}>
      <Col span={8}>

        <Card title="上传文件到区块链" bordered={false}>
        <font color='red'>该模块实现文件的存储</font>
          </Card>
      </Col>

      <Col span={8}>
        <Card title="Card title" bordered={false}>Card content</Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" bordered={false}>Card content</Card>
      </Col>
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

