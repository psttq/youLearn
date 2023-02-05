const express = require('express');
const {Client} = require('pg')
const bodyParser = require('body-parser');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');
const cookieParser = require('cookie-parser');
const {tokenMiddleware} = require('./token-middleware');
const {getTokenFromCookie} = require('./tools');
const app = express()
const port = 8000

const SELECT_USER_BY_LOGIN_AND_PASSWORD_QUERY = 'SELECT id FROM users WHERE login = $1 AND password = $2';
const SELECT_TOKEN_QUERY = 'SELECT * FROM tokens WHERE user_id=$1';
const UPDATE_TOKEN_QUERY = 'UPDATE tokens SET token=$2, expiration_date=$3 WHERE user_id=$1';
const INSERT_TOKEN_QUERY = 'INSERT INTO tokens(user_id, token, expiration_date) VALUES($1, $2, $3)';
const SELECT_USER_BY_LOGIN_QUERY = 'SELECT * FROM users WHERE login=$1';
const INSERT_USER_QUERY = 'INSERT INTO users(login, password) VALUES($1, $2)';
const SELECT_USER_BY_TOKEN_QUERY = 'SELECT login FROM tokens JOIN users ON users.id = user_id WHERE token = $1';
const INSERT_CARD_QUERY = 'INSERT INTO cards(title, description, img_url, creator_id) VALUES($1, $2, $3, $4)';
const SELECT_ALL_CARDS_QUERY = 'SELECT * FROM cards';
const SELECT_ALL_TAGS_QUERY = 'SELECT name FROM tags';
const SELECT_CARD_BY_TITLE_QUERY = 'SELECT id FROM cards WHERE title=$1';
const SELECT_CARD_BY_ID = 'SELECT * FROM cards WHERE id = $1';
const SELECT_TAG_BY_NAME_QUERY = 'SELECT id FROM tags WHERE name=$1';
const INSERT_TAG_QUERY = 'INSERT INTO tags(name) VALUES($1)';
const INSERT_TAG_TO_CARD_QUERY = 'INSERT INTO card_tags(card_id, tag_id) VALUES($1, $2)';
const SELECT_USER_ID_BY_TOKEN = 'SELECT user_id FROM tokens WHERE token=$1';
const SELECT_TAGS_BY_CARD_ID = 'SELECT name FROM card_tags JOIN tags on card_tags.tag_id = tags.id WHERE card_id = $1; '
const SELECT_TESTS_BY_CARD_ID = 'SELECT * FROM tests WHERE card_id = $1';
const CREATE_TEST_QUERY = "INSERT INTO tests(card_id, question) VALUES($1, 'Вопрос?')";
const CREATE_TEST_ANSWER_QUERY = "INSERT INTO test_answers(text, is_correct, test_id) VALUES('Ответ', $1, $2)";
const SELECT_LAST_TEST_ID_BY_CARD_ID = "SELECT id FROM tests WHERE card_id = $1 ORDER BY id DESC LIMIT 1";

const corsOptions = {origin: "http://localhost:3000", credentials: true};

app.use(bodyParser.json())
app.use(cors(corsOptions));
app.use(cookieParser())

const client = new Client({
    user: 'xyamix_db',
    host: '94.250.252.158',
    database: 'youLearn',
    password: 'qwerty78',
    port: 5433,
})
app.use(tokenMiddleware(client));

client.connect().then(() => console.log('DB Connected')).catch('DB connection failed');

app.post('/login', async (req, res) => {
    debugger;
    const {login, password} = req.body;
    const userInfoResult = await client.query(SELECT_USER_BY_LOGIN_AND_PASSWORD_QUERY, [login, password]);

    if (!userInfoResult.rows?.length) {
        res.status(404)
        return res.send('USER_NOT_FOUND');
    }

    const {id} = userInfoResult.rows[0];
    const tokenResult = await client.query(SELECT_TOKEN_QUERY, [id]);
    const token = uuidv4();
    const expires = new Date(Date.now())

    expires.setDate(expires.getDate() + 1);

    if (tokenResult.rows?.length) {
        await client.query(UPDATE_TOKEN_QUERY, [id, token, expires])
    } else {
        await client.query(INSERT_TOKEN_QUERY, [id, token, expires])
    }

    res.json({token, expires});
});

