require("dotenv").config();
import mongoose from "mongoose";

import { UserModel } from "../models/user";

// const dbUrl = `mongodb://zenVentzi:${
//   process.env.MLAB_PASS
// }@ds149732.mlab.com:49732/hquest`;

const dbUrl = `mongodb://localhost/test`;

mongoose.connect(
  dbUrl,
  { useNewUrlParser: true }
  // { useNewUrlParser: true, dbName: "test",  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  await db.dropDatabase();
  await new UserModel({
    firstName: "a2",
    surName: "a",
    email: "a",
    intro: "Hey, I am an intro",
    avatarSrc: `/public/images/avatar.jpeg`,
    socialMediaLinks: {
      facebookLink: "",
      twitterLink: "",
      instagramLink: "",
      linkedInLink: ""
    }
  }).save();
});
