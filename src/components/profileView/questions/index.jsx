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
    const bottomMarginPx = 60;
    const offsetBottom =
      window.innerHeight + window.pageYOffset - bottomMarginPx;
    const isCloseToBottom = offsetBottom >= document.body.scrollHeight;

    if (isCloseToBottom && !this.isLoading && this.hasNextPage) {
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

  renderQuestions = questions => {
    const { user, showAnswered } = this.props;

    return showAnswered ? (
      <AnsweredQuestions isPersonal={user.me} questions={questions} />
    ) : (
      <UnansweredQuestions questions={questions} />
    );
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
            if (loading) {
              this.isLoading = true;
            } else {
              this.isLoading = false;
              this.hasNextPage = questions.pageInfo.hasNextPage;
              this.fetchAfter = questions.pageInfo.endCursor;
              this.fetchMore = fetchMore;
            }
            if (error) return <div> {`Error ${error}`}</div>;

            return (
              <Fragment>
                {questions && this.renderQuestions(questions)}
                {loading && <div>loading questions..</div>}
              </Fragment>
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
