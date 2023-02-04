import { Conjunction, Injunction, Premise } from "./classes";

export const isPremise = (candidate) => candidate instanceof Premise;
export const isConjunction = (candidate) => candidate instanceof Conjunction;
export const isInjunction = (candidate) => candidate instanceof Injunction;
