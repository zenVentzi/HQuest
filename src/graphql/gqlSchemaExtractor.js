// const { HttpLink } = require('apollo-link-http');
// const fetch = require('node-fetch');
// const { introspectSchema } = require('graphql-tools');

// const link = new HttpLink({ uri: 'http://localhost:4000', fetch });

// const schema = introspectSchema(link)
//   .then(res => console.log(res))
//   .catch(err => console.log(err));

const fetch = require('node-fetch');
const fs = require('fs');

fetch(`http://localhost:4000/graphql`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variables: {},
    operationName: '',
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
  .then(result => result.json())
  .then(result => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      type => type.possibleTypes !== null
    );
    // eslint-disable-next-line no-param-reassign
    result.data.__schema.types = filteredData;
    fs.writeFile(
      './src/fragmentTypes.json',
      JSON.stringify(result.data),
      err => {
        if (err) {
          console.error('Error writing fragmentTypes file', err);
        } else {
          console.log('Fragment types successfully extracted!');
        }
      }
    );
  });
