import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import Select, { components } from "react-select";
import { GET_QUESTIONS_TAGS } from "GqlClient/question/queries";
import {
  QuestionsTagsQueryVariables,
  QuestionsTagsQuery
} from "GqlClient/autoGenTypes";

type Option = { value: string; label: string };

interface QuestionTagsProps {
  onSelected: (selectedTags: string[]) => void;
}

const QuestionTags = (props: QuestionTagsProps) => {
  return (
    <Query<QuestionsTagsQuery, QuestionsTagsQueryVariables>
      query={GET_QUESTIONS_TAGS}
      errorPolicy="all"
    >
      {({ loading, error, data }) => {
        if (error) {
          console.log(error);
        } else if (loading) {
          return null;
        }

        if (!data) {
          throw Error(`data cannot be null|undefined at that point`);
        }

        const selectOptions: Option[] = data.questionsTags.map(tag => {
          const option: Option = { value: tag, label: tag };
          return option;
        });

        return (
          <Select<Option>
            styles={{
              multiValue: base => {
                return {
                  ...base,
                  color: "white",
                  backgroundColor: "black"
                };
              },
              multiValueLabel: base => {
                return {
                  ...base,
                  color: "white"
                };
              },
              option: (base, state) => {
                return {
                  ...base,
                  backgroundColor: state.isFocused ? "black" : "white",
                  color: state.isFocused ? "white" : "black"
                };
              },
              container: base => {
                return { ...base, width: "500px", marginBottom: "15px" };
              },
              indicatorsContainer: base => {
                return { ...base, color: "red" };
              }
            }}
            isMulti={true}
            options={selectOptions}
            placeholder="Search questions by tag"
            onChange={(options, actionMeta) => {
              switch (actionMeta.action) {
                case "pop-value":
                case "remove-value":
                case "select-option":
                case "clear": {
                  const newSelectedTags = (options as Option[])!.map(option => {
                    return option.value;
                  });
                  // setSelectedTags(newSelectedTags);
                  props.onSelected(newSelectedTags);
                  break;
                }
              }
            }}
            noOptionsMessage={({ inputValue }) => {
              return inputValue.length
                ? `No tags found with "${inputValue}"`
                : null;
            }}
          />
        );
      }}
    </Query>
  );
};

export default QuestionTags;
