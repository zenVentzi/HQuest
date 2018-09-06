import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

const EDIT_USER = gql`
  mutation editUser($input: EditUserInput) {
    editUser(input: $input) {
      id
    }
  }
`;

const Input = styled.input`
  margin-bottom: 0.5em;
`;

const ProfileEditor = ({
  user: {
    me,
    fullName,
    intro,
    socialMediaLinks: {
      facebookLink,
      twitterLink,
      instagramLink,
      linkedInLink,
    },
  },
  history,
}) => {
  if (!me) {
    return (
      <div>
        Cannot edit others
        {"'"} profiles, duh
      </div>
    );
  }
  const fullNameInput = React.createRef();
  const introInput = React.createRef();
  const facebookInput = React.createRef();
  const twitterInput = React.createRef();
  const instagramInput = React.createRef();
  const linkedInInput = React.createRef();

  const onSave = editUser => async () => {
    const newFullName = fullNameInput.current.value;
    const newIntro = introInput.current.value;
    const newFacebookLink = facebookInput.current.value;
    const newTwitterLink = twitterInput.current.value;
    const newInstagramLink = instagramInput.current.value;
    const newLinkedInLink = linkedInInput.current.value;
    const variables = {
      input: {
        fullName: newFullName,
        intro: newIntro,
        socialMediaLinks: {
          facebookLink: newFacebookLink,
          twitterLink: newTwitterLink,
          instagramLink: newInstagramLink,
          linkedInLink: newLinkedInLink,
        },
      },
    };

    await editUser({ variables });
    history.goBack();
  };

  // const { links } = user;
  const links = {
    facebook: 'fb.com/user',
    twitter: 'twitter.com/user',
    instagram: 'insta/user',
    linkedIn: 'lin/user',
  };

  return (
    <Mutation mutation={EDIT_USER}>
      {editUser => (
        <Fragment>
          <Input innerRef={fullNameInput} defaultValue={fullName} />
          <Input innerRef={introInput} defaultValue={intro} />
          <Input innerRef={facebookInput} defaultValue={facebookLink} />
          <Input innerRef={twitterInput} defaultValue={twitterLink} />
          <Input innerRef={instagramInput} defaultValue={instagramLink} />
          <Input innerRef={linkedInInput} defaultValue={linkedInLink} />
          <button onClick={onSave(editUser)}>Save</button>
        </Fragment>
      )}
    </Mutation>
  );
};

export default withRouter(ProfileEditor);
