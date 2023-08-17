import { apply } from 'arqeo';
import { isReasoning, isPremise } from './checkers';

/* -------------------------------------------------------------------------------------------------------------*\
 | Boolean operators                                                                                           |
\*------------------------------------------------------------------------------------------------------------- */

export const and = (acc, el) => acc && el;
export const or = (acc, el) => acc || el;

// TODO: Check if booleanList-variable is boolean array
export const batchAnd = (booleanList) => booleanList.reduce(and, true);
export const batchOr = (booleanList) => booleanList.reduce(or, false);

export const applyReasoningArtifact = (candidate, reasoningCallback) =>
  apply(candidate, isReasoning, reasoningCallback);

const premiseKeyValueCallback = (premise) => [premise.key, premise.value];

export const getPremisesEntries = (premises) =>
  apply(premises, isPremise, premiseKeyValueCallback);

const premiseKeyCallback = (premise) => premise.key;
export const getPremiseKeys = (premises) => apply(premises, isPremise, premiseKeyCallback);
