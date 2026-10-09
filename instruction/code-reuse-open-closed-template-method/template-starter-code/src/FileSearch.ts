import { Traverser } from "./Traverser";

class FileSearch extends Traverser{

  public static main(): void {
    let fileSearch: FileSearch;

    if (process.argv.length === 5) {
      fileSearch = new FileSearch(
        process.argv[2],
        process.argv[3],
        process.argv[4]
      );
    } else if (process.argv.length === 6 && process.argv[2].match("-r")) {
      fileSearch = new FileSearch(
        process.argv[3],
        process.argv[4],
        process.argv[5],
        true
      );
    } else {
      this.usage();
      return;
    }

    fileSearch.run();
  }

  private static usage(): void {
    console.log(
      "USAGE: npx ts-node src/FileSearch.ts {-r} <dir> <file-pattern> <search-pattern>"
    );
  }

  private constructor(
    dirName: string,
    filePattern: string,
    searchPattern: string,
    recurse: boolean = false
  ) {
    super(dirName, filePattern, searchPattern, recurse)
  }

  async processLines(filePath: string, lines: string[]): Promise<void> {
    let currCount = 0;
    lines.forEach((line) => {
          if (this.searchRegExp.test(line)) {
            if (currCount == 0) {
              console.log();
              console.log(`FILE: ${filePath}`);
            }

            console.log(line);
            currCount++;
          }
        })
        if (currCount > 0) {
          console.log(`MATCHES: ${currCount}`);
          this.count += currCount
        }
  }


}

FileSearch.main();
