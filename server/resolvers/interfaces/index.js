const interfaces = {
  Notification: {
    __resolveType(obj, context, info) {
      if (obj.commentId) {
        return 'NewComment';
      }

      return 'NewFollower';
    },
  },
};
