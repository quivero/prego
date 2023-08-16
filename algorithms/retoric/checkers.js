import { isUndefined } from 'lodash';
import { Conjunction, Injunction, Premise, Reasoning } from './classes';

import { is } from 'arqeo';

export const isDefined = (candidate) => !isUndefined(candidate);

export const isReasoning = (candidate) => candidate instanceof Reasoning;
export const isPremise = (candidate) => candidate instanceof Premise;
export const isConjunction = (candidate) => candidate instanceof Conjunction;
export const isInjunction = (candidate) => candidate instanceof Injunction;

export const isReasoningArtifact = (candidate) =>
  is(candidate, isReasoning);
export const isPremiseArtifact = (candidate) =>
  is(candidate, isPremise);
export const isInjunctionArtifact = (candidate) =>
  is(candidate, isInjunction);
export const isConjunctionArtifact = (candidate) =>
  is(candidate, isConjunction);