app.get('/user-info', async (req, res) => {
    const token = getTokenFromCookie(req);

    const {login, 'avatar_url': avatarUrl} = (await client.query(SELECT_USER_BY_TOKEN_QUERY, [token]))?.rows[0];

    res.json({login, avatarUrl});
});

app.get('/cards', async (req, res) => {
    const token = getTokenFromCookie(req);

    let cards = await client.query(SELECT_ALL_CARDS_QUERY);
    cards = cards.rows;

    for (let card of cards) {
        let tags = await client.query(SELECT_TAGS_BY_CARD_ID, [card.id]);
        tags = tags.rows.map(tag => tag.name);
        card.tags = tags;
    }

    res.json(cards);
});


app.post('/card', async (req, res) => {
    const {card_id} = req.body;
    let card_info = await client.query(SELECT_CARD_BY_ID, [card_id]);
    console.log(card_info.rows.length)
    if (card_info?.rows.length === 0) {
        res.status(404)
        return res.send('CARD NOT FOUND');
    }
    let card = card_info.rows[0];

    let tags = await client.query(SELECT_TAGS_BY_CARD_ID, [card_id]);
    tags = tags.rows.map(tag => tag.name);
    card.tags = tags;

    res.json(card);
});

app.post('/registration', async (req, res) => {
    const {login, password} = req.body;
    const userInfoResult = await client.query(SELECT_USER_BY_LOGIN_QUERY, [login]);

    if (userInfoResult.rows?.length) {
        res.status(409)
        return res.send('USER_ALREADY_EXIST');
    }

    await client.query(INSERT_USER_QUERY, [login, password])

    return res.send('SUCCESS');
});

app.post('/createcard', async (req, res) => {
    const {title, description, imgUrl, tags} = req.body;
    const token = getTokenFromCookie(req);

    const user_info = await client.query(SELECT_USER_ID_BY_TOKEN, [token]);
    const user_id = user_info.rows[0].user_id;

    console.log(user_id);

    await client.query(INSERT_CARD_QUERY, [title, description, imgUrl, user_id])

    const card_info = await client.query(SELECT_CARD_BY_TITLE_QUERY, [title])

    const card_id = card_info.rows[0].id;
    for (const tag of tags) {
        let tag_info = await client.query(SELECT_TAG_BY_NAME_QUERY, [tag]);
        if (tag_info.rows?.length) {
            const tag_id = tag_info.rows[0].id;
            await client.query(INSERT_TAG_TO_CARD_QUERY, [card_id, tag_id]);
        } else {
            await client.query(INSERT_TAG_QUERY, [tag]);
            tag_info = await client.query(SELECT_TAG_BY_NAME_QUERY, [tag]);
            const tag_id = tag_info.rows[0].id;
            await client.query(INSERT_TAG_TO_CARD_QUERY, [card_id, tag_id]);
        }
    }
    return res.send('SUCCESS');
});

app.get('/getalltags', async (req, res) => {
    const tagsResult = await client.query(SELECT_ALL_TAGS_QUERY);
    let tags = tagsResult.rows.map(res => res.name);
    return res.send(tags);
})

app.post('/get_tests', async (req, res) => {
    const {id} = req.body;
    const tests_result = await client.query(SELECT_TESTS_BY_CARD_ID, [id]);
    return res.send(tests_result.rows);
});

app.post('/create_test', async (req, res) => {
    const {id} = req.body;
    await client.query(CREATE_TEST_QUERY, [id]);
    const tests_result = await client.query(SELECT_LAST_TEST_ID_BY_CARD_ID, [id]);
    await client.query(CREATE_TEST_ANSWER_QUERY, [true, tests_result.rows[0].id]);
    await client.query(CREATE_TEST_ANSWER_QUERY, [false, tests_result.rows[0].id]);
    await client.query(CREATE_TEST_ANSWER_QUERY, [false, tests_result.rows[0].id]);
    await client.query(CREATE_TEST_ANSWER_QUERY, [false, tests_result.rows[0].id]);
    return res.send('OK');
});

app.get('/', (req, res) => {

})

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)

})
