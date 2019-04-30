import React, { useState } from "react";
// import style from "./bla.css";
import deep_diff from "deep-diff";
import { Mention, MentionsInput, SuggestionDataItem } from "react-mentions";
import { createGlobalStyle } from "styled-components";
import { GlobalStyle } from "./appTheme";

// const GlobalStyle = createGlobalStyle``;
const suggestions: SuggestionDataItem[] = [
  { id: 1, display: "Pesho" },
  { id: 2, display: "Gosho" }
];

const TestApp = () => {
  const [value, setValue] = useState("");

  const renderSuggestion = (
    suggestion: SuggestionDataItem,
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
    <div id="random">
      <GlobalStyle />
      <MentionsInput
        value={value}
        // @ts-ignore // incorrect @types/
        // onKeyDown={props.onKeyDown}
        // inputRef={ref}
        onChange={e => {
          setValue(e.target.value);
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
              // fontFamily: "monospace",
              paddingTop: 8
              // padding: 2
            },

            input: {
              padding: 8,
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
      >
        <Mention
          trigger="@"
          data={suggestions}
          style={{
            backgroundColor: "#00000030",
            color: "black"
          }}
          renderSuggestion={renderSuggestion}
        />
      </MentionsInput>
    </div>
  );
};

export default TestApp;
