export class NotImplementedError extends Error {
    constructor(message = "") {
      super(message);
      this.name = "NotImplementedError";
    }
  }

  export const interfaceError = () => NotImplementedError("This is an interface.");
