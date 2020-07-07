import React,  { Component,PropTypes } from 'react';
import { Row, Col, Card, Icon} from 'antd';
import { actions  } from '../../reducers/adminManagerUser';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CountUp from 'react-countup';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import ChartsCard from './Card/ChartsCard';
import './Card.less';



const { get_logout } = actions;


const salescard= [
    {"name":1.40,"百度云单节点":0.13,"百度云双节点":0.12,"局域网单节点":0.16},{"name":46,"百度云单节点":6.29,"百度云双节点":7.05,"局域网单节点":0.638},{"name":75,"百度云单节点":11.39,"百度云双节点":8.92,"局域网单节点":1.06},{"name":550,"百度云单节点":60,"百度云双节点":72,"局域网单节点":7.16},{"name":720,"百度云单节点":78,"百度云双节点":84,"局域网单节点":11.82},
];
class AdminIndex extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return  (
            
            <div  className="avatar">

           <Row gutter={16}>
              
                <Col xs={24} sm={24} md={12} lg={6} xl={6} >
                  <Card
                    className='countCard'
                    bordered={true}
                  >
                        
                    <Icon className='iconWarp' style={{ color: 'blue' }} type={'sync'} />
                    <div className='content'>
                      <p className='title'>区块链节点</p>
                      <p className='number'>
                        <CountUp
                          start={0}
                          end={7}
                          duration={2.75}
                          useEasing
                          useGrouping
                          separator="," 
                        />
                      </p>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} sm={24} md={12} lg={6} xl={6} >
                  <Card
                    className='countCard'
                    bordered={true}
                  >
                    <Icon className='iconWarp' style={{ color: 'blue' }} type={'desktop'} />
                    <div className='content'>
                      <p className='title'>IPFS节点</p>
                      <p className='number'>
                        <CountUp
                          start={0}
                          end={7}
                          duration={2.75}
                          useEasing
                          useGrouping
                          separator="," 
                        />
                      </p>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} sm={24} md={12} lg={6} xl={6} >
                  <Card
                    className='countCard'
                    bordered={true}
                  >
                    <Icon className='iconWarp' style={{ color: 'blue' }} type={'team'} />
                    <div className='content'>
                      <p className='title'>用户数</p>
                      <p className='number'>
                        <CountUp
                          start={0}
                          end={12}
                          duration={2.75}
                          useEasing
                          useGrouping
                          separator="," 
                        />
                      </p>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} sm={24} md={12} lg={6} xl={6} >
                  <Card
                    className='countCard'
                    bordered={true}
                  >
                    <Icon className='iconWarp' style={{ color: 'blue' }} type={'check'} />
                    <div className='content'>
                      <p className='title'>赞赏</p>
                      <p className='number'>
                        <CountUp
                          start={0}
                          end={11 }
                          duration={2.75}
                          useEasing
                          useGrouping
                          separator="," 
                        />
                      </p>
                    </div>
                  </Card>
                </Col>
                
     
        </Row>

            
  
    
    <Row>
      <Col span={24}>
        <Card bordered={true} bodyStyle={{
          padding: '24px 36px 24px 0',
        }}>
          <div className='sales'>
            <div className='title'>节点性能</div>
            <ResponsiveContainer minHeight={360}>
              <LineChart data={salescard}>
                <XAxis dataKey="name" axisLine={{ stroke: '#e5e5e5', strokeWidth: 1 }} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <CartesianGrid vertical={false} stroke={'#e5e5e5'} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="局域网单节点" stroke='#faaf76' strokeWidth={3} dot={{ fill: '#d897eb' }} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="百度云双节点" stroke='#76cdd3' strokeWidth={3} dot={{ fill: '#f69899' }} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="百度云单节点" stroke='#f79992' strokeWidth={3} dot={{ fill: '#64ea91' }} activeDot={{ r: 5, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
    </Row>
    <ChartsCard  />
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

