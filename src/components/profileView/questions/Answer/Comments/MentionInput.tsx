import {
  MentionsInput,
  Mention,
  OnChangeHandlerFunc,
  SuggestionDataItem
} from "react-mentions";
import React, { useState } from "react";
import { UserFieldsFragment, UsersVariables } from "GqlClient/autoGenTypes";

type MentionInputProps = {
  searchUsers?: (
    variables: UsersVariables
  ) => Promise<UserFieldsFragment[] | null>;
  // placeholder: string;
  // onChange: any;
  // onBlur: any;
};

const MentionInput = (props: MentionInputProps) => {
  const [value, setValue] = useState("");

  return (
    <MentionsInput
      value={value}
      onChange={e => {
        setValue(e.target.value);
      }}
      // markup={"'@[__display__](__display__)'"}
      style={{
        control: {
          backgroundColor: "white",
          fontSize: 12,
          fontWeight: "normal"
        },
        textAlign: "left",

        highlighter: {
          overflow: "hidden"
        },
        width: "80%",

        input: {
          margin: 0
        },

        "&multiLine": {
          control: {
            fontFamily: "monospace",

            border: "1px solid silver"
          },

          highlighter: {
            padding: 9
          },

          input: {
            padding: 9,
            minHeight: 200,
            outline: 0,
            border: 0
          }
        },

        suggestions: {
          list: {
            backgroundColor: "white",
            border: "1px solid rgba(1,1,1,0.15)",
            fontSize: 10
          },

          item: {
            padding: "5px 15px",
            borderBottom: "1px solid rgba(1,1,1,0.15)",

            "&focused": {
              backgroundColor: "black",
              color: "white"
            }
          }
        }
      }}
      placeholder="Mention any Github user by typing `@` followed by at least one char"
      // displayTransform={login => {
      //   console.log(login);
      //   return `@${login + 1}`;
      // }}
    >
      <Mention
        trigger="@"
        data={(search, callback) => {
          const users: SuggestionDataItem[] = [
            {
              id: "1",
              display: "Jimmy"
            },
            {
              id: "2",
              display: "Ketut"
            },
            {
              id: "3",
              display: "Gede"
            }
          ];
          return users;

          if (props.searchUsers) {
            props.searchUsers({ match: search }).then(users => {
              if (users && users.length) {
                const suggestions: SuggestionDataItem[] = users.map(user => {
                  return { ...user, display: user.fullName };
                });
                callback(suggestions);
              }
            });
          } else {
            // TODO remove that, it\s for testing
            const users: SuggestionDataItem[] = [
              {
                id: "1",
                display: "Jimmy"
              },
              {
                id: "2",
                display: "Ketut"
              },
              {
                id: "3",
                display: "Gede"
              }
            ];
            return users;
          }
        }}
        style={{
          backgroundColor: "black",
          color: "white"
        }}
        renderSuggestion={(
          suggestion,
          search,
          highlightedDisplay,
          index,
          focused
        ) => {
          return <div>{suggestion.display}</div>;
        }}
      />
    </MentionsInput>
  );
};

export default MentionInput;
