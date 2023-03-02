const express = require('express');
const {Pool} = require('pg')
const bodyParser = require('body-parser');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');
const cookieParser = require('cookie-parser');
const {tokenMiddleware} = require('./token-middleware');
const {getTokenFromCookie} = require('./tools');
const app = express()
const port = 8000

const https = require("https");
const fs = require("fs");

const SELECT_USER_BY_LOGIN_AND_PASSWORD_QUERY = 'SELECT id FROM users WHERE login = $1 AND password = $2';
const SELECT_TOKEN_QUERY = 'SELECT * FROM tokens WHERE user_id=$1';
const UPDATE_TOKEN_QUERY = 'UPDATE tokens SET token=$2, expiration_date=$3 WHERE user_id=$1';
const INSERT_TOKEN_QUERY = 'INSERT INTO tokens(user_id, token, expiration_date) VALUES($1, $2, $3)';
const SELECT_USER_BY_LOGIN_QUERY = 'SELECT * FROM users WHERE login=$1';
const INSERT_USER_QUERY = 'INSERT INTO users(login, password) VALUES($1, $2)';
const SELECT_USER_BY_TOKEN_QUERY = 'SELECT * FROM tokens JOIN users ON users.id = user_id WHERE token = $1';
const SELECT_USER_BY_ID = 'SELECT login FROM users WHERE id = $1';
const INSERT_CARD_QUERY = 'INSERT INTO cards(title, description, img_url, creator_id) VALUES($1, $2, $3, $4)';
const SELECT_ALL_CARDS_QUERY = 'SELECT cards.*, (case when user_id is null then false or creator_id=$1 else user_id=$1 end) as isadded FROM cards LEFT OUTER JOIN card_user cu on cards.id = cu.card_id and user_id=$1';
const SELECT_ALL_MY_CARDS_QUERY = ' SELECT cards.* fROM cards WHERE creator_id=$1 UNION SELECT cards.* fROM cards JOIN card_user cu on cards.id = cu.card_id WHERE user_id=$1';
const SELECT_ALL_TAGS_QUERY = 'SELECT * FROM tags';
const SELECT_CARD_BY_TITLE_QUERY = 'SELECT id FROM cards WHERE title=$1';
const SELECT_CARD_BY_ID = 'SELECT cards.*, (case when user_id is null then false or creator_id=$2 else user_id=$2 end) as isadded FROM cards LEFT OUTER JOIN card_user cu on cards.id = cu.card_id  and user_id=$2 WHERE id = $1';
const SELECT_TAG_BY_NAME_QUERY = 'SELECT id FROM tags WHERE name=$1';
const INSERT_TAG_QUERY = 'INSERT INTO tags(name) VALUES($1)';
const INSERT_TAG_TO_CARD_QUERY = 'INSERT INTO card_tags(card_id, tag_id) VALUES($1, $2)';
const SELECT_USER_ID_BY_TOKEN = 'SELECT user_id FROM tokens WHERE token=$1';
const SELECT_TAGS_BY_CARD_ID = 'SELECT name FROM card_tags JOIN tags on card_tags.tag_id = tags.id WHERE card_id = $1; '
const SELECT_TESTS_BY_CARD_ID = 'SELECT * FROM tests WHERE card_id = $1';
const CREATE_TEST_QUERY = "INSERT INTO tests(card_id, question) VALUES($1, 'Вопрос?')";
const CREATE_TEST_ANSWER_QUERY = "INSERT INTO test_answers(text, is_correct, test_id) VALUES('Ответ', $1, $2)";
const SELECT_LAST_TEST_ID_BY_CARD_ID = "SELECT id FROM tests WHERE card_id = $1 ORDER BY id DESC LIMIT 1";
const UPDATE_TEST_QUESTION_BY_ID = "UPDATE tests SET question = $1, type = $2 WHERE id = $3";
const SELECT_ALL_TEST_ANSWERS_BY_TEST_ID = "SELECT * FROM test_answers WHERE test_id = $1";
const UPDATE_TEST_ANSWER_BY_ID = "UPDATE test_answers SET text = $1, is_correct = $2 WHERE id = $3";
const SELECT_TEST_BY_ID = "SELECT * FROM tests WHERE id = $1";
const SELECT_ALL_CARDS_BY_NAME = "SELECT cards.*, (case when user_id is null then false or creator_id=$2 else user_id=$2 end) as isadded FROM cards LEFT OUTER JOIN card_user cu on cards.id = cu.card_id  and user_id=$2 WHERE title LIKE $1";
const SELECT_ALL_MY_CARDS_BY_NAME = " SELECT cards.* fROM cards WHERE creator_id=$2 and title LIKE $1 UNION SELECT cards.* fROM cards JOIN card_user cu on cards.id = cu.card_id WHERE user_id=$2 and title LIKE $1";
const DELETE_CARD_BY_ID = "DELETE FROM cards WHERE id = $1";
const DELETE_TEST_BY_ID = "DELETE FROM tests WHERE id = $1";
const UPDATE_CARD_BY_ID = "UPDATE cards SET title=$2, description=$3, img_url=$4 WHERE id=$1";
const DELETE_CARD_TAGS_BY_CARD_ID = "DELETE FROM card_tags WHERE card_id=$1";
const ADD_CARD_TO_USER = "INSERT INTO card_user(card_id, user_id) VALUES($1, $2)";
const REMOVE_CARD_FROM_USER = "DELETE FROM card_user WHERE card_id=$1 and user_id=$2";
const INSERT_ATTEMPT = "INSERT INTO attempts(card_id, user_id) VALUES($1, $2)";
const SELECT_LAST_ATTEMPT_ID = "SELECT id FROM attempts WHERE card_id=$1 and user_id=$2 ORDER BY id DESC LIMIT 1"
const SELECT_CURRENT_ATTEMPTS = "SELECT attempts.id as attempt_id, start_time, c.* FROM attempts JOIN cards c on attempts.card_id = c.id WHERE start_time + INTERVAL '01:00' HOUR TO MINUTE > current_timestamp and user_id=$1 and is_finished=false"
const SELECT_ATTEMPT = "SELECT attempts.id as attempt_id, current_test, is_finished, progress, start_time, c.* FROM attempts JOIN cards c on attempts.card_id = c.id WHERE start_time + INTERVAL '01:00' HOUR TO MINUTE > current_timestamp and attempts.id=$1"
const SELECT_TESTS_ID_BY_CARD_ID = "SELECT id FROM tests WHERE card_id=$1 ORDER BY id ASC";
const INSERT_ATTEMPT_ANSWER = "INSERT INTO attempt_answers(attempt_id, test_id, answer_id) VALUES($1, $2, $3)"
const UPDATE_ATTEMPT_CURRENT_TEST = "UPDATE attempts SET current_test=current_test+1 WHERE id=$1";
const UPDATE_ATTEMPT_FINISHED = "UPDATE attempts SET is_finished=true WHERE id=$1";
const SELECT_RESULT_ATTEMPTS = "SELECT attempts.id as attempt_id, start_time, c.* FROM attempts JOIN cards c on attempts.card_id = c.id WHERE (start_time + INTERVAL '01:00' HOUR TO MINUTE <= current_timestamp or  is_finished=true) and user_id=$1"
const SELECT_RIGHT_ATTEMPT_ANSWERS_COUNT = "SELECT SUM(is_correct::int) from attempt_answers JOIN test_answers ON attempt_answers.answer_id = test_answers.id WHERE attempt_id=$1";
const SELECT_LATEST_RESULT_ATTEMPTS = "SELECT attempts.id as attempt_id, start_time, c.* FROM attempts JOIN cards c on attempts.card_id = c.id WHERE (start_time + INTERVAL '01:00' HOUR TO MINUTE <= current_timestamp or  is_finished=true) and user_id=$1  and start_time in (select max(start_time) from attempts GROUP BY card_id)"


