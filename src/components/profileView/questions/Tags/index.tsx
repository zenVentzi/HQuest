import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import { GET_QUESTIONS_TAGS } from "GqlClient/question/queries";
import Anchor from "Reusable/Anchor";
import AllTags from "./AllTags";
import MatchingTags from "./MatchingTags";

const InvalidText = styled.div`
  color: red;
`;

const Input = styled.input`
  width: 40%;
  margin-right: 1em;

  @media (max-width: 600px) {
    width: 90%;
    margin-right: 0.5em;
  }
`;

const InputRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  padding-left: 1.8em;
`;

const TagsWrapper = styled.div`
  position: relative;
  margin-bottom: 1em;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

interface QuestionTagsProps {
  onSelected: (selectedTags: string[]) => void;
}

const QuestionTags = (props: QuestionTagsProps) => {
  const allTags = useRef<string[]>();
  const [showAllTags, setShowAllTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [matchingTags, setMatchingTags] = useState<string[]>([]);
  const [invalidTagMsg, setInvalidTagMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hideAllTagsWindow = () => {
    setShowAllTags(false);
  };

  const onSelectFromAllTags = (selectedTags: string[]) => {
    hideAllTagsWindow();
    inputRef.current!.focus();
    if (!selectedTags || !selectedTags.length) return;
    setSelectedTags(selectedTags);
    props.onSelected(selectedTags);
    inputRef.current!.value = `${selectedTags.join(",")},`;

    // setState(
    //   (prevState: any) => {
    //     return { ...prevState, selectedTags };
    //   },
    //   () => {
    //     notifyParents();
    //   }
    // );
  };

  const onSelectFromMatchingTags = (selectedTag: string) => {
    const newSelectedTags = [...selectedTags, selectedTag];
    setSelectedTags(newSelectedTags);
    inputRef.current!.value = `${newSelectedTags.join(",")},`;
    props.onSelected(newSelectedTags); // this is under scrutiny
    // setState(
    //   (prevState: any) => {
    //     return { ...prevState, selectedTags, matchingTags: [] };
    //   },
    //   () => {
    //     notifyParents();
    //   }
    // );
    inputRef.current!.focus();
  };

  const addToSelected = (tag: string) => {
    setSelectedTags([...selectedTags, tag]);
    props.onSelected(selectedTags); // under scrutiny
  };

  const removeLastSelectedTag = () => {
    selectedTags.pop();
    setSelectedTags(() => {
      const res: string[] = [];
      for (let i = 0; i < selectedTags.length - 1; i++) {
        const t = selectedTags[i];
        res.push(t);
      }

      return res;
    });
    props.onSelected(selectedTags); // under scrutiny
  };

  const setInputToSelected = () => {
    inputRef.current!.value = `${selectedTags.join(",")},`;
    setMatchingTags([]);
    setInvalidTagMsg(null);
  };

  // getInputSelection = (node: any) => {
  //   const startPos = node.selectionStart;
  //   const endPos = node.selectionEnd;
  //   return { startPos, endPos };
  // };

  const handleBackspaceOrDelete = (e: any) => {
    const key = e.keyCode || e.charCode;

    if (key === 8 || key === 46) {
      removeLastSelectedTag();
      setInputToSelected();
    }
  };

  const moveCursorToEnd = () => {
    if (inputRef.current!.value) {
      inputRef.current!.selectionStart = inputRef.current!.selectionEnd = 100000;
    }
  };

  const onClickInput = () => {
    moveCursorToEnd();
  };

  const onKeyDownInput = (event: any) => {
    moveCursorToEnd();
    handleBackspaceOrDelete(event);
  };

  const checkTagSelected = (tag: string) => {
    return selectedTags.includes(tag);
  };

  const onChangeInput = (e: any) => {
    const {
      target: { value }
    } = e;
    const trimmed = value.trim();
    if (value.charAt(value.length - 1) === " ") {
      inputRef.current!.value = trimmed;
      return;
    } else if (trimmed.includes(",,")) {
      inputRef.current!.value = trimmed.slice(0, -1);
      return;
    }

    const enteredTags = trimmed.split(",").filter((t: string) => !!t);
    const lastTag = enteredTags[enteredTags.length - 1];

    const lastChar = trimmed.charAt(trimmed.length - 1);
    if (lastChar === ",") {
      const lastTagExists = allTags.current!.includes(lastTag);
      if (!lastTagExists) {
        setInvalidTagMsg(`Tag ${lastTag} does not exist`);
        return;
      }

      const alreadySelected = checkTagSelected(lastTag);
      if (alreadySelected) {
        setInputToSelected();
        return;
      }

      addToSelected(lastTag);
      setMatchingTags([]);
    } else {
      const matchingTags = allTags.current!.filter((t: string) =>
        t.includes(lastTag)
      );
      setMatchingTags(matchingTags);
    }

    /*  
    if backspace or delete, delete the whole previous word
    How to detect backspace or delte
    */
  };

  const toggleAllTags = (show: boolean) => () => {
    setShowAllTags(show);
  };

  return (
    <Query query={GET_QUESTIONS_TAGS} errorPolicy="all">
      {({ loading, error, data: { questionsTags: tags } }) => {
        allTags.current = tags;

        return (
          <TagsWrapper>
            {showAllTags && (
              <AllTags
                tags={tags}
                onSelect={onSelectFromAllTags}
                onClose={hideAllTagsWindow}
              />
            )}
            <InputRow>
              <Input
                ref={inputRef}
                placeholder="Search by tag..."
                onClick={onClickInput}
                onChange={onChangeInput}
                onKeyDown={onKeyDownInput}
                type="text"
              />
              <Anchor onClick={toggleAllTags(true)}>all</Anchor>
            </InputRow>
            {invalidTagMsg && <InvalidText>{invalidTagMsg}</InvalidText>}
            {matchingTags.length > 0 && (
              <MatchingTags
                tags={matchingTags}
                onSelect={onSelectFromMatchingTags}
              />
            )}
          </TagsWrapper>
        );
      }}
    </Query>
  );
};

export default QuestionTags;
