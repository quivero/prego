import { applyArtifact } from "../testing/utils"
import { isPremise } from "./checkers";

const premiseKeyValueCallback = (premise) => [premise.key, premise.value];
const premiseKeyCallback = (premise) => premise.key;

export const getPremisesEntries = ( premises ) => {
  return applyArtifact(premises, isPremise, premiseKeyValueCallback);
}

export const getPremiseKeys = ( premises ) => {
  return applyArtifact(premises, isPremise, premiseKeyCallback);
}