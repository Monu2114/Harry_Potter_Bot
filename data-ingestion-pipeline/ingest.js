import { readFileSync } from "fs";
const readFile = async () => {
  const text = readFileSync(
    "data/03 Harry Potter and the Prisoner of Azkaban.txt",
    "utf-8"
  );
  console.log(text);
};
readFile();
