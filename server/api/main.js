import Express from 'express';

import  { responseClient } from '../util';

const router = Express.Router();

router.use('/user', require('./user'));


module.exports = router;
