// IMPORT JWT pour la creation de token
const jwt = require('jsonwebtoken');
require('dotenv').config();

//creation de la fontion de la validation de token
module.exports = (req, res, next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
        const userId = decodedToken.userId;

        if(req.body.userId && req.body.userId !== userId){
            throw "user id non valable";
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')

        });
    }
}
