const Router = require('express')
const router = new Router
const typeRouter = require('./typeRouter')
const brandRouter = require('./brandRouter')
const perfumeRouter = require('./perfumeRouter')
const userRouter = require('./userRouter')
const groupRouter = require('./groupRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/perfume', perfumeRouter)
router.use('/group', groupRouter)

module.exports = router