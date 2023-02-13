import fs from "fs";

class FilesManager {
  constructor(file) {
    this.file = `${process.cwd()}/files/${file}`;
  }

  async loadItems() {
    if (fs.existsSync(this.file)) {
      const data = await fs.promises.readFile(this.file);
      const response = JSON.parse(data);
      return response;
    }
    return "El archivo no existe";
  }
}

export default FilesManager;
