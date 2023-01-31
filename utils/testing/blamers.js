import { isCondition } from "./utils";
import { defaultArrayTruthMessage } from "./defaults";
import { arrayTruthError } from "./errors";


export const blameArrayElements = (
    array, truthCallback, truthMessage=defaultArrayTruthMessage
  ) => {
    const truthArray = array.map(truthCallback);
    const falseElements = whosFalse(truthArray);
    const truthError = arrayTruthError(falseElements, truthMessage);

    const truthCondition = areArrayElements(array, truthCallback);
    return isCondition(
      truthCondition, (x) => x, truthCondition, truthError.message, truthError.type
    );
};
