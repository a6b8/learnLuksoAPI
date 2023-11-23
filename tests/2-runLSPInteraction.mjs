import { LSPInteraction } from './../src/services/LSPInteraction.mjs'
import { config } from './../src/data/config.mjs'

const lsp = new LSPInteraction( config )
lsp.init()


const tests = [
    '0x0C83Be9fFb51Ff0a82EB02c117d7f73faaFf2A9e', // up profile
    '0B031363560403179Aac100d51864e27fFF4D7807' // custom profile
]

const n = await lsp.getData( {
    'address': tests[ 1 ],
    'network': 'luksoTestnet',
    'filter': [ 'LSP3Profile' ],
    'presetKey': 'LSP3Profile'
} )

console.log( 'n', JSON.stringify( n, null, 4 ) )
