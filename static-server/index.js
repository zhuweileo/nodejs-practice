const http = require('http');
const path = require('path');
const fs = require('fs')
const url = require('url');
const ejs = require('ejs');

const server = http.createServer();

const staticRoot = './static-server/public'
const tplRoot = path.join(path.dirname(process.argv[1]), 'tpls')

server.on('request', (req, res) => {
    const { url: reqUrl } = req;
    const urlObj = url.parse(reqUrl);
    const pathname = urlObj.pathname;
    const filePath = path.join(staticRoot, pathname);

    fs.stat(filePath, function (err, stats) {
        if (err) return;
        if (stats.isDirectory()) {
            const dirTpl = path.join(tplRoot, 'dirList.html')

            fs.readdir(filePath, { withFileTypes: true }, function (err, files) {
                const filesList = files.map(dirent => {
                    let type = 'unknown';
                    if (dirent.isDirectory()) type = 'directory';
                    if (dirent.isFile()) type = 'file';

                    return {
                        path: `${pathname}${/\/$/.test(pathname) ? '' : '/'}${dirent.name}`,
                        name: dirent.name,
                        type,
                    }
                })

                fs.readFile(dirTpl, function (err, data) {
                    const renderStr = ejs.render(data.toString(), { list: filesList })
                    res.end(renderStr)
                })


            })
            return;
        }
        if (stats.isFile()) {
            fs.readFile(filePath, function (err, data) {
                if (err) return;
                res.end(data)
            })
            return
        }
        res.end('404!')
    })


});

server.listen(8000);