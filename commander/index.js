const commander = require('commander');
const inquirer = require('inquirer');
const api = require('./api');
const packageJson = require('./package.json');

const { Command } = commander;
const program = new Command();
program.version(packageJson.version, '-v, --version', '输出当前版本号');

program
  .option('-d, --debug', 'output extra debugging')

if (program.debug) console.log(program.opts());

async function main() {
  const dbTodoList = await api.read().catch(e => {
    process.exit();
  }) || [];

  program
    .command('add <todo>')
    .description('添加代办')
    .action((todoName) => {
      api.add(todoName).then(todoList => {
        api.show(todoList);
      });
    })

  program
    .command('ls')
    .description('展示代办')
    .action(() => {
      api.show(dbTodoList)
    })

  program
    .command('clear')
    .description('清空')
    .action(() => {
      api.clear()
    })

  program
    .command('default', { isDefault: true })
    .description('default')
    .action(() => {
      menu(dbTodoList);
    });


  function menu(todoList) {
    const listAction = todoList.map((item, index) => {
      return {
        value: index,
        name: api.todoUI(item),
      }
    })
    inquirer.prompt({
      type: 'list',
      name: 'action',
      message: '请选择操作',
      choices: [
        {
          value: 'add',
          name: '新增',
        },
        ...listAction,
        {
          value: 'quite',
          name: '退出',
        },
      ]
    }).then(answers => {
      const { action } = answers;
      // 新增 todo
      if (action === 'add') {
        add(todoList);
        return
      }
      // 操作 todo
      if (typeof action === 'number') {
        operateTodo(action, todoList);
        return
      }
      process.exit();
    }).catch(err => {

    })
  }

  function add(todoList) {
    return inquirer
      .prompt({
        type: 'input',
        name: 'todoName',
        message: '请输入代办',
      })
      .then(async answer => {
        const { todoName } = answer;
        const newList = await api.add(todoName, todoList);
        menu(newList);
      })
      .catch(() => {

      })
  }

  function operateTodo(todoId, todoList) {
    const todo = todoList[todoId];
    inquirer
      .prompt({
        type: 'list',
        name: 'todoAction',
        message: '操作:' + todo.name,
        choices: [
          {
            value: 'delete',
            name: '删除',
          },
          {
            value: 'toggle',
            name: `标记：${todo.done ? '未完成' : '已完成'}`,
          },
          {
            value: 'modify',
            name: '修改名称',
          },
        ]
      })
      .then(async answer => {
        const { todoAction } = answer;
        if (todoAction === 'delete') {
          todoList = todoList.filter((item, index) => index !== todoId)
        };
        if (todoAction === 'toggle') {
          todoList.forEach((item, index) => {
            if (index === todoId) {
              item.done = !item.done;
            }
          })
        }
        if (todoAction === 'modify') {
          const todoName = await modify();
          todoList.forEach((item, index) => {
            if (index === todoId) {
              item.name = todoName;
            }
          })
        }
        const newList = await api.write(todoList);
        menu(newList);
      })
  }

  function modify() {
    return inquirer
      .prompt({
        type: 'input',
        name: 'todoName',
        message: '修改名称',
      })
      .then((answer) => {
        return answer.todoName;
      })
  }

  program.parse(process.argv);
}

main();
program.parse(process.argv);