const express = require('express');
const app = express();
const PORT = process.env.PORT || 8088;
const productService = require('./public/js/ProductService');
var body_parser = require('body-parser');
var cors = require('cors');

app.use(express.static('public'));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.use(cors());

app.get('/products', function (req, res) {
    productService.getProducts()
        .then((products) => {
            res.json(products);
        })
        .catch((err) => { res.json(err) })
})

app.get('/products/:id/locations', function (req, res) {
    productService.getLocationsById(req.params.id)
        .then((products) => {
            res.json(products);
        })
        .catch((err) => { res.json(err) })
})

app.get('/products/:id/locations/:locationId', function (req, res) {
    productService.getLocationById(req.params.id, req.params.locationId)
        .then((products) => {
            res.json(products);
        })
        .catch((err) => { res.json(err) })
})

app.put('/products/:id/locations/:locationId', function (req, res) {
    productService.findByIdUpdate(req.params.id, req.params.locationId, req.body)
        .then((products) => {
            res.json(products);
        })
        .catch((err) => { res.json(err) })
})

app.delete('/products/:id/locations/:locationId', function (req, res) {
    productService.deleteById(req.params.id, req.params.locationId)
        .then((products) => {
            res.json(products);
        })
        .catch((err) => { res.json(err) })
})

app.post('/products', function (req, res) {
    productService.createProduct(req.body)
        .then((products) => {
            res.json(products);
        })
        .catch((err) => { res.json(err) })
})

app.get('/products/:id', function (req, res) {
    productService.findProductById(req.params.id)
        .then((targetProduct) => {
            res.json(targetProduct);
        })
        .catch((err) => { res.json(err) })
})

app.post('/products/:id/locations', function (req, res) {
    productService.createLocation(req.params.id, req.body)
        .then((products) => {
            res.json(products);
        })
        .catch((err) => { res.json(err) })
})

app.get('/reports', function (req, res) {
    productService.getAllProducts(req)
        .then((products) => {
            res.json(products);
        })
        .catch((err) => { res.json(err) })
})

app.post('/products', function (req, res) {
    productService.createProduct(req.body).then((newProduct) => {
        res.json(newProduct);
    })
        .catch((err) => { res.json(err) })
})


app.put('/products/:id', function (req, res) {
    productService.findByIdUpdate(req.params.id, req.body).then((data) => {
        res.json(data);
    })
        .catch((err) => { })
})

productService.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log("app is listening on " + PORT);
        });
    })
    .catch((err) => { console.log("error: " + err) });







