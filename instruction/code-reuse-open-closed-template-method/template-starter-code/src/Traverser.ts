// Will traverse files in a given directory and only call subclasses when determining what to do with the found value (count lines or count instances)
import * as fs from "fs";
import * as path from "path";

export abstract class Traverser {
  public dirName: string;
  public fileRegExp: RegExp;
  public searchRegExp!: RegExp;
  public recurse: boolean;

  public count: number = 0;

  public constructor(dirName: string, filePattern: string, searchPattern: string = '', recurse: boolean = false) {
    this.dirName = dirName;
    this.fileRegExp = new RegExp(filePattern);
    if(searchPattern != '') {
        this.searchRegExp = new RegExp(searchPattern)
    }
    this.recurse = recurse;
  }

  public async run() {
    await this.searchDirectory(this.dirName);
    console.log(`TOTAL: ${this.count}`);
  }

  public async countOrSearchFile(filePath: string) {
  
      if (this.fileRegExp.test(filePath)) {
        try {
          const fileContent: string = await fs.promises.readFile(
            filePath,
            "utf-8"
          );
          const lines: string[] = fileContent.split(/\r?\n/);
  
          await this.processLines(filePath, lines)
        } catch (error) {
          this.unreadableFile(filePath);
        }
      }
  };

  public abstract processLines(filePath: string, lines: string[]): Promise<void>

  public async searchDirectory(filePath: string) {
      if (!this.isDirectory(filePath)) {
        this.nonDirectory(filePath);
        return;
      }
  
      if (!this.isReadable(filePath)) {
        this.unreadableDirectory(filePath);
        return;
      }
  
      const files = fs.readdirSync(filePath);
  
      for (let file of files) {
        const fullPath = path.join(filePath, file);
        if (this.isFile(fullPath)) {
          if (this.isReadable(fullPath)) {
            await this.countOrSearchFile(fullPath);
          } else {
            this.unreadableFile(fullPath);
          }
        }
      }
  
      if (this.recurse) {
        for (let file of files) {
          const fullPath = path.join(filePath, file);
          if (this.isDirectory(fullPath)) {
            await this.searchDirectory(fullPath);
          }
        }
      }
    }

    private isDirectory(path: string): boolean {
        try {
          return fs.statSync(path).isDirectory();
        } catch (error) {
          return false;
        }
    }

    private isFile(path: string): boolean {
        try {
          return fs.statSync(path).isFile();
        } catch (error) {
          return false;
        }
    }
    
    private isReadable(path: string): boolean {
        try {
          fs.accessSync(path, fs.constants.R_OK);
          return true;
        } catch (error) {
          return false;
        }
    }
    
    private nonDirectory(dirName: string): void {
        console.log(`${dirName} is not a directory`);
    }
    
    public unreadableDirectory(dirName: string): void {
        console.log(`Directory ${dirName} is unreadable`);
    }
    
    public unreadableFile(fileName: string): void {
        console.log(`File ${fileName} is unreadable`);
    }
}