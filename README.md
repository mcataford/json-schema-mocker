# schema-mockdata

## Overview & motivation

Hardcoding mock data is the devil's plaything. As your code evolves and grows, it's easy for its test suites to drift away from the real state of the your application. All it takes is forgetting to update your mock data alongside your schemas and suddenly, your tests are all invalid.

This package removes the need for hardcoded mock data by generating schema-compliant mock data on the fly based on your JSON Schema. This way, you can focus on what the mock data should __be like__ instead of __what it is__.

## Installing

_TBD_

## Usage

```
// Adjust the import for the fact that this isn't yet published on NPM.
import MockGenerator from 'schema-mockdata'

describe('My cool testsuite', () => {
    const myGenerator = new MockGenerator()
    it('Even cooler testcase', () => {
        const mySchema = { ... }
        const myMockData = myGenerator.buildMock(mySchema)

        // Use your mock data knowing it matches your schema!
    })
})
```

## Feature roadmap

### Types

#### Numeric types

- [x] `type`
- [x] `maximum`
- [x] `minimum`
- [x] `multipleOf`
- [x] `exclusiveMinimum` (Extrema are always exclusive)
- [x] `exclusiveMaximum` (Extrema are always exclusive)

#### Object

- [x] `type`
- [x] `properties`
- [ ] `additionalProperties`
- [ ] `required`
- [ ] `propertyNames.pattern`
- [ ] `minProperties`
- [ ] `maxProperties`
- [ ] `dependencies`
- [ ] `patternProperties`

#### Array

- [x] `type`
- [x] `items`
- [ ] `items` (tuple validation)
- [ ] `minItems`
- [ ] `maxItems`
- [ ] `uniqueItems`

#### Boolean

- [x] `type`

#### Null

- [x] `type`

#### String

- [x] `type`
- [ ] `pattern`
- [ ] `maxLength`
- [ ] `minLength`
- [ ] `format`
