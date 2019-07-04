const { MongoClient, ObjectID} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log("Error, unable to connect to database. " + error);
    }

    const db = client.db(databaseName);

    // FIND USER
    // db.collection('users').findOne({_id: new ObjectID('5d1be167011737457c03449b')}, (error, user)=> {
    //     if(error) {
    //         return console.log("Unable to query");
    //     }

    //     if(!user) {
    //         return console.log("No such user found");
    //     }

    //     console.log(user);
    // })

    //FIND MULTIPLE USERS
    // db.collection('users').find({age: 42}).toArray((error, users) => {
    //     console.log(users);
    // })

    //FIND A COUNT OF THE USERS
    // db.collection('users').find({age: 42}).count((error, count) => {
    //     console.log(count);
    // })


    // INSERT ONE
    // db.collection('users').insertOne({
    //     name: 'Karm',
    //     age: 'Old enough to know better'
    // }, (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert users');
    //     }

    //     console.log(result.ops);
    // })

    // INSERT MANY
    // db.collection('users').insertMany([
    //     {
    //         name: 'Bob',
    //         age: 1 
    //     },{
    //         name: 'Bob',
    //         age: 2
    //     },{
    //         name: 'Bob',
    //         age: 3
    //     }
    // ], (error, result)=>{
    //     if(error) {
    //         return console.log('Error! Unable to insert the users!')
    //     }

    //     console.log(result.ops);
    // })

    //FIND A SPECIFIC TASK BY ID
    // db.collection('tasks').findOne({_id: new ObjectID('5d1c139151900e4806f234f9')}, (error, task) => {
    //     if(error) {
    //         return console.log("Unable to query task");
    //     }

    //     if(!task) {
    //         return console.log("No such task found")
    //     }

    //     console.log(task);
    // })

    //FIND ALL OF THE UNCOMPLETED TASKS
    // db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
    //     if(error) {
    //         return console.log("Unable to query tasks");
    //     }

    //     if(tasks.length === 0) {
    //         return console.log("No tasks found for that criteria");
    //     }

    //     console.log("Uncompleted tasks:")
    //     console.log(tasks);
    // })

    //UPDATE ONE USER (NAME)
    // db.collection('users').updateOne({
    //     _id: new ObjectID('5d1be167011737457c03449b')
    // }, {
    //     $set: {
    //         name: 'Melissa'
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    //UPDATE ONE USER (AGE)
    // db.collection('users').updateOne({
    //     _id: new ObjectID('5d1be167011737457c03449b')
    // }, {
    //     $inc: {
    //         age: -1
    //     }
    // }).then((result) => {
    //     console.log(`${result.modifiedCount} record(s) have been modified`);
    // }).catch((error) => {
    //     console.log("Error: " + error);
    // })

    //UPDATE MANY TASKS (COMPLETED)
    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(`${result.modifiedCount} record(s) have been modified`);
    // }).catch((error) => {
    //     console.log("Error: " + error);
    // })

    //DELETE ONE USER
    // db.collection('users').deleteOne({
    //     name: 'Bob'
    // }).then((result) => {
    //     console.log(`${result.deletedCount} records have been deleted`);
    // }).catch((error) => {
    //     console.log(error);
    // })

    //DELETE ANY USER OLD ENOUGH TO KNOW BETTER
    db.collection('users').deleteMany({
        name: "Bob"
    }).then((result) => {
        console.log(`${result.deletedCount} records have been deleted`);
    }).catch((error) => {
        console.log(error);
    })

});