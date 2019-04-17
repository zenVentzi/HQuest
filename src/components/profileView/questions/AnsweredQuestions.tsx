import React, { Fragment, CSSProperties, useRef } from "react";
import styled from "styled-components";
import AnsweredQuestion from "./AnsweredQuestion";
import {
  AnsweredQuestionFieldsFragment,
  AnsweredQuestionsQuery,
  AnsweredQuestionsQueryVariables,
  UserFieldsFragment
} from "GqlClient/autoGenTypes";
import { withPropsChecker } from "Utils";
import { useFetchMoreOnScroll } from "./fetchMoreQuestionsHook";
import { NetworkStatus } from "apollo-client";
import { ObservableQueryFields, Query } from "react-apollo";
import { GET_ANSWERED_QUESTIONS } from "GqlClient/question/queries";

const Empty = styled.div`
  text-align: center;
  width: 100%;
`;

interface AnsweredQuestionsProps {
  isPersonal: boolean;
  user: UserFieldsFragment;
  selectedTags: string[] | undefined;
  // questions: AnsweredQuestionFieldsFragment[];
  // totalCount: number;
  // refetch: any;
  // couldn't add the style type
}

const AnsweredQuestions = ({
  isPersonal,
  user,
  selectedTags,
  // questions,
  // totalCount,
  // refetch,
  ...style
}: AnsweredQuestionsProps) => {
  const networkStatus = useRef<NetworkStatus>();
  const hasNextPage = useRef(false);
  type FetchMoreFn = ObservableQueryFields<
    AnsweredQuestionsQuery,
    AnsweredQuestionsQueryVariables
  >["fetchMore"];
  const fetchMoreFn = useRef<FetchMoreFn>();
  const fetchAfter = useRef<string | null>();
  useFetchMoreOnScroll(networkStatus, hasNextPage, fetchAfter, fetchMoreFn);

  // if (!questions.length) {
  //   return <Empty style={style}> No answered questions </Empty>;
  // }

  const queryVars: AnsweredQuestionsQueryVariables = {
    userId: user.id,
    tags: selectedTags,
    first: 20
  };

  return (
    <Query<AnsweredQuestionsQuery, AnsweredQuestionsQueryVariables>
      query={GET_ANSWERED_QUESTIONS}
      variables={queryVars}
      // fetchPolicy="network-only" // play with when not using HOT RELOAD
      fetchPolicy="cache-and-network"
      notifyOnNetworkStatusChange={true}
    >
      {({ error, data, fetchMore, refetch, networkStatus: ns }) => {
        if (error) {
          console.log(error);
          return (
            <div>
              {`Could not find questions. Work is being done fixing this issue`}
            </div>
          );
        }

        networkStatus.current = ns;
        const { answeredQuestions } = data!;

        if (answeredQuestions) {
          hasNextPage.current = answeredQuestions.pageInfo.hasNextPage;
          fetchAfter.current = answeredQuestions.pageInfo.endCursor;
          fetchMoreFn.current = fetchMore;
        }

        if (ns === NetworkStatus.ready) {
          if (!answeredQuestions || !answeredQuestions.edges) {
            return <Empty style={style}> No answered questions </Empty>;
          }
          return answeredQuestions.edges.map(q => (
            <AnsweredQuestion
              key={q.node.id}
              showComments={true}
              style={style}
              isPersonal={isPersonal}
              question={q.node}
              totalQuestionsCount={answeredQuestions.totalCount}
            />
          ));
        } else if (ns === NetworkStatus.fetchMore) {
          if (!answeredQuestions || !answeredQuestions.edges) {
            throw Error(
              `cannot fetch more questions without any previous questions`
            );
          }
          return (
            <>
              {answeredQuestions.edges.map(q => (
                <AnsweredQuestion
                  key={q.node.id}
                  showComments={true}
                  style={style}
                  isPersonal={isPersonal}
                  question={q.node}
                  totalQuestionsCount={answeredQuestions.totalCount}
                />
              ))}
              <div>Loading more questions...</div>
            </>
          );
        }

        return <div>Loading questions...</div>;
      }}
    </Query>
  );
};

// export default AnsweredQuestions;
export default AnsweredQuestions;
