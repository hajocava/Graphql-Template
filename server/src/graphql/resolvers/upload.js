import promisesAll from 'promises-all'

export default {
    Query: {
        async getUploads(root, {}, { models }) {
            const { uploads } = models;

            try { return await uploads.find({}) } catch (err) { return err }
        }
    },

    Mutation: {
        singleUpload(obj, { file }, { utils: { processUpload } }) {
            return processUpload(file);
        },

        async multipleUpload(obj, { files }, { utils: { processUpload }  }) {
            const { resolve, reject } = await promisesAll.all(files.map(processUpload))

            if (reject.length)
                reject.forEach(({ name, message }) => console.error(`${name}: ${message}`))

            return resolve
        }
    }
};