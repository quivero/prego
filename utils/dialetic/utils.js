import { applyArtifact } from "../testing/utils"
import { isReasoning, isPremise } from "./checkers";


export const applyReasoningArtifact = (candidate, reasoningCallback) => applyArtifact(
  candidate, isReasoning, reasoningCallback
);

const premiseKeyValueCallback = (premise) => [premise.key, premise.value];
export const getPremisesEntries = ( premises ) => {
  return applyArtifact(premises, isPremise, premiseKeyValueCallback);
}

const premiseKeyCallback = (premise) => premise.key;
export const getPremiseKeys = ( premises ) => {
  return applyArtifact(premises, isPremise, premiseKeyCallback);
}
