import {
  UnansweredQuestionsQuery,
  AnsweredQuestionsQuery,
  AnsweredQuestionsQueryVariables,
  UnansweredQuestionsQueryVariables
} from "GqlClient/autoGenTypes";
import { NetworkStatus } from "apollo-client";
import { useEffect } from "react";
import { ObservableQueryFields } from "react-apollo";

const useFetchMoreOnScroll = (
  networkStatus: React.MutableRefObject<NetworkStatus | undefined>,
  hasNextPage: React.MutableRefObject<boolean>,
  fetchAfter: React.MutableRefObject<string | null | undefined>,
  fetchMoreAnswered?: React.MutableRefObject<
    | ObservableQueryFields<
        AnsweredQuestionsQuery,
        AnsweredQuestionsQueryVariables
      >["fetchMore"]
    | undefined
  >,
  fetchMoreUnanswered?: React.MutableRefObject<
    | ObservableQueryFields<
        UnansweredQuestionsQuery,
        UnansweredQuestionsQueryVariables
      >["fetchMore"]
    | undefined
  >
) => {
  useEffect(() => {
    const fetchOnScroll = () => {
      const bottomMarginPx = 0;
      const offsetBottom =
        window.innerHeight + window.pageYOffset - bottomMarginPx;
      const isCloseToBottom = offsetBottom >= document.body.scrollHeight;
      if (isCloseToBottom) {
        if (
          networkStatus.current !== NetworkStatus.ready ||
          !hasNextPage.current
        ) {
          return;
        }

        if (fetchMoreAnswered && fetchMoreAnswered.current) {
          fetchMoreAnswered.current({
            variables: {
              after: fetchAfter.current
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              const res: AnsweredQuestionsQuery = {
                ...prev,
                ...fetchMoreResult
              };
              if (
                !res.answeredQuestions ||
                !prev.answeredQuestions ||
                !prev.answeredQuestions.edges ||
                !fetchMoreResult.answeredQuestions ||
                !fetchMoreResult.answeredQuestions.edges
              ) {
                // can bemore helpful by logging what actually was null
                // under scrutiny
                throw Error(`fetchMore result cannot contain null|undefined`);
              }
              res.answeredQuestions.pageInfo.startCursor =
                prev.answeredQuestions.pageInfo.startCursor;
              res.answeredQuestions.edges = [
                ...prev.answeredQuestions.edges,
                ...fetchMoreResult.answeredQuestions.edges
              ];

              return res;
            }
          });
        } else if (fetchMoreUnanswered && fetchMoreUnanswered.current) {
          fetchMoreUnanswered.current({
            variables: {
              after: fetchAfter.current
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              const res: UnansweredQuestionsQuery = {
                ...prev,
                ...fetchMoreResult
              };
              if (
                !res.unansweredQuestions ||
                !prev.unansweredQuestions ||
                !prev.unansweredQuestions.edges ||
                !fetchMoreResult.unansweredQuestions ||
                !fetchMoreResult.unansweredQuestions.edges
              ) {
                // can bemore helpful by logging what actually was null
                // under scrutiny
                throw Error(`fetchMore result cannot contain null|undefined`);
              }
              res.unansweredQuestions.pageInfo.startCursor =
                prev.unansweredQuestions.pageInfo.startCursor;
              res.unansweredQuestions.edges = [
                ...prev.unansweredQuestions.edges,
                ...fetchMoreResult.unansweredQuestions.edges
              ];

              return res;
            }
          });
        } else {
          throw Error(`fetchMore fn cannot be null|undefined`);
        }
      }
    };

    window.addEventListener("scroll", fetchOnScroll);
    return () => {
      window.removeEventListener("scroll", fetchOnScroll);
    };
  }, []);
};

export { useFetchMoreOnScroll };
