import { mkdirSync } from 'fs'
import multer from 'multer'
import path from 'path'
import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'

interface CustomRequest extends Request {
    body: {
        fileUploadPath?: string
        filename?: string
    }
}

const createRoutePath = (req: CustomRequest) => {
    const directory = path.join(__dirname, '..', '..', '..', '..', 'public', 'uploads')

    req.body.fileUploadPath = directory

    mkdirSync(directory, { recursive: true })
    return directory
}

const storage = multer.diskStorage({
    destination: (req: CustomRequest, file, cb) => {
        if (file?.originalname) {
            const filePath = createRoutePath(req)
            return cb(null, filePath)
        }
        cb(null, '')
    },
    filename: (req, file, cb) => {
        if (file?.originalname) {
            const ext = path.extname(file.originalname)
            const uniqueId = uuidv4()
            const fileName = uniqueId + ext
            req.body.filename = fileName
            return cb(null, fileName)
        }
        cb(null, '')
    }
})

const fileSize = 1 * 1000 * 1000 // 1MB

const uploadFile = multer({ storage, limits: { fileSize } })

export default uploadFile
