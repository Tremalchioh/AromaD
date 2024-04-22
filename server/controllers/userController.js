const ApiError = require('../error/ApiError')
const {User, Favorites, RecentlyViewed, FavoritesPerfume, Perfume, RecentlyViewedPerfume, Rating} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateToken = (id, username) => {
    return jwt.sign(
        {id, username },
        process.env.SECRET_KEY,
        {expiresIn: '36h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {username, password} = req.body

        if (!username || !password) {
            return next(ApiError.badRequest('Некорректное имя пользователя или пароль'))
        }
        const usernameExists = await User.findOne({where: {"username": username}})
        if (usernameExists) {
            return next(ApiError.badRequest("Пользователь с таким именем уже существует"))
        }

        const hashPassword = await bcrypt.hash(password, 7)
        const user = await User.create({username, password:hashPassword})
        const favorites = await Favorites.create({userId: user.id})
        const recently_viewed = await RecentlyViewed.create({userId: user.id})

        const token = generateToken(user.id, username)
        return res.json({token})
    }

    async login(req, res, next) {
        const {username, password} = req.body

        if(!username || !password) {
            return next(ApiError.badRequest("Введите корректные данные"))
        }

        const user = await User.findOne({where: {"username": username}})

        if(!user) {
            return next(ApiError.badRequest("Пользователь с таким именем не существует"))
        }

        let isPasswordCorrect = bcrypt.compareSync(password, user.password)
        if(!isPasswordCorrect) {
            return next(ApiError.badRequest("Введен неверный пароль"))
        }

        const token = generateToken(user.id, username)

        return res.json({'userId': user.id, 'token': token})
    }

    async check(req, res, next) {
        const token = generateToken(req.user.id, req.user.username, req.user.role)
        return res.json({token})
    }

    async addToFavorites(req, res) {
        const { userId, perfumeId } = req.body
        const favorites = await Favorites.findOne({where: {"userId": userId}})

        try {
            const isAlreadyFavorite = await FavoritesPerfume.findOne({where: {"favoriteId": favorites.id, "perfumeId": perfumeId}})
            if (isAlreadyFavorite) {
                await FavoritesPerfume.destroy({where: {"favoriteId": favorites.id, "perfumeId": perfumeId}})
                res.status(200).json({ message: 'Perfume deleted from favorites' })
            } else {
                await FavoritesPerfume.create({favoriteId: favorites.id, perfumeId: perfumeId})
                res.status(200).json({ message: 'Perfume added to favorites' })
            }
        } catch (error) {
            console.error('Error adding perfume to favorites (server error):', error)
            ApiError.internal('Internal server error')
        }
    }

    async getFavorites(req, res) {
        try {
            const {userId} = req.body
            const favorites = await Favorites.findOne({where: {"userId": userId}})
            //const perfumesInFavorites = await FavoritesPerfume.findAll({where: {"favoriteId": favorites.id}})

            const favoritePerfumeIds = (await FavoritesPerfume.findAll({ where: { "favoriteId": favorites.id } }))
                .map(favorite => favorite.perfumeId);

            const favoritePerfumes = await Perfume.findAll({ where: { "id": favoritePerfumeIds } });

            return res.json(favoritePerfumes)
        } catch (error) {
            console.error('Error fetching the favorites (server error):', error)
            ApiError.internal('Internal server error')
        }
    }
    async addToRecentlyViewed(req, res) {
        const { userId, perfumeId } = req.body
        const recentlyViewed = await RecentlyViewed.findOne({where: {"userId": userId}})

        try {
            const isAlreadyViewed = await RecentlyViewedPerfume.findOne({where: {"recentlyViewedId": recentlyViewed.id, "perfumeId": perfumeId}})
            if (isAlreadyViewed) {
                await RecentlyViewedPerfume.destroy({where: {"recentlyViewedId": recentlyViewed.id, "perfumeId": perfumeId}})
                await RecentlyViewedPerfume.create({recentlyViewedId: recentlyViewed.id, perfumeId: perfumeId})
            } else {
                await RecentlyViewedPerfume.create({recentlyViewedId: recentlyViewed.id, perfumeId: perfumeId})
            }
            res.status(200).json({ message: 'Perfume added to recently viewed' })
        } catch (error) {
            console.error('Error adding perfume to recently viewed (server error):', error)
            ApiError.internal('Internal server error')
        }
    }

    async getRecentlyViewed(req, res) {
        try {
            const {userId} = req.body
            const recentlyViewed = await RecentlyViewed.findOne({where: {"userId": userId}})

            const recentlyViewedPerfumeIds = (await RecentlyViewedPerfume.findAll({ where: { "recentlyViewedId": recentlyViewed.id } }))
                .map(viewedPerfume => viewedPerfume.perfumeId);

            const recentlyViewedPerfumes = await Perfume.findAll({ where: { "id": recentlyViewedPerfumeIds } });

            return res.json(recentlyViewedPerfumes)
        } catch (error) {
            console.error('Error fetching recently viewed (server error):', error)
            ApiError.internal('Internal server error')
        }
    }

    async rate(req, res) {
        try {
            const {perfumeId, rating, userId} = req.body
            const alreadyRated = await Rating.findAll({where: {"userId": userId, "perfumeId": perfumeId}})
            if (alreadyRated) {
                await Rating.destroy({where: {"perfumeId": perfumeId, "userId": userId}})
                await Rating.create({userId, perfumeId, rating})
            } else {
                await Rating.create({userId, perfumeId, rating})
            }
            res.status(200).json({message: 'Perfume was successfully rated'})
            console.log('Perfume was successfully rated')
        } catch (error) {
            console.error('Error fetching recently viewed (server error):', error)
            ApiError.internal('Internal server error')
        }
    }
}

module.exports = new UserController()