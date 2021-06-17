export enum FileType {
  File = "*",
  Img = "image/*",
  Video = "video/*",
  Audio = "audio/*",
}
type FileTypes = FileType | string | (FileType | string)[];
type FileArg = {
  type?: FileTypes;
  multi?: boolean;
};
export default function useFile(arg?: FileArg) {
  const selector = document.createElement("input");
  selector.setAttribute("id", "file");
  selector.setAttribute("type", "file");
  selector.setAttribute("name", "file");
  selector.setAttribute("style", "position:absolute;top:-1000px;left:-1000px");
  if (arg?.multi) selector.setAttribute("multiple", "");

  const types =
    typeof arg?.type === "object"
      ? arg.type.join(",")
      : arg?.type ?? FileType.File;
  selector.setAttribute("accept", types);
  //   selector.setAttribute("style", "visibility:hidden");
  let fileTmp: FileList | null;
  let blurCount = 0;
  let rejected = false;
  selector.addEventListener("change", () => {
    fileTmp = selector.files;
  });
  selector.addEventListener("blur", () => {
    blurCount += 1;
    if (blurCount === 2) {
      document.body.removeChild(selector);
      rejected = true;
    }
  });
  document.body.appendChild(selector);
  selector.click();
  selector.focus();
  return new Promise<FileList>((res, rej) => {
    const timer = setInterval(() => {
      if (fileTmp) {
        clearInterval(timer);
        res(fileTmp);
      } else if (rejected) {
        rej();
      }
    }, 100);
  });
}
