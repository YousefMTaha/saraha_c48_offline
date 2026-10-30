import { fileTypeFromBuffer } from "file-type";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { BadRequestException } from "../../exceptions/app.exceptions.js";
export async function processFile({ file, acceptedFileType, customPath }) {
  let fileContent;

  if (file.buffer) {
    fileContent = file.buffer;
  } else {
    fileContent = await readFile(resolve(file.path));
  }

  const result = await fileTypeFromBuffer(fileContent);
  if (
    !result ||
    (acceptedFileType.length && !acceptedFileType.includes(result.mime))
  ) {
    throw BadRequestException({ errMsg: "Invalid Actual File Type" });
  }
  if (!file.path) {
    const fileDir = `./assets/${customPath}`;
    const finalFilePath = `${fileDir}/${randomUUID()}.${result.ext}`;

    await mkdir(fileDir, { recursive: true });
    await writeFile(resolve(finalFilePath), fileContent);
    file.finalPath = finalFilePath;
  } else {
    file.finalPath = file.path;
  }
  return file;
}
export async function processFiles({
  files = [],
  acceptedFileType,
  customPath,
}) {
  for (const file of files) {
    await processFile({ file, acceptedFileType, customPath });
  }
}
export async function processFields({ fields, acceptedFileType, customPath }) {
  // fields => {avatar:[{}] , gallery:[{}] }
  // ["avatar" , "gallery"]

  for (const key of Object.keys(fields)) {
    await processFiles({ files: fields[key], acceptedFileType, customPath });
  }
}
