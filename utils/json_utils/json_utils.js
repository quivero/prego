

export const saveJSONtoFile = (path, json_object, name) => {
    // convert JSON object to string
    const json_str = JSON.stringify(json_object);

    // write JSON string to a file
    fs.writeFile(name, json_str, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}