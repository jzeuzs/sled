<div align="center">

# @tomiocodes/sled

**A key value database.**

[![GitHub](https://img.shields.io/github/license/1chiSensei/sled)](https://github.com/1chiSensei/sled/blob/main/LICENSE.md)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@tomiocodes/sled?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@tomiocodes/sled)
[![npm](https://img.shields.io/npm/v/@tomiocodes/sled?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@tomiocodes/sled)

</div>

**Table of Contents**

-   [@tomiocodes/sled](#tomiocodessled)
    -   [Description](#description)
    -   [Features](#features)
    -   [Installation](#installation)
    -   [Usage](#usage)
        -   [Basic Usage](#basic-usage)
        -   [Configuration](#configuration)
    -   [API Documentation](#api-documentation)

## Description

A simple key-value database.

## Features

-   Written in TypeScript
-   Offers CommonJS, ESM bundles
-   Fully tested
-   Powered by Rust
-   Persistent

## Installation

```sh
yarn add @tomiocodes/sled
# npm install @tomiocodes/sled
# pnpm add @tomiocodes/sled
```

## Usage

**Note:** While this section uses `require`, the imports match 1:1 with ESM imports. For example `const { set } = require('@tomiocodes/sled')` equals `import { set } from '@tomiocodes/sled'`.

### Basic Usage

```js
const { set, get } = require('@tomiocodes/sled');

set('hello', 'world');

console.log(get('hello'));
```

### Configuration

> We support any configuration file if the [config](https://crates.io/crates/config) crate supports it.

```json
{
	"name": "sled-database"
}
```

---

## API Documentation

For the full API documentation please refer to the TypeDoc generated [documentation](https://sled.vercel.app).
