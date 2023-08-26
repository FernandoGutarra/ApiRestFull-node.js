import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Definición de tipo para el objeto req con la propiedad user
interface AuthenticatedRequest extends Request {
  user?: string;
}

function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.header('Authorization');
  console.log(req.header('Authorization'));
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó el token' });
  }

  try {
    const decoded: any = jwt.verify(token.replace('Bearer ', ''), 'tu_secreto_secreto');
    console.log(req.user);
    req.user = decoded.user; // Almacenar información del usuario en el objeto de solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

export default verifyToken;
