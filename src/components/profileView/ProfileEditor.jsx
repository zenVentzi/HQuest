import { Mutation } from 'react-apollo';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { EDIT_USER } from 'Mutations';
import { GET_USER } from 'Queries';
import { toast } from 'react-toastify';
import TextBtn from 'Reusable/TextBtn';

const Input = styled.input`
  margin-bottom: 0.5em;
`;

const ProfileEditor = ({
  user: {
    id,
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

    await editUser({
      variables,
      refetchQueries: [
        {
          query: GET_USER,
          variables: { id },
        },
      ],
    });
    history.goBack();
    toast.success('🦄 Answer edited!');
    // onSaved();
    // TODO redirect to either help page or profile depending on whether the user is new. Define if user is new by whether they have any answered questions
  };

  return (
    <Mutation mutation={EDIT_USER}>
      {editUser => (
        <Fragment>
          <h1>Profile editor</h1>
          <Input
            placeholder="Name..."
            innerRef={fullNameInput}
            defaultValue={fullName}
          />
          <Input
            placeholder="Profile intro..."
            innerRef={introInput}
            defaultValue={intro}
          />
          <Input
            placeholder="FB profile..."
            innerRef={facebookInput}
            defaultValue={facebookLink}
          />
          <Input
            placeholder="Twitter profile..."
            innerRef={twitterInput}
            defaultValue={twitterLink}
          />
          <Input
            placeholder="Instagram profile..."
            innerRef={instagramInput}
            defaultValue={instagramLink}
          />
          <Input
            placeholder="LinkedIn profile..."
            innerRef={linkedInInput}
            defaultValue={linkedInLink}
          />
          <TextBtn onClick={onSave(editUser)}>Save</TextBtn>
        </Fragment>
      )}
    </Mutation>
  );
};

export default withRouter(ProfileEditor);
