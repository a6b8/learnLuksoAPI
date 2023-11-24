export class ValueModifier {
    #config

    constructor( config ) {
        this.#config = config

        return true
    }


    start( { value, modifier } ) {
        const result = {
            'value': value,
            'modified': false 
        }

        if( !this.#isPattern( { value, modifier } ) ) {
            return result
        }

        result['value'] = this.#setSteps( { value, modifier } )
        result['modified'] = true

        return result
    }


    #isPattern( { value, modifier } ) {
        const regex = this.#getFromTree( { 'treePath': modifier['pattern'] } )
        const test = regex.test( value ) 
        return test
    }


    #getFromTree( { treePath } ) {
        const keyPath = treePath
            .replace( '{{', '' )
            .replace( '}}', '' )
            .replace( 'tree__', '' )
        return this.#keyPathToValue( { 'data': this.#config, keyPath } )
    }


    #setSteps( { value, modifier } ) {
        value = modifier['steps']
            .reduce( ( acc, step, index ) => {
                acc = this.#setStep( { 
                    'value': acc,
                    step
                } )
                return acc
            }, value )

        return value
    }


    #setStep( { value, step } ) {
        const _self = value
        switch( step['cmd'] ) {
            case 'replace':
                const r1 = [ 'from', 'to' ]
                    .reduce( ( acc, key ) => {
                        const struct = step[ key ]
                        acc[ key ] = this.#structToValue( { struct, _self } )
                        return acc
                    }, {} )

                const { from, to } = r1
                value = value.replaceAll( from, to )
                break
            case 'struct':
                    value= [ 'self', 'to' ]
                        .reduce( ( acc, key ) => {
                            const struct = step[ key ]
                            acc = this.#structToValue( { struct, '_self': acc } )
                            return acc
                        }, _self )
                    break
            default:
                break
        }

        return value
    }


    #structToValue( { struct, _self } ) {
        const transforms = struct
            .match( /{{[^}]+}}/g )
        
        if( transforms === null ) {
            return struct
        }

        const transformed = transforms
            .reduce( ( acc, treePath ) => {
                if( treePath === '{{self}}' ) {
                    acc = acc.replaceAll( treePath, _self )
                } else {
                    acc = acc.replaceAll(
                        treePath,
                        this.#getFromTree( { treePath } )
                    )
                }
                return acc 
            }, struct )
    
        return transformed
    }


    #keyPathToValue( { data, keyPath, separator='__' } ) {
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
}


const config = {
    'ipfs': {
        'gateways': {
            'custom': 'https://api.universalprofile.cloud/ipfs'
        }
    },
    'validations': {
          'ethereumAddress': {
                'regex': /^0x[a-fA-F0-9]{40}$/,
                'description': "Allowed is a string which starts with a '0x' prefix followed by exactly 40 hexadecimal characters"
            },
            'ipfsURL': {
                'regex': /^ipfs:\/\/[a-zA-Z0-9]{46}$/,
                'description': 'Find ipfs links.'
            }
    },
    'modifiers': [ {
        'name': 'ipfs-to-custom-gateway',
        'pattern': '{{tree__validations__ipfsURL__regex}}',
        'steps': [ 
            {
                'cmd': 'replace',
                'from': 'ipfs://',
                'to': ''
            },
            {
                'cmd': 'struct',
                'self': '{{self}}',
                'to': '{{tree__ipfs__gateways__custom}}/{{self}}'
            }
            
        ]
    } ]
}