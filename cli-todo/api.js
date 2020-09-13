const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.env.HOME || process.env.USERPROFILE, '.todo');
const api = {
    read() {
        return new Promise(function (resolve, reject) {
            // todo 为什么 a 不可以
            fs.readFile(dbPath, { flag: 'a+' }, function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(JSON.parse(data.toString()));
            })
        })
    },
    write(todoList) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(dbPath, JSON.stringify(todoList,'', 4), 'utf8', function (err) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(todoList);
            })
        })
    },
    add(todoName, todoList) {
      const newTodoList = [
        ...todoList,
        { name: todoName, done: false },
      ]
      return api.write(newTodoList)
    },
    show(todoList) {
      todoList.forEach(e => {
          const text = api.todoUI(e);
          console.log(text);
      })
    },
    clear() {
        api.write([]);
    },
    todoUI(todo) {
        const status = todo.done ? '[√]' : '[ ]';
        return `${status} ${todo.name}`;
    },

}

module.exports = api