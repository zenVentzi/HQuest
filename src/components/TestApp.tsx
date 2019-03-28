import React, { useState } from "react";
import { MentionsInput, Mention, SuggestionDataItem } from "react-mentions";

// function fetchUsers(query, callback) {
//   if (!query) return;
//   fetch(`https://api.github.com/search/users?q=${query}`, { json: true })
//     .then(res => res.json())

//     // Transform the users to what react-mentions expects
//     .then(res =>
//       res.items.map(user => ({ display: user.login, id: user.login }))
//     )
//     .then(callback);
// }

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

function AsyncGithubUserMentions() {
  const [value, setValue] = useState("");

  return (
    <div className="async">
      <h3>Async Github user mentions</h3>

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

          highlighter: {
            overflow: "hidden"
          },

          input: {
            margin: 0
          },

          "&singleLine": {
            control: {
              display: "inline-block",

              width: 130
            },

            highlighter: {
              padding: 1,
              border: "2px inset transparent"
            },

            input: {
              padding: 1,
              border: "2px inset"
            }
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
            console.log(search);
            callback(users);
            // return users;
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
    </div>
  );
}

export default AsyncGithubUserMentions;
