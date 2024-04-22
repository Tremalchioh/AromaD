const Router = require('express')
const router = new Router()
const perfumeController = require('../controllers/perfumeController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', perfumeController.create)
router.get('/', perfumeController.getAll)
router.get('/:id', perfumeController.getOne)
router.get('/:id/rating', perfumeController.getRating)

module.exports = router