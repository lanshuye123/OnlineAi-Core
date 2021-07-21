const icovn = require("iconv-lite");
console.log(icovn.encode("你好","utf8"));
console.log(icovn.encode("你好","gbk"));
console.log(icovn.encode("你好","utf8").toString());
console.log(icovn.encode("你好","gbk").toString());

console.log(icovn.decode(Buffer.from("你好"),"utf8"));
console.log(icovn.decode(Buffer.from("你好"),"gbk"));
console.log(icovn.decode(Buffer.from("你好"),"utf8").toString());
console.log(icovn.decode(Buffer.from("你好"),"gbk").toString());