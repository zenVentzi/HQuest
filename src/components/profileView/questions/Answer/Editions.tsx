import React, { useEffect, useState, useRef } from "react";
import {
  AnswerFieldsEditions,
  LikeAnswerEditionMutation,
  LikeAnswerEditionVariables
} from "GqlClient/autoGenTypes";
import { MutationFn } from "react-apollo";
import { toast } from "react-toastify";
import { getLoggedUserId } from "Utils";
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
  const [pickedEditions, setPickedEditions] = useState<AnswerFieldsEditions[]>([
    latestEdition
  ]);

  const onPickEdition = (all: boolean, pickedEditionId?: string) => {
    if (all) {
      setPickedEditions(props.editions);
    } else {
      const pickedEdition = props.editions.find(
        ed => ed.id === pickedEditionId
      );
      if (!pickedEdition) {
        throw Error(`Couldn't find edition with id ${pickedEditionId}`);
      }
      setPickedEditions([pickedEdition]);
    }
  };

  return (
    <>
      <EditionPicker
        allEditions={props.editions}
        pickedEditionId={
          pickedEditions.length === 1 ? pickedEditions[0].id : undefined
        }
        onPickEdition={onPickEdition}
      />
      {pickedEditions
        .slice()
        .reverse()
        .map(ed => (
          <Edition
            key={ed.id}
            answerId={props.answerId}
            edition={ed}
            likeEdition={props.likeEdition}
          />
        ))}
    </>
  );
};

export default Editions;
