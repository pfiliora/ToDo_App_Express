//include express
const express = require('express');

// grab db
const low = require('lowdb');

// static file server
const serveStatic = require('serve-static');

// body parser middleware
const parser = require('body-parser');

//create an express application
const app = express();

// instantiate db
const db = low('./db.json');

//parses requests with the content type of `application/json`
app.use(parser.json());

//define a route on `/hello/world`
app.get('/api/todos',(request, response) => {
    response.header('Content-Type', 'application/json');
    response.send(db.get('todos').value());
});


// POST create new todos
app.post('/api/todos', (request, response) => {
	const requestBody = request.body;

	// Add a post
	db.get('todos').push({
		id: Date.now(),
		data: requestBody,
	}).write();

	response.header('Content-Type', 'application/json');
	response.send(db.get('todos').value());
});// POST create new todos


// PUT todos, update isDone and/or text
app.put('/api/todo/:id', (request, response) => {
	const dataPayload = request.body;
  const id = parseInt(request.params.id, 10);

  Object.keys(request.body).forEach((key) => {
    console.log(key, request.body[key])
    db.get('todos')
      .find({ id })
      .set('data.' + key, request.body[key])
      .write();

    console.log(db.get('todos').find({id}).value())
  })
	response.header('Content-Type', 'application/json');
	response.send(db.get('todos').value());
});

// DELETE todos
app.delete('/api/todo/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);

  db.get('todos')
    .remove({ id })
    .write()

	response.header('Content-Type', 'application/json');
	response.send(db.get('todos').value());

});// DELETE todos

//DELETE All COMPLETED todos
app.delete('/api/todos/completed', (request, response) => {
    db.get('todos')
      .remove(todo => {
          return todo.data.isDone === true
      })
      .write();

      response.header('Content-Type', 'application/json');
    	response.send(db.get('todos').value());
})//DELETE COMPLETED todos

app.use('/', serveStatic( 'public', {
	'index': [ 'index.html' ]
}));

//have the application listen on a specific port
app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
