const express             = require('express');
const { Client }          = require('pg')
const bodyParser          = require('body-parser');
const cors                = require('cors');
const { v4: uuidv4 }      = require('uuid');
const cookieParser        = require('cookie-parser');
const { tokenMiddleware } = require('./token-middleware');
const app                 = express()
const port                = 8000

const SELECT_USER_BY_LOGIN_AND_PASSWORD_QUERY = 'SELECT id FROM users WHERE login = $1 AND password = $2';
const SELECT_TOKEN_QUERY                      = 'SELECT * FROM tokens WHERE user_id=$1';
const UPDATE_TOKEN_QUERY                      = 'UPDATE tokens SET token=$2, expiration_date=$3 WHERE user_id=$1';
const INSERT_TOKEN_QUERY                      = 'INSERT INTO tokens(user_id, token, expiration_date) VALUES($1, $2, $3)';
const SELECT_USER_BY_LOGIN_QUERY              = 'SELECT * FROM users WHERE login=$1';
const INSERT_USER_QUERY                       = 'INSERT INTO users(login, password) VALUES($1, $2)'

var corsOptions = {
    credentials: true,
    origin:      'http://localhost:3000',
}

app.use(bodyParser.json())
app.use(cors(corsOptions));
app.use(cookieParser())

const client = new Client({
    user:     'postgres',
    host:     'localhost',
    database: 'youlearn',
    password: '1',
    port:     5432,
})
app.use(tokenMiddleware(client));

client.connect().then(() => console.log('DB Connected')).catch('DB connection failed');

app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const userInfoResult      = await client.query(SELECT_USER_BY_LOGIN_AND_PASSWORD_QUERY, [login, password]);

    if (!userInfoResult.rows?.length) {
        res.status(404)
        return res.send('USER_NOT_FOUND');
    }

    const id             = userInfoResult.rows[0][0];
    const tokenResult    = await client.query(SELECT_TOKEN_QUERY, [id]);
    const token          = uuidv4();
    const expirationDate = new Date(Date.now())

    expirationDate.setDate(expirationDate.getDate() + 1);

    if (tokenResult.rows) {
        await client.query(UPDATE_TOKEN_QUERY, [id, token, expirationDate])
    }
    else {
        await client.query(INSERT_TOKEN_QUERY, [id, token, expirationDate])
    }

    res.cookie('token', token, { httpOnly: true, secure: false, expires: expirationDate });
    res.send('SUCCESS');
});


app.post('/registration', async (req, res) => {
    const { login, password } = req.body;
    const userInfoResult      = await client.query(SELECT_USER_BY_LOGIN_QUERY, [login]);

    if (userInfoResult.rows?.length) {
        res.status(409)
        return res.send('USER_ALREADY_EXIST');
    }

    await client.query(INSERT_USER_QUERY, [login, password])

    return res.send('SUCCESS');
});

app.get('/', (req, res) => {

})

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${ port }`)
})
