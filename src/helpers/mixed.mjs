function keyPathToValue( { data, keyPath, separator='__' } ) {
    if( typeof keyPath !== 'string' ) {
        console.log( `KeyPath: ${keyPath} is not a "string".` )
        return undefined
    }

    const result = keyPath
        .split( separator )
        .reduce( ( acc, key, index ) => {
            if( !acc ) return undefined
            if( !acc.hasOwnProperty( key ) ) return undefined
            acc = acc[ key ]
            return acc
        }, data )

    return result
}


function objectToKeyPaths( { data, parentKey='', separator='__' } ) {
    const result = Object
        .entries( data === undefined || data === null ? {} : data )
        .reduce( ( acc, [ key, value ], index ) => {
            const currentKey = parentKey ? `${parentKey}${separator}${key}` : key;
            if( typeof data[ key ] === 'object' && !Array.isArray( data[ key ] ) ) {
                const _next = objectToKeyPaths( {
                    'data': data[ key ],
                    'parentKey': currentKey,
                    separator
                } )
                acc.push( ..._next )
              } else {
                acc.push( currentKey )
              }
            return acc
        }, [] )

    return result
}


function printMessages( { messages=[], comments=[] } ) {
    const n = [
        [ comments, 'Comment', false ],
        [ messages, 'Error', true ]
    ]
        .forEach( ( a, index ) => {
            const [ msgs, headline, stop ] = a
            msgs
                .forEach( ( msg, rindex, all ) => {
                    rindex === 0 ? console.log( `\n${headline}${all.length > 1 ? 's' : ''}:` ) : ''
                    console.log( `  - ${msg}` )
                    if( ( all.length - 1 ) === rindex ) {
                        if( stop === true ) {
                            process.exit( 1 )
                        }
                    }
                } )
        } )

    return true
}


export { printMessages, keyPathToValue, objectToKeyPaths }