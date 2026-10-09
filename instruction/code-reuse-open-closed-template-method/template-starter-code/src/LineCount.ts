import { Traverser } from "./Traverser";

class LineCount extends Traverser{

  public static main(): void {
    let lineCount: LineCount;

    if (process.argv.length === 4) {
      lineCount = new LineCount(process.argv[2], process.argv[3]);
    } else if (process.argv.length === 5 && process.argv[2].match("-r")) {
      lineCount = new LineCount(process.argv[3], process.argv[4], true);
    } else {
      this.usage();
      return;
    }

    lineCount.run();
  }

  private static usage(): void {
    console.log(
      "USAGE: npx ts-node src/LineCount.ts {-r} <dir> <file-pattern>"
    );
  }

  private constructor(
    dirName: string,
    filePattern: string,
    recurse: boolean = false
  ) {
    super(dirName, filePattern, '', recurse);
  }

  async processLines(filePath: string, lines: string[]): Promise<void> {
    let currLineCount = 0;
    currLineCount = lines.length;
    this.count += currLineCount;
    console.log(`${currLineCount}: ${filePath}`)
  }
}

LineCount.main();
