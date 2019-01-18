"use strict";
const createBaseRes = cbArr => {
    const res = async (parent, args, context, info) => {
        // const promises = cbArr.map(async cb => {
        //   return cb(parent, args, context, info);
        // });
        let returnVal;
        cbArr.forEach(async (cb) => {
            returnVal = await cb(parent, args, context, info);
        });
        return returnVal;
        // const results = await Promise.all(promises);
        // return results[results.length - 1];
    };
    res.createResolver = cb => {
        cbArr.push(cb);
        return createBaseRes(cbArr);
    };
    return res;
};
const createResolver = cb => {
    // const res: Resolver<any, any> = async (parent, args, context, info) => {
    //   return cb(parent, args, context, info);
    // };
    const cbArr = [cb];
    return createBaseRes(cbArr);
};
const wait = ms => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};
const res1 = createResolver(async (root, args, context, info) => {
    // console.log("first open");
    // await wait(2000);
    // throw new Error();
    // console.log("first close");
    // return 5;
});
const res2 = res1.createResolver(async (root, args, context, info) => {
    console.log("2nd open");
    console.log("2nd close");
    // await wait(2000);
    return "";
});
res2(null, {}, 5, null);
// res2(null, {}, 5, null).then(console.log);
//below code is duplicate
// interface Context {}
// type Callback<TArgs, TRes> = (
//   parent: any,
//   args: TArgs,
//   context: Context,
//   info: any
// ) => Promise<TRes>;
// interface Resolver<TArgs, TRes> {
//   (parent: any, args: TArgs, context: Context, info: any): Promise<TRes>;
//   createResolver: ResolverCreator;
// }
// type BaseResolverCreator = <TArgs, TRes>(
//   cb: Callback<any, any>[]
// ) => Resolver<TArgs, TRes>;
// type ResolverCreator = <TArgs, TRes>(
//   cb: Callback<TArgs, TRes>
// ) => Resolver<TArgs, TRes>;
// const createBaseRes: BaseResolverCreator = cbArr => {
//   const res: Resolver<any, any> = async (parent, args, context, info) => {
//     // const promises = cbArr.map(async cb => {
//     //   return cb(parent, args, context, info);
//     // });
//     let returnVal;
//     cbArr.forEach(async cb => {
//       returnVal = await cb(parent, args, context, info);
//     });
//     return returnVal;
//     // const results = await Promise.all(promises);
//     // return results[results.length - 1];
//   };
//   res.createResolver = cb => {
//     cbArr.push(cb);
//     return createBaseRes(cbArr);
//   };
//   return res;
// };
// const createResolver: ResolverCreator = cb => {
//   // const res: Resolver<any, any> = async (parent, args, context, info) => {
//   //   return cb(parent, args, context, info);
//   // };
//   const cbArr = [cb];
//   return createBaseRes(cbArr);
// };
// const wait: (ms: number) => Promise<void> = ms => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve();
//     }, ms);
//   });
// };
// interface Argss {
//   re1?: number;
// }
// const res1 = createResolver(async (root, args, context, info) => {
//   // console.log("first open");
//   // await wait(2000);
//   // throw new Error();
//   // console.log("first close");
//   // return 5;
// });
// const res2 = res1.createResolver<Argss, string>(
//   async (root, args, context, info) => {
//     console.log("2nd open");
//     console.log("2nd close");
//     // await wait(2000);
//     return "";
//   }
// );
// res2(null, {}, 5, null);
// // res2(null, {}, 5, null).then(console.log);
//# sourceMappingURL=test.js.map