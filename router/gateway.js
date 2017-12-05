module.exports = function (app) {
    let utils = require("../private_modules/utils");
    let APIService = require("../data/API.service")();

    // retrieves all saved APIs configuration
    app.get('/', function (req, res) {
        APIService.getAll().then(function (obj) {
            res.json(obj);
        });

    });

    // interceptor of all the get request 
    // respond with the corresponding API id if found
    // 'id not found' otherwise
    app.get('/*', function (req, res) {
        
        let id = utils.trimWith(req.path, "/"); //remove the '/' from the beginning or the end of the string


        APIService.getById(id).then(function (obj) {
            res.json(obj);
        }).catch( function(reason) {
            res.status(400).send(reason);
        });
    });

    // defalut error message for empty post request
    app.post('/', function (req, res) {
        res.status(400).send('id required');
    });

    // interceptor of all the post request 
    // respond with inserted API if API is added
    // 'id not unique' or 'Insertion failed' otherwise
    app.post('/*', function (req, res) {

        let id = utils.trimWith(req.path, "/"); //remove the '/' from the beginning or the end of the string

        let newApi = req.body;
        newApi.id = id;

        APIService.add(newApi).then(function (obj) {
            res.send(obj);
        }).catch(
            function(reason) {
                res.status(400).send(reason);
            });

    });

    // defalut error message for empty put request
    app.put('/', function (req, res) {
        res.status(400).send('id required');
    });

    // interceptor of all the put request 
    // respond with updated API if API is updated
    // 'id not found' or 'Update failed' otherwise
    app.put('/*', function (req, res) {

        let id = utils.trimWith(req.path, "/"); //remove the '/' from the beginning or the end of the string


        let newApi = req.body;
        newApi.id = id;

        APIService.update(newApi).then(function (obj) {
            res.send(obj);
        }).catch(
            function(reason) {
                res.status(400).send(reason);
            });
    });
    
    // defalut error message for empty delete request
    app.delete('/', function (req, res) {
        res.status(400).send('id required');
    });

    // interceptor of all the delete request 
    // respond with removed API if API is removed
    // 'id not found' or 'remove failed' otherwise
    app.delete('/*', function (req, res) {

        let id = utils.trimWith(req.path, "/"); //remove the '/' from the beginning or the end of the string

        APIService.remove(id).then(function (obj) {
            res.json(obj);
        }).catch( function(reason) {
            res.status(400).send(reason);
        });
    });
};