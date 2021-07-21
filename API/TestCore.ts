var E = /^\[(.*?)\]$/g;
var S = "[A[BC]]"
E.exec(S);
console.log(RegExp.$1);
console.log(RegExp.$2);