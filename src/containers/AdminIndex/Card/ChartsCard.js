import React from 'react';
import { Row, Col, Card, message } from 'antd';
import ReactEcharts from 'echarts-for-react';
// import * as airportConfig from './airportConfig';

// require('echarts/map/js/china.js');

class ChartsCard extends React.Component {

  onChartClick = () => {
    message.info('chart click');
  }

  render() {

    const chartscard = {
      sdoption: {
        title: {
          text: '堆叠图',
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告']
        },
        toolbox: {
          feature: {
          }
        },
        grid: {
          left: '1%',
          right: '3%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [150, 232, 201, 154, 190, 330, 410]
          }
        ]
      },
      eeoption: {
        title: {
          text: ' 用户访问来源',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
                        {value: 335, name: '直接访问'},
                        {value: 310, name: '邮件营销'},
                        {value: 234, name: '联盟广告'},
                        {value: 135, name: '视频广告'},
                        {value: 1548, name: '搜索引擎'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    };

    const onEvents = {
      click: this.onChartClick
    }

    const reStyle = {
      width: '100%',
      height: '220px'
    }

    return (
        <div>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Card
              bordered={false}
              hoverable>
              <ReactEcharts
                option={chartscard.sdoption}
                style={reStyle} />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Card
              bordered={false}
              hoverable>
              <ReactEcharts
                option={chartscard.eeoption}
                onEvents={onEvents}
                style={reStyle} />
            </Card>
          </Col>
        </Row>
        {/* <Row style={{ marginTop: 20 }}>
            <Col>
            <Card
              bordered={false}
              hoverable>
              <ReactEcharts
                option={airportConfig.getOption}
                style={{height: '600px', width: '100%'}} />
            </Card>
            </Col>
        </Row> */}
        </div>
    );
  }
}



export default ChartsCard;
