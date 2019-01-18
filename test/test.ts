import { ApolloContext } from "../server/types/index";
import { any } from "async";

// interface ApolloContext {}

type Callback<TArgs, TRes, TContext> = (
  parent: any,
  args: TArgs,
  context: TContext,
  info: any
) => TRes | Promise<TRes>;

interface Resolver<TArgs, TRes, TContext> {
  (parent: any, args: TArgs, context: TContext, info: any):
    | TRes
    | Promise<TRes>;
  createResolver: ResolverCreator;
}

type BaseResolverCreator = <TArgs, TRes, TContext>(
  cb: Callback<any, any, any>[]
) => Resolver<TArgs, TRes, TContext>;

type ResolverCreator = <TArgs, TRes, TContext = ApolloContext>(
  cb: Callback<TArgs, TRes, TContext>
) => Resolver<TArgs, TRes, TContext>;

const createBaseRes: BaseResolverCreator = cbArr => {
  const res: Resolver<any, any, ApolloContext> = async (
    parent,
    args,
    context,
    info
  ) => {
    // const promises = cbArr.map(async cb => {
    //   return cb(parent, args, context, info);
    // });

    let returnVal;

    cbArr.forEach(async cb => {
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

const createResolver: ResolverCreator = cb => {
  // const res: Resolver<any, any> = async (parent, args, context, info) => {
  //   return cb(parent, args, context, info);
  // };

  const cbArr = [cb];
  return createBaseRes(cbArr);
};

const wait: (ms: number) => Promise<void> = ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

interface Argss {
  re1?: number;
}

// const res1 = createResolver((root, args, context, info) => {});

const res1 = createResolver((root, args, context, info) => {});

const res2 = res1.createResolver<Argss, string>(
  async (root, args, context, info) => {
    console.log("2nd open");
    console.log("2nd close");
    // await wait(2000);
    return "";
  }
);

res2(null, {}, {}, null);
// res2(null, {}, 5, null).then(console.log);
