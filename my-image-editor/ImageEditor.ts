const fs = require('node:fs');

type Color = {
    red: number
    green: number
    blue: number
}

type Image = {
    pixels: Color[][];
    width: number;
    height: number;
}

function motionBlur(image: Image, length: number): Image {
    if(length < 1) {
        // do nothing
    } 
    for(let i = 0; i < image.height; i++) {
        for(let j = 0; j < image.width; j++) {
            let curColor = image?.pixels[i][j]
            let maxI = Math.min(image.height - 1, i + length - 1)
            for(let k = i + 1; k<= maxI; ++k) {
                let tmpColor = image?.pixels[k][j]
                curColor.red += tmpColor.red
                curColor.green += tmpColor.green
                curColor.blue += tmpColor.blue
            }

            let delta = (maxI - i + 1)
            curColor.red /= delta
            curColor.green /= delta
            curColor.blue /= delta
        }
    }
    return image
}

function invert(image: Image): void {
    for(let i = 0; i < image.height; i++) {
        for(let j = 0; j< image.width; j++) {
            let curColor = image.pixels[i][j]

            curColor.red = 255 - curColor.red
            curColor.green = 255 - curColor.green
            curColor.blue = 255 - curColor.blue
        }
    }
}

function grayscale(image: Image): void {
    for(let i = 0; i < image.height; ++i) {
        for(let j = 0; j < image.width; ++j) {
            let curColor = image.pixels[i][j]

            let grayLevel = Math.floor((curColor.red + curColor.green + curColor.blue) / 3)
            grayLevel = Math.max(0, Math.min(grayLevel, 255))

            curColor.red = Math.floor(grayLevel)
            curColor.green = Math.floor(grayLevel)
            curColor.blue = Math.floor(grayLevel)
        }
    }
}

function emboss(image: Image): void {
    for(let i = image.height - 1; i >= 0; --i) {
        for(let j = image.width -1; j >= 0; --j) {
            let curColor = image.pixels[i][j]

            let diff = 0
            if(i > 0 && j > 0) {
                let upLeftColor = image.pixels[i - 1][j - 1]
                if(Math.abs(curColor.red - upLeftColor.red) > Math.abs(diff)) {
                    diff = curColor.red - upLeftColor.red
                }
                if(Math.abs(curColor.green - upLeftColor.green) > Math.abs(diff)) {
                    diff = curColor.green - upLeftColor.green
                }
                if(Math.abs(curColor.blue - upLeftColor.blue) > Math.abs(diff)) {
                    diff = curColor.blue - upLeftColor.blue
                }
            }

            let grayLevel = 128 + diff
            grayLevel = Math.max(0, Math.min(grayLevel, 255))

            curColor.red = Math.floor(grayLevel)
            curColor.green = Math.floor(grayLevel)
            curColor.blue = Math.floor(grayLevel)
        }
    }
}


function read(filePath: string): Image {
    let file = fs.readFileSync(filePath, 'utf-8')

    const tokens = file
        .split(/\s+/)
        .filter(token => token.length > 0 && !token.startsWith('#'));
    const width = Number(tokens[1])
    const height = Number(tokens[2])
    const pixels: Color[][] = []

    for(let i = 0; i < height; i++) {
        pixels[i] = []
        for(let j = 0; j < width; j++) {
            const index = 4 + (i * width + j) * 3
            const red = Number(tokens[index])
            const green = Number(tokens[index + 1])
            const blue = Number(tokens[index + 2])
            pixels[i][j] = { red, green, blue }
        }
    }
    return { width, height, pixels }
}

function write(filePath: string, image: Image): void {
    let output = "";
    output += "P3\n";
    output += `${image.width} ${image.height}\n`;
    output += "255\n";

    for (let y = 0; y < image.height; ++y) {
        let line = "";
        for (let x = 0; x < image.width; ++x) {
            const color = image.pixels[y][x];
            line += `${color.red} ${color.green} ${color.blue} `;
        }
        output += line.trim() + "\n";
    }
    fs.writeFileSync(filePath, output);
}

function usage(): void {
    console.log("USAGE: java ImageEditor <in-file> <out-file> <grayscale|invert|emboss|motionblur> {motion-blur-length}")
}

function main() {
    const args = process.argv.slice(2)

    if(args.length < 3) {
        usage()
        return
    }

    const inFile = args[0]
    const outFile = args[1]
    const operation = args[2]

    let image = read(inFile)

    switch(operation) {
        case "grayscale":
            grayscale(image)
            break
        case "invert":
            invert(image)
            break
        case "emboss":
            emboss(image)
            break
        case "motionblur":
            if(args.length < 4) {
                usage()
                return
            }
            const length = parseInt(args[3])
            image = motionBlur(image, length)
            break
        default:
            usage()
            return
    }
    write(outFile, image)
}

main()
