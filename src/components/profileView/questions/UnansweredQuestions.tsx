import React, { CSSProperties, useRef } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import UnansweredQuestion from "./UnansweredQuestion";
import {
  UnansweredQuestionFieldsFragment,
  UnansweredQuestionsQuery,
  UnansweredQuestionsQueryVariables,
  UserFieldsFragment
} from "GqlClient/autoGenTypes";
import { GET_UNANSWERED_QUESTIONS } from "GqlClient/question/queries";
import { useFetchMoreOnScroll } from "./fetchMoreQuestionsHook";
import { ObservableQueryFields, Query } from "react-apollo";
import { NetworkStatus } from "apollo-client";

const Empty = styled.div`
  text-align: center;
  width: 100%;
`;

interface UnansweredQuestionsProps {
  style?: CSSProperties;
  user: UserFieldsFragment;
  selectedTags: string[] | undefined;
  // questions: UnansweredQuestionFieldsFragment[];
  // refetchQuestions: () => Promise<void>;
}

const UnansweredQuestions = ({
  style,
  user,
  selectedTags
}: // questions,
// refetchQuestions
UnansweredQuestionsProps) => {
  const networkStatus = useRef<NetworkStatus>();
  const hasNextPage = useRef(false);
  type FetchMoreFn = ObservableQueryFields<
    UnansweredQuestionsQuery,
    UnansweredQuestionsQueryVariables
  >["fetchMore"];
  const fetchMoreFn = useRef<FetchMoreFn>();
  const fetchAfter = useRef<string | null>();
  useFetchMoreOnScroll(
    networkStatus,
    hasNextPage,
    fetchAfter,
    undefined,
    fetchMoreFn
  );

  const queryVars: UnansweredQuestionsQueryVariables = {
    userId: user.id,
    tags: selectedTags,
    first: 20
  };

  return (
    <Query<UnansweredQuestionsQuery, UnansweredQuestionsQueryVariables>
      query={GET_UNANSWERED_QUESTIONS}
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
        const { unansweredQuestions } = data!;

        if (unansweredQuestions) {
          hasNextPage.current = unansweredQuestions.pageInfo.hasNextPage;
          fetchAfter.current = unansweredQuestions.pageInfo.endCursor;
          fetchMoreFn.current = fetchMore;
        }

        if (ns === NetworkStatus.ready) {
          if (!unansweredQuestions || !unansweredQuestions.edges) {
            return <Empty style={style}> No unanswered questions </Empty>;
          }
          return unansweredQuestions.edges.map(edge => (
            <UnansweredQuestion
              key={edge.node.id}
              style={style}
              question={edge.node}
              refetchQuestions={refetch}
            />
          ));
        } else if (ns === NetworkStatus.fetchMore) {
          if (!unansweredQuestions || !unansweredQuestions.edges) {
            throw Error(
              `cannot fetch more questions without any previous questions`
            );
          }
          return (
            <>
              {unansweredQuestions.edges.map(edge => (
                <UnansweredQuestion
                  key={edge.node.id}
                  style={style}
                  question={edge.node}
                  refetchQuestions={refetch}
                />
              ))}
              <div>Loading more questions...</div>
            </>
          );
        }

        return <div>Loading unanswered questions...</div>;
      }}
    </Query>
  );
};

export default UnansweredQuestions;
