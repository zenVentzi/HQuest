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

type CustomSuggestion = SuggestionDataItem & UserFieldsFragment;

type MentionInputProps = {
  searchUsers: (
    variables: UsersQueryVariables
  ) => Promise<UserFieldsFragment[] | null>;
  submitOnEnter: boolean;
  onSubmit: (
    comment: string,
    mentionedUserIds: string[] | undefined
  ) => Promise<{ success: boolean }>;
  isSubmitting: boolean;
};

const MentionInput = (props: MentionInputProps) => {
  const [value, setValue] = useState("");
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

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mentionedUserIds = useRef<string[]>();

  return (
    // @ts-ignore // disabled prop causes error cuz of bad @types support
    <MentionsInput
      value={value}
      onKeyDown={async e => {
        if (e.key === "Enter" && !e.shiftKey && props.submitOnEnter) {
          e.preventDefault();
          const { success } = await props.onSubmit(
            value,
            mentionedUserIds.current
          );
          if (success) {
            setValue("");
            inputRef.current!.blur();
          }
        }
      }}
      inputRef={inputRef}
      disabled={props.isSubmitting}
      onChange={e => {
        setValue(e.target.value);
        const text = e.target.value;
        const mentions = text.match(mentionRegex);
        if (mentions) {
          const userIds = mentions.map(mention => {
            const userId = mention.match(/\(\w+\)/);
            if (!userId) {
              throw Error(`incorrect markup format for user mentions`);
            }
            const parsedUserId = userId[0].slice(1, -1);
            return parsedUserId;
          });

          mentionedUserIds.current = userIds;
        }

        // const ats = text.split("@");
        // if (ats.length <= 1) return;
        // console.log(ats);
        // ats.forEach(at => {
        //   // console.log(at);
        //   const userId = at.split("(")[1].slice(0, -1);
        //   console.log(userId);
        // });
        //"@[Test11 Sarah](5c08b7766f91b01640e54921)".match(/@\[\w+( \w+)*\]\(\w+\)/)
        //@\[\w+( \w+)*\]\(\w+\)
        // console.log(e.target.value);
      }}
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
      placeholder="Add comment... use @userName to tag people"
    >
      <Mention
        trigger="@"
        data={(search, callback) => {
          // const users: SuggestionDataItem[] = [
          //   {
          //     id: "1",
          //     display: "Jimmy"
          //   },
          //   {
          //     id: "2",
          //     display: "Ketut"
          //   },
          //   {
          //     id: "3",
          //     display: "Gede"
          //   },
          //   {
          //     id: "4",
          //     display: "Gede"
          //   },
          //   {
          //     id: "5",
          //     display: "Gede"
          //   }
          // ];
          // return users;

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
          backgroundColor: "black",
          color: "white"
        }}
        // @ts-ignore // @types/ are incomplete
        renderSuggestion={renderSuggestion}
        onAdd={(id, display) => {
          const mentionedUserId = id.toString();
          // console.log(mentionedUserId);
        }}
      />
    </MentionsInput>
  );
};

export default MentionInput;
