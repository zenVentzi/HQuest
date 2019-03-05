import React, { useRef } from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import { Formik, Form } from "formik";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Anchor from "Reusable/Anchor";
import UsersDataList from "./UsersDataList";
import { UsersQuery, UsersVariables } from "GqlClient/autoGenTypes";
import { GET_USERS } from "GqlClient/user/queries";

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

interface CustomSearchProps extends RouteComponentProps {}

const CustomSearch = (props: CustomSearchProps) => {
  const datalistRef = useRef<HTMLDataListElement>(null);

  const search = (username: string) => {
    const { history } = props;
    history.push("/search", { username });
  };

  /* 
  problem: when click enter over a result, it doesn't submit the form
  */

  const isDatalistSelected = (inputValue: string) => {
    // FIXME: it returns true incorrectly when the input is typed from user
    // possible not so hacky solution is to create my own dropdown
    let res = false;
    if (datalistRef.current) {
      const options = datalistRef.current.childNodes;
      options.forEach(opt => {
        // used to be opt.value before typescript, possibly incorrect typings
        if (opt.nodeValue === inputValue) {
          res = true;
        }
      });
    }

    return res;
  };

  const canShowDatalist = (inputValue: string) => {
    // console.log(isOptionSelected({ inputValue }));
    return (
      inputValue && inputValue.length > 1 && !isDatalistSelected(inputValue)
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

  return (
    <Formik
      initialValues={{ username: "" }}
      validateOnBlur={false}
      validate={values => {
        const errors = {};
        return errors;
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        search(values.username);
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
        isSubmitting
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
                if (isDatalistSelected(e.target.value)) {
                  submitForm();
                }
              }}
              value={values.username || ""}
              // onChange={e => {
              //   const val = e.target.value;
              //   optionWasSelected = isOptionSelected(val);
              //   setState({ input: val });
              // }}
            />
            <Anchor
              onClick={() => {
                if (isSubmitting) return;
                search("");
              }}
            >
              all
            </Anchor>
          </SearchRow>

          {canShowDatalist(values.username) && (
            <Query<UsersQuery, UsersVariables>
              query={GET_USERS}
              variables={{ match: values.username }}
              fetchPolicy="network-only"
            >
              {({ loading, error, data }) => {
                if (loading) return <div> loading users </div>;
                if (error) return <div> {error} </div>;

                const { users } = data!;

                if (!users.length) {
                  return <div> No matches found </div>;
                }

                return <UsersDataList users={users} ref={datalistRef} />;
              }}
            </Query>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default withRouter(CustomSearch);
