const Sequelize = require('sequelize');

var sequelize = new Sequelize('d1k6hvfconbl2i', 'rjvkfqcvmbdezi',
    '9424db89678966cf89b719530d672073130240d190f3867d43b51323a9a8cc9e', {
        host: 'ec2-54-204-41-148.compute-1.amazonaws.com',
        dialect: 'postgres',
        port: 5432,
        dialectOptions: {
            ssl: true
        }
    })

var Products = sequelize.define('Products', {
    description: Sequelize.STRING,
})


var Locations = sequelize.define('ProductInfos', {
    dateTime: Sequelize.DATE,
    longitude: Sequelize.NUMERIC(9, 6),
    latitude: Sequelize.NUMERIC(9, 6),
    elevation: Sequelize.INTEGER,
})

Products.hasMany(Locations);
Locations.belongsTo(Products)


module.exports = {
    initialize: function () {
        return new Promise(function (resolve, reject) {
            sequelize
                .authenticate()
                .then(function () {
                    console.log('Users connection has been established successfully.');
                    resolve();
                })
                .catch(function (err) {
                    console.log('Unable to connect to the users database: ', err);
                    reject();
                })
        })
    },
    userValidation: function (targetBody) {
        return new Promise(function (resolve, reject) {
            sequelize.sync().then(function () {
                Users.all()
                    .then((data) => {
                        for (let i = 0; i < data.length; ++i) {
                            if (targetBody.userEmail === data[i].dataValues.email && targetBody.password === data[i].dataValues.password) {
                                resolve(data[i].dataValues.email);
                            }
                        }
                        reject({ message: "Check email or password" })
                    })
            })
        })
    },
    createProduct: function (newProduct) {
        return new Promise(function (resolve, reject) {
            sequelize.sync().then(function () {
                Products.create({
                    description: newProduct.description
                })
                    .then((newProduct) => {
                        resolve(newProduct);
                    })
            })
        })
    },
    findProductById: function (id) {
        return new Promise(function (resolve, reject) {
            Products.findAll({
                where: {
                    id: id
                }
            }).then(function (data) {
                if (data.length === 0)
                    reject("no result returned");
                else
                    resolve(data[0]);
            })
        })
    },
    createLocation: function (id, newInfo) {
        return new Promise(function (resolve, reject) {
            sequelize.sync().then(function () {
                Locations.create({
                    ProductId: id,
                    dateTime: newInfo.dateTime,
                    longitude: newInfo.longitude,
                    latitude: newInfo.latitude,
                    elevation: newInfo.elevation
                })
                    .then((newInfo) => {
                        resolve(newInfo);
                    }).catch(err => {
                        reject(err);
                    })
            })
        })
    },
    getProducts: function () {
        return new Promise(function (resolve, reject) {
            sequelize.sync().then(() => {
                Products.findAll({})
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })
        })
    },
    getAllProducts: function (req) {
        return new Promise(function (resolve, reject) {
            let whereClause = {};
            if (req.query.fromDate && req.query.toDate) {
                whereClause = {
                    dateTime: {
                        $between: [req.query.fromDate, req.query.toDate]
                    }
                };
            }
            sequelize.sync().then(() => {
                Locations.findAll({
                    include: [Products],
                    where: whereClause
                })
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })
        })
    },
    getLocationsById: function (targetId) {
        return new Promise(function (resolve, reject) {
            sequelize.sync().then(() => {
                Locations.findAll({
                    where: { ProductId: targetId }
                })
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })
        })
    },
    getLocationById: function (productId, locationId) {
        return new Promise(function (resolve, reject) {
            sequelize.sync().then(() => {
                Locations.findAll({
                    where: { id: locationId }
                })
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })
        })
    },
    findByIdUpdate: function (productId, locationId, targetLocation) {
        return new Promise(function (resolve, reject) {
            sequelize.sync().then(() => {
                Locations.update({
                    ProductId: productId,
                    dateTime: targetLocation.dateTime,
                    longitude: targetLocation.longitude,
                    latitude: targetLocation.latitude,
                    elevation: targetLocation.elevation
                }, {
                        where: { id: locationId }
                    }).then(function (data) {
                        resolve(data);
                    })
            })
        })
    }
    ,
    deleteById: function (productId, locationId) {
        return new Promise(function (resolve, reject) {
            Locations.destroy({
                where: { id: locationId }
            }).then(function () {
                resolve();
            });
        })
    }
}