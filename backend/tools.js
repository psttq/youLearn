function getTokenFromCookie (req) {
    return req.cookies?.token;
}

module.exports = {
    getTokenFromCookie,
}
