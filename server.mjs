import { LearnLuksoServer } from './src/LearnLuksoServer.mjs'


async function main() {
    const learnluksoServer = new LearnLuksoServer()

    try {
        const version = 'v0.3'
        console.log( `Start server! Version: ${version}` )
        learnluksoServer
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