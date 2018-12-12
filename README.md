# Counselor <Project Proposal / Working Document>

> "JavaScript File Types"

## Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Essential Learnings](#essential-learnings)
- [Quick Examples](#quick-examples)
- [Example Query / Rule](#example-query--rule)
- [Example Code Enforce](#example-code-enforce)
- [Recipies](#recipies)
- [Syntax Examples](#syntax-examples)
  - [1. Method Chain](#1-method-chain)
  - [2. Query / Action](#2-query--action)
  - [3. Chaining sorta?](#3-chaining-sorta)
- [Type Thoughts](#type-thoughts)
- [AST Options](#ast-options)
  - [Tree Sitter](#tree-sitter)
- [Questions](#questions)
- [Use case parking lot](#use-case-parking-lot)
- [JSON based Query](#json-based-query)
- [Many ways of doing the same thing](#many-ways-of-doing-the-same-thing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Essential Learnings
 
What I am looking for is a way to take a TypeScript file and query for the different parts and pieces of code. Then you can assert different things to be consistent for all thoses pieces of code. 

## Quick Examples

* Prohibit file from containing any `const`
* Prohibit file from containing any `async`
* Prohibit file from containing any `imports`
* Prohibit file from containing any `export default`
* Prohibit file from containing any `arrow functions`

## Example Query / Rule

Query for any `ImportDecloration`

* Prohibit `redux`
* Require `lodash`

Query for any `InterfaceDefinitions`

* Require all of them to be __named a certain way__
* Prohibit them from the file
* Require file to have `InterfaceDefinitions`
* Prohibit a specific type for a given `InterfaceDefinition`

Query for any `InterfaceDefinitions` named `/.+NoDate/`

* Prohibit `Date` type

Query for any `FunctionDecloration` named `/getCustomer.+`

* Require to pass in `customer` as first argument

Query for any `FunctionDecloration` with `ExportKeyword` and `DefaultKeyword` modifiers

* Require this.

Query for all `FunctionDeclorations` 

* Require `async`

Query for single class exported default named `/.+DAO/`. (Require)
Query class methods matching `/.+pgdb.+/`

* Require only methods that call method of `this.pgdb`

Query for single class exported default. (Require)
Query class methods matching `/.+mongo.+/`

* Require only methods that call method of `this.mongo`

Query for single class exported default. (Require)
Query class all methods

* Require none call `this.mongo` or `this.pgdb`

## Example Code Enforce

```typescript
export const LOVE = 'love'
export default LOVE
```

```typescript
export const LOVE = 'love'
export default 'love'
```

```typescript
export default 'love'
```

```typescript
export const LOVE = 'love'
```

```typescript
export default class Love {

}
```

## Recipies

I'd like to get to the point that there are "recipies" for different file types. Essentially this would allow for a paradigm shift in the way people organize code. When you start a project using these recipies you can see that there are consistent folders with requirements on what can and cannot exist within.

Ideas for recipies:

* `recipies/` (return a file recipe)
* `express-middlewares/` (return a express middleware)
* `express-apps/` (return express app)
* `graph-schemas/` (return a graph schema)
* `dumb-react-components/` (return a dumb component)
* `hoc-react-components/` (return a higher order component)
* `dumb-react-native-components/` (return a dumb react native component)
* `hoc-react-native-components/`(return a dumb higher order react native component)
* `models/` (return a specific model entity)
* `utils/` (file of functions)
* `daos/` (file with one class)
* `no-deps/` (file with no imports)

## Syntax Examples

### 1. Method Chain

The example below is of plain english AST traversal with method chaining, the `recipie` would require `react` and prohibit `redux` from the file, it would then assign a `const` called `Component` as a `anonymous function`, then it would `export default Component` outling a "Dumb React Component".

```typescript
import Counselor, { CONST, ANONYOUS_FUNCTION} from 'counselor'

export default new Counselor()
    .manditory.import('react')
    .prohibited.import('redux')
    .import.limit(3)
    .export.limit(1)
    .declare(CONST).as(ANONYMOUS_FUNCTION).named('Component')
    .export.default.assigned('Component')
    .advise()
```

### 2. Query / Action

```typescript
import Counselor, { CONST, ANONYOUS_FUNCTION} from 'counselor'
export default new Counselor()
    .clause
        .where.import.prohibit('react')
    .clause
        .where.function.argument(0).isDestructured()
        .where.function.argument(0).has('customer')
        .where.function.returns.type('boolean')
            .have.name.match(/validateCustomer.+/)
                .completeClause()
    .clause
        .where.function.argument(0).isDestructured()
        .where.function.argument(0).has('customer')
        .where.function.returns.type('string')
            .have.name.match(/getCustomer.+/)
                .completeClause()
    .clause
        .where.children
            .have.only.type(NAMED_FUNCTION)
            .have.no.export.default()
                .completeClause()
    .clause
        .where.exports
            .completeClause()
    .clause
        .where.function.named('love') // just needs to match this query
            .completeClause()
    .clause
        .where.export.default
            .has.assignment('love')
                .completeClause()
    .audit()
```

### 3. Chaining sorta?

```ts
import counselor from 'counselor'

counselor.import
    .manditory('react')
    .prohibited('redux')
    .limit(3)

const dao = counselor.declare.class(/.+DAO/, {
    methods: {
        "async .+pgdb.+": () => {
            counselor.must.utilize(['this.pgdb'])
        },
        "async .+mongo.+": () => {
            counselor.must.utilize(['this.mongo'])
        }
    }
});

counselor.exportDefault(dao)

export default counselor.audit()
```

## Type Thoughts

```typescript
enum RelationalOperator {
    DOUBLE_EQUALS = '==',
    TRIPPLE_EQUALS = '===',
    NOT_EQUAL = '!==',
    GREATER_THAN = '>',
    LESS_THAN = '<',
    GREATER_THAN_OR_EQUAL_TO = '>=',
    LESS_THAN_OR_EQUAL_TO = '<=',
}

enum DeclorationTypes {
    CONST = 'CONST',
    VAR = 'VAR',
    LET = 'LET',
}

enum PrimitaveTypes {
    NUMBER = 'NUMBER',
    STRING = 'STRING',
    ARRAY = 'ARRAY',
    OBJECT = 'OBJECT',
    NULL = 'NULL',
    BOOLEAN = 'BOOLEAN',
    UNDEFINED = 'UNDEFINED',
    CLASS = 'CLASS',
    INSTANTIATED_CLASS = 'INSTANTIATED_CLASS',
}

enum FunctionTypes {
    ARROW_FUNCTION = 'ARROW_FUNCTION',
    NAMED_FUNCTION = 'NAMED_FUNCTION',
    ANONYMOUS_FUNCTION = 'ANONYMOUS_FUNCTION',
}
```

## AST Options

### Tree Sitter

```typescript
import * as TypeScript from 'tree-sitter-typescript';
import * as Parser from 'tree-sitter';
const parser = new Parser();
parser.setLanguage(TypeScript);
const tree = parser.parse(`const alpha = 'hello world';`)
console.log(tree.rootNode.toString());
```

## Questions 

> How do you ensure a javasript file isn't executing any code? 

## Use case parking lot

* no root level function execution
* no root level const
* no root level import statments
* all root level functions are exported
* root level export one const
* check function for if statements
* check function for try / catch
* check function for switch
* check every function has async keyword
* every method has async keyword
* targeted methods have async in name "appending Async"
* force function naming based on input or return type 
* functions that return booleans should always prepend with `is` (eg. `isNewYork`)


## JSON based Query

I was thinking of ways the recipe could be built with just JSON.

```json
[
    {
        "query": "/.+\\.ts/",
        "fileNameRules": {
            "pascalCase": true,
            "match": [
                "/.+\\.ts/"
            ]
        },
        "contentRules": {
            "manditoryImport": [
                "react"
            ],
            "prohibitImport": [
                "redux"
            ],
            "importLimit": 1,
            "exportLimit": 1,
            "functions": [
                {
                    "functionDeclaration": true,
                    "name": "!fileName"
                }
            ],
            "exports": [
                {
                    "default": true,
                    "arrowFunction": true
                }
            ]
        }
    }
]
```

## Many ways of doing the same thing

How do you validate across these?

```js
function example () {
    return 'example'
}

export default example
```

```js
export default function example () {
    return 'example'
}
```

```js
export default function () {
    return 'example'
}
```

```js
const example = () => {
    return 'example'
}

export default example
```

```js
export default () => {
    return 'example'
}
```