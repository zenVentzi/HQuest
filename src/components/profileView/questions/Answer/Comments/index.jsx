import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, Form, ErrorMessage } from 'formik';
import Textarea from 'react-textarea-autosize';
import { Query, Mutation } from 'react-apollo';
import { toast } from 'react-toastify';
import Comment from './Comment';
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
  // state = { scrolledToComment: false };

  componentDidMount(prevProps, prevState) {
    if (this.highlightedComment) {
      this.panel.scrollTop = this.highlightedComment.offsetTop;

      // eslint-disable-next-line react/no-did-mount-set-state
      // this.setState((state, props) => {
      //   return { ...state, scrolledToComment: true };
      // });
    }
  }

  scrollToComment = () => {};

  // updateCache = (cache, { data: { addComment } }) => {
  //   const vars = { answerId: this.props.answerId };
  //   const { comments: cments } = cache.readQuery({
  //     query: GET_COMMENTS,
  //     variables: vars,
  //   });

  //   cache.writeQuery({
  //     query: GET_COMMENTS,
  //     variables: vars,
  //     data: { comments: cments.concat([addComment]) },
  //   });
  // };

  renderComments = ({ comments, scrollToComment }) => {
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
          onEdit: this.props.onEditComment,
          onRemove: this.props.onRemoveComment,
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
    const { comments, scrollToComment } = this.props;
    const formInitialValues = { comment: '' };

    return (
      <Panel
        ref={ref => {
          this.panel = ref;
        }}
      >
        <Formik
          initialValues={formInitialValues}
          validateOnBlur={false}
          validate={values => {
            const errors = {};
            if (values.comment.length < 7)
              errors.comment = 'Comment must be at least 7 characters';

            return errors;
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            await this.props.onAddComment({ commentValue: values.comment });
            setSubmitting(false);
            resetForm(formInitialValues);
          }}
        >
          {({ values, handleChange, submitForm, handleBlur, isSubmitting }) => (
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
        {this.renderComments({ comments, scrollToComment })}
      </Panel>
    );
  }
}

export default Comments;
