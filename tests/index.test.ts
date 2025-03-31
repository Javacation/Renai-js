import { LabeledError, once } from '@/index';
import { describe, it, expect } from 'vitest'
// import { LabeledError, once } from ''



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
  it('once test', () => {
    expect(once(genb, {})).toBeInstanceOf(Error1);
  });
})