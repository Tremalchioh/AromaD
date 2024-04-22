const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/authorization', authMiddleware, userController.check)
router.post('/favorites/add', userController.addToFavorites)
router.post('/favorites', userController.getFavorites)
router.post('/recentlyViewed/add', userController.addToRecentlyViewed)
router.post('/recentlyViewed', userController.getRecentlyViewed)
router.post('/rating', userController.rate)

module.exports = router