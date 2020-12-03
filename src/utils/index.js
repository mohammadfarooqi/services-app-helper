const fs = require('fs').promises;

async function readFile(path, getJSON = true) {
  try {
    const data = await fs.readFile(path, 'utf-8');
    
    if (getJSON) return JSON.parse(data);

    return data;
  } catch (error) {
    console.log('Error reading file =>', error);
    return false;
  }
}

async function writeFile(path, content, setJSON = true) {
  try {

    if (setJSON) {
      const temp = JSON.stringify(content, null, 2);
      return await fs.writeFile(path, temp);
    }

    return await fs.writeFile(path, content);
  } catch (error) {
    console.log('Error writing file =>', error);
    return false;
  }
}


module.exports = {
  readFile,
  writeFile
}