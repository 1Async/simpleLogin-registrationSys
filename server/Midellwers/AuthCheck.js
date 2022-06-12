const { verify } = require('jsonwebtoken');

const AuthCheck = (req, res, next) => {

    const Token = req.header("Token");

    if (!Token) {
        return res.json({ error: "You are not logged in" })
    } else {
        try {
            const validToken = verify(Token, "secretToken");
            req.user = validToken;
            if (validToken) {
                return next();
            }
        } catch (err) {
            return res.json({ error: err });
        }
    }
}

module.exports = { AuthCheck };