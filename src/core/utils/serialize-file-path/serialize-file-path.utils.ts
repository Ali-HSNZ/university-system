const serializeFilePath = (path?: string): string | null => {
    if (!path) return null

    const filePath = path.replace(/\\/g, '/')
    const index = filePath.indexOf('/uploads/')
    return filePath.slice(index)
}
export default serializeFilePath
