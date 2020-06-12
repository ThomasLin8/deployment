import React, { Component, PropTypes } from 'react';
import style from './style.css';
import { Row, Col, Input, Icon, Cascader, DatePicker, Button, Tooltip, Popconfirm, Table, Pagination } from 'antd';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from '../../reducers/AdminManagerTransactions'
import crypto from 'crypto'
const Blind = require('blind');
const Search = Input.Search;
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');
//api插件的引用




const { get_all_transactions,ipfs_find,bc_find,delete_transction,get_file_transactions,get_enipfshash_transactions,get_txhash_transactions} = actions;



class AdminManagerTransactions extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
        this.state = {
            blockChainHash: null,
            txhash:null,
            tblockhash:null,
            msgshow: false,
            gasused: null,
            blockhash: null,
            dataSource: null,
            filename:null,
            
          }
    }



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
            },
        {
            title: '文件名',
            dataIndex: 'filename',
            key: 'filename'
        },  
        {
            title: '存储的区块链地址',
            dataIndex: 'transaction',
            key: 'transaction',
        }, 
        {
            title: '数据的哈希值(加密后)',
            dataIndex: 'enipfshash',
            key: 'enipfshash',
        }, {
            title: '时间',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title:'操作',
            key:'action',
            render:(text) => {
                return(
                <div>
                    <span>
                        {/* //先将加密哈希值解密,然后利用ipfs下载对应的文件 */}
                    <a href="javascript:;" onClick={() => {
                        const deipfshash = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).decrypt(text.enipfshash);
                        const fileUrl = "http://localhost:8080/ipfs/" + deipfshash;
                        const a = document.createElement('a');                     
                        var filename = 'download';
                        a.href = fileUrl;
                        a.download = filename;
                        a.click();
                        window.URL.revokeObjectURL(url);


                        }}>Download</a> 
                  
                   
                   {/* popconfirm弹出确认狂 */}
                    <span className="ant-divider" />
                    <Popconfirm title="Sure to delete?" onConfirm={() => {
                        console.log('发送ID',text.ID)
                        console.log('text数据',text)
                        this.props.DeleteTransaction(text._id)
                    }}>
                    <a href="javascript:;">Delete</a>
                    </Popconfirm>
                    </span>
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
                        <br></br>
                        <Button type="primary" onClick={() => this.props.getAllTransactions()} style={{float:"right"}}>重置</Button>
  
                    </Row>
                    <br></br>
                    {this.setState({dataSource: this.props.list})}
                  <Table
                      className={style.table}
                      pagination={false}
                      columns={columns}
                      dataSource={this.state.dataSource}
                      bordered
                      scroll={{ x: 1300 }}
                      />
                  <div>
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