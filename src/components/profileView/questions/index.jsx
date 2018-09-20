import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { GET_QUESTIONS } from 'Queries';
import AnsweredQuestions from './AnsweredQuestions';
import QuestionTags from './QuestionTags';
import UnansweredQuestions from './UnansweredQuestions';

class QuestionsContainer extends Component {
  state = { selectedTags: [] };
  firstRenderResetScroll = true;

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    // this is done as a hack for the scroll position after refresh
    // on refresh the scroll position doesn't restore properly, need to take a look
    // if (this.firstRenderResetScroll) {
    //   this.firstRenderResetScroll = false;
    //   window.scrollTo(0, 0);
    //   return;
    // }
    const bottomMarginPx = 60;
    const offsetBottom =
      window.innerHeight + window.pageYOffset - bottomMarginPx;
    const isCloseToBottom = offsetBottom >= document.body.scrollHeight;

    if (isCloseToBottom && !this.isFetching && this.hasNextPage) {
      console.log(
        'TCL: QuestionsContainer -> onScroll -> isCloseToBottom',
        isCloseToBottom
      );
      console.log(`fetchinggg`);
      this.fetchMore({
        variables: {
          after: this.fetchAfter,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          const res = {
            ...prev,
            ...fetchMoreResult,
          };
          res.questions.pageInfo.startCursor =
            prev.questions.pageInfo.startCursor;
          res.questions.edges = [
            ...prev.questions.edges,
            ...fetchMoreResult.questions.edges,
          ];

          console.log(
            'TCL: QuestionsContainer -> onScroll -> res',
            res.questions.pageInfo.hasNextPage
          );

          return res;
        },
      });
    }

    // if (isCloseToBottom && this.hasNextPage) {
    //   debugger;
  };

  onSelectedTags = tags => {
    this.setState(prev => {
      return { ...prev, selectedTags: tags };
    });
  };

  render() {
    // return <TestQuestions />;
    const { user, showAnswered } = this.props;
    const { selectedTags } = this.state;
    const vars = {
      answered: showAnswered,
      userId: user.id,
      tags: selectedTags,
      first: 2,
    };

    return (
      <Fragment>
        <QuestionTags onSelected={this.onSelectedTags} />
        <Query
          query={GET_QUESTIONS}
          variables={vars}
          fetchPolicy="cache-and-network"
          notifyOnNetworkStatusChange
        >
          {({ loading, error, data: { questions }, fetchMore }) => {
            this.isFetching = true;
            if (loading) return <div> loading questions.. </div>;
            // return <TestQuestions />;
            if (error) return <div> {`Error ${error}`}</div>;
            this.isFetching = false;
            this.hasNextPage = questions.pageInfo.hasNextPage;
            this.fetchAfter = questions.pageInfo.endCursor;
            this.fetchMore = fetchMore;

            return showAnswered ? (
              <AnsweredQuestions isPersonal={user.me} questions={questions} />
            ) : (
              <UnansweredQuestions
                questions={questions}
                fetchMore={fetchMore}
              />
            );
          }}
        </Query>
      </Fragment>
    ); // move the queries here?
  }
}

const TestQuestions = () => {
  const questions = [];

  for (let i = 0; i < 100; i++) {
    questions.push(
      <div key={i}>
        Question
        {i}
      </div>
    );
  }

  return questions;
};

export default QuestionsContainer;
