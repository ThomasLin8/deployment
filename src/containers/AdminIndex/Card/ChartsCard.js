import React from 'react';
import { Row, Col, Card, message } from 'antd';
import ReactEcharts from 'echarts-for-react';
class ChartsCard extends React.Component {

  onChartClick = () => {
    message.info('chart click');
  }

  render() {

    const chartscard = {
      sdoption: {
        title: {
          text: '预留',
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['预留1', '预留2', '预留3']
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
            data: ['预留', '预留二', '预留三', '预留四', '预留五', '预留六', '预留七']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '预留1',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '预留2',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '预留3',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [150, 232, 201, 154, 190, 330, 410]
          }
        ]
      },
      eeoption: {
        title: {
          text: ' 节点构成',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['阿里云服务器', '本地局域网服务器', '百度云服务器']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
                        {value: 2, name: '阿里云服务器'},
                        {value: 3, name: '本地局域网服务器'},
                        {value: 2, name: '百度云服务器'},
                        
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
        </div>
    );
  }
}



export default ChartsCard;
