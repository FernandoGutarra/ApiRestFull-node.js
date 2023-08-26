import express from 'express';
import multer from 'multer';
import ApiGameController from './Controllers/ApiGameController';
import ApiCategoryController from './Controllers/ApiCategoryController';
import ApiUserController from './Controllers/ApiUserController';
import verifyToken from './helper/verifyToken';

const router = express.Router();
const gameController = new ApiGameController();
const categorieController = new ApiCategoryController();
const userController = new ApiUserController();

// Configurar multer para manejar la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Prefijo "/api" para todas las rutas de la API

// Definir las rutas para ApiGameController
router.get('/api/games', verifyToken, gameController.getGames.bind(gameController));
router.get('/api/game/:ID', verifyToken, gameController.getGame.bind(gameController));
router.delete('/api/game/:ID', verifyToken, gameController.deleteGame.bind(gameController));
router.put('/api/game/:ID', verifyToken, upload.single('mainImage'), gameController.updateGame.bind(gameController));
router.post('/api/game', verifyToken, upload.single('mainImage'), gameController.insertGame.bind(gameController));

// Definir las rutas para ApiCategoryController
router.get('/api/categories', verifyToken, categorieController.getCategories.bind(categorieController));
router.get('/api/category/:ID', verifyToken, categorieController.getCat.bind(categorieController));
router.delete('/api/category/:ID', verifyToken, categorieController.deleteCat.bind(categorieController));
router.put('/api/category/:ID', verifyToken, categorieController.updateCat.bind(categorieController));
router.post('/api/category', verifyToken, categorieController.insertCat.bind(categorieController));

// Definir las rutas para ApiUserController
router.post('/api/register', userController.verifyRegister.bind(userController));
router.post('/api/login', userController.verifyLogin.bind(userController));

router.use('/api', (req, res, next) => {
  // Middleware para verificar la ruta
  if (!req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'Ruta no encontrada' });
  }
  next();
});

export default router;

