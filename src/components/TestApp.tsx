import React, { useState } from "react";
// import style from "./bla.css";
import Select, { components } from "react-select";
// import { GlobalStyle } from "./appTheme";
import styledNormalize from "styled-normalize";
import { createGlobalStyle } from "styled-components";

type Option = { value: string; label: string };

const GlobalStyle = createGlobalStyle`
  ${styledNormalize}
  * {
    box-sizing: border-box;
    color: white;
  }
`;

const colourOptions: Option[] = [
  { value: "ocean", label: "Ocean" },
  { value: "blue", label: "Blue" }
];

const TestApp = props => {
  return (
    <div>
      <GlobalStyle />
      <Select
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
            return { ...base, width: "500px" };
          },
          // dropdownIndicator: base => {
          //   return { ...base, backgroundColor: "black" };
          // },
          indicatorsContainer: base => {
            return { ...base, color: "red" };
          }
        }}
        isMulti={true}
        options={colourOptions}
        placeholder="Search questions by tag"
      />
    </div>
  );
};

export default TestApp;
