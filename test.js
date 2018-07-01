// console.log(undefined === false);

const obj = { a: 5 };

const nm = 'a';
// const a = 5;

const { [nm]: b } = obj;
console.log(b);
