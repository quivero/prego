import { isUndefined } from "lodash";
import { isArtifact } from "../testing/utils";
import { Conjunction, Injunction, Premise, Reasoning } from "./classes";

export const isReasoning = (candidate) => candidate instanceof Reasoning;
export const isPremise = (candidate) => candidate instanceof Premise;
export const isConjunction = (candidate) => candidate instanceof Conjunction;
export const isInjunction = (candidate) => candidate instanceof Injunction;

export const isDefined = ( candidate ) => !isUndefined(candidate);

export const isReasoningArtifact = (candidate) => isArtifact( candidate, isReasoning );
export const isPremiseArtifact = (candidate) => isArtifact( candidate, isPremise );
export const isInjunctionArtifact = (candidate) => isArtifact( candidate, isInjunction );
export const isConjunctionArtifact = (candidate) => isArtifact( candidate, isConjunction );
