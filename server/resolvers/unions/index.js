const unions = {
  News: {
    __resolveType(obj, context, info) {
      switch (obj.type) {
        case 'NEW_ANSWER':
        case 'NEW_ANSWER_EDITION':
          return 'AnswerNews';
        case 'NEW_COMMENT':
          return 'CommentNews';
        case 'NEW_LIKE':
          return 'NewLikeNews';
        case 'NEW_FOLLOWER':
          return 'NewFollowerNews';

        default:
          throw new Error(`${obj.type} is incorrect`);
      }
    },
  },
};

export default unions;
