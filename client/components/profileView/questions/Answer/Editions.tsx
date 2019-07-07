import React, { useEffect, useState, useRef } from "react";
import {
  EditionFieldsFragment,
  LikeAnswerEditionMutation,
  LikeAnswerEditionMutationVariables
} from "GqlClient/autoGenTypes";
import { MutationFn } from "react-apollo";
import { toast } from "react-toastify";
import { getLoggedUserId, withPropsChecker } from "Utils";
import EditionPicker from "./EditionPicker";
import Edition from "./Edition";

interface EditionsProps {
  selectedEditionId?: string;
  editions: EditionFieldsFragment[];
  answerId: string;
  likeEdition: MutationFn<
    LikeAnswerEditionMutation,
    LikeAnswerEditionMutationVariables
  >;
}

const Editions = (props: EditionsProps) => {
  const latestEdition = props.editions[props.editions.length - 1];
  const [selectedEditionId, setSelectedEditionId] = useState<string | null>(
    props.selectedEditionId ? props.selectedEditionId : latestEdition.id
  );

  const onSelectEdition = (all: boolean, selectedEdId?: string) => {
    if (all) {
      setSelectedEditionId(null);
    } else {
      setSelectedEditionId(selectedEdId!);
    }
  };

  return (
    <>
      <EditionPicker
        allEditions={props.editions}
        pickedEditionId={selectedEditionId}
        onPickEdition={onSelectEdition}
      />
      {selectedEditionId ? (
        <Edition
          showComments={true}
          answerId={props.answerId}
          edition={props.editions.find(ed => ed.id === selectedEditionId)!}
          likeEdition={props.likeEdition}
        />
      ) : (
        props.editions
          .slice()
          .reverse()
          .map(ed => (
            <Edition
              key={ed.id}
              answerId={props.answerId}
              edition={ed}
              likeEdition={props.likeEdition}
            />
          ))
      )}
    </>
  );
};

export default Editions;
// export default withPropsChecker(Editions, "Editions");
