const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log("Error, unable to connect to database. " + error);
    }

    const db = client.db(databaseName);

    db.collection('users').insertMany([{
        name: 'Katie',
        age: 'Super young'
    }, {
        name: 'Sage',
        age: 9
    }, {
        name: 'Caleb',
        age: .85
    }], (error, result) => {
        if(error) {
            return console.log("Unable to insert users.");
        }

        console.log(result.ops);
    })
});