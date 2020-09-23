---
layout: package
title: util-array-object-or-both
---

## Purpose

It standardises the input strings a user has given:

| <br>               | Assumed to be an array-type | object-type | either type  |
| ------------------ | --------------------------- | ----------- | ------------ |
| **Input string:**  | `array`                     | `object`    | `any`        |
| <br>               | `arrays`                    | `objects`   | `all`        |
| <br>               | `arr`                       | `obj`       | `everything` |
| <br>               | `aray`                      | `ob`        | `both`       |
| <br>               | `arr`                       | `o`         | `either`     |
| <br>               | `a`                         |             | `each`       |
| <br>               |                             |             | `whatever`   |
| <br>               |                             |             | `e`          |
| <br>               | `----`                      | `----`      | `----`       |
| **Output string:** | `array`                     | `object`    | `any`        |

{% include "btt.njk" %}

## API

**{{ packageJsons["util-array-object-or-both"].lect.req }}(str, \[opts])**

In other words, it's a function which takes two input arguments, second-one being optional (marked by square brackets).

If the input is valid, normalised version: `array` or `object` or `any` will be returned.

If the input is not valid, an error will be thrown.

| Input argument | Type         | Obligatory? | Description                                                                 |
| -------------- | ------------ | ----------- | --------------------------------------------------------------------------- |
| `input`        | String       | yes         | Let users choose from variations of "array", "object" or "both". See above. |
| `opts`         | Plain object | no          | Optional Options Object. See below for its API.                             |

Options object lets you customise the `throw`n error message. It's format is the following:

```js
`${opts.msg}The ${opts.optsVarName} was customised to an unrecognised value: ${str}. Please check it against the API documentation.`
```

| `options` object's key | Type   | Obligatory? | Default                                               | Description                                    |
| ---------------------- | ------ | ----------- | ----------------------------------------------------- | ---------------------------------------------- |
| `msg`                  | String | no          | `` | Append the message in front of the thrown error. |
| `optsVarName`          | String | no          | `given variable`                                      | The name of the variable we are checking here. |

For example, set `optsVarName` to `opts.only` and set `msg` to `ast-delete-key/deleteKey(): [THROW_ID_01]` and the error message `throw`n if user misconfigures the setting will be, for example:

```js
`ast-delete-key/deleteKey(): [THROW_ID_01] The variable "opts.only" was customised to an unrecognised value: sweetcarrots. Please check it against the API documentation.`
```

{% include "btt.njk" %}

## API - Output

Returns one of three possible string values: `"array"` or `"object"` or `"any"`.

## Use

```js
// require this library:
const arrObjOrBoth = require('util-array-object-or-both')
// and friends:
const clone = require('lodash.clonedeep')
const checkTypes = require('check-types-mini')
const objectAssign = require('object-assign')
// let's say you have a function:
function myPrecious (input, opts) {
  // now you want to check your options object, is it still valid after users have laid their sticky paws on it:
  // define defaults:
  let defaults = {
    lalala: null,
    only: 'object' // <<< this is the value we're particularly keen to validate, is it `array`|`object`|`any`
  }
  // clone the defaults to safeguard it, and then, object-assign onto defaults.
  // basically you fill missing values with default-ones
  opts = objectAssign(clone(defaults), opts)
  // now, use "check-types-mini" to validate the types:
  checkTypes(opts, defaults,
    {
      // give a meaningful message in case it throws,
      // customise the library `check-types-mini`:
      msg: 'my-library/myPrecious(): [THROW_ID_01]',
      optsVarName: 'opts',
      schema: {
        lalala: ['null', 'string'],
        only: ['null', 'string']
      }
    }
  )
  // by this point, we can guarantee that opts.only is either `null` or `string`.
  // if it's a `string`, let's validate is its values among accepted-ones:
  opts.only = arrObjOrBoth(opts.only, {
    msg: 'my-library/myPrecious(): [THROW_ID_02]',
    optsVarName: 'opts.only'
  })
  // now we can guarantee that it's either falsy (undefined or null) OR:
  //   - `object`
  //   - `array`
  //   - `any`

  // now you can use `opts.only` in your function safely.
  ...
  // rest of the function...
}
```

{% include "btt.njk" %}

## Use

We are going to use it in:

- [ast-monkey](/os/ast-monkey/)
- [json-variables](/os/json-variables/)
- [object-delete-key](/os/object-delete-key/)

{% include "btt.njk" %}
