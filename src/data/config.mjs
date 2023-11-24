const config = {
    'networks': {
        'luksoTestnet': {
            'rpc': 'https://rpc.testnet.lukso.network',
            'explorer': {
                'root': ''
            }
        },
        'luksoMainnet': {
            'rpc': 'https://rpc.lukso.gateway.fm',
            'explorer': {
                'root': ''
            }
        }
    },
    'ipfs': {
        'gateways': {
            'up': 'https://api.universalprofile.cloud/ipfs'
        }
    },
    'env': {
        'validation': {
            'API_KEY': {
                'regex':  /^(?=.*[0-9])(?=.*[A-Za-z])[0-9A-Za-z]{42}$/,
                'message': 'Must have exactly the length of 42, with at least char and numbers.',
                'header': 'X-API-KEY'
            },
            'PORT': {
                'regex': /^\d{2,4}$/,
                'messages': 'Must be 2 to 4 digits long.'
            },
            'EMAIL': {
                'regex': /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'messages': 'Must have characters followed  by @, and characters.'
            }
        }
    },
    'environment': {
        'quickstart': {
            'env': './.env.example'
        },
        'development': {
            'env': './.env'
        },
        'staging': {}
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
    'presets': {
        'LSP3Profile': {
            'filter': 'LSP3Profile',
            'flatten': [
                [ 'LSP3Profile__name', 'name' ],
                [ 'LSP3Profile__description', 'description' ],
                [ 'LSP3Profile__links', 'links' ],
                [ 'LSP3Profile__tags', 'tags' ],
                [ 'LSP3Profile__profileImage', 'profileImage' ],
                [ 'LSP3Profile__backgroundImage', 'backgroundImage' ]
            ],
            'modifier': {
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
                        'to': '{{tree__ipfs__gateways__up}}/{{self}}'
                    }
                    
                ]
            }
        }
    }
} 


export { config }