# Renai-js
Renai-js was created to simplify the difficult-to-see try-catch blocks.

# Feature
- Replace try-catch in typescript
- Based on generator function ※ function*() { ... }
- I think I got the name wrong

# Why?
- In TypeScript(or JS), when writing code, can't know which function might cause which error.   
  ※ It's not really a big deal, but I just made it because I was uncomfortable.

# Getting Started

### First, install Renai-js using npm.

```
npm install --save-dev renai-js
```

### Second, Find error throwing function in your code.
```typescript
// error.ts
export function randomOops(): '+_+' {
  const { 
    random, 
    floor 
  } = Math;
  const result: 0 | 1 | 2 | 3 = floor( random() * 100 ) % 4;
  
  switch( result ) {
    case 1: throw new Error('T_T'); break;
    case 2: throw new Error('X_X'); break;
    case 3: throw new Error('U_U'); break;
    default: return '+_+';
  }
}
```

### Third, Convert code like this
```typescript
// oops.ts
import { LabeledError } from 'renai-js';

export class T_TError extends LabeledError<'T_TError'> {};
export class X_XError extends LabeledError<'X_XError'> {};
export class U_UError extends LabeledError<'U_UError'> {};

export function* randomOops(): '+_+' {
  const { 
    random, 
    floor 
  } = Math;
  const result: 0 | 1 | 2 | 3 = floor( random() * 100 ) % 4;

  switch( result ) {
    case 1: yield T_TError.of('T_T'); break;
    case 2: yield X_XError.of('X_X'); break;
    case 3: yield U_UError.of('U_U'); break;
    default: return '+_+';
  }
}
```

### Fourth, Find and Replace try-catch block using Renai-js.
```typescript
/** Before ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
// play.ts
try {
  const result = randomOops();
}
catch(e) {
  switch( e.message ) {
    case 'T_T': /** error handling1 */ break;
    case 'X_X': /** error handling2 */ break;
    case 'U_U': /** error handling3 */ break;
    default   : /** unexcepted error handling */ break;
  }
}

/** After ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
// play.ts
import { renai, UnknownError } from 'renai-js';
import { randomOops, T_TError, X_XError, U_UError } from './oops';

/** Sorry, I'm not very good at TypeScript so I don't know how to extract the return value type, so it will come down to unknown. */
/** I'll try it later when I get a chance. */
const result: '+_+' | number | string | boolean | UnknownError = renai(
  randomOops,
  {
    'T_TError': (error: T_TError): number => { /** error handling1 */ },
    'X_XError': (error: X_XError): string => { /** error handling2 */ },
    'U_UError': (error: U_UError): boolean => { /** error handling3 */ },
    'UnknownError': (error: UnknownError): UnknownError => { /** unexcepted error handling */ }
  }
);
```

# Browser Version Support
### chorme 55+

| Browser | Version |
|----------------|-------------|
| Chorme | 55+ |
| Edge | 15+ |
| Safari | 11+ |
| Firefox | 52+ |
| Opera | 42+ |
| IE | Not Support |
※ referenced by "https://caniuse.com/"