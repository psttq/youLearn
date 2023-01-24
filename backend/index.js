const express                = require('express');
const { Client }             = require('pg')
const bodyParser             = require('body-parser');
const cors                   = require('cors');
const { v4: uuidv4 }         = require('uuid');
const cookieParser           = require('cookie-parser');
const { tokenMiddleware }    = require('./token-middleware');
const { getTokenFromCookie } = require('./tools');
const app                    = express()
const port                   = 8000

const SELECT_USER_BY_LOGIN_AND_PASSWORD_QUERY = 'SELECT id FROM users WHERE login = $1 AND password = $2';
const SELECT_TOKEN_QUERY                      = 'SELECT * FROM tokens WHERE user_id=$1';
const UPDATE_TOKEN_QUERY                      = 'UPDATE tokens SET token=$2, expiration_date=$3 WHERE user_id=$1';
const INSERT_TOKEN_QUERY                      = 'INSERT INTO tokens(user_id, token, expiration_date) VALUES($1, $2, $3)';
const SELECT_USER_BY_LOGIN_QUERY              = 'SELECT * FROM users WHERE login=$1';
const INSERT_USER_QUERY                       = 'INSERT INTO users(login, password) VALUES($1, $2)'
const SELECT_USER_BY_TOKEN_QUERY              = 'SELECT login FROM tokens JOIN users ON users.id = user_id WHERE token = $1'
const INSERT_CARD_QUERY                       = 'INSERT INTO cards(title, description, img_url) VALUES($1, $2, $3)'
const SELECT_ALL_CARDS_QUERY                  = 'SELECT * FROM cards'


const corsOptions = {origin: "http://localhost:3000", credentials: true};

app.use(bodyParser.json())
app.use(cors(corsOptions));
app.use(cookieParser())

const client = new Client({
    user:     'xyamix_db',
    host:     '94.250.252.158',
    database: 'postgres',
    password: 'qwerty78',
    port:     5432,
})
app.use(tokenMiddleware(client));

client.connect().then(() => console.log('DB Connected')).catch('DB connection failed');

app.post('/login', async (req, res) => {
    debugger;
    const { login, password } = req.body;
    const userInfoResult      = await client.query(SELECT_USER_BY_LOGIN_AND_PASSWORD_QUERY, [login, password]);

    if (!userInfoResult.rows?.length) {
        res.status(404)
        return res.send('USER_NOT_FOUND');
    }

    const { id }      = userInfoResult.rows[0];
    const tokenResult = await client.query(SELECT_TOKEN_QUERY, [id]);
    const token       = uuidv4();
    const expires     = new Date(Date.now())

    expires.setDate(expires.getDate() + 1);

    if (tokenResult.rows?.length) {
        await client.query(UPDATE_TOKEN_QUERY, [id, token, expires])
    }
    else {
        await client.query(INSERT_TOKEN_QUERY, [id, token, expires])
    }

    res.json({ token, expires });
});

app.get('/user-info', async (req, res) => {
    const token = getTokenFromCookie(req);

    const { login, 'avatar_url': avatarUrl } = (await client.query(SELECT_USER_BY_TOKEN_QUERY, [token]))?.rows[0];

    res.json({ login, avatarUrl });
});

app.get('/cards', async (req, res) => {
    const token = getTokenFromCookie(req);

    const cards = await client.query(SELECT_ALL_CARDS_QUERY);

    res.json(cards.rows);
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

app.post('/createcard', async (req, res) => {
    const { title, description, imgUrl } = req.body;


    await client.query(INSERT_CARD_QUERY, [title, description, imgUrl])

    return res.send('SUCCESS');
});
app.get('/', (req, res) => {

})

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${ port }`)
})
