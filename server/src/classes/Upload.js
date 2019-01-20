import { resolve } from 'path'
import { createWriteStream, unlinkSync } from 'fs'
import { sync } from 'mkdirp'
import { generate } from 'shortid'
import uploads from '../models/Uploads'

const uploadDir = resolve(__dirname, '../../uploads')

// Ensure upload directory exists.
sync(uploadDir)

const storeDB = async (file) => {
    const { id, filename, mimetype, path } = file;

    try {
        let file =  new uploads({ id, filename, mimetype, path });
        return await file.save();

    } catch (err) {
        return err
    }
}

const storeFS = ({ stream, filename }) => {
  const id = generate()
  const path = `${uploadDir}/${id}-${filename}`

  return new Promise((resolve, reject) =>
    stream.on('error', error => {
        if (stream.truncated) unlinkSync(path)
        reject(error)
    })
    .pipe(createWriteStream(path))
    .on('error', error => reject(error))
    .on('finish', () => resolve({ id, path }))
  )
}

export const processUpload = async upload => {
  const { createReadStream, filename, mimetype } = await upload
  const stream = createReadStream()
  const { id, path } = await storeFS({ stream, filename })
  return storeDB({ id, filename, mimetype, path })
}

export const getUploads = async () => {
    try {
        return await uploads.find({});
    } catch (err) {
        return err;
    }
}
