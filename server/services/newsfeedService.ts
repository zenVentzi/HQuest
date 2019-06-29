import { Types as GooseTypes } from "mongoose";
import * as DbTypes from "../dbTypes";
import { Models } from "../models";
import { Services } from "./index";

const { ObjectId } = GooseTypes;

class NewsfeedService {
  constructor(private models: Models) {}

  public async onLikeEdition(
    answer: DbTypes.Answer,
    editionId: string,
    performerId: string
  ) {
    const news: DbTypes.EditionLikeNews = {
      _id: ObjectId(),
      type: DbTypes.NewsType.EditionLike,
      performerId,
      answerOwnerId: answer.userId.toString(),
      answerId: answer._id.toString(),
      editionId
    };

    if (!(await this.checkLikedBefore(news))) {
      await this.models.newsfeed.create(news);
    }
  }

  public async onLikeComment(
    answer: DbTypes.Answer,
    editionId: string,
    commentId: string,
    performerId: string
  ) {
    const news: DbTypes.CommentLikeNews = {
      _id: ObjectId(),
      type: DbTypes.NewsType.CommentLike,
      performerId,
      answerOwnerId: answer.userId.toString(),
      answerId: answer._id.toString(),
      editionId,
      commentId
    };

    if (!(await this.checkLikedBefore(news))) {
      await this.models.newsfeed.create(news);
    }
  }

  public async onFollowUser(
    followedUserId: string,
    performerId: string
  ): Promise<void> {
    const news: DbTypes.NewFollowerNews = {
      _id: ObjectId(),
      type: DbTypes.NewsType.NewFollower,
      performerId,
      followedUserId
    };

    await this.models.newsfeed.create(news);
  }

  public async onNewComment(
    answer: DbTypes.Answer,
    editionId: string,
    commentId: string,
    performerId: string
  ): Promise<void> {
    const news: DbTypes.NewCommentNews = {
      _id: ObjectId(),
      type: DbTypes.NewsType.NewComment,
      performerId,
      answerOwnerId: answer.userId.toString(),
      answerId: answer._id.toString(),
      editionId,
      commentId
    };

    await this.models.newsfeed.create(news);
  }

  // public async onNewAnswer(
  //   answerId: string,
  //   performerId: string
  // ): Promise<void> {
  //   await this.onAnswerChange(
  //     DbTypes.NewsType.NewAnswer,
  //     answerId,
  //     performerId
  //   );
  // }

  public async onNewAnswerEdition(
    answerId: string,
    performerId: string
  ): Promise<void> {
    await this.onAnswerChange(
      DbTypes.NewsType.NewAnswerEdition,
      answerId,
      performerId
    );
  }

  public async onDeleteAccount(userId: string): Promise<void> {
    await this.models.newsfeed.deleteMany({ performerId: userId });
  }

  public getAnswerIdFromNews(news: DbTypes.News): string | null {
    if (news.type === DbTypes.NewsType.NewFollower) return null;
    return news.answerId;
  }

  public async getNewsFeedQuestions(
    newsfeed: DbTypes.Newsfeed,
    answerService: Services["answer"]
  ): Promise<DbTypes.AnsweredQuestion[] | null> {
    const answerIds: string[] = [];
    newsfeed.forEach(news => {
      const answerId = this.getAnswerIdFromNews(news);
      if (answerId && !answerIds.includes(answerId)) {
        answerIds.push(answerId);
      }
    });

    if (!answerIds || !answerIds.length) return null;

    const answers = await answerService.getAnswersById({ answerIds });

    if (!answers.length) {
      throw Error(`couldn't find answers in the database`);
    }

    const questionsIds = answers.map(a => a.questionId);
    const questions = (await this.models.question.find({
      _id: { $in: questionsIds }
    })).map(questionDoc => questionDoc.toObject());

    if (!questions.length) {
      throw Error(`couldn't find questions in the database`);
    }

    const answeredQuestions: DbTypes.AnsweredQuestion[] = answers.map(a => {
      const question = questions.find(q => q._id.equals(a.questionId));
      if (!question) {
        throw Error(`couldn't find question with id: ${a.questionId}`);
      }
      return { ...question, answer: a };
    });

    return answeredQuestions;
  }

  public async getNewsFeedUsers(
    newsfeed: DbTypes.Newsfeed
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

    const newsfeedUsers = (await this.models.user.find({
      _id: { $in: newsfeedUsersIds }
    })).map(userDoc => userDoc.toObject());

    return newsfeedUsers;
  }

  public async getNewsfeed(userId: string): Promise<DbTypes.Newsfeed> {
    const { following } = (await this.models.user.findById(userId))!.toObject();
    const followingIds: string[] = [];

    if (following) {
      following.forEach(userr => {
        followingIds.push(userr.toHexString());
      });
    }

    const newsfeed = (await this.models.newsfeed
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
    type: DbTypes.NewsType.NewAnswerEdition,
    answerId: string,
    performerId: string
  ): Promise<void> {
    const news: DbTypes.NewAnswerEditionNews = {
      _id: ObjectId(),
      type,
      performerId,
      answerOwnerId: performerId, // double check if that is true
      answerId
    };

    await this.models.newsfeed.create(news);
  }

  private async checkLikedBefore(
    news: DbTypes.CommentLikeNews | DbTypes.EditionLikeNews
  ) {
    if (DbTypes.isCommentLikeNews(news)) {
      const existingNews = await this.models.newsfeed.findOne({
        commentId: news.commentId,
        type: DbTypes.NewsType.CommentLike
      });

      return !!existingNews;
    } else {
      const existingNews = await this.models.newsfeed.findOne({
        editionId: news.editionId,
        type: DbTypes.NewsType.EditionLike
      });

      return !!existingNews;
    }
  }
}

export { NewsfeedService };
