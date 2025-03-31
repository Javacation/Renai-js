interface Label<T> {
  readonly _label: T;
}

type ExtractLabelMap<Yld extends LabeledError<string>> = {
  [key in Yld['_label']]: (error: Extract<Yld, { _label: key }>) => unknown;
};

export class LabeledError<T> extends Error implements Label<T> {
  readonly _label: T;

  constructor(
    ro: {
      caller: Function;
      message: any;
    }
  ) {
    const { caller, message } = ro;
    super(message);
    this._label = caller.name as T;
  }

  static of<T>(
    this: new (...args: any[]) => LabeledError<T>,
    ro: any
  ): LabeledError<T> {
    const result = new this({ message: ro, caller: this });
    return result;
  }
}

export class UnknownError extends LabeledError<'UnknownError'> {}

/** 
 * @description Renai return may be error Handling function return type or Generator return type. (or null)
*/
export function renai <Nxt, Rtn, Yld extends LabeledError<string>>(
  generator: (...args: any[])=> Generator<Yld, Rtn, Nxt>,
  errorHandler: Partial<ExtractLabelMap<Yld> & Record<'UnknownError', (error: UnknownError) => unknown>>
): unknown {
  let result: unknown = null;
  errorHandler = {
    UnknownError: (error: UnknownError) => {
      // console.error('UnknownError:', error.message);
      return error;
    },
    ...errorHandler
  };
  
  try {
    const itr = generator();
    let next = null;

    do {
      next = itr.next();
      result = next.value;

      if (result instanceof Error) throw result;
    } while (Boolean(next.done) === false);
  }
  catch (err) {
    result = err;
    const labeledError = err instanceof LabeledError ? err : UnknownError.of(err);
    const errorFunction = errorHandler[ labeledError._label as keyof typeof errorHandler ];

    if( errorFunction ) {
      result = errorFunction(labeledError as Extract<Yld, { _label: typeof labeledError._label }>);
    } else {
      result = errorHandler['UnknownError']!(labeledError as UnknownError);
    }
  }
  finally {
    return result;
  }
}