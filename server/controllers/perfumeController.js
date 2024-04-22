const {Perfume, Type, Favorites, Rating} = require('../models/models')
const ApiError = require('../error/ApiError')

const uuid = require('uuid')
const path = require('path')

class PerfumeController {
    async create(req, res, next) {
        try {
            const {name, brandId, typeId, groupId, info} = req.body
            const {picture, picture_pyramid} = req.files
            let fileName_picture = uuid.v4() + ".jpg"
            let fileName_pyramid = uuid.v4() + ".jpg"
            await picture.mv(path.resolve(__dirname, '..', 'static', fileName_picture))
            await picture_pyramid.mv(path.resolve(__dirname, '..', 'static', fileName_pyramid))

            const perfume = await Perfume.create({name, brandId, typeId, groupId, info, picture: fileName_picture, picture_pyramid: fileName_pyramid})

            return res.json(perfume)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {brandId, typeId, groupId, limit, page} = req.query
        page = page || 1
        limit = limit || 50
        let offset = limit * (page - 1)
        let perfumes;

        if(!brandId && !typeId && !groupId) {
            perfumes = await Perfume.findAndCountAll({limit, offset})
        }
        if(brandId && !typeId && !groupId) {
            perfumes = await Perfume.findAndCountAll({where: {brandId}, limit, offset})
        }
        if(!brandId && typeId && !groupId) {
            perfumes = await Perfume.findAndCountAll({where: {typeId}, limit, offset})
        }
        if(!brandId && !typeId && groupId) {
            perfumes = await Perfume.findAndCountAll({where: {groupId}, limit, offset})
        }
        if(brandId && typeId && !groupId) {
            perfumes = await Perfume.findAndCountAll({where: {brandId, typeId}, limit, offset})
        }
        if(!brandId && typeId && groupId) {
            perfumes = await Perfume.findAndCountAll({where: {groupId, typeId}, limit, offset})
        }
        if(brandId && !typeId && groupId) {
            perfumes = await Perfume.findAndCountAll({where: {brandId, groupId}, limit, offset})
        }
        if(brandId && typeId && groupId) {
            perfumes = await Perfume.findAll({where: {brandId, typeId, groupId}, limit, offset})
        }

        return res.json(perfumes)
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            if (!id) return ApiError.badRequest('Not Found')
            const perfume = await Perfume.findOne({where: {"id": id}})
            return res.json(perfume)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getRating(req, res, next) {
        try {
            const {id} = req.params
            if (!id) return ApiError.badRequest('Not Found')
            const ratings = await Rating.findAll({where: {"perfumeId":id}})
            if (ratings.length === 0) {return res.json(0)}
            let sum = 0
            for (let i = 0; i < ratings.length; ++i) {
                sum += ratings[i].rating
            }
            const rating = sum/ratings.length
            return res.json(rating)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new PerfumeController()