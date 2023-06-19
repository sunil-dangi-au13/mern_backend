let jwt = require('jsonwebtoken');
const JWT_SECRET ='spiderman123'

const fetchuser = (req,res,next)=>{
    //get the user from jwt token and add id in request object//
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:" no token"})
    }
    try {
        const data = jwt.verify(token,JWT_SECRET)
        req.user = data.user.user
        next();
        
    } catch (error) {
        res.status(401).send({error:"Please authnticate user with valid token"}) 
    }

}


module.exports = fetchuser

 