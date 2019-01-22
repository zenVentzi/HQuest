require("dotenv").config();
import mongoose from "mongoose";

import { UserModel } from "../models/user";

const mLabURI = `mongodb://zenVentzi:${
  process.env.MLAB_PASS
}@ds149732.mlab.com:49732/hquest`;

mongoose.connect(
  mLabURI
  // { useNewUrlParser: true, dbName: "test",  }
);

// function to<T>(
//   promise: mongoose.DocumentQuery<T,Types.User>,
//   // promise: mongoose.DocumentQuery<T,Types.User>,
//   errorExt?: object
// ): Promise<[any | null, T | undefined]> {
//   return promise
//     .then<[null, T]>((data: T) => [null, data])
//     .catch<[any, undefined]>((err: any) => {
//       if (errorExt) {
//         Object.assign(err, errorExt);
//       }

//       return [err, undefined];
//     });
// }

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log(`open`);
  // const user = await UserModel.findById("");
  const user = await UserModel.findById("5c08b7766f91b01640e54921");

  if (user) {
    user.firstName = "Test1";
    await user.save();
    console.log(user.firstName);
  }
  debugger;
});
