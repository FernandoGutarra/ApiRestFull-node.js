const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  console.log(req.header('Authorization'));
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó el token' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'tu_secreto_secreto');
    req.user = decoded.user; // Almacenar información del usuario en el objeto de solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = verifyToken;
