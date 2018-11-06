import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Query, Mutation } from 'react-apollo';
import { ADD_COMMENT } from 'Mutations';
import { GET_COMMENTS } from 'Queries';
import { toast } from 'react-toastify';
import Comment from './Comment';
import Panel from '../Panel';

const TextArea = styled.textarea`
  /* margin-top: 2em; */
  width: 80%;
  min-height: min-content;
  background: white;
  color: black;
  margin-bottom: 1em;
`;

const ErrorText = styled.div`
  color: red;
  margin-bottom: 1em;
`;

class Comments extends Component {
  // shouldComponentUpdate() {
  //   return false;
  // }

  // onKeyPress = addComment => async e => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     const { answerId } = this.props;
  //     const { enteredComment } = this.state;

  //     if (!enteredComment || enteredComment.length < 7) {
  //       toast.error(`Comment must be at least 7 characters`);
  //       return;
  //     }

  //     await addComment({ variables: { answerId, comment: enteredComment } });

  //     this.input.value = '';
  //     this.setState({ enteredComment: '' });
  //     this.forceUpdate();
  //   }
  // };

  // onInputClick = e => {
  //   e.stopPropagation();
  // };

  // onChange = e => {
  //   // console.log(e.target.value);
  //   this.setState({ enteredComment: e.target.value }, () => {
  //     console.log(this.state);
  //   });
  // };

  updateCache = (cache, { data: { addComment } }) => {
    const vars = { answerId: this.props.answerId };
    const { comments: cments } = cache.readQuery({
      query: GET_COMMENTS,
      variables: vars,
    });

    cache.writeQuery({
      query: GET_COMMENTS,
      variables: vars,
      data: { comments: cments.concat([addComment]) },
    });
  };

  renderComments = comments => {
    if (!comments.length) return <div> No comments yet </div>;

    const renderReversedComments = () => {
      const res = [];
      const copy = comments.slice();

      while (copy.length) {
        const com = copy.pop();
        res.push(<Comment key={com.id} comment={com} />);
      }
      return res;
    };

    return renderReversedComments();
  };

  render() {
    const { answerId, onClose } = this.props;

    return (
      <Query query={GET_COMMENTS} variables={{ answerId }}>
        {({ loading, error, data: { comments } }) => (
          <Mutation mutation={ADD_COMMENT} update={this.updateCache}>
            {addComment => {
              if (loading) return <div> Loading comments..</div>; // this should be below Input component
              if (error) return <div> {error.message} </div>;

              return (
                <Panel onClose={onClose}>
                  <Formik
                    initialValues={{ comment: '' }}
                    validateOnBlur={false}
                    validate={values => {
                      const errors = {};
                      if (values.comment && values.comment.length < 7)
                        errors.comment =
                          'Comment must be at least 7 characters';

                      return errors;
                    }}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                      await addComment({
                        variables: { answerId, comment: values.comment },
                      });

                      setSubmitting(false);
                      resetForm({});
                    }}
                  >
                    {({
                      touched,
                      values,
                      errors,
                      handleChange,
                      submitForm,
                      handleBlur,
                      isSubmitting,
                    }) => (
                      <Form style={{ width: '100%', textAlign: 'center' }}>
                        <TextArea
                          name="comment"
                          placeholder="Add a comment..."
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.comment || ''}
                          onKeyPress={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (!isSubmitting) submitForm();
                            }
                          }}
                        />
                        <ErrorMessage
                          name="comment"
                          render={msg => <ErrorText>{msg}</ErrorText>}
                        />
                      </Form>
                    )}
                  </Formik>
                  {this.renderComments(comments)}
                </Panel>
              );
            }}
          </Mutation>
        )}
      </Query>
    );
  }
}

export default Comments;
