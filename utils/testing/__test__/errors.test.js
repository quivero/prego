import { organizationTypeError } from "../errors";

describe(
    "isCondition", 
    () => {
      it("should provide organization error", () => {
        const orgError = organizationTypeError('Not an organization');
        
        expect(orgError.message).toMatch('[]');
      });
    }
);
