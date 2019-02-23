import * as GqlTypes from "../generated/gqltypes";
import * as DbTypes from "../dbTypes";
import { ApolloContext } from "gqlContext";
import mongoose from "mongoose";
import { Models } from "../models";

const { ObjectId } = mongoose.Types;

class QuestionService {
  constructor(private models: Models) {}

  public async addQuestions(
    { questions }: GqlTypes.AddQuestionsMutationArgs,
    { models }: ApolloContext
  ): Promise<void> {
    await models.question.create(questions);
  }

  public async markNotApply(
    { questionId },
    { models, user }: ApolloContext
  ): Promise<DbTypes.Question> {
    // old way
    // await User.findByIdAndUpdate(
    //   user.id,
    //   { $push: { questionsNotApply: ObjectId(questionId) } },
    //   { new: true, upsert: true }
    // );

    return (await models.question
      .findByIdAndUpdate(
        questionId,
        { $push: { notApplyToUsers: user!.id } },
        { new: true, upsert: true }
      )
      .lean()) as DbTypes.Question;

    // return Question.findById(questionId).lean();
  }

  public async getAllTags({ models }: ApolloContext): Promise<string[]> {
    const questions = (await models.question
      .find()
      .lean()) as DbTypes.Question[];
    const reducer = (allTags: string[], currentQuestion: DbTypes.Question) => {
      const questionTags = currentQuestion.tags.filter(
        t => !allTags.includes(t)
      );

      return [...allTags, ...questionTags];
    };

    const tags = questions.reduce(reducer, []);
    return tags;
  }

  // const getAnsweredQuestion = Question => async (userId, questionId, context) => {
  //   const answer = await answerController.getUserAnswer({
  //     userId,
  //     questionId,
  //     context,
  //   });
  //   const question = await Question.findById(questionId).lean();
  //   const answeredQuestion = mergeAnswerWithQuestion(answer, question);
  //   return answeredQuestion;
  // };

  public async getQuestion(
    { questionId }: { questionId: string },
    { models }: ApolloContext
  ): Promise<DbTypes.Question> {
    return (await models.question.findById(questionId))!.toObject();
  }

  public async getAnsweredQuestions(
    {
      answers,
      answeredQuestionsIds,
      tags
    }: {
      answers: DbTypes.Answer[];
      answeredQuestionsIds: string[];
      tags?: string[] | null;
    },
    { models }: ApolloContext
  ): Promise<DbTypes.AnsweredQuestion[]> {
    const query: any = { _id: { $in: answeredQuestionsIds } };

    if (tags && tags.length) {
      query.tags = { $in: tags };
    }

    const questions = (await models.question
      .find(query)
      .lean()) as DbTypes.Question[];
    // ordering is done because the $in query returns in random order
    const orderedQs = this.preserveOrder({ answeredQuestionsIds, questions });
    const mergedQuestions = this.mergeAnswersWithQuestions(answers, orderedQs);
    return mergedQuestions;
  }

  public async getUnansweredQuestions(
    {
      answeredQuestionsIds,
      tags
    }: { answeredQuestionsIds: string[]; tags?: string[] | null },
    { models, user }: ApolloContext
  ): Promise<DbTypes.Question[]> {
    const query: any = {
      _id: { $nin: answeredQuestionsIds }
    };

    if (tags && tags.length) {
      query.tags = { $in: tags };
    }

    const questions = await models.question.find(query).lean();

    return questions.filter(q => {
      if (!q.notApplyToUsers) return true;
      return !q.notApplyToUsers.includes(user!.id);
    });
  }

  public async getUserQuestions(
    answers: DbTypes.Answer[],
    answered: boolean,
    context: ApolloContext,
    tags?: string[] | null
  ): Promise<DbTypes.Question[]> {
    const answeredQuestionsIds = await this.getQuestionsIds(answers);
    let questions: DbTypes.Question[];

    if (answered) {
      questions = await this.getAnsweredQuestions(
        { answeredQuestionsIds, tags, answers },
        context
      );
    } else {
      questions = await this.getUnansweredQuestions(
        {
          answeredQuestionsIds,
          tags
        },
        context
      );
    }

    return questions;
  }

  public getQuestionsById({ ids }, context) {
    throw Error("Not implemented");
  }

  private getQuestionsIds(answers: DbTypes.Answer[]): string[] {
    return answers.map(a => a.questionId.toHexString());
  }

  private preserveOrder({
    answeredQuestionsIds,
    questions
  }: {
    answeredQuestionsIds: string[];
    questions: DbTypes.Question[];
  }): DbTypes.Question[] {
    const res = answeredQuestionsIds
      .map(id => questions.find(q => q._id.equals(id))!)
      .filter(q => q); // filters undefined or null values

    return res;
  }

  private mergeAnswerWithQuestion(
    answer: DbTypes.Answer,
    question: DbTypes.Question
  ): DbTypes.AnsweredQuestion {
    return { ...question, answer };
  }

  private mergeAnswersWithQuestions(
    answers: DbTypes.Answer[],
    questions: DbTypes.Question[]
  ): DbTypes.AnsweredQuestion[] {
    const result: DbTypes.AnsweredQuestion[] = [];
    const mergedAnswers: typeof answers = [];

    questions.forEach(question => {
      const answer = answers.find(
        a =>
          a.questionId.equals(question._id) &&
          !mergedAnswers.some(ma => ma._id.equals(a._id))
      );
      const mergedQA = this.mergeAnswerWithQuestion(answer!, question);
      mergedAnswers.push(answer!);
      result.push(mergedQA);
    });

    return result;
  }
}

export { QuestionService };
