# 学习笔记

## -- 参数
参数(options/argv) 一般是--如 npm install egg --save 
然后一些使用频率较高的会提供缩写（alias），那就是一个 -如 npm install egg -S ，等价于上面那句。

还有一种情况是两个 --，代表后面的参数不解析。
譬如 npm scripts 如果设置了 "start": "egg-scripts start" 
那当你执行`npm start -s -- --workers=1`时第一个 -s 是 npm 本身的参数，代表静默，后面的 workers 参数不解析，直接传递进去，相当于执行 egg-scripts start --workers=1

## 如何保持processs不退出
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

## 格式化输出json字符串
详见mdn文档

```
JSON.stringify(todoList,'', 4) // 4个空格缩进
```

## mysql数据类型
varchar(100) 动态分配长度
char(100) 固定长度

iso 8601

## 数据库 事务
所有语句都成功才会生效
start transaction;
语句1;语句2;语句3;……

## stream
readable 和 writable 的pipe 方法都只接受 writable 对象；

writableStream.write();

> 当流还未被排空时，调用 write() 会缓冲 chunk，并返回 false。 一旦所有当前缓冲的数据块都被排空了（被操作系统接收并传输），则触发 'drain' 事件。 建议一旦 write() 返回 false，则不再写入任何数据块，直到 'drain' 事件被触发。 当流还未被排空时，也是可以调用 write()，Node.js 会缓冲所有被写入的数据块，直到达到最大内存占用，这时它会无条件中止。 甚至在它中止之前， 高内存占用将会导致垃圾回收器的性能变差和 RSS 变高（即使内存不再需要，通常也不会被释放回系统）。 如果远程的另一端没有读取数据，TCP 的 socket 可能永远也不会排空，所以写入到一个不会排空的 socket 可能会导致远程可利用的漏洞。