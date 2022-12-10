const { CLIENT_URL } = require('../frontend/src/config');
const PUBLIC_PAGES   = ['login', 'registration'];

function isPublicPage (url) {
    return PUBLIC_PAGES.some(p => url.includes(p));
}

const SELECT_EXPIRATION_DATE_QUERY = 'SELECT expiration_date FROM tokens WHERE token = $1';

function returnFailResponse (res, message, redirect) {
    res.status(403);
    return res.json({ success: false, message, redirect });
}


function tokenMiddleware (dbClient) {
    return async function (req, res, next) {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Credentials', 'true');

        if (isPublicPage(req.url))
            return next();

        const token = req.cookies?.token;

        console.log(JSON.stringify(token));

        if (!token)
            return returnFailResponse(res, 'Token is not defined', `${ CLIENT_URL }/login`);

        const result = await dbClient.query(SELECT_EXPIRATION_DATE_QUERY, [token]);

        if (!result.rows?.length)
            return returnFailResponse(res, 'Session is expired', `${ CLIENT_URL }/login`);

        const expirationDate = result.rows[0]?.['expiration_date'];

        console.log(expirationDate);

        return next();
    }
}

module.exports = {
    tokenMiddleware,
}
