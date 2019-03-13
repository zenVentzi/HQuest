import React, { useRef, useState, useEffect } from "react";
import { Query } from "react-apollo";
import { GET_QUESTIONS } from "GqlClient/question/queries";
import styled from "styled-components";
import AnsweredQuestions from "./AnsweredQuestions";
import QuestionTags from "./Tags";
import UnansweredQuestions from "./UnansweredQuestions";
import ToggleQuestions from "./ToggleQuestions";
import {
  UserUser,
  QuestionsQuery,
  QuestionsVariables,
  QuestionConnectionFieldsFragment
} from "GqlClient/autoGenTypes";
import { render } from "react-dom";
import { NetworkStatus } from "apollo-client";

interface QuestionsContainerProps {
  user: UserUser;
}

const QuestionsContainer = (props: QuestionsContainerProps) => {
  const networkStatus = useRef<NetworkStatus>();
  const hasNextPage = useRef(false);
  const fetchMoreFn = useRef<any>(undefined);
  const fetchAfter = useRef<string | null>();

  const [showAnswered, setShowAnswered] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>();

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

        fetchMoreFn.current!({
          variables: {
            after: fetchAfter.current
          },
          updateQuery: (prev: any, { fetchMoreResult }: any) => {
            if (!fetchMoreResult) return prev;
            const res = {
              ...prev,
              ...fetchMoreResult
            };
            res.questions.pageInfo.startCursor =
              prev.questions.pageInfo.startCursor;
            res.questions.edges = [
              ...prev.questions.edges,
              ...fetchMoreResult.questions.edges
            ];

            return res;
          }
        });
      }
    };

    window.addEventListener("scroll", fetchOnScroll);
    return () => {
      window.removeEventListener("scroll", fetchOnScroll);
    };
  }, []);

  const onToggleQuestions = (e: any) => {
    const isTogglerOn = e.target.checked;
    setShowAnswered(!isTogglerOn);
  };

  const onSelectedTags = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const renderQuestions = (
    questions: QuestionConnectionFieldsFragment | null,
    refetch: any
  ) => {
    // TODO fix no unanswered questions blink on first load
    if (!questions) {
      return (
        <div>{`No ${showAnswered ? "answered" : "unanswered"} questions`}</div>
      );
    }

    const questionNodes = questions.edges
      ? questions.edges.map(edge => edge.node)
      : [];

    if (!showAnswered) {
      console.log(questionNodes);
    }

    return showAnswered ? (
      <AnsweredQuestions
        isPersonal={!!user.me}
        totalCount={questions.totalCount}
        questions={questionNodes}
        refetch={refetch}
      />
    ) : (
      <UnansweredQuestions
        questions={questionNodes}
        refetchQuestions={refetch}
      />
    );
  };

  const { user } = props;
  const queryVars: QuestionsVariables = {
    answered: showAnswered,
    userId: user.id,
    tags: selectedTags,
    first: 20
  };

  return (
    <>
      {user.me && <ToggleQuestions onClick={onToggleQuestions} />}
      <QuestionTags onSelected={onSelectedTags} />
      <Query<QuestionsQuery, QuestionsVariables>
        query={GET_QUESTIONS}
        variables={queryVars}
        fetchPolicy="network-only" // play with when not using HOT RELOAD
        // fetchPolicy="cache-and-network"
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
          const { questions } = data!;

          if (questions) {
            hasNextPage.current = questions.pageInfo.hasNextPage;
            fetchAfter.current = questions.pageInfo.endCursor;
            fetchMoreFn.current = fetchMore;
          }

          if (ns === NetworkStatus.ready) {
            return renderQuestions(questions, refetch);
          } else if (ns === NetworkStatus.fetchMore) {
            return (
              <>
                {renderQuestions(questions, refetch)}
                <div>Loading more questions...</div>
              </>
            );
          }

          return <div>Loading questions...</div>;
        }}
      </Query>
    </>
  );
};

export default QuestionsContainer;
