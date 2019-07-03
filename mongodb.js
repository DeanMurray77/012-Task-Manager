const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log("Error, unable to connect to database. " + error);
    }

    const db = client.db(databaseName);

    // db.collection('users').insertMany([
    //     {
    //         user: DelayNode,
    //         age: 42
    //     }, {
    //         user: Laynie,
    //         age: 7
    //     }
    // ], (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert users');
    //     }

    //     console.log(result.ops);
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Watch videos',
    //         completed: false
    //     },{
    //         description: 'Find a place to live',
    //         completed: false
    //     },{
    //         description: 'Ruin something',
    //         completed: true
    //     }
    // ], (error, result)=>{
    //     if(error) {
    //         return console.log('Error! Unable to insert the tasks!')
    //     }

    //     console.log(result.ops);
    // })

});