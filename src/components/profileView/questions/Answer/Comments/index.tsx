import * as React from "react";
import styled from "styled-components";
import { Formik, Form, ErrorMessage } from "formik";
import Textarea from "react-textarea-autosize";
import { toast } from "react-toastify";
import Comment from "./Comment";
import CommentsGql from "./CommentsGql";
import Panel from "../Panel";
import { MutationFn } from "react-apollo";

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

interface CommentsProps {
  comments: any[];
  answerId: string;
  onAddComment: () => void;
  // onEditComment: () => void;
  onRemoveComment: () => void;
  scrollToComment?: string;
}

class Comments extends React.Component<CommentsProps, {}> {
  state = { comments: this.props.comments || [] };
  highlightedComment: any;
  panel: any;

  // TODO: IMPORTANT. This is commented out because of bad react typings
  // it should NOT be

  // componentDidMount(prevProps, prevState) {
  //   if (this.highlightedComment) {
  //     this.panel.scrollTop = this.highlightedComment.offsetTop;
  //   }
  // }

  updateComments = (
    newComment?: any,
    removedComment?: any,
    editedComment?: any
  ) => {
    if (newComment) {
      let comments: any[] = [];
      [...comments] = this.state.comments;
      comments.push(newComment);
      this.setState((prevState: any) => ({ ...prevState, comments }));
    } else if (removedComment) {
      const [...comments] = this.state.comments.filter(
        c => c.id !== removedComment.id
      );
      this.setState((prevState: any) => ({
        ...prevState,
        comments
      }));
    } else if (editedComment) {
      const [...comments] = this.state.comments;
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === editedComment.id) {
          comments[i] = editedComment;
        }
      }
      this.setState((prevState: any) => ({ ...prevState, comments }));
    }
  };

  validateForm = (values: any) => {
    const errors: any = {};
    if (values.comment.length < 7)
      errors.comment = "Comment must be at least 7 characters";

    return errors;
  };

  onSubmitForm = (commentAnswerMutation: MutationFn) => async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    // console.log(commentAnswerMutation);
    const { answerId, onAddComment } = this.props;
    const variables = {
      answerId,
      comment: values.comment
    };
    const res = await commentAnswerMutation({ variables });
    if (!res) {
      throw Error("Comment answer mutation failed");
    }
    const newComment = res.data.commentAnswer;
    this.updateComments(newComment);
    toast.success("Comment added!");
    onAddComment();
    setSubmitting(false);
    resetForm({ comment: "" });
  };

  onEditComment = (editCommentMutation: MutationFn) => async (
    commentId: string,
    commentValue: string
  ) => {
    const { answerId } = this.props;
    const variables = { answerId, commentId, commentValue };
    const res = await editCommentMutation({ variables });
    if (!res) {
      throw Error("Failed edit comment mutation");
    }

    const editedComment = res.data.editComment;
    this.updateComments({ editedComment });
    toast.success("Comment edited!");
  };

  onRemoveComment = (removeCommentMutation: MutationFn) => async (
    commentId: string
  ) => {
    const { answerId, onRemoveComment } = this.props;
    const variables = { answerId, commentId };
    const res = await removeCommentMutation({ variables });
    if (!res) {
      throw Error("removeCommentMutation failed");
    }

    const removedComment = res.data.removeComment;
    this.updateComments({ removedComment });
    onRemoveComment();
    toast.success("Comment removed!");
  };

  renderComments = (
    editCommentMutation: MutationFn,
    removeCommentMutation: MutationFn
  ) => {
    const { scrollToComment } = this.props;
    const { comments } = this.state;

    if (!comments || !comments.length)
      return <div> Be the first to add a comment </div>;

    const renderReversedComments = () => {
      const res = [];
      const copy = comments.slice();

      while (copy.length) {
        const com = copy.pop();
        const commentProps: any = {
          key: com.id,
          comment: com,
          onEdit: this.onEditComment(editCommentMutation),
          onRemove: this.onRemoveComment(removeCommentMutation)
        };

        if (scrollToComment && scrollToComment === com.id) {
          commentProps.ref = (ref: any) => {
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
                initialValues={{ comment: "" }}
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
                  isSubmitting
                }) => (
                  <Form style={{ width: "100%", textAlign: "center" }}>
                    <CommentInput
                      name="comment"
                      placeholder="Add a comment..."
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.comment || ""}
                      disabled={isSubmitting}
                      onKeyPress={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
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
              {this.renderComments(editComment, removeComment)}
            </Panel>
          );
        }}
      </CommentsGql>
    );
  }
}

export default Comments;
