import { statusImgPath } from "../../utils/logging/status.js";

const curr_dir = `${process.cwd()}`;
let relativeStatusPath, absoluteStatusPath;
let statusCode;
let animal;

export const statusPage_controller = (req, res) => {
  statusCode = req.params.code;
  animal = req.params.animal;
  relativeStatusPath = statusImgPath(animal, statusCode);
  absoluteStatusPath = `${curr_dir}/${statusPath}`;

  res.sendFile(absoluteStatusPath);
};
