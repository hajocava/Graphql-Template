import { GraphQLUpload } from 'graphql-upload'
import { processUpload, getUploads } from '../../classes/Upload'
import promisesAll from 'promises-all'

export default {
    Upload: GraphQLUpload,    
    
    Query: {
      uploads: () => getUploads()
    },

    Mutation: {
      singleUpload: (obj, { file }) => processUpload(file),
      async multipleUpload(obj, { files }) {
        const { resolve, reject } = await promisesAll.all(files.map(processUpload))

        if (reject.length)
        reject.forEach(({ name, message }) => console.error(`${name}: ${message}`))

        return resolve
      }
    }
};
