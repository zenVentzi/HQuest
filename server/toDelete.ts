import {
  Document,
  Model,
  Types as GooseTypes,
  DocumentToObjectOptions
} from "mongoose";

export type ObjectId = GooseTypes.ObjectId;

export enum MyEnum {
  Bla = "bla"
}

// export interface User<FollowT extends User | ObjectId = ObjectId> {
//   avatarSrc: string;
//   followers?: FollowT;
// }
