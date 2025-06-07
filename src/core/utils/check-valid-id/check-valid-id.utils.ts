const checkValidId = (id: string | number | undefined) => {
    if (id === undefined || Number.isNaN(Number(id))) {
        throw new Error('شناسه وارد شده معتبر نمی‌باشد')
    }
    return true
}

export default checkValidId
