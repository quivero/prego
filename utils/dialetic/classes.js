import { interfaceError } from "../errors/errors";
import { applyArtifact } from "../testing/utils";
import { isPremise } from "./checkers";
import { toConclusion } from "./transformers";

class Reasoning  {

  _booleanReduceMap = undefined;
  _defaultValue = null;

  constructor(key, description, value) {
    this.key = key;
    this.description = description;
    this.value = value;
  }

  // Children MUST override this method
  toArgument( ) {
    throw interfaceError();
  }

  argue( ) {
    return this.toArgument();
  }

  conclude( ) {
    return toConclusion(this.value, this._booleanReduceMap, this._defaultValue);
  }

  // Children MUST override this method
  verbalize( ) {
    throw interfaceError();
  }

  // Children MUST override this method
  toPremise( ) {
    throw interfaceError();
  }

  toString( ) {
    return this.verbalize();
  }
}

export class Premise extends Reasoning {

    constructor( key, description, value ) {
      super(key, description, value);
    }

    toArgument( ) {
      return Object.fromEntries([this.key, this.value]);
    }

    conclude( ) {
      return this.value;
    }

    verbalize( ) {
      return `(${this.key}:${this.value})`;
    }

    toPremise( ) {
      return this;
    }
}

export class Conjunction extends Reasoning {

  constructor( key, description, value ) {
    super(key, description, value);
    this._booleanReduceMap = batchAnd;
    this._defaultValue = true;
  }

  toPremise( ) {
    const talkMap = (premise) => premise.verbalize();
    const arguments_ = andify(applyArtifact(this.value, isPremise,  talkMap));
    const conjunctionAsPremiseKey = `${this.key}-${arguments_}`;
    
    return new Premise(conjunctionAsPremiseKey, this.description, this.conclude());
  }

  toArgument( ) {
    return Object.fromEntries(getPremisesEntries( this.value ));
  }

  verbalize( ) {
    return this.toPremise().toString();
  }
}

export class Injunction extends Reasoning {
  constructor( key, description, value ) {
    super(key, description, value);
    this._booleanReduceMap = batchOr;
    this._defaultValue = false;
  }

  toPremise( ) {
    const talkMap = (premise) => premise.verbalize();
    const arguments_ = orify(applyArtifact(this.value, isPremise,  talkMap));
    const injunctionAsPremiseKey = `${this.key}-${arguments_}`;
    
    return new Premise(injunctionAsPremiseKey, this.description, this.conclude());
  }

  toArgument( ) {
    return Object.fromEntries(getPremisesEntries( this.value ));
  }

  verbalize( ) {
    return this.toPremise().toString();
  }
}