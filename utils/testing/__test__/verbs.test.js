import { atest, batchAtest } from "../verbs";
import { additionFixtures, additionScenes, validAtestAct, validAtestFixture } from "./fixtures";

describe(
    "atest", 
    () => it("should assert atest", () => {
        atest(validAtestFixture, validAtestAct);
    })
);  

describe(
    "batchAtest", 
    () => it("should assert batchAtest",  () => {
        batchAtest(additionFixtures, additionScenes);
    })
);
  