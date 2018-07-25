// const a = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('reverance/sacredness/now/only');
//   }, 2000);
// });

const sacredFn = async () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('reverance/sacredness/now/only');
    }, 2000);
  }).then(res => console.log(res));

console.log(sacredFn());
