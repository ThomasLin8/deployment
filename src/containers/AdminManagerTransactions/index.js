import React, { Component, PropTypes } from 'react';
import  './index.less';
import { Row, Col, Input, Icon,  Button, notification, Popconfirm, Table, Pagination } from 'antd';
import moment from 'moment';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from '../../reducers/AdminManagerTransactions'
import crypto from 'crypto'
const Blind = require('blind');
const Search = Input.Search;
//api插件的引用




const { get_all_transactions,ipfs_find,bc_find,delete_transction,get_file_transactions,get_enipfshash_transactions,get_txhash_transactions} = actions;



class AdminManagerTransactions extends Component {

    constructor(props) {
        super(props);
    }

    openNotification = () => {
        const args = {
          message: '查询出错,请输入正确的64位数据哈希值!',
          description: '请输入正确的地址!.',
          duration: 1,
        };
        notification.open(args);
      };

    //利用文件名进行搜索
    onSearchFileName = (filename) => {
         console.log(filename);
        this.props.getfiletransactions(filename)

    };

    //利用存储哈希值进行搜索
    onSearchTxhash = (txhash) => {
        console.log(txhash);
       this.props.gettxhashtransactions(txhash)

   };

//利用加密哈希值进行搜索
   onSearchEnipfshash = (enipfshash) => {
       if (enipfshash.length != 64) {
           this.openNotification();
        };
   const ipfshash = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).decrypt(enipfshash);
    console.log(ipfshash);
   this.props.getenipfshashtransactions(ipfshash)

};
    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: '_id',
                key: 'ID',
                width:60,
            },
        {
            title: '文件名',
            dataIndex: 'filename',
            key: 'filename',
            width:90,
        },  
        {
            title: '存储的区块链地址',
            dataIndex: 'transaction',
            key: 'transaction',
            width:170,
        }, 
        {
            title: '数据的哈希值(加密后)',
            dataIndex: 'enipfshash',
            key: 'enipfshash',
            width:170,
        }, {
            title: '时间',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => moment(a.date) - moment(b.date),
            width:80,
        },
        {
            title:'操作',
            key:'action',
            width:50,
            render:(text) => {
                return(
                    <div className='opera'>
                        <span onClick={() => {
                             const deipfshash = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).decrypt(text.enipfshash);
                             const fileUrl = "http://45.32.74.218:8087/ipfs/" + deipfshash;
                             const a = document.createElement('a');                     
                             var filename = 'download';
                             a.href = fileUrl;
                             a.download = filename;
                             a.click();
                             window.URL.revokeObjectURL(url);
                        }}>
                            <Icon type="download" /> 下载
                        </span><br />
                        <br></br>
                        <span><Popconfirm title="确定要删除吗?" onConfirm={() => {
                                                    console.log('发送ID',text.ID)
                                                    console.log('text数据',text)
                                                    this.props.DeleteTransaction(text._id)
                                                    setTimeout(() => {
                                                        location.reload();
                                                    }, 400);
                        }}><Icon type="minus-square-o" /> 删除 </Popconfirm></span>
                    </div>
        
                )
            }
        }
        ];
        return (
           

  <div>

 // 表格的形式和内容
<h1 style={{textAlign:'center',color:'gray'}}>存储记录</h1>
              <br></br>

                <div>
             
                <div className='formBody'>
                    <Row gutter={16}>
                        <Col className="gutter-row" sm={8}>
                        <h4 style={{marginLeft:'100px',color:'gray'}}>文件名查询</h4>
                        <Search
                                placeholder="输入文件名,回车查询"
                                prefix={<Icon type="file" />}
                            
                                onSearch={this.onSearchFileName}
                            />
                        </Col>
                        <Col className="gutter-row" sm={8}>
                        <h4 style={{marginLeft:'100px',color:'gray'}}>数据哈希值查询</h4>
                        <Search
                                placeholder="输入数据哈希值,回车查询"
                                prefix={<Icon type="file" />}
                                onSearch={this.onSearchEnipfshash}
                            />
                        </Col>
                        <Col className="gutter-row" sm={8}>
                        <h4 style={{marginLeft:'100px',color:'gray'}}>存储地址查询</h4>
                        <Search
                                placeholder="输入存储地址,回车查询"
                                prefix={<Icon type="file" />}
                                onSearch={this.onSearchTxhash}
                            />
                        </Col>
                
                    </Row>
                    <Row gutter={16}>
                        <div className='btnOpera'>
                            
                            <Button type="primary" onClick={() => this.props.getAllTransactions()} style={{background:'#f8f8f8', color: '#108ee9'}}>重置</Button>
                        </div>
                        {/* <Button type="primary" onClick={() => this.props.getAllTransactions()} style={{float:"right"}}>重置</Button> */}
  
                    </Row>
                   
                    {/* {this.setState({dataSource: this.props.list})} */}
                  <Table
                      className='formTable'
                      pagination={false}
                      columns={columns}
                      dataSource={this.props.list}
                      bordered
                      scroll={{ x: 1300 }}
                      />
                    <br></br>
                  <div className = 'pdiv'>
                      <Pagination
                          onChange={(pageNum)=>{
                              this.props.getAllTransactions(pageNum);
                          }}
                          current={this.props.pageNum}
                          total={this.props.total}/>
                  </div>
                </div>
            </div>

             
                
            </div>
        )
    }

    componentDidMount() {
        //缓存
        if(this.props.list.length===0)
        {
            this.props.getAllTransactions();
            
            
        }
            

    }
}


AdminManagerTransactions.propsTypes = {
    pageNUm: PropTypes.number.isRequired,
    list: PropTypes.arrayOf(PropTypes.object),
    total:PropTypes.number.isRequired
}; 

AdminManagerTransactions.defaultProps = {
    pageNum: 1,
    list: [],
    total:0
};

function mapStateToProps(state) {
    let {pageNum, list,total} = state.admin.transactions;
    return {
        pageNum,
        list,
        total,
        userInfo:state.globalState.userInfo
        
    }
     
  }

function mapDispatchToProps(dispatch) {
    return {
        getAllTransactions: bindActionCreators(get_all_transactions, dispatch),
        ipfsFind: bindActionCreators(ipfs_find, dispatch),
        bcFind: bindActionCreators(bc_find, dispatch),
        DeleteTransaction:bindActionCreators(delete_transction, dispatch),
        getfiletransactions:bindActionCreators(get_file_transactions, dispatch),
        getenipfshashtransactions:bindActionCreators(get_enipfshash_transactions, dispatch),
        gettxhashtransactions:bindActionCreators(get_txhash_transactions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminManagerTransactions)