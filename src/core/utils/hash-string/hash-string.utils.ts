import bcrypt from 'bcrypt'

const hashString = (value: string) => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(value, salt)
}

export default hashString
