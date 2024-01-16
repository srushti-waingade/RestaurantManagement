const jwt = require('jsonwebtoken');
const secretKey = 'srushti'; 


const generateAccessToken = (req,res) => {
  const {email,pass}=req.body;
  if(email =="admin@gmail.com" && pass=="1234"){
    return res.send({accessToken: jwt.sign({email:email}, secretKey, { expiresIn: 120*120 })}) 
  }
  return res.send({err:"Invalid username and password"});
}
const authenticateToken = (req, res, next) => {


  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split('Bearer ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }
    
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

module.exports = {
  generateAccessToken,
  authenticateToken,
};
