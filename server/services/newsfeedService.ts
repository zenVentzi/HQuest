import { ApolloContext } from "gqlContext";
import { Types as GooseTypes } from "mongoose";
import * as DbTypes from "../dbTypes";
import { Models } from "../models";

const { ObjectId } = GooseTypes;

class NewsfeedService {
  constructor(private models: Models) {}

  public async onLikeAnswer(
    answer: DbTypes.Answer,
    performerId: string,
    context: ApolloContext
  ) {
    const news: DbTypes.NewLikeNews = {
      _id: ObjectId(),
      type: DbTypes.NewsType.NewLike,
      performerId,
      answerOwnerId: answer.userId.toString(),
      answerId: answer._id.toString()
    };

    if (!(await this.checkLikedBefore(news, context))) {
      await context.models.newsfeed.create(news);
    }
  }

  public async onFollowUser(
    followedUserId: string,
    performerId: string,
    context: ApolloContext
  ): Promise<void> {
    const news: DbTypes.NewFollowerNews = {
      _id: ObjectId(),
      type: DbTypes.NewsType.NewFollower,
      performerId,
      followedUserId
    };

    await context.models.newsfeed.create(news);
  }

  public async onNewComment(
    answer: DbTypes.Answer,
    commentId: string,
    performerId: string,
    context: ApolloContext
  ): Promise<void> {
    const news: DbTypes.CommentNews = {
      _id: ObjectId(),
      type: DbTypes.NewsType.NewComment,
      performerId,
      answerOwnerId: answer.userId.toString(),
      answerId: answer._id.toString(),
      commentId
    };

    await context.models.newsfeed.create(news);
  }

  public async onNewAnswer(
    answerId: string,
    performerId: string,
    context: ApolloContext
  ): Promise<void> {
    await this.onAnswerChange(
      DbTypes.NewsType.NewAnswer,
      answerId,
      performerId,
      context
    );
  }

  public async onEditAnswer(
    answerId: string,
    performerId: string,
    context: ApolloContext
  ): Promise<void> {
    await this.onAnswerChange(
      DbTypes.NewsType.NewAnswerEdition,
      answerId,
      performerId,
      context
    );
  }

  public getAnswerIdFromNews(news: DbTypes.News): string | null {
    if (news.type === DbTypes.NewsType.NewFollower) return null;
    return news.answerId;
  }

  public async getNewsFeedQuestions(
    newsfeed: DbTypes.Newsfeed,
    { models }: ApolloContext
  ): Promise<DbTypes.AnsweredQuestion[] | null> {
    const answerIds: string[] = [];
    newsfeed.forEach(news => {
      const answerId = this.getAnswerIdFromNews(news);
      if (answerId && !answerIds.includes(answerId)) {
        answerIds.push(answerId);
      }
    });

    if (!answerIds) return null;

    const answers = (await models.answer.find({ _id: { $in: answerIds } })).map(
      answerDoc => answerDoc.toObject()
    );

    if (!answers.length) {
      throw Error(`couldn't find answers in the database`);
    }

    const questionsIds = answers.map(a => a.questionId);
    const questions = (await models.question.find({
      _id: { $in: questionsIds }
    })).map(questionDoc => questionDoc.toObject());

    if (!questions.length) {
      throw Error(`couldn't find questions in the database`);
    }

    const answeredQuestions: DbTypes.AnsweredQuestion[] = answers.map(a => {
      const question = questions.find(q => q._id.equals(a.questionId));
      return { ...question!, answer: a };
    });

    return answeredQuestions;
  }

  public async getNewsFeedUsers(
    newsfeed: DbTypes.Newsfeed,
    { models }: ApolloContext
  ): Promise<DbTypes.User[]> {
    const newsfeedUsersIds: string[] = [];

    newsfeed.forEach(news => {
      const newsUsers = this.getUsersFromNews(news);
      newsUsers.forEach(userId => {
        if (!newsfeedUsersIds.includes(userId)) {
          newsfeedUsersIds.push(userId);
        }
      });
    });

    const newsfeedUsers = (await models.user.find({
      _id: { $in: newsfeedUsersIds }
    })).map(userDoc => userDoc.toObject());

    return newsfeedUsers;
  }

  public async getNewsfeed(context: ApolloContext): Promise<DbTypes.Newsfeed> {
    const { models, user } = context;
    const { following } = (await models.user.findById(user!.id))!.toObject();
    const followingIds: string[] = [];

    if (following) {
      following.forEach(userr => {
        followingIds.push(userr.toHexString());
      });
    }

    const newsfeed = (await models.newsfeed
      .find({
        performerId: { $in: followingIds }
      })
      .lean()) as DbTypes.Newsfeed;

    return newsfeed.reverse(); // newest first
  }

  private getUsersFromNews(news: DbTypes.News): string[] {
    if (news.type === DbTypes.NewsType.NewFollower) {
      return [news.performerId, news.followedUserId];
      /* 
       double check if we need followedUserId
        */
    }

    return [news.performerId, news.answerOwnerId];
  }

  private async onAnswerChange(
    type: DbTypes.NewsType.NewAnswer | DbTypes.NewsType.NewAnswerEdition,
    answerId: string,
    performerId: string,
    context: ApolloContext
  ): Promise<void> {
    const news: DbTypes.AnswerNews = {
      _id: ObjectId(),
      type,
      performerId,
      answerOwnerId: performerId, // double check if that is true
      answerId
    };

    await context.models.newsfeed.create(news);
  }

  private async checkLikedBefore(
    news: DbTypes.News,
    { models }: ApolloContext
  ) {
    const existingNews = await models.newsfeed.findById(news._id);

    // old way
    // const existingNews = await models.newsfeed.findOne({
    //   type: news.type,
    //   performerId: news.performerId,
    //   answerId: news.answerId
    // }).lean();

    return !!existingNews;
  }
}

export { NewsfeedService };
