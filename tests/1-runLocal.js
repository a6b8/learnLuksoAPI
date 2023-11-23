async function main() {
    const { LearnLuksoServer } = await import( '../src/LearnLuksoServer.mjs' )
    const learnluksoServer = new LearnLuksoServer()

    try {
        const version = 'v0.1'
        console.log( `Start server! Version: ${version}` )
        learnluksoServer
            .init( { 
                'environment': 'development', 
                version
            } )
            .start()
    } catch( e ) {
        console.log( `Error ${e}` )
    }

    return true
}


main()
    .then( a => console.log( a ) )
    .catch( e => console.log( e ) )