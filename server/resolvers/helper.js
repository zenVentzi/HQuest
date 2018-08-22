function gqlUser(context, dbUser) {
  return {
    id: dbUser._id.toString(),
    email: dbUser.email,
    fullName: `${dbUser.firstName} ${dbUser.surName}`,
    intro: dbUser.intro,
    avatarSrc: dbUser.avatarSrc,
    me: context.user.id === dbUser._id.toString(),
  };
}

function gqlComment(context, dbUser, dbComment) {
  const usr = gqlUser(context, dbUser);
  return {
    id: dbComment._id.toString(),
    user: usr,
    comment: dbComment.comment,
  };
}

module.exports = { gqlComment, gqlUser };
