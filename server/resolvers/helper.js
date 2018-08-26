function gqlUser(context, dbUser) {
  let me = false;

  if (context.user) {
    me = context.user.id === dbUser._id.toString();
  }

  const res = {
    id: dbUser._id.toString(),
    email: dbUser.email,
    fullName: `${dbUser.firstName} ${dbUser.surName}`,
    intro: dbUser.intro,
    avatarSrc: dbUser.avatarSrc,
    me,
    followers: dbUser.followers || [],
    following: dbUser.following || [],
  };

  return res;
}

function gqlNotifications(dbNotifs) {
  const res = dbNotifs.map(notif => ({
    id: notif._id.toString(),
    performerId: notif.performerId,
    performerAvatarSrc: notif.performerAvatarSrc,
    text: notif.text,
    seen: notif.seen,
    createdOn: notif._id.getTimestamp(),
  }));

  return res;
}

function gqlNotfication(dbNotif) {
  return {
    id: dbNotif._id.toString(),
    performerId: dbNotif.performerId,
    performerAvatarSrc: dbNotif.performerAvatarSrc,
    text: dbNotif.text,
    seen: dbNotif.seen,
    createdOn: dbNotif._id.getTimestamp(),
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

module.exports = { gqlComment, gqlUser, gqlNotfication, gqlNotifications };
