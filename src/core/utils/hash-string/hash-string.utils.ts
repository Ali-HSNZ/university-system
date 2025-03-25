import bcrypt from 'bcrypt'

const hashString = (value: string) => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(value, salt)
}

const compareHash = (current: string, hashed: string) => {
    return bcrypt.compareSync(current, hashed)
}

export { hashString, compareHash }
