const { CLIENT_URL } = require('../frontend/src/config');

function isPublicPage (url) {
    return url.includes('login')
}

const SELECT_EXPIRATION_DATE_QUERY = 'SELECT expiration_date FROM tokens WHERE token = $1';

function tokenMiddleware (dbClient) {
    return async function (req, res, next) {
        if (isPublicPage(req.url))
            return next();

        const token = req.cookies?.token;

        if (!token)
            return res.redirect(`${ CLIENT_URL }/login`);

        const result = await dbClient.query(SELECT_EXPIRATION_DATE_QUERY, [token]);

        if (!result.rows?.length)
            return res.redirect(`${ CLIENT_URL }/login`);

        const expirationDate = result.rows[0][0];

        console.log(expirationDate);

        return next();
    }
}

module.exports = {
    tokenMiddleware,
}
