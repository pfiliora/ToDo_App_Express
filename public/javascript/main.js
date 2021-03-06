(function() { // protect the lemmings

    function GET(url) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', url);
            request.onload = () => {
                const data = JSON.parse(request.responseText);
                resolve(data)
            };
            request.onerror = (err) => {
                reject(err)
            };
            request.send();
        });
    } // GET

    function POST(url, data) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('POST', url);
            request.setRequestHeader('Content-Type', 'application/json');

            request.onload = () => {
                const data = JSON.parse(request.responseText);
                resolve(data)
            };
            request.onerror = (err) => {
                reject(err)
            };

            request.send(JSON.stringify(data));
        });
    } // POST

    function PUT(url, data) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('PUT', url);
            request.setRequestHeader('Content-Type', 'application/json');

            request.onload = () => {
                const data = JSON.parse(request.responseText);
                resolve(data)
            };
            request.onerror = (err) => {
                reject(err)
            };

            request.send(JSON.stringify(data));
        });
    } // PUT

    function DELETE(url, data = {}) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('DELETE', url);
            request.setRequestHeader('Content-Type', 'application/json');

            request.onload = () => {
                const data = JSON.parse(request.responseText);
                resolve(data)
            };
            request.onerror = (err) => {
                reject(err)
            };

            request.send(JSON.stringify(data));
        });
    } // DELETE

//Render todo items from lowDB with checkbox toggle and remove icone
    function render(todoItems) {
        const container = document.querySelector('.js-todolist');
        container.innerHTML = '';
        for (const todoItem of todoItems) {
            const li = document.createElement('li');
            li.innerHTML = `
<input type="text" class="todoinput" value="${todoItem.data.todo}">
			`;
            li.innerHTML += `<i class="fa fa-trash-o todolist-icon trash-icon js-todo-remove"></i>`
            if (todoItem.data.isDone) {
                li.innerHTML += `<span class="glyphicon glyphicon-check check-icon todolist-icon js-todo-check"></span>`
                li.className += `todolist-item-done`
            } else {
                li.innerHTML += `<span class="glyphicon glyphicon-unchecked check-icon todolist-icon js-todo-check"></span>`
            }
            li.classList.add('list-group-item', 'todolist-item');
            container.appendChild(li);
            // Remove Todo item on click
            li.querySelector('.js-todo-remove').addEventListener('click', (e) => {
                const { id } = todoItem;
                DELETE('/api/todo/' + id)
                    .then((data) => {
                        render(data);
                    })
                    .catch((e) => {
                        alert(e)
                    });
            });
            // Update text & isDone, via PUT Request, on enter
            const changeInput= li.querySelector('.todoinput')
            changeInput.addEventListener('keydown', (e) => {
                const {
                    keyCode,
                    which
                } = e;

                if (keyCode === 13 || which === 13) {
                    console.log('updater');
                    const update = changeInput.value
                    PUT('/api/todo/' + todoItem.id, {
                            todo: e.target.value,
                            isDone: false,
                        })
                        .then((data) => {
                            render(data);
                        })
                        .catch((e) => {
                            alert(e)
                        })
                }
            });
            //Update isDone boolean for Todo item
            li.querySelector('.js-todo-check').addEventListener('click', (e) => {
                let isDone;
                if (todoItem.data.isDone) {
                    isDone = false;
                } else {
                    isDone = true;
                }

                PUT('/api/todo/' + todoItem.id, {
                        isDone
                    })
                    .then((data) => {
                        render(data);
                    })
                    .catch((e) => {
                        alert(e)
                    })
            })
        }
        //Placeholder message if no ToDo items exist
        if (todoItems.length === 0) {
            container.innerHTML = `
<li class="list-group-item">
No todoitems!
</li>
			`;
        }
    } // End of render on page load

    //Initializer on page load
    GET('/api/todos')
        .then((todoItems) => {
            render(todoItems);
        });

    //Add ToDo function, User & Server Side processing
    const addToDo = () => {
        const input = document.querySelector('.js-todo-text');
        input.setAttribute('disabled', 'disabled');
        POST('/api/todos', {
            todo: input.value,
            when: new Date().getTime() + 9 * 60 * 60 * 1000
        }).then((data) => {
            input.removeAttribute('disabled');
            input.value = '';
            render(data);
        });
    }

    //Event listener for adding a new ToDo item
    document.querySelector('.js-add-todo').addEventListener('click', (e) => addToDo())
    document.querySelector('.js-todo-text').addEventListener('keydown', (e) => {
        const {
            keyCode,
            which
        } = e;
        if (keyCode === 13 || which === 13) {
            addToDo();
        }
    });

    //Event listener for Clear All Complete Tasks
    document.querySelector('.js-clear-completed').addEventListener('click', (e) => {
        console.log('clear completed')
        DELETE('/api/todos/completed')
          .then((data) => {
            render(data)
          })
          .catch((e) => {
            alert(e)
          })
    });

})();
