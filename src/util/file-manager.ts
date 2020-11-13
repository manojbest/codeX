import { existsSync, mkdirSync, WriteFileOptions, writeFileSync } from 'fs';

class FileManager {
  /**
   * Create directory for given path
   *
   * @param path - the directory path
   * @private
   */
  public createDirectory(path: string) {
    // check directory
    if (!existsSync(path)) {
      // create directory if not exists
      mkdirSync(path);
    }
  }

  /**
   * Create file and write content
   *
   * @param path - the directory path
   * @param fileName - the file name
   * @param content - the file content
   * @param options - the file options
   */
  public createFile(path: string, fileName: string, content: any, options?: WriteFileOptions) {
    // create directory directory
    this.createDirectory(path);
    // create new file and write content
    writeFileSync(`${path}/${fileName}`, content, options);
  }
}

export const fileManager = new FileManager();
