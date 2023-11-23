import { config } from './data/config.mjs'
import { printMessages } from './helpers/mixed.mjs'
import { LSPInteraction } from './services/LSPInteraction.mjs'
import fetch from 'node-fetch'


import express from 'express'
import fs from 'fs'
import path from 'path'
// import moment from 'moment'


export class LearnLuksoServer {
    #config
    #app
    #silent
    #state


    constructor( silent=false ) {
        this.#silent = silent
        this.#config = config
    }


    init( { environment='developement', version='' } ) {
        const [ messages, comments ] = this.#validateInit( { environment } )
        printMessages( { messages, comments } )
        
        this.#state = {
            'environment': environment,
            'version': version,
            'secrets': {},
            'privacy': '',
            'lspInteraction': null
        }

        this.#state['secrets'] = this.#addSecrets()
        const [ m, c ] = this.#validateSecrets()
        printMessages( { 'messages': m, 'comments': c } )

        return this
    }


    start() {
        this.#addServer()
        this.#trackReponse()
        this.#addRoutes()
        this.#addCatchAllRoute()

        return true
    }


    getOpenAiSchema( { title, description, version, url } ) {
        const [ m, c ] = this.#validateOpenAISchema( { title, description, version, url } )
        printMessages( { 'messages': m, 'comments': c } )

        const struct = {
            'openapi': '3.1.0',
            'info': null,
            'servers': [],
            'paths': {},
            'comments': {
                'schemas': {}
            }
        }
        
        struct['info'] = [ 
            [ 'title', title ],
            [ 'description', description ],
            [ 'version', version ]
        ]
            .reduce( ( acc, a, index ) => {
                const [ key, value ] = a 
                acc[ key ] = value
                return acc
            }, {} )
        
        struct['servers']
            .push( { url } )

        return struct
    }


    #addSecrets() {
        let result = {}

        if( 
            this.#state['environment'] === 'development' ||
            this.#state['environment'] === 'quickstart'
        ) {
            const key = this.#state['environment']
            result = fs
                .readFileSync( this.#config['environment'][ key ]['env'], 'utf-8' )
                .split( "\n" )
                .reduce( ( acc, a, index ) => {
                    const str = a.trim()
                    const [ key, value ] = str
                        .split( '=' )
                        .map( a => a.trim() )
                    acc[ key ] = value
                    return acc
                }, {} )
        } else if( this.#state['environment'] === 'staging' ) {
            result = Object
                .keys( this.#config['env']['validation'] )
                .reduce( ( acc, key, index ) => {
                    acc[ key ] = process.env[ key ]
                    return acc
                }, {} )
        } else {
            console.log( `The "environment" with the value "${environment}" key does not have any associated .env files.` )
            process.exit( 1 ) 
        }

        return result
    }


    #validateInit( { environment } ) {
        const messages = []
        const comments = []

        if( typeof environment === 'string' ) {
            if( !Object.keys( this.#config['environment'] ).includes( environment ) ) {
                messages.push( `Key "environemt" with value "${environment}" is not excepted as answer. Choose from ${JSON.stringify( environment )}.`)
            }
        } else {
            messages.push( `Key "environment" is not type of "string".` )
        }

        return [  messages, comments ]
    }


    #validateSecrets() {
        const messages = []
        const comments = []
        const keys = Object.keys( this.#config['env']['validation'] )

        keys
            .forEach( key => {
                if( !this.#state['secrets'].hasOwnProperty( key ) ) {
                    messages.push( `Key "${key}" is not found in .env` )
                    return true
                }
console.log( 'HERE')
console.log( this.#state['secrets'][ key ] )
                const test = this.#state['secrets'][ key ]
                    .match( this.#config['env']['validation'][ key ]['regex'] )
console.log( 'AAA' )
                if( test === null ) {
                    console.log( 'K', key)
                    messages.push( `Env '${key}' not the expected pattern. Use ${this.#config['env']['validation'][ key ]['messages']}` )
                    return true
                }
            } )
        return [ messages, comments ]
    }


    #validateOpenAISchema( { title, description, version, url } ) {
        const messages = []
        const comments = []

        const tmp = [
            [ 'title', title ],
            [ 'description', description ],
            [ 'version', version ],
            [ 'url', url ]
        ]
            .forEach( a => {
                if( a[ 1 ] === undefined || a[ 1 ] === null ) {
                    messages.push( `Key '${a[ 0 ]}' is missing.` )
                } else if( typeof a[ 1 ] !== 'string' ) {
                    messages.push( `Key '${a[ 0 ]} is not type of 'string''`)
                }
            } )

        return [ messages, comments ]
    }


    #addCatchAllRoute() {
        this.#app.use( ( req, res ) => {
            res
                .status( 404 )
                .json( { 'message': 'Invalid route' } )
        } )

        return true
    }


    #addServer() {
        const port = this.#state['secrets']['PORT']
        this.#app = express();
        this.#app.listen(
            port, 
            () => {
                switch( this.#state['environment'] ) {
                    case 'development':
                        console.log( `http://localhost:${port}` )
                        break
                    case 'server':
                        console.log( `Server is running on port ${port}` )
                        break
                    default:
                }
            }
        )

        return true
    }


    #trackReponse() {
        this.#app.use( ( req, res, next ) => {
            console.log( `${new Date().toISOString()} - ${req.method} Request to ${req.url}`)
            console.log( 'Headers:', req.headers )
            next()
        } )
    }


    #addRoutes() {
        const addApiKeyHeader = ( req, res, next ) => {
            const apiKey = req.get( this.#config['env']['validation']['API_KEY']['header'] )
            if( apiKey && apiKey === this.#state['secrets']['API_KEY'] ) {
                next()
            } else {
                res
                    .status( 401 )
                    .json( { 'message': 'Invalid API Key' } )
            }
        }

        this.#app.get(
            '/health', 
            // addApiKeyHeader,
            ( req, res ) => {
                const randomNumber = Math.floor( Math.random() * 100 )
                res.json( { 'health': 'ok', 'version': this.#state['version'] } )
            } 
        )

        const lsp = new LSPInteraction( this.#config, false )
        lsp.init( { 'validation': false } )


        this.#app.get(
            '/getUniversalProfile', 
            addApiKeyHeader,
            async( req, res ) => {
                // const { network } = req.params

                try {
                    const { address } = req.query

                    const network = 'luksoTestnet'
                    const presetKey = 'LSP3Profile'

                    const [ m, c ] = lsp.validateGetData( { address, network, presetKey } )
    
                    if( m.length === 0 ) {
                        const response = await lsp.getData( { address, network, presetKey } )
                        console.log( 'response', response )
                        res.json( { 
                            'data': response['data'],
                            'status': response['status']
                        } )
                    } else {
                        const msgs = [ 
                            [ 'message', m ], 
                            [ 'comment', c ]
                        ]
                            .reduce( ( acc, a, index ) => {
                                const [ key, values ] = a
                                !acc.hasOwnProperty( key ) ? acc[ key ] = [] : ''
                                values.forEach( value => acc[ key ].push( value ) )
                                return acc
                            }, {} )
    
                        res.json( { 
                            'data': {},
                            'status': {
                                'code': 400,
                                'msgs': msgs
                            } 
                        } )
                    }
                } catch( e ) {
                    console.log( e )
                    res.json( { 
                        'data': {},
                        'status': {
                            'code': 400,
                            'text': e
                        } 
                    } )
                }
            } 
        )

        this.#app.get(
            '/privacy', 
            ( req, res ) => {
                res.setHeader('Content-Type', 'text/html');
                res.send( this.#state['privacy'] ) 
            }
        )

        return true
    }
}