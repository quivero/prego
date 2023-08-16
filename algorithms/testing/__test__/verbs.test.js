import { atest } from "../verbs";
import { validAtestAct, validAtestFixture } from "./fixtures";

describe(
  "atest", () => it("must assert atest", () => {
    atest(validAtestFixture, validAtestAct)
  })
);
