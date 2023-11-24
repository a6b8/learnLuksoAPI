async function main() {
    const { UpApi } = await import( '../src/UpApi.mjs' )
    const upApi = new UpApi()

    try {
        const version = 'v0.1'
        console.log( `Start server! Version: ${version}` )
        upApi
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