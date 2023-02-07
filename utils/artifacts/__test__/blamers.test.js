import { artifactErrorMessage } from "../blamers";

let result, expectation;

describe("errorMessage", () => {
  it("must match artifact message snippet", () => {
    result = artifactErrorMessage();
    expectation = "An artifact is ";

    expect(result).toMatch(expectation);
  });
  it("must match criteria snippet", () => {
    const criteria = "These are item criteria.";

    result = artifactErrorMessage(criteria);
    expectation = criteria;

    expect(result).toMatch(expectation);
  });
});
