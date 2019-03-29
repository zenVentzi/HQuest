import React, { useEffect, useState, useRef } from "react";
import {
  AnswerFieldsEditions,
  LikeAnswerEditionMutation,
  LikeAnswerEditionVariables
} from "GqlClient/autoGenTypes";
import { MutationFn } from "react-apollo";
import { toast } from "react-toastify";
import { getLoggedUserId, withPropsChecker } from "Utils";
import EditionPicker from "./EditionPicker";
import Edition from "./Edition";

interface EditionsProps {
  editions: AnswerFieldsEditions[];
  answerId: string;
  likeEdition: MutationFn<
    LikeAnswerEditionMutation,
    LikeAnswerEditionVariables
  >;
}

const Editions = (props: EditionsProps) => {
  const latestEdition = props.editions[props.editions.length - 1];
  const [pickedEditionId, setPickedEditionId] = useState<string | null>(
    latestEdition.id
  );

  const onPickEdition = (all: boolean, pickedEdId?: string) => {
    if (all) {
      setPickedEditionId(null);
    } else {
      setPickedEditionId(pickedEdId!);
    }
  };

  return (
    <>
      <EditionPicker
        allEditions={props.editions}
        pickedEditionId={pickedEditionId}
        onPickEdition={onPickEdition}
      />
      {pickedEditionId ? (
        <Edition
          showComments={true}
          answerId={props.answerId}
          edition={props.editions.find(ed => ed.id === pickedEditionId)!}
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
