import fs from "fs";

class FilesManager {
  constructor(file) {
    console.log(process.cwd());
    this.file = `${process.cwd()}/src/files/${file}`;
  }

  async loadItems() {
    if (fs.existsSync(this.file)) {
      console.log(this.file);
      const data = await fs.promises.readFile(this.file);
      const response = JSON.parse(data);
      return response;
    }
    return "El archivo no existe";
  }
}

export default FilesManager;
