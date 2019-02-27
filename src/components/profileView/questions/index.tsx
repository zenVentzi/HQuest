import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { GET_QUESTIONS } from "Queries";
import styled from "styled-components";
import AnsweredQuestions from "./AnsweredQuestions";
import QuestionTags from "./Tags";
import UnansweredQuestions from "./UnansweredQuestions";
import ToggleQuestions from "./ToggleQuestions";

interface QuestionsContainerProps {
  user: any;
}

class QuestionsContainer extends Component<QuestionsContainerProps, any> {
  private isFetching: boolean;
  private hasNextPage: boolean;
  private fetchMore: any;
  private fetchAfter: string;
  private isFetchingInitial: boolean;
  private isFetchingMore: boolean;
  private isRefetching: boolean;

  state = { showAnswered: true, selectedTags: [""] };
  firstRenderResetScroll = true;

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  onScroll = () => {
    const bottomMarginPx = 0;
    const offsetBottom =
      window.innerHeight + window.pageYOffset - bottomMarginPx;
    const isCloseToBottom = offsetBottom >= document.body.scrollHeight;
    const shouldFetchMore =
      isCloseToBottom && !this.isFetching && this.hasNextPage;

    if (shouldFetchMore) {
      this.fetchMore({
        variables: {
          after: this.fetchAfter
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

  onToggleQuestions = (e: any) => {
    const isOn = e.target.checked;
    this.setState({ showAnswered: !isOn });
  };

  onSelectedTags = (tags: string[]) => {
    this.setState((prev: any) => {
      return { ...prev, selectedTags: tags };
    });
  };

  renderQuestions = (questions: any, refetch: any) => {
    if (!questions) return null;

    const { user } = this.props;
    const { showAnswered } = this.state;

    const questionNodes = questions.edges.map((e: any) => e.node);

    return showAnswered ? (
      <AnsweredQuestions
        isPersonal={user.me}
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

  render() {
    const { user } = this.props;
    const { selectedTags, showAnswered } = this.state;
    const queryVars = {
      answered: showAnswered,
      userId: user.id,
      tags: selectedTags,
      first: 20
    };

    return (
      <Fragment>
        {user.me && <ToggleQuestions onClick={this.onToggleQuestions} />}
        <QuestionTags onSelected={this.onSelectedTags} />
        <Query
          query={GET_QUESTIONS}
          variables={queryVars}
          fetchPolicy="network-only" // play with when not using HOT RELOAD
          // fetchPolicy="cache-and-network"
          notifyOnNetworkStatusChange
        >
          {({
            error,
            data: { questions },
            fetchMore,
            refetch,
            networkStatus
          }) => {
            if (error) return <div> {`Error ${error}`}</div>;

            this.isFetchingInitial = networkStatus === 1;
            this.isFetchingMore = networkStatus === 3;
            this.isRefetching = networkStatus === 4;

            this.isFetching =
              this.isFetchingInitial ||
              this.isFetchingMore ||
              this.isRefetching;

            if (questions) {
              this.hasNextPage = questions.pageInfo.hasNextPage;
              this.fetchAfter = questions.pageInfo.endCursor;
              this.fetchMore = fetchMore;
            }

            return (
              <Fragment>
                {!this.isFetchingInitial &&
                  this.renderQuestions(questions, refetch)}
                {(this.isFetchingInitial || this.isFetchingMore) && (
                  <div>loading questions..</div>
                )}
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    ); // move the queries here?
  }
}

// const TestQuestions = () => {
//   const questions = [];

//   for (let i = 0; i < 100; i++) {
//     questions.push(
//       <div key={i}>
//         Question
//         {i}
//       </div>
//     );
//   }

//   return questions;
// };

export default QuestionsContainer;
