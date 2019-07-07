import mongoose from "mongoose";
import * as DbTypes from "./dbTypes";
import { UserModel } from "./models/user";

// mongoose.set("runValidators", true);

const { ObjectId } = mongoose.Types;

process.env = { JWT_SECRET: "test" };

const tempUser: DbTypes.User = {
  _id: ObjectId(),
  email: "fdf",
  firstName: "Pesho",
  surName: "Goeshev",
  intro: "blaIntro",
  avatarSrc: "test",
  role: DbTypes.UserRoles.Admin,
  experience: 0
};

beforeAll(async done => {
  const dbName = Math.floor(Math.random() * 99999999999);
  const url = `mongodb://localhost/${dbName}`;

  mongoose.connect(
    url,
    { useNewUrlParser: true }
    // { useNewUrlParser: true, dbName: "test",  }
  );

  mongoose.connection.once("open", async () => {
    // console.log(`open`);
    done();
  });
});

afterAll(async done => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  done();
});

beforeEach(async done => {
  await mongoose.connection.dropDatabase();
  done();
});

describe("mongoose should clear models between tests", () => {
  test("save user to db", async done => {
    await new UserModel(tempUser).save();
    done();
  });

  test("read user from db should be null", async done => {
    const existingUser = await UserModel.findById(tempUser._id);
    expect(existingUser).toBeFalsy();
    done();
  });
});
