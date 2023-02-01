import { atest, batchAtest } from "../verbs";
import { additionFixtures, additionScenes, validAtestAct, validAtestFixture } from "./fixtures";

describe(
    "atest",
    () => it("must assert atest", () => {
        atest(validAtestFixture, validAtestAct);
    })
);

describe(
    "batchAtest",
    () => it("must assert batchAtest",  () => {
        batchAtest(additionFixtures, additionScenes);
    })
);
