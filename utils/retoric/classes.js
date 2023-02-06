import { isBoolean } from "lodash";

import { InterfaceError } from "../errors/errors";
import { andify, orify } from "../testing/utils";
import { applyReasoningArtifact, batchAnd, batchOr, getPremisesEntries } from "./utils";

export class Reasoning  {

  _booleanReduceMap = undefined;

  constructor(key, description, value) {
    this.key = key;
    this.description = description;
    this.value = value;
  }

  // Children MUST override this method
  toPremise( ) {
    throw new InterfaceError();
  }

  // Children MUST override this method
  toArgument( ) {
    throw new InterfaceError();
  }

  toConclusion() {
    throw new InterfaceError();
  }

  // Children MUST override this method
  toThought( ) {
    return {
      "arguments": this.toArgument(),
      "conclusion": this.toConclusion()
    };
  }

  toString( ) {
    return this.verbalize();
  }

  argue( ) {
    return this.toArgument();
  }

  conclude( ) {
    return this.toConclusion();
  }

  think( ) {
    return this.toThought( );
  }

  // Children MUST override this method
  verbalize( ) {
    throw new InterfaceError();
  }
}

export class Premise extends Reasoning {

    constructor( key, description, value ) {
      super(key, description, value);
    }

    toArgument( ) {
      return Object.fromEntries([[this.key, this.value]]);
    }

    toConclusion() {
      return this.value;
    }

    toPremise( ) {
      return this;
    }

    verbalize( ) {
      return `(${this.key}:${this.value})`;
    }
}

export class Conjunction extends Reasoning {

  constructor( key, description, value ) {
    super(key, description, value);
    this._booleanReduceMap = batchAnd;
  }

  toPremise( ) {
    const talkMap = (premise) => premise.verbalize();
    const arguments_ = andify(applyReasoningArtifact(this.value, talkMap));
    const conjunctionAsPremiseKey = `${this.key}=${arguments_}`;

    return new Premise(conjunctionAsPremiseKey, this.description, this.conclude());
  }

  toArgument( ) {
    return Object.fromEntries(
      getPremisesEntries( this.value )
    );
  }

  toConclusion( ) {
    const concludeMap = (premise) => premise.conclude();
    const conclusion = applyReasoningArtifact( this.value, concludeMap );
    const IsBooleanCondition = isBoolean(conclusion);

    return IsBooleanCondition ? conclusion : this._booleanReduceMap(conclusion);
  }

  verbalize( ) {
    return this.toPremise().toString();
  }
}

export class Injunction extends Reasoning {
  constructor( key, description, value ) {
    super(key, description, value);
    this._booleanReduceMap = batchOr;
  }

  toPremise( ) {
    const talkMap = (premise) => premise.verbalize();
    const arguments_ = orify(applyReasoningArtifact(this.value, talkMap));
    const injunctionAsPremiseKey = `${this.key}=${arguments_}`;

    return new Premise(injunctionAsPremiseKey, this.description, this.conclude());
  }

  toArgument( ) {
    return Object.fromEntries(getPremisesEntries( this.value ));
  }

  toConclusion( ) {
    const concludeMap = (premise) => premise.conclude();
    const conclusion = applyReasoningArtifact( this.value, concludeMap );
    const IsBooleanCondition = isBoolean(conclusion);

    return IsBooleanCondition ? conclusion : this._booleanReduceMap(conclusion);
  }

  verbalize( ) {
    return this.toPremise().toString();
  }
}
