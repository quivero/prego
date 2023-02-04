import { Conjunction, Injunction, Premise } from "../classes";

export const truePremise = Premise( 'true-premise-1', 'This is a true premise', true );
export const falsePremise = Premise( 'false-premise-1', 'This is a false premise', false );

const premises11 = [ truePremise, truePremise ];
const premises10 = [ truePremise, falsePremise ]
const premises01 = [ falsePremise, truePremise ];
const premises00 = [ falsePremise, falsePremise ];

export const injunction11 = new Injunction( 'injunction-1', 'This is a [true, true] injunction', premises11);
export const injunction10 = new Injunction( 'injunction-2', 'This is a [true, false] injunction', premises10);
export const injunction01 = new Injunction( 'injunction-3', 'This is a [false, true] injunction', premises01);
export const injunction00 = new Injunction( 'injunction-4', 'This is a [false, false] injunction', premises00);

export const conjunction11 = new Conjunction( 'conjunction-1', 'This is a [true, true] conjunction', premises11 );
export const conjunction10 = new Conjunction( 'conjunction-2', 'This is a [true, false] conjunction', premises10 );
export const conjunction01 = new Conjunction( 'conjunction-3', 'This is a [false, true] conjunction', premises01 );
export const conjunction00 = new Conjunction( 'conjunction-4', 'This is a [false, false] conjunction', premises00 );

export const injunctions = [ injunction11, injunction10, injunction01, injunction00 ];
export const expectInjunctionsConclusions = [true, true, true, false];

export const conjunction = [ conjunction11, conjunction10, conjunction01, conjunction00 ];
export const expectConjunctionsConclusions = [true, false, false, false];
