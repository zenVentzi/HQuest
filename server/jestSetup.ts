import mongoose from "mongoose";

process.env = { JWT_SECRET: "test" };

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

// beforeEach(async done => {
//   done();
// });
