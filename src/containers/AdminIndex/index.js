import React,  { Component,PropTypes } from 'react';

// import './Profile.less'
import { Row, Col, Card, Icon,Input } from 'antd';
import { actions  } from '../../reducers/adminManagerUser';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CountUp from 'react-countup';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartsCard from './Card/ChartsCard';
import './Card.less';


const profileImg = require('../../assets/img/profile.jpg');
const { get_logout } = actions;

const cardstyle = {
    width: '400px',
    margin: '30px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    border: '1px solid #e8e8e8',
  };
const salescard= [
    {"name":2008,"卫衣":214,"T恤":354,"衬衫":416},{"name":2009,"卫衣":395,"T恤":192,"衬衫":390},{"name":2010,"卫衣":260,"T恤":269,"衬衫":404},{"name":2011,"卫衣":323,"T恤":297,"衬衫":449},{"name":2012,"卫衣":215,"T恤":220,"衬衫":491},{"name":2013,"卫衣":365,"T恤":341,"衬衫":422},{"name":2014,"卫衣":218,"T恤":187,"衬衫":349},{"name":2015,"卫衣":248,"T恤":217,"衬衫":431}
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
                    hoverable>
                        
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
                    hoverable>
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
                    hoverable>
                    <Icon className='iconWarp' style={{ color: 'blue' }} type={'team'} />
                    <div className='content'>
                      <p className='title'>用户数</p>
                      <p className='number'>
                        <CountUp
                          start={0}
                          end={2372}
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
                    hoverable>
                    <Icon className='iconWarp' style={{ color: 'blue' }} type={'check'} />
                    <div className='content'>
                      <p className='title'>赞赏</p>
                      <p className='number'>
                        <CountUp
                          start={0}
                          end={666  }
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
            <div className='title'>统计</div>
            <ResponsiveContainer minHeight={360}>
              <LineChart data={salescard}>
                {/* <Legend verticalAlign="top"
                  content={prop => {
                    const { payload } = prop
                    return (<ul className={classnames({ ['legend']: true, clearfix: true })}>
                      {payload.map((item, key) => <li key={key}><span className={'radiusdot'} style={{ background: item.color }} />{item.value}</li>)}
                    </ul>)
                  }}
                /> */}
                <XAxis dataKey="name" axisLine={{ stroke: '#e5e5e5', strokeWidth: 1 }} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <CartesianGrid vertical={false} stroke={'#e5e5e5'} strokeDasharray="3 3" />
                {/* <Tooltip
                  wrapperStyle={{ border: 'none', boxShadow: '4px 4px 40px rgba(0, 0, 0, 0.05)' }}
                  content={content => {
                    const list = content.payload.map((item, key) => <li key={key} className='tipitem'><span className='radiusdot' style={{ background: item.color }} />{`${item.name}:${item.value}`}</li>)
                    return <div className='tooltip'><p className='tiptitle'>{content.label}</p><ul>{list}</ul></div>
                  }}
                /> */}
                <Line type="monotone" dataKey="衬衫" stroke='#faaf76' strokeWidth={3} dot={{ fill: '#d897eb' }} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="T恤" stroke='#76cdd3' strokeWidth={3} dot={{ fill: '#f69899' }} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="卫衣" stroke='#f79992' strokeWidth={3} dot={{ fill: '#64ea91' }} activeDot={{ r: 5, strokeWidth: 0 }} />
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

