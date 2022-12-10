import { Cookies } from 'react-cookie'

function convertStringToDate (expiresString) {
    try {
        return new Date(expiresString);
    }
    catch (err) {
        return false;
    }
}

export function setAuthCookies (token, expires) {
    const cookie = new Cookies();

    if (typeof expires === 'string')
        expires = convertStringToDate(expires);

    if (!expires)
        return false;

    cookie.set('token', token, { expires });

    return true;
}
