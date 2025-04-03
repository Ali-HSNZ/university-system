const serializeFilePath = (path?: string): string | undefined => {
    if (!path) return

    const filePath = path.replace(/\\/g, '/')
    const index = filePath.indexOf('/uploads/')
    return filePath.slice(index)
}
export default serializeFilePath
