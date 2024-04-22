const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const {SIGUSR1} = require("nodemon/lib/monitor/signals");

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING}
})

const Perfume = sequelize.define('perfume', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    groupId: {type: DataTypes.INTEGER, allowNull: false},
    gender: {type:DataTypes.STRING, defaultValue: 'unisex'},
    picture: {type: DataTypes.STRING, allowNull: false},
    picture_pyramid: {type: DataTypes.STRING, allowNull: false},
    info: {type: DataTypes.STRING, allowNull: false}
})

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Group = sequelize.define('group', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rating: {type: DataTypes.INTEGER, defaultValue: 0}
})

const Favorites = sequelize.define('favorites', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const RecentlyViewed = sequelize.define('recently_viewed', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const FavoritesPerfume = sequelize.define('favorites_perfume', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const RecentlyViewedPerfume = sequelize.define('recently_viewed_perfume', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

Perfume.hasMany(Rating)
Rating.belongsTo(Perfume)

Group.hasMany(Perfume)
Perfume.belongsTo(Group)

Type.hasMany(Perfume)
Perfume.belongsTo(Type)

Perfume.hasOne(FavoritesPerfume)
FavoritesPerfume.belongsTo(Perfume)

Perfume.hasOne(RecentlyViewedPerfume)
RecentlyViewedPerfume.belongsTo(Perfume)

Brand.hasMany(Perfume)
Perfume.belongsTo(Brand)

User.hasOne(Favorites)
Favorites.belongsTo(User)

User.hasOne(RecentlyViewed)
RecentlyViewed.belongsTo(User)

User.hasOne(Rating)
Rating.belongsTo(User)

Favorites.hasMany(FavoritesPerfume)
FavoritesPerfume.belongsTo(Favorites)

RecentlyViewed.hasMany(RecentlyViewedPerfume)
RecentlyViewedPerfume.belongsTo(RecentlyViewed)

module.exports = {
    User,
    Perfume,
    Type,
    Brand,
    Group,
    Rating,
    Favorites,
    FavoritesPerfume,
    RecentlyViewed,
    RecentlyViewedPerfume
}