import { isBoolean } from "lodash";
import { isPremise } from "./checkers";

const concludeMap = (premise) => premise.conclude();

export const toConclusion = (premises, booleanReduceMap, defaultValue) => {
    const conclusion = applyArtifact( premises, isPremise, concludeMap);
    const IsBooleanCondition = isBoolean(conclusion);

    return IsBooleanCondition ? conclusion : conclusion.reduce(booleanReduceMap, defaultValue);
}