const corsOptions = {origin: "https://localhost:3000", credentials: true};

app.use(bodyParser.json())
app.use(cors(corsOptions));
app.use(cookieParser())

const client = new Pool({
    user: 'xyamix_db',
    host: '94.250.252.158',
    database: 'youLearn',
    password: 'qwerty78',
    port: 5433,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})


app.use(tokenMiddleware(client));

function connect() {
    client.on('error', error => {
        connect();
    });
    return client.connect().then(() => console.log('DB Connected')).catch('DB connection failed');
    ;
}


connect()

app.post('/login', cors(corsOptions), async (req, res) => {
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

app.get('/user-info', cors(corsOptions), async (req, res) => {
    const token = getTokenFromCookie(req);

    const {id, login, 'avatar_url': avatarUrl} = (await client.query(SELECT_USER_BY_TOKEN_QUERY, [token]))?.rows[0];
    const token_info = await client.query(SELECT_TOKEN_QUERY, [id]);
    let data = {user_id: id, login, avatarUrl};
    data.token = token_info.rows[0].token;
    data.expires = token_info.rows[0].expiration_date;
    res.json(data);
});

app.post('/checkauth', cors(corsOptions), async (req, res) => {
    const token = getTokenFromCookie(req);
    if(!token)
        return res.send({auth: false})


    const {id, login, 'avatar_url': avatarUrl} = (await client.query(SELECT_USER_BY_TOKEN_QUERY, [token]))?.rows[0];
    const token_info = await client.query(SELECT_TOKEN_QUERY, [id]);
    let expires = token_info.rows[0].expiration_date;
    console.log("checkauth")
    if(Date.parse(expires) < Date.now())
    {
        res.send({auth: false})
    }
    res.send({auth: true});
});

app.post('/cards', cors(corsOptions), async (req, res) => {

    const {name, categories} = req.body;

    const token = getTokenFromCookie(req);
    const {id: user_id} = (await client.query(SELECT_USER_BY_TOKEN_QUERY, [token]))?.rows[0];
    console.log(name, categories);

    let cards;
    if (categories?.length) {
        let categoriesString = `(${categories.join(', ')})`
        console.log(categoriesString)
        const query = `SELECT cards.*, (case when user_id is null then false or creator_id=${user_id} else user_id=${user_id} end) as isadded FROM cards LEFT OUTER JOIN card_user cu on cards.id = cu.card_id  and user_id=${user_id} JOIN card_tags ON cards.id = card_tags.card_id WHERE tag_id IN ${categoriesString} ${name ? `AND title LIKE '%${name}%'` : ""}`;
        console.log(query)
        cards = await client.query(query);
    } else {
        if (name !== null) {
            cards = await client.query(SELECT_ALL_CARDS_BY_NAME, [`%${name}%`, user_id]);
        } else {
            cards = await client.query(SELECT_ALL_CARDS_QUERY, [user_id]);
        }
    }

    cards = cards.rows;

    for (let card of cards) {
        let tags = await client.query(SELECT_TAGS_BY_CARD_ID, [card.id]);
        const tests = await client.query(SELECT_TESTS_BY_CARD_ID, [card.id]);
        card.test_count = tests.rows?.length;
        tags = tags.rows.map(tag => tag.name);
        card.tags = tags;
    }

    res.json(cards);
});

app.post('/mycards', cors(corsOptions), async (req, res) => {

    const {name, categories} = req.body;

    const token = getTokenFromCookie(req);
    const {id: user_id} = (await client.query(SELECT_USER_BY_TOKEN_QUERY, [token]))?.rows[0];
    console.log(name, categories);

    let cards;
    if (categories?.length) {
        let categoriesString = `(${categories.join(', ')})`
        console.log(categoriesString)
        const query = `SELECT cards.* fROM cards JOIN card_tags ON cards.id = card_tags.card_id WHERE tag_id IN ${categoriesString} AND creator_id=${user_id} ${name ? `AND title LIKE '%${name}%'` : ""} UNION SELECT cards.* fROM cards JOIN card_user cu on cards.id = cu.card_id JOIN card_tags ON cards.id = card_tags.card_id WHERE tag_id IN ${categoriesString} AND user_id=${user_id} ${name ? `AND title LIKE '%${name}%'` : ""} `;
        console.log(query)
        cards = await client.query(query);
    } else {
        if (name !== null) {
            cards = await client.query(SELECT_ALL_MY_CARDS_BY_NAME, [`%${name}%`, user_id]);
        } else {
            cards = await client.query(SELECT_ALL_MY_CARDS_QUERY, [user_id]);
        }
    }

    cards = cards.rows;

    for (let card of cards) {
        let tags = await client.query(SELECT_TAGS_BY_CARD_ID, [card.id]);
        const tests = await client.query(SELECT_TESTS_BY_CARD_ID, [card.id]);
        card.test_count = tests.rows?.length;
        tags = tags.rows.map(tag => tag.name);
        card.tags = tags;
    }

    res.json(cards);
});

app.post('/addcard', cors(corsOptions), async (req, res) => {
    const {card_id} = req.body;
    const token = getTokenFromCookie(req);
    const {id: user_id} = (await client.query(SELECT_USER_BY_TOKEN_QUERY, [token]))?.rows[0];
    await client.query(ADD_CARD_TO_USER, [card_id, user_id]);
    res.send('SUCCESS');
});

app.post('/startattempt', cors(corsOptions), async (req, res) => {
    const {card_id} = req.body;
    const token = getTokenFromCookie(req);
    const {id: user_id} = (await client.query(SELECT_USER_BY_TOKEN_QUERY, [token]))?.rows[0];
    await client.query(INSERT_ATTEMPT, [card_id, user_id]);
    const {id: attempt_id} = (await client.query(SELECT_LAST_ATTEMPT_ID, [card_id, user_id]))?.rows[0];
    res.send({attempt_id});
});

app.post('/getcurrent', cors(corsOptions), async (req, res) => {
    const token = getTokenFromCookie(req);
    const {id: user_id} = (await client.query(SELECT_USER_BY_TOKEN_QUERY, [token]))?.rows[0];
    let cards = await client.query(SELECT_CURRENT_ATTEMPTS, [user_id]);
    cards = cards.rows;

    for (let card of cards) {
        let tags = await client.query(SELECT_TAGS_BY_CARD_ID, [card.id]);
        const tests = await client.query(SELECT_TESTS_BY_CARD_ID, [card.id]);
        card.test_count = tests.rows?.length;
        tags = tags.rows.map(tag => tag.name);
        card.tags = tags;
    }

    res.json(cards);
});

app.post('/getresult', cors(corsOptions), async (req, res) => {
    const token = getTokenFromCookie(req);
    const {id: user_id} = (await client.query(SELECT_USER_BY_TOKEN_QUERY, [token]))?.rows[0];
    let cards = await client.query(SELECT_LATEST_RESULT_ATTEMPTS, [user_id]);
    cards = cards.rows;


    for (let card of cards) {
        let tags = await client.query(SELECT_TAGS_BY_CARD_ID, [card.id]);
        const tests = await client.query(SELECT_TESTS_BY_CARD_ID, [card.id]);
        card.test_count = tests.rows?.length;
        tags = tags.rows.map(tag => tag.name);
        card.tags = tags;
        let tests_info = await client.query(SELECT_TESTS_ID_BY_CARD_ID, [card.id])
        let right_count = await client.query(SELECT_RIGHT_ATTEMPT_ANSWERS_COUNT, [card.attempt_id])
        right_count = right_count.rows[0].sum;
        if(right_count) {
            console.log(right_count, tests_info.rows.length)
            card.result = right_count / tests_info.rows.length * 100;
        }
        else
            card.result = 0;
    }

    res.json(cards);
});

app.post('/getattempt', cors(corsOptions), async (req, res) => {
    const {attempt_id} = req.body;
    console.log("Getting attempt " + attempt_id);
    let attempt = await client.query(SELECT_ATTEMPT, [attempt_id]);
    if (attempt?.rows.length === 0) {
        res.status(404);
        res.send("NO SUCT ATTEMPT")
        return;
    }
    attempt = attempt.rows[0];
    let tests_info = await client.query(SELECT_TESTS_ID_BY_CARD_ID, [attempt.id]);
    attempt.tests_id = tests_info.rows;
    res.json(attempt);
});

app.post('/attemptanswer', cors(corsOptions), async (req, res) => {
    const {attempt_id, test_id, answer_id} = req.body;

    let attempt = await client.query(SELECT_ATTEMPT, [attempt_id]);
    if (attempt?.rows.length === 0) {
        res.status(404);
        res.send("NO SUCT ATTEMPT")
        return;
    }
    attempt = attempt.rows[0];

    let tests_info = await client.query(SELECT_TESTS_ID_BY_CARD_ID, [attempt.id]);

    await client.query(INSERT_ATTEMPT_ANSWER, [attempt_id, test_id, answer_id]);

    if (attempt.current_test === tests_info.rows.length - 1)
        await client.query(UPDATE_ATTEMPT_FINISHED, [attempt_id]);

    await client.query(UPDATE_ATTEMPT_CURRENT_TEST, [attempt_id]);
    res.send('SUCCESS');
});

app.post('/removecard', cors(corsOptions), async (req, res) => {
    const {card_id} = req.body;
    const token = getTokenFromCookie(req);
    const {id: user_id} = (await client.query(SELECT_USER_BY_TOKEN_QUERY, [token]))?.rows[0];
    await client.query(REMOVE_CARD_FROM_USER, [card_id, user_id]);
    res.send('SUCCESS');
});


app.post('/card', cors(corsOptions), async (req, res) => {
    const {card_id} = req.body;

    const token = getTokenFromCookie(req);
    const {id: user_id} = (await client.query(SELECT_USER_BY_TOKEN_QUERY, [token]))?.rows[0];

    let card_info = await client.query(SELECT_CARD_BY_ID, [card_id, user_id]);
    console.log(card_info.rows.length)
    if (card_info?.rows.length === 0) {
        res.status(404)
        return res.send('CARD NOT FOUND');
    }
    let card = card_info.rows[0];

    let tests = await client.query(SELECT_TESTS_BY_CARD_ID, [card_id]);
    card.test_count = tests.rows?.length;

    let tags = await client.query(SELECT_TAGS_BY_CARD_ID, [card_id]);
    tags = tags.rows.map(tag => tag.name);
    card.tags = tags;
    const user_info = await client.query(SELECT_USER_BY_ID, [card.creator_id]);

    card.creator_login = user_info.rows?.[0]?.login;

    res.json(card);
});

app.post('/delete_card', cors(corsOptions), async (req, res) => {
    const {card_id} = req.body;
    await client.query(DELETE_CARD_BY_ID, [card_id]);
    res.send('SUCCESS');
});

app.post('/delete_test', cors(corsOptions), async (req, res) => {
    const {test_id} = req.body;
    await client.query(DELETE_TEST_BY_ID, [test_id]);
    res.send('SUCCESS');
});

app.post('/registration', cors(corsOptions), async (req, res) => {
    const {login, password} = req.body;
    const userInfoResult = await client.query(SELECT_USER_BY_LOGIN_QUERY, [login]);

    if (userInfoResult.rows?.length) {
        res.status(409)
        return res.send('USER_ALREADY_EXIST');
    }

    await client.query(INSERT_USER_QUERY, [login, password])

    return res.send('SUCCESS');
});

app.post("/updatetest", cors(corsOptions), async (req, res) => {
    console.log(req.body);
    const {test_id, question, answer, type} = req.body;
    await client.query(UPDATE_TEST_QUESTION_BY_ID, [question, type === "qubic" ? 0 : 1, test_id]);
    //get all answers by test_id
    const answers_info = await client.query(SELECT_ALL_TEST_ANSWERS_BY_TEST_ID, [test_id]);
    const answers_from_db = answers_info.rows;
    //update answers
    for (let i = 0; i < answers_from_db.length; i++) {
        await client.query(UPDATE_TEST_ANSWER_BY_ID, [answer[i], i === 0, answers_from_db[i].id])
    }
    res.send('SUCCESS');
});

app.post("/gettest", cors(corsOptions), async (req, res) => {
    const {test_id} = req.body;
    console.log(test_id)
    const test_info = await client.query(SELECT_TEST_BY_ID, [test_id]);
    const test = test_info.rows[0];
    const answers_info = await client.query(SELECT_ALL_TEST_ANSWERS_BY_TEST_ID, [test_id]);
    test.answers = answers_info.rows;
    res.json(test);
});

app.post('/createcard', cors(corsOptions), async (req, res) => {
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

app.get('/getalltags', cors(corsOptions), async (req, res) => {
    const tagsResult = await client.query(SELECT_ALL_TAGS_QUERY);
    return res.send(tagsResult.rows);
})

app.post('/get_tests', cors(corsOptions), async (req, res) => {
    const {id} = req.body;
    const tests_result = await client.query(SELECT_TESTS_BY_CARD_ID, [id]);
    return res.send(tests_result.rows);
});

app.post('/create_test', cors(corsOptions), async (req, res) => {
    const {id} = req.body;
    await client.query(CREATE_TEST_QUERY, [id]);
    const tests_result = await client.query(SELECT_LAST_TEST_ID_BY_CARD_ID, [id]);
    await client.query(CREATE_TEST_ANSWER_QUERY, [true, tests_result.rows[0].id]);
    await client.query(CREATE_TEST_ANSWER_QUERY, [false, tests_result.rows[0].id]);
    await client.query(CREATE_TEST_ANSWER_QUERY, [false, tests_result.rows[0].id]);
    await client.query(CREATE_TEST_ANSWER_QUERY, [false, tests_result.rows[0].id]);
    return res.send('OK');
});
app.post('/edit_card', cors(corsOptions), async (req, res) => {
    const {
        id,
        title,
        testCount,
        imgUrl,
        tags,
        description
    } = req.body;
    // todo check that editor is owner of card
    await client.query(UPDATE_CARD_BY_ID, [id, title, description, imgUrl]);
    await client.query(DELETE_CARD_TAGS_BY_CARD_ID, [id]);
    for (const tag of tags) {
        let tag_info = await client.query(SELECT_TAG_BY_NAME_QUERY, [tag]);
        if (tag_info.rows?.length) {
            const tag_id = tag_info.rows[0].id;
            await client.query(INSERT_TAG_TO_CARD_QUERY, [id, tag_id]);
        } else {
            await client.query(INSERT_TAG_QUERY, [tag]);
            tag_info = await client.query(SELECT_TAG_BY_NAME_QUERY, [tag]);
            const tag_id = tag_info.rows[0].id;
            await client.query(INSERT_TAG_TO_CARD_QUERY, [id, tag_id]);
        }
    }
    return res.send('OK');
});

https
    .createServer({
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
    }, app)
    .listen(port, () => {
        console.log(`Example app listening on http://localhost:${port}`)
    });

