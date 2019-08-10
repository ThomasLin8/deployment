import Express from 'express';
import User from '../../models/user'
import { MD5_SUFFIX, responseClient} from '../util'

const router = Express.Router();

router.post('/login', (req,res) => {
    let { username, password } = req.body;
    if (!username) {
        responseClient(res,400 ,2,'用户名不能为空');
        return;
    }

    if (!password) {
        responseClient(res, 400, 2, '密码不可为空');
        return;
    }

    User.findOne({
        username,
        password,
    }).then(userInfo => {
        console.log(userInfo)
        if(userInfo){
            //登录成功
            //console.log('权限',userInfo.blockchainupload)
            let data = {};
            data.username = userInfo.username;
            data.userType = userInfo.type;
            data.userId = userInfo._id;
            data.wallet = userInfo.wallet;
            data.blockchainupload = userInfo.blockchainupload;
            data.ipfsupload = userInfo.ipfsupload;
            data.localupload = userInfo.localupload;
            data.blockchaindownload = userInfo.blockchaindownload;
            data.ipfsdownload = userInfo.ipfsdownload;
            data.localdownload = userInfo.localdownload;
            req.session.userInfo = data;
            console.log('用户权限信息',req.session.userInfo);
            responseClient(res, 200, 0, '登录成功', data);
            return;
        }
        responseClient(res,400,1,'用户名或密码错误');
    }).catch(err => {
        responseClient(res);
    })
});


router.post('/register', (req,res) => {
    let { userName, password, passwordRe } = req.body;
    if (!userName) {
        responseClient(res, 400, 2, '用户名不可为空');
        return;
    }

    if (!password) {
        responseClient(res,400,2,'密码不可为空');
        return;
    }

    if (password !== passwordRe) {
        responseClient(res,400,2,'两次密码不一致');
        return;
    }

    User.findOne({username: userName})
        .then(data => {
            if (data) {
                responseClient(res, 200, 1, '用户已存在');
                return;
            }
            let user = new User({
                username: userName,
                password: password,
                //password: md5(password + MD5_SUFFIX),
                type: 'user',
                wallet: 0,
                blockchainupload:'false',
                ipfsupload: 'false',
                localupload: 'false',
                blockchaindownload : 'false',
                ipfsdownload : 'false',
                localdownload : 'false',
            });
            user.save()
                .then(() => {
                    User.findOne({username: userName})
                        .then(userInfo => {
                            let data = {};
                            data.username = userInfo.username;
                            data.userType = userInfo.type;
                            data.userId = userInfo._id;
                            data.wallet = userInfo.wallet;
                            data.blockchainupload = userInfo.blockchainupload;
                            data.ipfsupload = userInfo.ipfsupload;
                            data.localupload = userInfo.localupload;
                            data.blockchaindownload = userInfo.blockchaindownload;
                            data.ipfsdownload = userInfo.ipfsdownload;
                            data.localdownload = userInfo.localdownload;
                            responseClient(res, 200, 0, '注册成功', data);
                            return;
                        });
                })
        }).catch(err => {
            responseClient(res);
        });
});

router.get('/userInfo',function (req,res) {
    if(req.session.userInfo){
        responseClient(res,200,0,'',req.session.userInfo)
    }else{
        responseClient(res,200,1,'请重新登录',req.session.userInfo)
        //res.redirect('/');
    }
});

router.get('/logout',function (req,res) {
    req.session.destroy();

    res.redirect('/');
});

module.exports = router;
