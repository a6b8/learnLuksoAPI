const { LearnLuksoServer } = await import( './src/LearnLuksoServer.mjs' )
const lls = new LearnLuksoServer()
const schema = lls.getOpenAiSchema( { 
    'title': 'Title',
    'description': `Description`,
    'version': '',
    'url': 'https://...'
} )
console.log( JSON.stringify( schema, null, 4 ) )