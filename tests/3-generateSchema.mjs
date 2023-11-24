import { UpApi } from '../src/UpApi.mjs'
import fs from 'fs'

const url = fs.readFileSync( '.env', 'utf-8' )
    .split( "\n" )
    .filter( a => a.startsWith( 'URL' ) )
    .map( a => a.split( '=' )[ 1 ] )[ 0 ]

const version = 'v0.0.2'

const upApi = new UpApi()
const schema = upApi.getOpenAiSchema( { 
    'title': 'Learn Lukso Blockchain',
    'description': `This REST API connects the Lukso Blockchain to an AI system for processing and displaying Universal Profiles data. It also includes a Schema Generator following the OpenAI standard (Swagger) to describe the API. ${url}.`,
    version,
    url
} )

console.log( JSON.stringify( schema, null, 4 ) )

fs.writeFileSync( 
    `./openai/schema-${version}.json`, 
    JSON.stringify( schema, null, 2 ), 
    'utf-8' 
)