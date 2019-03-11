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

interface QuestionsContainerProps {
  user: UserUser;
}

const QuestionsContainer = (props: QuestionsContainerProps) => {
  const isFetching = useRef(false);
  const hasNextPage = useRef(false);
  const fetchMoreFn = useRef<any>(undefined);
  const fetchAfter = useRef<string | null>();
  const isFetchingInitial = useRef(false); // or true?
  const isFetchingMore = useRef(false);
  const isRefetching = useRef(false);
  // const firstRenderResetScroll = useRef(true);

  const [showAnswered, setShowAnswered] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>();

  useEffect(() => {
    const fetchOnScroll = () => {
      const bottomMarginPx = 0;
      const offsetBottom =
        window.innerHeight + window.pageYOffset - bottomMarginPx;
      const isCloseToBottom = offsetBottom >= document.body.scrollHeight;
      const shouldFetchMore = isCloseToBottom && !isFetching && hasNextPage;

      if (shouldFetchMore) {
        fetchMoreFn.current!({
          variables: {
            after: fetchAfter
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
    // console.log(questions);
    if (!questions) return null;

    const questionNodes = questions.edges
      ? questions.edges.map(edge => edge.node)
      : [];

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
        notifyOnNetworkStatusChange
      >
        {({ error, data, fetchMore, refetch, networkStatus }) => {
          if (error) {
            // console.log(error);
            return (
              <div>
                {`Could not find questions. Work is being done fixing this issue`}
              </div>
            );
          }

          isFetchingInitial.current = networkStatus === 1;
          isFetchingMore.current = networkStatus === 3;
          isRefetching.current = networkStatus === 4;

          isFetching.current =
            isFetchingInitial.current ||
            isFetchingMore.current ||
            isRefetching.current;

          const { questions } = data!;

          if (questions) {
            hasNextPage.current = questions.pageInfo.hasNextPage;
            fetchAfter.current = questions.pageInfo.endCursor;
            fetchMoreFn.current = fetchMore;
          }

          return (
            <>
              {!isFetchingInitial.current &&
                renderQuestions(questions, refetch)}
              {(isFetchingInitial.current || isFetchingMore.current) && (
                <div>loading questions..</div>
              )}
            </>
          );
        }}
      </Query>
    </>
  );
};

export default QuestionsContainer;
