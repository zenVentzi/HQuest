import { Mutation } from "react-apollo";
import React, { Fragment } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
// import Field from 'Reusable/Field';
import styled from "styled-components";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { EDIT_USER, DELETE_ACCOUNT } from "GqlClient/user/mutations";
import { GET_USER } from "GqlClient/user/queries";
import { toast } from "react-toastify";
import TextBtn from "Reusable/TextBtn";
import {
  UserFieldsFragment,
  EditUserMutation,
  EditUserMutationVariables,
  DeleteAccountMutation,
  DeleteAccountMutationVariables
} from "GqlClient/autoGenTypes";
import { deleteLoggedUserData } from "Utils";

interface ProfileEditorProps extends RouteComponentProps {
  user: UserFieldsFragment;
}

const StyledInput = styled.input`
  width: 350px;
  margin-bottom: 5px;
`;

const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProfileEditor = ({
  user: { id, me, fullName, intro, socialMediaLinks },
  history
}: ProfileEditorProps) => {
  if (!me) {
    return (
      <div>
        Cannot edit others
        {"'"} profiles, duh
      </div>
    );
  }

  const {
    facebookLink,
    twitterLink,
    instagramLink,
    linkedInLink
  } = socialMediaLinks!;

  return (
    <Mutation<DeleteAccountMutation, DeleteAccountMutationVariables>
      mutation={DELETE_ACCOUNT}
    >
      {deleteAccount => {
        return (
          <Mutation<EditUserMutation, EditUserMutationVariables>
            mutation={EDIT_USER}
          >
            {editUser => (
              <Formik
                initialValues={{
                  fullName,
                  intro,
                  facebookLink,
                  twitterLink,
                  instagramLink,
                  linkedInLink
                }}
                validate={values => {
                  const errors: any = {};

                  if (!values.fullName) {
                    errors.fullName = "Required";
                  }
                  if (!values.intro) {
                    errors.intro = "Required";
                  }

                  const twitterRegex = RegExp(
                    /http(s)?:\/\/(.*\.)?twitter\.com\/[A-z0-9_]+\/?/
                  );
                  const linkedInRegex = RegExp(
                    /http(s)?:\/\/([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?/
                  );
                  const facebookRegex = RegExp(
                    /http(s)?:\/\/(www\.)?(facebook|fb)\.com\/[A-z0-9_\-\.]+\/?/
                  );
                  const instagramRegex = RegExp(
                    /https?:\/\/(www\.)?instagram\.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/
                  );

                  if (values.facebookLink && values.facebookLink.length > 0) {
                    if (!facebookRegex.test(values.facebookLink)) {
                      errors.facebookLink = "Incorrect profile link";
                    }
                  }
                  if (values.twitterLink && values.twitterLink.length > 0) {
                    if (!twitterRegex.test(values.twitterLink)) {
                      errors.twitterLink = "Incorrect profile link";
                    }
                  }
                  if (values.linkedInLink && values.linkedInLink.length > 0) {
                    if (!linkedInRegex.test(values.linkedInLink)) {
                      errors.linkedInLink = "Incorrect profile link";
                    }
                  }
                  if (values.instagramLink && values.instagramLink.length > 0) {
                    if (!instagramRegex.test(values.instagramLink)) {
                      errors.instagramLink = "Incorrect profile link";
                    }
                  }
                  // if (!values.email) {
                  //   errors.email = 'Required';
                  // } else if (
                  //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                  // ) {
                  //   errors.email = 'Invalid email address';
                  // }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  // setTimeout(() => {
                  //   alert(JSON.stringify(values, null, 2));
                  //   setSubmitting(false);
                  // }, 400);

                  /* */

                  const variables: EditUserMutationVariables = {
                    input: {
                      fullName: values.fullName!,
                      intro: values.intro!,
                      socialMediaLinks: {
                        facebookLink: values.facebookLink,
                        twitterLink: values.twitterLink,
                        instagramLink: values.instagramLink,
                        linkedInLink: values.linkedInLink
                      }
                    }
                  };

                  await editUser({
                    variables,
                    refetchQueries: [
                      {
                        query: GET_USER,
                        variables: { id }
                      }
                    ]
                  });
                  setSubmitting(false);
                  history.goBack();
                  toast.success("🦄 Profile edited!");
                  // onSaved();
                  // TODO redirect to either help page or profile depending on whether the user is new. Define if user is new by whether they have any answered questions
                }}
                /* 
          
          1) stop using styled-components
          2) use input manually, without the Field compoennt from Formik
          3) 

          */
              >
                {({ touched, handleSubmit, isSubmitting }) => (
                  <Form>
                    <FieldsWrapper>
                      <Field
                        touched={touched.fullName}
                        type="text"
                        name="fullName"
                        placeholder="Full name..."
                        render={({
                          field, // { name, value, onChange, onBlur }
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          ...props
                        }) => <StyledInput {...field} {...props} />}
                      />
                      <ErrorMessage
                        name="fullName"
                        render={msg => (
                          <div style={{ color: "red", marginBottom: "5px" }}>
                            {msg}
                          </div>
                        )}
                      />
                      <Field
                        touched={touched.intro}
                        type="text"
                        name="intro"
                        placeholder="Intro..."
                        render={({
                          field, // { name, value, onChange, onBlur }
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          ...props
                        }) => <StyledInput {...field} {...props} />}
                      />
                      <ErrorMessage
                        name="intro"
                        render={msg => (
                          <div style={{ color: "red", marginBottom: "5px" }}>
                            {msg}
                          </div>
                        )}
                      />
                      <Field
                        touched={touched.facebookLink}
                        type="text"
                        name="facebookLink"
                        render={({
                          field, // { name, value, onChange, onBlur }
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          ...props
                        }) => (
                          <StyledInput
                            {...field}
                            {...props}
                            placeholder="Facebook link..."
                          />
                        )}
                      />
                      <ErrorMessage
                        name="facebookLink"
                        render={msg => (
                          <div style={{ color: "red", marginBottom: "5px" }}>
                            {msg}
                          </div>
                        )}
                      />
                      <Field
                        touched={touched.twitterLink}
                        type="text"
                        name="twitterLink"
                        render={({
                          field, // { name, value, onChange, onBlur }
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          ...props
                        }) => (
                          <StyledInput
                            {...field}
                            {...props}
                            placeholder="Twitter link..."
                          />
                        )}
                      />
                      <ErrorMessage
                        name="twitterLink"
                        render={msg => (
                          <div style={{ color: "red", marginBottom: "5px" }}>
                            {msg}
                          </div>
                        )}
                      />
                      <Field
                        touched={touched.instagramLink}
                        type="text"
                        name="instagramLink"
                        render={({
                          field, // { name, value, onChange, onBlur }
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          ...props
                        }) => (
                          <StyledInput
                            {...field}
                            {...props}
                            placeholder="Instagram link..."
                          />
                        )}
                      />
                      <ErrorMessage
                        name="instagramLink"
                        render={msg => (
                          <div style={{ color: "red", marginBottom: "5px" }}>
                            {msg}
                          </div>
                        )}
                      />
                      <Field
                        touched={touched.linkedInLink}
                        type="text"
                        name="linkedInLink"
                        render={({
                          field, // { name, value, onChange, onBlur }
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          ...props
                        }) => (
                          <StyledInput
                            {...field}
                            {...props}
                            placeholder="LinkedIn link..."
                          />
                        )}
                      />
                      <ErrorMessage
                        name="linkedInLink"
                        render={msg => (
                          <div style={{ color: "red", marginBottom: "5px" }}>
                            {msg}
                          </div>
                        )}
                      />
                      <TextBtn
                        color="white"
                        backgroundColor="black"
                        onClick={e => {
                          handleSubmit();
                        }}
                        style={{ marginBottom: "5px" }}
                        disabled={isSubmitting}
                      >
                        Submit
                      </TextBtn>
                      <TextBtn
                        color="white"
                        backgroundColor="black"
                        onClick={async e => {
                          const confirmed = confirm(
                            "Are you sure you want to permanently delete this account?"
                          );

                          if (confirmed) {
                            await deleteAccount();
                            deleteLoggedUserData();
                            toast.success(
                              "Account has been permanently deleted!",
                              { autoClose: 3000 }
                            );
                            history.push("/");
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        Delete account permanently
                      </TextBtn>
                    </FieldsWrapper>
                  </Form>
                )}
              </Formik>
            )}
          </Mutation>
        );
      }}
    </Mutation>
  );
};

export default withRouter(ProfileEditor);
