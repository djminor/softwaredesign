
// 1. Explain why/how this program violates the Single Responsibility Principle
// 2. Explain how you would refactor the program to improve its design.

/* 
This class vioalted the SRP because it had a single class (CsvWriter) that was handling both writing and formatting. 
My solution was to just abstract the formatting job out to a formatter class that doesn't write anything, thereby allowing 
the CsvWriter class to handle ONLY writing and the new class to handle ONLY formatting
*/

export class CsvFormatter {
	public format(lines: string[][]) {
		return lines.map(line => this.formatLine(line)).join('\n');
	}

	private formatLine(fields: string[]) {
		if (fields.length == 0)
			return "";
		else {
			let line = this.formatField(fields[0]);
			for (let i = 1; i < fields.length; i++) {
				
				line += "," + this.formatField(fields[i]);
			}
			return line
		}
	}

	private formatField(field: string) {
		if (field.indexOf(',') != -1 || field.indexOf('\"') != -1)
			return this.formatQuoted(field);
		else
			return field;
	}

	private formatQuoted(field: string) {
		let line = '\"'
		for (let i = 0; i < field.length; i++) {
			let c: string = field.charAt(i);
			if (c == '\"')
				line += "\"\"";
			else
				line += c;
		}
		line += '\"';
		return line
	}
}

export class CsvWriter {

	constructor(private formatter: CsvFormatter) {}

	public write(lines: string[][] ) {
		for (let i = 0; i < lines.length; i++)
			console.log(this.formatter.format(lines));
	}
}
