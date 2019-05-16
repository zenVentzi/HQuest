import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import Textarea from "react-textarea-autosize";
import styled, { css } from "styled-components";
import TextBtn from "Reusable/TextBtn";
import {
  AnswerFieldsFragment,
  UsersQueryVariables,
  UsersQuery
} from "GqlClient/autoGenTypes";
import MentionInput, {
  getMentionedUserIdsFromInput
} from "./Comments/MentionInput";
import { ApolloConsumer } from "react-apollo";
import { GET_USERS } from "GqlClient/user/queries";

const TextArea = styled(Textarea)`
  display: block;
  margin: 1em auto;
  text-align: center;
  /* margin-left: auto; */
  margin-bottom: 1em;
  overflow: hidden;
  width: 50%;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

const Buttons = styled.div`
  display: flex;
  margin-top: 8px;
  width: 100%;
  justify-content: center;
  margin-bottom: 1em;
`;

const commonBtnStyles = css`
  background: white;
  color: black;
  border: 2px solid black;
  cursor: pointer;

  &:hover {
    background: black;
    color: white;
  }
`;

const LeftBtn = styled(TextBtn)`
  margin-right: 1em;
  ${commonBtnStyles}
`;
const RightBtn = styled(TextBtn)`
  ${commonBtnStyles}
`;

interface AnswerEditorProps {
  onClickDoesNotApply: () => void;
  onClickSave: (
    answerValue: string,
    mentionedUserIds: string[] | null | undefined
  ) => Promise<void>;
  answer: AnswerFieldsFragment | null;
}

const AnswerEditor = React.forwardRef<HTMLTextAreaElement, AnswerEditorProps>(
  (props: AnswerEditorProps, ref) => {
    const [answerValue, setAnswerValue] = useState<string>(() => {
      if (props.answer) {
        const latestEdition =
          props.answer.editions[props.answer.editions.length - 1];

        return latestEdition.value;
      }
      return "";
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const checkLastCharsEqual = (
      text: string,
      last: number,
      equalChar: string
    ) => {
      if (text.length < last) {
        return false;
      }

      const lastChars = text.slice(-last).split("");
      return lastChars.filter(ch => ch === equalChar).length === last;
    };

    const minimizeNewlines = (newValue: string, oldValue: string) => {
      if (checkLastCharsEqual(newValue, 3, "\n")) {
        return oldValue;
      }

      return newValue;
    };

    const isNew = !props.answer;
    let initialValue: string;
    if (!isNew) {
      const latestEdition = props.answer!.editions[
        props.answer!.editions.length - 1
      ];
      initialValue = latestEdition.value;
    }

    return (
      <ApolloConsumer>
        {client => {
          const searchUsers = async (variables: UsersQueryVariables) => {
            const res = await client.query<UsersQuery, UsersQueryVariables>({
              query: GET_USERS,
              variables
            });
            return res.data.users;
          };

          return (
            <>
              <MentionInput
                ref={ref}
                value={answerValue}
                onChange={e => {
                  setAnswerValue(e.target.value);
                }}
                // onKeyDown={async e => {
                //   if (e.key === "Enter" && !e.shiftKey && !isSubmitting) {
                //     e.preventDefault();

                //     // await onSubmitComment(commentAnswerEdition);
                //     // await onSubmit(e.target., mentionedUserIds.current);
                //   }
                // }}
                placeholder="Answer... tag @somebody"
                searchUsers={searchUsers}
                // submitOnEnter={false}
                disabled={isSubmitting}
                // initialValue={initialValue || ""}
                // onSubmit={async (inputText, mentionedUserIds) => {
                //   console.log(mentionedUserIds);
                //   setIsSubmitting(true);
                //   await props.onClickSave(inputText, mentionedUserIds);

                //   // this is called on unmounted component
                //   // setIsSubmitting(false);
                // }}
                // shouldSubmit={shouldSubmit}
              />
              <Buttons>
                <LeftBtn
                  color="white"
                  backgroundColor="black"
                  disabled={isSubmitting}
                  onClick={async () => {
                    if (!isSubmitting) {
                      const mentionedUserIds = getMentionedUserIdsFromInput(
                        answerValue
                      );
                      setIsSubmitting(true);
                      await props.onClickSave(answerValue, mentionedUserIds);
                      // setIsSubmitting(false);
                    }
                  }}
                >
                  Save
                </LeftBtn>
                {isNew && (
                  <RightBtn
                    onClick={props.onClickDoesNotApply}
                    color="white"
                    backgroundColor="black"
                  >
                    Does not apply
                  </RightBtn>
                )}
              </Buttons>
            </>
          );
        }}
      </ApolloConsumer>
    );
  }
);

export default AnswerEditor;
