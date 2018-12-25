import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, Form, ErrorMessage } from 'formik';
import Textarea from 'react-textarea-autosize';
import { toast } from 'react-toastify';
import Comment from './Comment';
import CommentsGql from './CommentsGql';
import Panel from '../Panel';

const CommentInput = styled(Textarea)`
  /* margin-top: 2em; */
  width: 79%;
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
  // componentDidMount() {
  //   console.log(`mount`);
  // }
  state = { comments: this.props.comments };

  componentDidMount(prevProps, prevState) {
    if (this.highlightedComment) {
      this.panel.scrollTop = this.highlightedComment.offsetTop;
    }
  }

  updateComments = ({ newComment, removedComment, editedComment }) => {
    if (newComment) {
      const [...comments] = this.state.comments;
      comments.push(newComment);
      this.setState(prevState => ({ ...prevState, comments }));
    } else if (removedComment) {
      const [...comments] = this.state.comments.filter(
        c => c.id !== removedComment.id
      );
      this.setState(prevState => ({
        ...prevState,
        comments,
      }));
    } else if (editedComment) {
      const [...comments] = this.state.comments;
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === editedComment.id) {
          comments[i] = editedComment;
        }
      }
      this.setState(prevState => ({ ...prevState, comments }));
    }
  };

  validateForm = values => {
    const errors = {};
    if (values.comment.length < 7)
      errors.comment = 'Comment must be at least 7 characters';

    return errors;
  };

  onSubmitForm = commentAnswerMutation => async (
    values,
    { setSubmitting, resetForm }
  ) => {
    // console.log(commentAnswerMutation);
    const { answerId, onAddComment } = this.props;
    const variables = {
      answerId,
      comment: values.comment,
    };
    const { data } = await commentAnswerMutation({ variables });
    const newComment = data.commentAnswer;
    this.updateComments({ newComment });
    toast.success('Comment added!');
    onAddComment();
    setSubmitting(false);
    resetForm({ comment: '' });
  };

  onEditComment = ({ editCommentMutation }) => async ({
    commentId,
    commentValue,
  }) => {
    const { answerId } = this.props;
    const variables = { answerId, commentId, commentValue };
    const { data } = await editCommentMutation({ variables });
    const editedComment = data.editComment;
    this.updateComments({ editedComment });
    toast.success('Comment edited!');
  };

  onRemoveComment = ({ removeCommentMutation }) => async ({ commentId }) => {
    const { answerId, onRemoveComment } = this.props;
    const variables = { answerId, commentId };
    const { data } = await removeCommentMutation({ variables });
    const removedComment = data.removeComment;
    this.updateComments({ removedComment });
    onRemoveComment();
    toast.success('Comment removed!');
  };

  renderComments = ({ editCommentMutation, removeCommentMutation }) => {
    const { scrollToComment } = this.props;
    const { comments } = this.state;

    if (!comments || !comments.length)
      return <div> Be the first to add a comment </div>;

    const renderReversedComments = () => {
      const res = [];
      const copy = comments.slice();

      while (copy.length) {
        const com = copy.pop();
        const commentProps = {
          key: com.id,
          comment: com,
          onEdit: this.onEditComment({ editCommentMutation }),
          onRemove: this.onRemoveComment({ removeCommentMutation }),
        };

        if (scrollToComment && scrollToComment === com.id) {
          commentProps.ref = ref => {
            this.highlightedComment = ref;
          };
        }

        res.push(<Comment {...commentProps} />);
      }
      return res;
    };

    return renderReversedComments();
  };

  render() {
    return (
      <CommentsGql>
        {(commentAnswer, editComment, removeComment) => {
          return (
            <Panel
              ref={ref => {
                this.panel = ref;
              }}
            >
              <Formik
                initialValues={{ comment: '' }}
                validateOnBlur={false}
                validate={this.validateForm}
                // validate={this.validateForm}
                onSubmit={this.onSubmitForm(commentAnswer)}
              >
                {({
                  values,
                  handleChange,
                  submitForm,
                  handleBlur,
                  isSubmitting,
                }) => (
                  <Form style={{ width: '100%', textAlign: 'center' }}>
                    <CommentInput
                      name="comment"
                      placeholder="Add a comment..."
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.comment || ''}
                      disabled={isSubmitting}
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
              {this.renderComments({
                editCommentMutation: editComment,
                removeCommentMutation: removeComment,
              })}
            </Panel>
          );
        }}
      </CommentsGql>
    );
  }
}

export default Comments;
