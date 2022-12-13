const fs = require("fs");
const path = require("path");

async function coflow() {
  const directoryPath = path.resolve("./src");
  const files = await parseDirectory(directoryPath);
  const processes = await parseFiles(files);
  console.log(processes);
}

async function parseDirectory(dir) {
  let files = [];

  // Use the fs.readdirSync() method to read the contents of the directory
  const dirFiles = await fs.promises.readdir(dir);

  // Iterate over the array of files and directories
  for (const file of dirFiles) {
    const stats = await fs.promises.stat(`${dir}/${file}`);

    if (stats.isDirectory()) {
      // If the current file is a directory, recursively parse the directory
      const subdirFiles = await parseDirectory(`${dir}/${file}`);
      files = files.concat(subdirFiles);
    } else {
      // If the current file is not a directory, it is a regular file, so you can add it to the array
      files.push(`${dir}/${file}`);
    }
  }

  return files;
}

async function parseFiles(files) {
  let processes = [];

  for (const file of files) {
    const fileData = await fs.promises.readFile(file, "utf8");
    let process = { file: file };

    // Filter each line in data for PN
    const dataSplit = fileData.split("\n");
    const steps = dataSplit.filter((line) => line.startsWith("// PS:"));
    const name = dataSplit.filter((line) => line.startsWith("// PN:"));
    process.steps = steps;
    process.name = name;

    processes.push(process);
  }

  return processes;
}

module.exports = coflow;
