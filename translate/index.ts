import * as CryptoJS from 'crypto-js';
import * as https from 'https';
import * as querystring from 'querystring';
const configs = require('./private.json');

const appKey = configs.appKey;
const key = configs.key;//注意：暴露appSecret，有被盗用造成损失的风险
const salt = (new Date).getTime();
const curtime = Math.round(new Date().getTime() / 1000);

const query = '你好';
// 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
const from = 'zh-CHS';
const to = 'en';
const str1 = appKey + truncate(query) + salt + curtime + key;
//console.log('---',str1);
const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

const postData = {
    q: query,
    appKey: appKey,
    salt: salt,
    from: from,
    to: to,
    sign: sign,
    signType: "v3",
    curtime: curtime,
}

const options = {
    hostname: 'openapi.youdao.com',
    port: 443,
    path: `/api?callback=hello&${querystring.stringify(postData)}`,
    method: 'POST'
}

const req = https.request(options, (res) => {

    const data = [];

    res.on('data', (chunk) => {
        data.push(chunk);
    });
    res.on('end', () => {
        console.log(Buffer.concat(data).toString());
    });


})

req.on('error', (e) => {
    console.error(e);
});


req.end();


function truncate(q) {
    var len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
}