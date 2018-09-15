import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { GET_QUESTIONS } from 'Queries';
import AnsweredQuestions from './AnsweredQuestions';
import QuestionTags from './QuestionTags';
import UnansweredQuestions from './UnansweredQuestions';

class QuestionsContainer extends Component {
  state = { selectedTags: [] };

  onSelectedTags = tags => {
    this.setState(prev => {
      return { ...prev, selectedTags: tags };
    });
  };

  render() {
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
        >
          {({ loading, error, data: { questions }, fetchMore }) => {
            if (loading) return <div> loading questions.. </div>;
            if (error) return <div> {`Error ${error}`}</div>;

            console.log('TCL: render -> questions', questions.length);

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

export default QuestionsContainer;
