import { LabeledError, renai } from '@/index';
import { describe, it, expect } from 'vitest'

class Error1 extends LabeledError<'Error1'> {}
class Error2 extends LabeledError<'Error2'> {}
class Error3 extends LabeledError<'Error3'> {}
class Error4 extends LabeledError<'Error4'> {}
class Error5 extends LabeledError<'Error5'> {}

const gena = function* () {
  yield Error1.of('');
  yield Error2.of('');
}

export const genb = function* () {
  yield* gena();
  yield Error3.of('');
  yield Error4.of('');
  yield Error5.of('');
}

describe('Renai', () => {
  it('renai test', () => {
    const a = renai(genb, {
      Error1: (err: Error1): number => {
        expect(err).toBeInstanceOf(Error1);
        return 1;
      },
      Error2: (err: Error2) => {
        expect(err).toBeInstanceOf(Error2);
        return 2;
      },
      Error3: (err: Error3) => {
        expect(err).toBeInstanceOf(Error3);
        return 3;
      },
      Error4: (err: Error4) => {
        expect(err).toBeInstanceOf(Error4);
        return 4;
      },
      Error5: (err: Error5) => {
        expect(err).toBeInstanceOf(Error5);
        return 5;
      }

    });
    expect(renai(genb, {})).toBeInstanceOf(Error1);
  });
})