import { LabeledError, renai, renaiAsync } from '@/index';
import { describe, it, expect } from 'vitest'

class Error1 extends LabeledError<'Error1'> {}
class Error2 extends LabeledError<'Error2'> {}
class Error3 extends LabeledError<'Error3'> {}
class Error4 extends LabeledError<'Error4'> {}
class Error5 extends LabeledError<'Error5'> {}

const gen1 = function* () {
  yield Error1.of('');
  yield Error2.of('');
}

const gen2 = function* () {
  yield* gen1();
  yield Error3.of('');
  yield Error4.of('');
  yield Error5.of('');
  return '+_+' as const;
}

const async_gen1 = async function* () {
  yield Promise.resolve(Error1.of(''));
  yield Error2.of('');
}

const async_gen2 = async function* () {
  yield* gen1();
  yield Error3.of('');
  yield Error4.of('');
  yield Error5.of('');
  return '+_+' as const;
}

describe('Renai', () => {
  it('renai test', () => {
    expect(renai(gen2, {})).toBeInstanceOf(Error1);
  });

  it('renaiAsync test', async () => {
    expect((await renaiAsync(async_gen2, {}))).toBeInstanceOf(Error1);
  });

})