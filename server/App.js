const express = require('express'),
    app = express(),
    cors = require('cors'),
    db = require('./models'),
    userInfoRouter = require('./Routes/UserInfo');
;

//midelwars
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/userInfo', userInfoRouter);

//static images folder
app.use('/Images', express.static('../Images'));



db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Server is running on PORT 3001');
    });
});
