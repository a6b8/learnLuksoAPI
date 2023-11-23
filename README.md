# Learn Lukso API

This REST API retrieves data related to Universal Profiles from the Lukso Blockchain and serves as a bridge between the blockchain and an AI system that processes and presents the data in a suitable manner. Additionally, it includes a Schema Generator that describes the API according to the OpenAI standard (Swagger).


## Quickstart

### Run Server

```js
import { LearnLuksoServer } from './src/LearnLuksoServer.mjs'
const lls = new LearnLuksoServer()
lls
    .init( { 'environment': 'quickstart' } )
    .start()
```

### Generate OpenAI Schema

```js
import { LearnLuksoServer } from './src/LearnLuksoServer.mjs'
const lls = new LearnLuksoServer()
const schema = lls.getOpenAiSchema( { 
    'title': 'My Title',
    'description': `My description`,
    'version': 'v0.0.2',
    'url': 'https://...'
} )
console.log( JSON.stringify( schema, null, 4 ) )
```

## Table of Contents

- [Learn Lukso API](#learn-lukso-api)
  - [Quickstart](#quickstart)
    - [Run Server](#run-server)
    - [Generate OpenAI Schema](#generate-openai-schema)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Methods](#methods)
    - [init( {} )](#init--)
    - [start()](#start)
    - [getOpenAISchema](#getopenaischema)
    - [init( {} )](#init---1)
    - [start()](#start-1)
    - [getOpenAISchema](#getopenaischema-1)
  - [Deployment](#deployment)
  - [License](#license)

## Features

- Add Header Api Key through key `x-api-key`. To set secrets see `.init({})`
- OpenAI Schema generator, for Custom GPT integration.
- Add `/health` route
- Add `/privacy` route. You can find the template here: `./public/privacy.html`


## Methods
Public methods include init, start, and getOpenAISchema.


### init( {} )

The following key/value pairs are editable:

| Name         | Description                                       | Required | Default        | Type                                     |
|--------------|---------------------------------------------------|----------|----------------|------------------------------------------|
| environment  | Is needed to locate the environment variables. For 'developement' it expect a file on `./.env`. For `staging` search in `process.env`    | Yes      | `development`  | `string` [ 'development', 'staging' ] |
| version      | The version number of the application             | No       | `` (empty string) | string                                   |

For informations you can find under `./src/data/config.mjs`

**Returns**: 
```js
return this
```


**Example**: 
```js
const { LearnLuksoServer } = await import( './src/LearnLuksoServer.mjs' )
const lls = new LearnLuksoServer()
lls
    .init( { 'environment': 'quickstart', 'version': 'v0.2' } )
    .start()

```


### start()

Start the server after settings via .init({}).

**Example**: 
```js
const { LearnLuksoServer } = await import( './src/LearnLuksoServer.mjs' )
const lls = new LearnLuksoServer()
lls
    .init( { 'environment': 'quickstart', 'version': 'v0.2' } )
    .start()

```


### getOpenAISchema

Generate an OpenAI Schema configuration file for Custom GPT integration.

```js
const { LearnLuksoServer } = await import( './src/LearnLuksoServer.mjs' )
const lls = new LearnLuksoServer()
const schema = lls.getOpenAiSchema( { 
    'title': 'Title',
    'description': `Description`,
    'version': '',
    'url': 'https://...'
} )
console.log( JSON.stringify( schema, null, 4 ) )
```

### init( {} )

### start()

### getOpenAISchema

## Deployment

## License

This project is licensed under the [Apache 2.0](LICENSE).