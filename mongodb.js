const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log("Error, unable to connect to database. " + error);
    }

    const db = client.db(databaseName);

    db.collection('users').insertOne({
        name: 'Dean',
        age: 42
    }, (error, result) => {
        if(error) {
            return console.log("Unable to insert user.");
        }

        console.log(result.ops);
    })
});