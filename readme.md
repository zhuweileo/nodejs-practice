# -- 参数
参数(options/argv) 一般是--如 npm install egg --save 
然后一些使用频率较高的会提供缩写（alias），那就是一个 -如 npm install egg -S ，等价于上面那句。

还有一种情况是两个 --，代表后面的参数不解析。
譬如 npm scripts 如果设置了 "start": "egg-scripts start" 
那当你执行`npm start -s -- --workers=1`时第一个 -s 是 npm 本身的参数，代表静默，后面的 workers 参数不解析，直接传递进去，相当于执行 egg-scripts start --workers=1

# 如何保持processs不退出
1. 设置一个非常久的setInterval
```
setInterval(() => {}, 1 << 30);
```
2. 开启一个tcp server
```
require('net').createServer().listen();
```

3. 使用标准输入
```
process.stdin.resume();
或
process.stdin.on("data", () => {});
```

# 格式化输出json字符串
详见mdn文档

```
JSON.stringify(todoList,'', 4) // 4个空格缩进
```
