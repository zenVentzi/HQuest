import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { withRouter } from 'react-router-dom';
import Anchor from 'Reusable/Anchor';
import UsersDataList from './UsersDataList';

const GET_USERS = gql`
  query GetUsers($match: String) {
    users(match: $match) {
      id
      fullName
    }
  }
`;

const TextInput = styled.input`
  width: 20em;
  margin-right: 0.7em;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: flex-end;
`;

const CustomTextInput = styled(TextInput)`
  margin-top: 0.3em;
`;

class CustomSearch extends Component {
  constructor(props) {
    super(props);
    this.datalistRef = React.createRef();
  }

  search = ({ username }) => {
    const { history } = this.props;
    history.push('/search', { username });
  };

  /* 
  problem: when click enter over a result, it doesn't submit the form
  */

  isDatalistSelected = ({ inputValue }) => {
    // FIXME: it returns true incorrectly when the input is typed from user
    // possible not so hacky solution is to create my own dropdown
    let res = false;
    if (this.datalistRef.current) {
      const options = this.datalistRef.current.childNodes;
      options.forEach(opt => {
        if (opt.value === inputValue) {
          res = true;
        }
      });
    }

    return res;
  };

  canShowDatalist = ({ inputValue }) => {
    // console.log(this.isOptionSelected({ inputValue }));
    return (
      inputValue &&
      inputValue.length > 1 &&
      !this.isDatalistSelected({ inputValue })
    );
  };

  // test = () => {
  //   console.log(`test`);
  //   return false;
  // };

  /* problem: formik rerenders 3 times on input change and the isOptionSelected doesn't work, causing the datalist to rerender
  solutions:
  1) don't use datalist
  2) Try to make Formik rerender only once on inputchange
  3) at onChange, check if the selection is from dropdown and if yes, submit the form */

  render() {
    return (
      <Formik
        initialValues={{ username: '' }}
        validateOnBlur={false}
        validate={values => {
          const errors = {};
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          this.search({ username: values.username });
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
          isSubmitting,
        }) => (
          <Form action="/search">
            <SearchRow>
              <CustomTextInput
                list="users"
                name="username"
                autoComplete="off"
                placeholder="Search users.."
                onChange={e => {
                  handleChange(e);
                  if (this.isDatalistSelected({ inputValue: e.target.value })) {
                    submitForm();
                  }
                }}
                value={values.username || ''}
                // onChange={e => {
                //   const val = e.target.value;
                //   this.optionWasSelected = this.isOptionSelected(val);
                //   this.setState({ input: val });
                // }}
              />
              <Anchor
                onClick={() => {
                  if (isSubmitting) return;
                  this.search({ username: '' });
                }}
              >
                all
              </Anchor>
            </SearchRow>

            {this.canShowDatalist({ inputValue: values.username }) && (
              <Query
                query={GET_USERS}
                variables={{ match: values.username }}
                fetchPolicy="network-only"
              >
                {({ loading, error, data: { users } }) => {
                  if (loading) return <div> loading users </div>;
                  if (error) return <div> {error} </div>;

                  if (!users.length) {
                    return <div> No matches found </div>;
                  }

                  return <UsersDataList users={users} ref={this.datalistRef} />;
                }}
              </Query>
            )}
          </Form>
        )}
      </Formik>
    );
  }
}

export default withRouter(CustomSearch);
