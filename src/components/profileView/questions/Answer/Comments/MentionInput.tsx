import {
  MentionsInput,
  Mention,
  OnChangeHandlerFunc,
  SuggestionDataItem
} from "react-mentions";
import React, { useState, useRef } from "react";
import {
  UserFieldsFragment,
  UsersQueryVariables
} from "GqlClient/autoGenTypes";
import Avatar from "Reusable/Avatar";
import { ThemeProvider } from "styled-components";
import { mentionRegex } from "Reusable/MentionConstants";
import { useAsyncEffect } from "use-async-effect";

type CustomSuggestion = SuggestionDataItem & UserFieldsFragment;

type MentionInputProps = {
  searchUsers: (
    variables: UsersQueryVariables
  ) => Promise<UserFieldsFragment[] | null>;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => Promise<void> | void;
  onChange: OnChangeHandlerFunc;
  disabled: boolean;
  placeholder: string;
  value: string | undefined;
};

const MentionInput = React.forwardRef<
  HTMLTextAreaElement | null | undefined,
  MentionInputProps
>((props: MentionInputProps, ref) => {
  let modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.id = "modal-root";
  }

  const renderSuggestion = (
    suggestion: CustomSuggestion,
    search: string,
    highlightedDisplay: React.ReactNode,
    index: number,
    focused: boolean
  ) => {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          padding: "5px 2px 5px 2px",
          backgroundColor: focused ? "black" : "white"
          // height: "50px"
        }}
      >
        <ThemeProvider
          theme={{
            avatarSize: "1em",
            foregroundColor: focused ? "white" : "black"
          }}
        >
          <Avatar src={suggestion.avatarSrc} />
        </ThemeProvider>
        <div
          style={{
            marginLeft: "2px",
            color: focused ? "white" : "black",
            fontSize: "1.4em"
          }}
        >
          {suggestion.display}
        </div>
      </div>
    );
  };

  return (
    <MentionsInput
      value={props.value}
      // @ts-ignore // incorrect @types/
      onKeyDown={props.onKeyDown}
      // @ts-ignore
      inputRef={ref}
      disabled={props.disabled}
      onChange={props.onChange}
      style={{
        control: {
          backgroundColor: "white",
          fontSize: 12,
          fontWeight: "normal"
        },
        textAlign: "left",
        width: "80%",

        highlighter: {
          overflow: "hidden"
        },

        input: {
          margin: 0
        },

        "&multiLine": {
          control: {
            fontFamily: "monospace",
            border: "1px solid silver"
          },

          highlighter: {
            fontFamily: "monospace",
            padding: 10
          },

          input: {
            padding: 9,
            minHeight: 10,
            minWidth: 200,
            outline: 0,
            border: 0
          }
        },

        suggestions: {
          list: {
            backgroundColor: "white",
            border: "1px solid black",
            borderRadius: "0.4em",
            fontSize: 10
          },

          item: {
            // padding: "5px 15px",
            borderBottom: "1px solid rgba(1,1,1,0.15)"
          }
        }
      }}
      suggestionsPortalHost={modalRoot}
      placeholder={props.placeholder}
    >
      <Mention
        trigger="@"
        data={(search, callback) => {
          props.searchUsers({ match: search }).then(users => {
            if (users && users.length) {
              const suggestions: CustomSuggestion[] = users.map(user => {
                return { ...user, display: user.fullName };
              });
              callback(suggestions);
            }
          });
        }}
        style={{
          backgroundColor: "#00000030",
          color: "black"
        }}
        // @ts-ignore // @types/ are incomplete
        renderSuggestion={renderSuggestion}
      />
    </MentionsInput>
  );
});

const getMentionedUserIdsFromInput = (inputValue: string): string[] | null => {
  const mentions = inputValue.match(mentionRegex);
  if (mentions) {
    const userIds = mentions.map(mention => {
      const userId = mention.match(/\(\w+\)/);
      if (!userId) {
        throw Error(`incorrect markup format for user mentions`);
      }
      const parsedUserId = userId[0].slice(1, -1);
      return parsedUserId;
    });
    return userIds;
  }

  return null;
};

export default MentionInput;
export { getMentionedUserIdsFromInput };
