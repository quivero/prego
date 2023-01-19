import fs from "fs";
import { logging, log_message } from "../logging/logger.js";

import { objectForEach } from "../objects/objects.js";

const logger = logging("file");

export const createDirectory = (root_path, name) => {
  const folder_path = `${root_path}/${name}`;

  if (fs.existsSync(folder_path)) {
    log_message(
      logger, "info",
      `Directory ${root_path}/${name} already exists!`
    );
  } else {
    fs.mkdirSync(folder_path, (err) => {
      if (err) {
        log_message(logger, "error", err);
      }

      log_message(
        logger, "info",
        `Directory ${name} created successfully at path ${root_path}!`
      );
    });
  }
};

export const saveFilenameContentObject = (obj, root_path) => {
  objectForEach(
    obj, (filename, content) => saveStringtoFile(`${root_path}`, `${filename}`, content)
  );
};

/**
 * @abstract saves string to file
 *
 * @param {Array} path
 * @param {Object} json_object
 * @param {String} name
 */
export const saveStringtoFile = (path, name, string) => {
  // write JSON string to a file
  fs.writeFile(`${path}/${name}.txt`, string, (err) => {
    if (err) {
      throw err;
    }

    log_message(logger, "info", `String saved at file ${path}/${name}.txt`);
  });
};

/**
 * @abstract saves json to file
 *
 * @param {Array} path
 * @param {Object} json_object
 * @param {String} name
 */
export const saveJSONtoFile = (root_path, json_object, name) => {
  // convert JSON object to string
  const json_str = JSON.stringify(json_object, null, 2);

  // write JSON string to a file
  fs.writeFile(`${root_path}/${name}.json`, json_str, (err) => {
    if (err) {
      log_message(logger, "error", error);
    }

    log_message(
      logger, "info",
      `JSON file saved at file ${root_path}/${name}.json`
    );
  });
};

/**
 * @abstract loads json to file
 *
 * @param {Array} path
 * @param {Object} name
 */
export const loadJSONfromFile = (root_path, name) => {
  const filedata = fs.readFileSync(
    `${root_path + name}.json`, "utf8",
    (error, data) => {
      if (error) {
        log_message(logger, "error", error);
      }
    }
  );

  return JSON.parse(filedata);
};

export const filenameHasExtension = (filename, extension) =>
  filename.split(".").length === 2 && filename.includes(extension);
