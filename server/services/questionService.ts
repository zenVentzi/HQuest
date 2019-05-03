import "reflect-metadata";
// import * as GqlTypes from "../generated/gqltypes";
import * as DbTypes from "../dbTypes";
import { ApolloContext } from "gqlContext";
import mongoose from "mongoose";
import { Models } from "../models";

const { ObjectId } = mongoose.Types;

class QuestionService {
  constructor(private models: Models) {}

  public async addQuestions(
    questions: Array<{
      value: string;
      tags: string[];
    }>
  ): Promise<void> {
    await this.models.question.create(questions);
  }

  public async markNotApply(
    questionId: string,
    userId: string
  ): Promise<DbTypes.UnansweredQuestion> {
    // old way
    // await User.findByIdAndUpdate(
    //   user.id,
    //   { $push: { questionsNotApply: ObjectId(questionId) } },
    //   { new: true, upsert: true }
    // );

    return (await this.models.question
      .findByIdAndUpdate(
        questionId,
        { $push: { notApplyToUsers: userId } },
        { new: true, upsert: true }
      )
      .lean()) as DbTypes.UnansweredQuestion;

    // return Question.findById(questionId).lean();
  }

  public async getAllTags(): Promise<string[]> {
    const questions = (await this.models.question.find().lean()) as Array<
      DbTypes.UnansweredQuestion | DbTypes.AnsweredQuestion
    >;
    const reducer = (
      allTags: string[],
      currentQuestion: DbTypes.AnsweredQuestion | DbTypes.UnansweredQuestion
    ) => {
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
    questionId: string
  ): Promise<DbTypes.UnansweredQuestion> {
    return (await this.models.question.findById(questionId))!.toObject();
    // write in more lines of code, do if chekcs
  }

  public async getAnsweredQuestions(
    answers: DbTypes.Answer[],
    tags?: string[] | null
  ): Promise<DbTypes.AnsweredQuestion[]> {
    const answeredQuestionsIds = answers.map(a => a.questionId);

    const questions = (await this.models.question
      .find()
      .lean()) as DbTypes.UnansweredQuestion[];

    const answeredQs = questions.filter(q =>
      answeredQuestionsIds.includes(q._id.toHexString())
    );

    const qsWithTags = answeredQs.filter(q => {
      if (tags && tags.length) {
        let hasAllTags = true;

        tags.forEach(tag => {
          if (!q.tags.includes(tag)) {
            hasAllTags = false;
          }
        });

        return hasAllTags;
      }

      return true;
    });

    const mergedQuestions = this.mergeAnswersWithQuestions(answers, qsWithTags);
    return mergedQuestions;
  }

  public async getUnansweredQuestions(
    userId: string,
    answeredQuestionsIds: string[] | null,
    tags?: string[] | null
  ): Promise<DbTypes.UnansweredQuestion[]> {
    const { questionsNotApply } = (await this.models.user.findById(
      userId
    ))!.toObject();

    let ignoreQuestionIds: string[] = [];

    if (answeredQuestionsIds && answeredQuestionsIds.length) {
      ignoreQuestionIds = ignoreQuestionIds.concat(answeredQuestionsIds);
    }
    if (questionsNotApply && questionsNotApply.length) {
      ignoreQuestionIds = ignoreQuestionIds.concat(questionsNotApply);
    }

    const allQuestions = (await this.models.question
      .find()
      .lean()) as DbTypes.UnansweredQuestion[];

    const notIgnoredQs = allQuestions.filter(
      q => !ignoreQuestionIds.includes(q._id.toHexString())
    );

    const qsWithTags = notIgnoredQs.filter(q => {
      if (tags && tags.length) {
        let hasAllTags = true;

        tags.forEach(tag => {
          if (!q.tags.includes(tag)) {
            hasAllTags = false;
          }
        });

        return hasAllTags;
      }

      return true;
    });

    return qsWithTags;
  }

  // public async getUserQuestions(
  //   userId: string,
  //   answers: DbTypes.Answer[],
  //   answered: boolean,
  //   tags?: string[] | null
  // ): Promise<DbTypes.Question[]> {
  //   const answeredQuestionsIds = await this.getQuestionsIds(answers);
  //   let questions: DbTypes.Question[];

  //   if (answered) {
  //     questions = await this.getAnsweredQuestions(
  //       answers,
  //       answeredQuestionsIds,
  //       tags
  //     );
  //   } else {
  //     questions = await this.getUnansweredQuestions(
  //       userId,
  //       answeredQuestionsIds,
  //       tags
  //     );
  //   }

  //   return questions;
  // }

  public getQuestionsById({ ids }, context) {
    throw Error("Not implemented");
  }

  private getQuestionsIds(answers: DbTypes.Answer[]): string[] {
    return answers.map(a => a.questionId);
  }

  private preserveOrder({
    answeredQuestionsIds,
    questions
  }: {
    answeredQuestionsIds: string[];
    questions: Array<DbTypes.AnsweredQuestion | DbTypes.UnansweredQuestion>;
  }): Array<DbTypes.AnsweredQuestion | DbTypes.UnansweredQuestion> {
    const res = answeredQuestionsIds
      .map(id => questions.find(q => q._id.equals(id))!)
      .filter(q => q); // filters undefined or null values

    return res;
  }

  private mergeAnswerWithQuestion(
    answer: DbTypes.Answer,
    question: DbTypes.UnansweredQuestion
  ): DbTypes.AnsweredQuestion {
    return { ...question, answer };
  }

  private mergeAnswersWithQuestions(
    answers: DbTypes.Answer[],
    questions: DbTypes.UnansweredQuestion[]
  ): DbTypes.AnsweredQuestion[] {
    const result: DbTypes.AnsweredQuestion[] = [];
    const mergedAnswers: typeof answers = [];

    questions.forEach(question => {
      const answer = answers.find(
        a =>
          question._id.equals(a.questionId) &&
          !mergedAnswers.some(ma => ma._id.equals(a._id))
      );
      if (answer) {
        const mergedQA = this.mergeAnswerWithQuestion(answer, question);
        mergedAnswers.push(answer);
        result.push(mergedQA);
      }
    });

    return result;
  }
}

export { QuestionService };
