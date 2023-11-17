import path from "path";
import fs from "fs";
import { IBucketStorage } from "..";
import { config } from "../../../config";

const base_url = `${config.host.url}/storage`;

export class FileSystemBucket implements IBucketStorage {

    storage: string;
    constructor(storage: string = config.storage.path) {
        this.storage = storage;
    }

    async save (file_name: string, callback: (url: string, error?: Error) => void){
        try{
            const file_url = `${base_url}/${file_name}`;
            callback(file_url);
        } catch(err) {
            callback("", err);
        }
    };
    async delete(file_name: string, callback: (success: boolean, error?: Error) => void) {
        const file_path = path.join(this.storage, file_name);

        // Use the 'fs' module to delete the file
        fs.unlink(file_path, (err) => {
            if (err) {
                callback(false, err);
            } else {
                callback(true);
            }
        });
    }
    async exists (file_name: string, callback: (exists: boolean, error?: Error) => void){
        const file_path = path.join(this.storage, file_name);

        fs.access(file_path, fs.constants.F_OK, (err) => {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    };

}
