interface Label<T> {
  readonly _label: T;
}

type ExtractLabelMap<Yld extends LabeledError<string>> = {
  [key in Yld['_label']]: (error: Extract<Yld, { _label: key }>) => unknown;
};

/**
 * @description LabeledError is a class that extends the built-in Error class. It adds a label property to the error, which can be used to identify the type of error that occurred.
 */
export class LabeledError<T> extends Error implements Label<T> {
  readonly _label: T;

  constructor(
    ro: {
      caller: Function;
      message: any;
    }
  ) {
    /** caller.name(class name) => Erro._label */
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
/**
 * @description UnknownError is a class that extends the LabeledError class. It is used to represent an error that does not have a specific label. It is used as a fallback for errors that do not match any of the specified labels in the error handler.
 */
export class UnknownError extends LabeledError<'UnknownError'> {}

/** 
 * @description Renai return may be error Handling function return type or Generator return type. (or null)
 * @param generator - A generator function that yields LabeledError instances and returns a value of type Rtn.
 * @param errorHandler - An object that maps error labels to their corresponding error handling functions. Each function takes an error of the corresponding type and returns a value of type Rtn or undefined.
 * @returns - The return value of the generator function or the return value of the error handling function.
*/
export function renai<
  Nxt, 
  Rtn, 
  Yld extends LabeledError<string>, 
  ErrMap extends (Partial<ExtractLabelMap<Yld> & Record<'UnknownError', (error: UnknownError) => unknown>>)
>(
  generator: (...args: any[])=> Generator<Yld, Rtn, Nxt>,
  errorHandler: ErrMap 
): ( Rtn | undefined | ReturnType<Exclude<typeof errorHandler[keyof typeof errorHandler], undefined>> ) {
  let result: unknown = undefined;
  errorHandler = {
    UnknownError: (error: UnknownError) => {
      console.error(error);
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
    return result as ( Rtn | undefined | ReturnType<Exclude<typeof errorHandler[keyof typeof errorHandler], undefined>> );
  }
}

/**
 * @description RenaiAsync is a function that takes a generator function and an error handler object as arguments. It executes the generator function and handles any errors that occur during its execution. The error handler object maps error labels to functions that handle those errors.
 * @param generator - A generator function that yields LabeledError instances.
 * @param errorHandler - An object that maps error labels to functions that handle those errors.
 * @returns The return value of the generator function or the return value of the error handler function.
 */
export async function renaiAsync<
  Nxt, 
  Rtn, 
  Yld extends LabeledError<string>, 
  ErrMap extends (Partial<ExtractLabelMap<Yld> & Record<'UnknownError', (error: UnknownError) => unknown>>)
>(
  generator: (...args: any[])=> AsyncGenerator<Yld, Rtn, Nxt>,
  errorHandler: ErrMap 
): Promise<Rtn | undefined | ReturnType<Exclude<typeof errorHandler[keyof typeof errorHandler], undefined>>> {
  let result: unknown = undefined;
  errorHandler = {
    UnknownError: (error: UnknownError) => {
      console.error(error);
      return error;
    },
    ...errorHandler
  };
  
  try {
    const itr = generator();
    let next = null;

    do {
      next = await itr.next();
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
    return result as ( Rtn | undefined | ReturnType<Exclude<typeof errorHandler[keyof typeof errorHandler], undefined>> );
  }
}