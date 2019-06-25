import { User } from "../autoGenTypes";
import { User as DbUser } from "../../dbTypes";

function mapUser(
  dbUser: DbUser,
  loggedUserId: string,
  isFromLogin?: boolean
): User {
  let me = false;

  if (isFromLogin) {
    me = true;
  } else if (loggedUserId) {
    me = loggedUserId === dbUser._id.toString();
  }

  let followers;
  let following;

  if (dbUser.followers && dbUser.followers.length) {
    followers = dbUser.followers.map(followerId => followerId.toString());
  }
  if (dbUser.following && dbUser.following.length) {
    following = dbUser.following.map(followingUserId =>
      followingUserId.toString()
    );
  }

  const gqlUser: User = {
    id: dbUser._id.toString(),
    email: dbUser.email,
    fullName: `${dbUser.firstName} ${dbUser.surName}`,
    intro: dbUser.intro,
    socialMediaLinks: dbUser.socialMediaLinks,
    avatarSrc: dbUser.avatarSrc || "",
    me,
    followers,
    following,
    experience: dbUser.experience,
    role: dbUser.role
  };

  return gqlUser;
}

function mapUsers({
  dbUsers,
  loggedUserId
}: {
  dbUsers: null;
  loggedUserId: string;
}): null;
function mapUsers({
  dbUsers,
  loggedUserId
}: {
  dbUsers: DbUser[];
  loggedUserId: string;
}): User[];
function mapUsers({
  dbUsers,
  loggedUserId
}: {
  dbUsers: DbUser[] | null;
  loggedUserId: string;
}): User[] | null;
function mapUsers({
  dbUsers,
  loggedUserId
}: {
  dbUsers: DbUser[] | null;
  loggedUserId: string;
}): User[] | null {
  if (!dbUsers || !dbUsers.length) return null;
  return dbUsers.map(dbUser => mapUser(dbUser, loggedUserId));
}

export { mapUser, mapUsers };

// const gqlMapper = {
//   getUser,
//   getUsers
// };

// export { gqlMapper };
