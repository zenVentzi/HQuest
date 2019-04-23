import "reflect-metadata";
// import * as GqlTypes from "../generated/gqltypes";
import * as DbTypes from "../dbTypes";
import { ApolloContext } from "gqlContext";
import mongoose from "mongoose";
import { Models } from "../models";

const { ObjectId } = mongoose.Types;

function RemoveEmptyStrings(params: string[]) {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args1) {
      const args = arguments;

      params.forEach(param => {
        console.log(
          `Arguments have ${param}, ${Reflect.has(arguments, param)}`
        );

        if (!args[param] || !args[param].length) {
          // throw Error(
          //   `Parameter ${param} does not exist. Could be spelling error`
          // );
          return;
        } else if (
          !Array.isArray(args[param]) ||
          !args[param].every(elem => typeof elem === "string")
        ) {
          throw Error(`Parameter ${param} must be an array of strings`);
        }

        const noEmpty = args[param].filter((elem: string) => elem !== "");
        args[param] = noEmpty;
      });

      const result = originalMethod.apply(this, args);
      return result;
    };
    return descriptor;
  };
}

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
    const query: any = { _id: { $in: answeredQuestionsIds } };

    if (tags && tags.length) {
      query.tags = { $in: tags };
    }

    const questions = (await this.models.question
      .find(query)
      .lean()) as DbTypes.AnsweredQuestion[];
    // ordering is done because the $in query returns in random order
    const orderedQs = this.preserveOrder({ answeredQuestionsIds, questions });
    const mergedQuestions = this.mergeAnswersWithQuestions(answers, orderedQs);
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

    let ignoreQuestions: string[] = [];

    if (answeredQuestionsIds && answeredQuestionsIds.length) {
      ignoreQuestions = ignoreQuestions.concat(answeredQuestionsIds);
    }
    if (questionsNotApply && questionsNotApply.length) {
      ignoreQuestions = ignoreQuestions.concat(questionsNotApply);
    }

    const query: any = {};

    if (ignoreQuestions.length) {
      query._id = { $nin: ignoreQuestions };
    }
    if (tags && tags.length) {
      query.tags = { $in: tags.filter(tag => tag !== "") };
    }

    const questions = (await this.models.question
      .find(query)
      .lean()) as DbTypes.UnansweredQuestion[];

    return questions;
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
      const mergedQA = this.mergeAnswerWithQuestion(answer!, question);
      mergedAnswers.push(answer!);
      result.push(mergedQA);
    });

    return result;
  }
}

export { QuestionService };
