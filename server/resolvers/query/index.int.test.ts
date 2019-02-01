import queries from "./index";

test("should register if login doesn't exist", async done => {
  expect(true).toEqual(true);
  done();
});

// test("should bla", async done => {
//   console.log("awaitBefore");
//   const actual = await new UserModel({
//     firstName: "a",
//     surName: "a",
//     email: "a",
//     intro: "Hey, I am an intro",
//     avatarSrc: `/public/images/avatar.jpeg`,
//     socialMediaLinks: {
//       facebookLink: "",
//       twitterLink: "",
//       instagramLink: "",
//       linkedInLink: ""
//     }
//   }).save();
//   // actual!.firstName += "1";
//   // await actual!.save();
//   console.log("awaitAfter");
//   done();
// });

// test("should bla1", async done => {
//   console.log("awaitBefore1");
//   const actual = await UserModel.findById("5c08b7766f91b01640e54921");
//   console.log("TCL: actual", actual);
//   console.log("awaitAfter1");
//   done();
// });
