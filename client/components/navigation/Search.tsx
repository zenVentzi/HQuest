import React, { useRef, useState } from "react";
import { Query, ApolloConsumer } from "react-apollo";
import styled from "styled-components";
import { Formik, Form } from "formik";
import AsyncSelect from "react-select/lib/Async";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Anchor from "Reusable/Anchor";
import UsersDataList from "./UsersDataList";
import { UsersQuery, UsersQueryVariables } from "GqlClient/autoGenTypes";
import { GET_USERS } from "GqlClient/user/queries";
import { OptionProps } from "react-select/lib/components/Option";
import Avatar from "Reusable/Avatar";

type Option = {
  value: string;
  label: string;
  userId: string;
  avatarSrc: string | null | undefined;
};

const CustomOption = (props: OptionProps<Option>) => {
  return (
    <div
      style={{
        display: "flex",
        padding: "10px",
        flexDirection: "row",
        backgroundColor: props.isFocused ? "black" : "white",
        color: props.isFocused ? "white" : "black"
      }}
      ref={props.innerRef}
      {...props.innerProps}
    >
      <Avatar
        src={props.data.avatarSrc}
        size="20px"
        borderColor={props.isFocused ? "white" : "black"}
      />
      <div style={{ marginTop: "2px", marginLeft: "5px" }}>
        {props.data.label}
      </div>
    </div>
  );
};

interface CustomSearchProps extends RouteComponentProps {}

const CustomSearch = (props: CustomSearchProps) => {
  const [selectValue, setSelectValue] = useState<Option | null>();

  // const search = (username: string) => {
  //   const { history } = props;
  //   history.push("/search", { username });
  // };

  return (
    <ApolloConsumer>
      {client => (
        <AsyncSelect<Option>
          components={{
            IndicatorSeparator: () => null,
            DropdownIndicator: () => null,
            Option: CustomOption
          }}
          openMenuOnClick={false}
          styles={{
            // multiValue: base => {
            //   return {
            //     ...base,
            //     color: "white",
            //     backgroundColor: "black"
            //   };
            // },
            // multiValueLabel: base => {
            //   return {
            //     ...base,
            //     color: "white"
            //   };
            // },
            option: (base, state) => {
              return {
                ...base,
                backgroundColor: state.isFocused ? "black" : "white",
                color: state.isFocused ? "white" : "black"
              };
            },
            container: base => {
              return {
                ...base,
                width: "250px",
                // marginBottom: "15px",
                display: "inline-block"
              };
            },
            control: base => {
              return { ...base, minHeight: "25px", marginTop: "4px" };
            },
            indicatorsContainer: base => {
              return { ...base, color: "red" };
            }
          }}
          loadOptions={async inputValue => {
            const res = await client.query<UsersQuery, UsersQueryVariables>({
              query: GET_USERS,
              variables: { match: inputValue }
            });
            const options: Option[] = [];
            if (res.data.users) {
              res.data.users.forEach(user => {
                options.push({
                  label: user.fullName,
                  value: user.id,
                  userId: user.id,
                  avatarSrc: user.avatarSrc
                });
              });
            }
            return options;
          }}
          onChange={(selectedOption, actionMeta) => {
            props.history.push(
              `/userProfile/${(selectedOption as Option).userId}`
            );
            setSelectValue(null);
          }}
          value={selectValue}
          placeholder="Search users.."
          noOptionsMessage={({ inputValue }) => {
            return inputValue.length
              ? `No users found with "${inputValue}"`
              : null;
          }}
        />
      )}
    </ApolloConsumer>
  );
};

export default withRouter(CustomSearch);
