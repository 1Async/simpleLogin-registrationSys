const express = require('express'),
    app = express(),
    cors = require('cors'),
    db = require('./models'),
    userInfoRouter = require('./Routes/UserInfo');
;

//midelwars
app.use(cors());
app.use(express.json());

//routes
app.use('/userInfo', userInfoRouter);



db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Server is running on PORT 3001');
    });
});
