import { Mutation } from "react-apollo";
import React, { Fragment } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
// import Field from 'Reusable/Field';
import styled from "styled-components";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { EDIT_USER } from "GqlClient/user/mutations";
import { GET_USER } from "GqlClient/user/queries";
import { toast } from "react-toastify";
import TextBtn from "Reusable/TextBtn";
import {
  UserFieldsFragment,
  EditUserMutation,
  EditUserVariables
} from "GqlClient/autoGenTypes";

interface ProfileEditorProps extends RouteComponentProps {
  user: UserFieldsFragment;
}

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
    <Mutation<EditUserMutation, EditUserVariables> mutation={EDIT_USER}>
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

            const variables: EditUserVariables = {
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
            toast.success("🦄 Answer edited!");
            // onSaved();
            // TODO redirect to either help page or profile depending on whether the user is new. Define if user is new by whether they have any answered questions
          }}
        >
          {({ touched, handleSubmit, isSubmitting }) => (
            <Form>
              <div>
                <Field
                  touched={touched.fullName}
                  type="text"
                  name="fullName"
                  placeholder="Full name..."
                />
                <Field
                  touched={touched.intro}
                  type="text"
                  name="intro"
                  placeholder="Intro..."
                />
                <Field
                  touched={touched.facebookLink}
                  type="text"
                  name="facebookLink"
                  placeholder="Facebook link..."
                />
                <Field
                  touched={touched.twitterLink}
                  type="text"
                  name="twitterLink"
                  placeholder="Twitter link..."
                />
                <Field
                  touched={touched.instagramLink}
                  type="text"
                  name="instagramLink"
                  placeholder="Instagram link..."
                />
                <Field
                  touched={touched.linkedInLink}
                  type="text"
                  name="linkedInLink"
                  placeholder="LinkedIn link..."
                />
                <TextBtn
                  onClick={e => {
                    handleSubmit();
                  }}
                  disabled={isSubmitting}
                >
                  Submit
                </TextBtn>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Mutation>
  );
};

export default withRouter(ProfileEditor);
