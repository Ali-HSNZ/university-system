const checkValidId = (id: string | number) => {
    if (Number.isNaN(Number(id))) {
        throw new Error('شناسه وارد شده معتبر نمی‌باشد')
    }
    return true
}

export default checkValidId
