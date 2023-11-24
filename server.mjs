import { UpApi } from './src/UpApi.mjs'


async function main() {
    const upApi = new UpApi()

    try {
        const version = 'v0.3'
        console.log( `Start server! Version: ${version}` )
        upApi
            .init( { 
                'environment': 'staging', 
                version
            } )
            .start()
    } catch( e ) {
        console.log( `Error: ${e}` )
    }

    return true
}


main()
    .then( a => console.log( a ) )
    .catch( e => console.log( e ) )