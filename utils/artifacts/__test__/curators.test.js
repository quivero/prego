import { isString } from "lodash";
import { 
  catalogArtifactItems, 
  catalogArtifactsInCollection, 
  hasArtifactItemInCollection 
} from "../curators";

let result, expectation, candidate;

describe(
  "Artifact", 
  () => {
    it("must check for existence of valid items", () => {
      candidate = [1, 2, 3, "4"];

      result = catalogArtifactItems(candidate, isString)
      expectation = [false, false, false, true];
    
      expect(result).toStrictEqual(expectation);

      candidate = [1, 2, 3, 4];

      result = catalogArtifactItems(candidate, isString)
      expectation = false;
    
      expect(result).toStrictEqual(expectation);
    
      candidate = 42;

      result = catalogArtifactItems(candidate, isString)
      expectation = false;
    
      expect(result).toStrictEqual(expectation);
    
      candidate = "42";

      result = catalogArtifactItems(candidate, isString)
      expectation = [ true ];
    
      expect(result).toStrictEqual(expectation);
    });

    it("must check for existence of valid items", () => {
      const hasArtifactItem_ = (el) => hasArtifactItemInCollection(el, isString);

      candidate = 42;

      result = hasArtifactItem_(candidate);
      expectation = false;
    
      expect(result).toBe(expectation);
    
      candidate = "42";

      result = hasArtifactItem_(candidate);
      expectation = true;
    
      expect(result).toBe(expectation);
    
      candidate = ["7", "42"];

      result = hasArtifactItem_(candidate);
      expectation = true;
    
      expect(result).toBe(expectation);
    
      candidate = ["42", 42];

      result = hasArtifactItem_(candidate);
      expectation = true;
    
      expect(result).toBe(expectation);
    
      candidate = [42, 42];

      result = hasArtifactItem_(candidate);
      expectation = false;
    
      expect(result).toBe(expectation);
    
      candidate = [42, [42, 42]];

      result = hasArtifactItem_(candidate);
      expectation = false;
    
      expect(result).toBe(expectation);
    
      candidate = ["42", [42, 42]];

      result = hasArtifactItem_(candidate);
      expectation = true;
    
      expect(result).toBe(expectation);
    
      candidate = [42, ["42", 42]];
    
      result = hasArtifactItem_(candidate);
      expectation = true;
    
      expect(result).toBe(expectation);
    });

    it(
      "must check for existence of valid items", 
      () => {
        const catalogCallback = (el) => catalogArtifactsInCollection(el, isString);
      
        candidate = "42";

        result = catalogCallback(candidate);
        expectation = [ true ];
      
        expect(result).toStrictEqual(expectation);
      
        candidate = ["7", "42"];

        result = catalogCallback(candidate);
        expectation = [ true, true ];
      
        expect(result).toStrictEqual(expectation);
      
        candidate = 42;
      
        result = catalogCallback(candidate);
        expectation = false;
      
        expect(result).toStrictEqual(expectation);
      
        candidate = ["42", 42];

        result = catalogCallback(candidate);
        expectation = [ [ true ], false ];

        expect(result).toStrictEqual(expectation);

        candidate = [42, 42];

        result = catalogCallback(candidate);
        expectation = false;
      
        expect(result).toStrictEqual(expectation);
      
        candidate = [42, [42, 42]];

        result = catalogCallback(candidate);
        expectation = false;
      
        expect(result).toStrictEqual(expectation);
      
        candidate = ["42", [42, 42]];

        result = catalogCallback(candidate);
        expectation = [ [ true ], false ];
      
        expect(result).toStrictEqual(expectation);

        candidate = [42, ["42", 42]];

        result = catalogCallback(candidate);
        expectation = [ false, [ true, false ] ];
      
        expect(result).toStrictEqual(expectation);

      }
    )
  }
);