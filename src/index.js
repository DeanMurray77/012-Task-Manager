const app = require('./app');

const port = process.env.PORT;

app.get('', (req, res) => {
    let message = "";
    message += "<html>";
    message += "<p><b>Create New User:</b><br>POST to <b>/users</b><br>Accepts <b>name</b>, <b>email</b>, <b>age</b> and <b>password</b> in the request body<br><b>Age</b> isn't required</p>";
    message += "<p><b>Authenticate User:</b><br>POST to <b>/users/login</b><br>Accepts <b>email</b> and <b>password</b> in the request body<br>Both are required</p>";
    message += "<p><b>Log Out User:</b><br>POST to <b>/users/logout</b><br>Requires a valid bearer token</p>";
    message += "<p><b>Get User Profile:</b><br>GET to <b>/users/me</b><br>Requires a valid bearer token</p>";
    message += "<p><b>Update User Profile:</b><br>PATCH to <b>/users/me</b><br>Requires a valid bearer token<br>Allows update of any combination of <b>name</b>, <b>email</b>, <b>password</b>, or <b>age</b> by passing as parameters in the request body</p>";
    message += "<p><b>Delete User Profile:</b><br>DELETE to <b>/users/me</b><br>Requires a valid bearer token</p>";
    message += "<p><b>Upload User Avatar:</b><br>POST to <b>/users/me/avatar</b><br>Requires a valid bearer token<br>Include a .jpg, .jpeg or .png under the <b>avatar</b> key in the body</p>";
    message += "<p><b>Delete User Avatar:</b><br>DELETE to <b>/users/me/avatar</b><br>Requires a valid bearer token</p>";
    message += "<p><b>Get User Avatar:</b><br>GET to <b>/users/:id/avatar</b><br>Requires the user's id passed in the url in place of :id</p>";
    message += "<p><b>Create New Task:</b><br>POST to <b>/tasks</b><br>Requires a valid bearer token<br>Requires <b>description</b> in the request body<br>Also accepts <b>completed</b></p>";
    message += "<p><b>Get a List of User's Task:</b><br>GET to <b>/tasks</b><br>Requires a valid bearer token</p>";
    message += "<p><b>Get a Single Task:</b><br>GET to <b>/tasks/:id</b><br>Requires a valid bearer token<br>Requires the task id to be passed in the url in place of :id</p>";
    message += "<p><b>Update a Task:</b><br>PATCH to <b>/tasks/:id</b><br>Requires a valid bearer token<br>Requires the task id to be passed in the url in place of :id<br>Accepts <b>description</b> or <b>completed</b> for update in the request body</p>";
    message += "<p><b>Delete a Task:</b><br>DELETE to <b>/tasks/:id</b><br>Requires a valid bearer token<br>Requires the task id to be passed in the url in place of :id</p>";
    message += "</htm/>";
    res.send(message);
})

app.listen(port, () => {
    console.log("Server is up on port " + port);
})