let loki = require('lokijs');
let config = require('config');

// db path related to the env variable 
let dbPath = './db/'+config.DBPath;

// db configuration
let dbOption =  {   
                    autoloadCallback : OnDatabaseInitialized,
                    autoload: true,
                    autosave: true, 
                    autosaveInterval: 4000// save every four seconds
                };

// start db
let db = new loki(dbPath, dbOption );
let APIsCollection =[];

function OnDatabaseInitialized(){
    // check if the collection alrady exists otherwise creates a new one
    APIsCollection = db.getCollection("APIs");    

    if (APIsCollection === null) {
        APIsCollection = db.addCollection("APIs");
    }
}
module.exports = function () {
    
    // utility function to remove the metadata from the object
    function removeMeta ( obj ){
        return {
            id : obj.id,
            value : obj.value,
            name : obj.name
        };
    }

    return {
        getAll: function () {
            return new Promise(function (fulfill, reject) {
                
                let values = APIsCollection.data.map(removeMeta);

                return fulfill( values );
                    
            });
        },

        getById: function (id) {
            return new Promise(function (fulfill, reject) {

                let API = APIsCollection.findOne({id: id });
                
                if ( !API ) 
                   return reject("id not found");
                
                return fulfill( removeMeta( API ) ) ;
            });
        },


        add: function (API) {
            return new Promise(function (fulfill, reject) {
                               
                if ( APIsCollection.findOne({id: API.id }) ) 
                   return reject("id already taken");

                let newAPI = APIsCollection.insert(API);
                
                if ( !newAPI ) 
                    return reject("Insertion failed");
                
                return fulfill( removeMeta( newAPI ) ) ;            
            });
        },

        update : function (newAPI) {
            return new Promise(function (fulfill, reject) {
                
                var oldAPI =APIsCollection.findOne({id: newAPI.id } );

                if ( ! oldAPI ) 
                   return reject("id not found");

                oldAPI.id          = newAPI.id;
                oldAPI.name        = newAPI.name;
                oldAPI.value       = newAPI.value;
                
                var updatedAPI = APIsCollection.update(oldAPI);

                if ( !updatedAPI ) 
                    return reject("Update failed");
                
                return fulfill( removeMeta( updatedAPI ) ) ;
            });
        },
        removeAll : function (){
            return new Promise(function (fulfill, reject) {               
                APIsCollection.removeDataOnly();
                return fulfill() ;
            });
        },

        remove : function (id) {
            return new Promise(function (fulfill, reject) {
               
                var APItoRemove =APIsCollection.findOne({id: id } );

                if ( ! APItoRemove ) 
                   return reject("id not found");
                
                var removedAPI = APIsCollection.remove(APItoRemove);
                
                if ( !removedAPI ) 
                    return reject("remove failed");
                
                return fulfill( removeMeta( removedAPI ) ) ;
            });
        }
    }
};