import { InterfaceError, NotImplementedError } from "../errors";

describe(
  "Errors",
  () => {
    it(
      "must match defaultArrayTruthMessage on truthError message without truthMessage",
      () => {
        let message, error;
        message = "Fire!";
        error = new NotImplementedError(message);

        expect(error.message).toMatch(message);
        expect(error.name).toMatch("NotImplementedError");

        message = "";
        error = new NotImplementedError();

        expect(error.name).toMatch("NotImplementedError");
      }
    );
    it(
      "must check interfaceError", 
      () => {
        let message, error;
        message = "This is an interface";
        error = new InterfaceError();

        expect(error.message).toMatch(message);
        expect(error.name).toMatch("InterfaceError");
      }
    );
  }
);
