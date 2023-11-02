import { IBucketStorage } from "..";

const fs = require('fs');
const path = require('path');

export class FileSystemBucket implements IBucketStorage {
    storage: string;

    constructor(storage: string) {
        this.storage = storage;
    }

    // Method for saving file data to the file system
    save(pathLocation: string, fileData: Buffer, callback: (url: string | null, error?: Error) => void): void {
        const filePath = path.join(this.storage, pathLocation);
        
        fs.writeFile(filePath, fileData, (error) => {
            if (error) {
                callback(null, error);
            } else {
                callback(filePath); // You can pass the local file path as the URL
            }
        });
    }

    // Method for retrieving file data from the file system
    retrieve(pathLocation: string, callback: (fileData: Buffer | null, error?: Error) => void): void {
        const filePath = path.join(this.storage, pathLocation);

        fs.readFile(filePath, (error, data) => {
            if (error) {
                callback(null, error);
            } else {
                callback(data);
            }
        });
    }

    // Method for deleting a file from the file system
    delete(pathLocation: string, callback: (success: boolean, error?: Error) => void): void {
        const filePath = path.join(this.storage, pathLocation);

        fs.unlink(filePath, (error) => {
            if (error) {
                callback(false, error);
            } else {
                callback(true);
            }
        });
    }

    // Optional method for checking if a file exists in the file system
    exists?(pathLocation: string, callback: (exists: boolean, error?: Error) => void): void {
        const filePath = path.join(this.storage, pathLocation);

        fs.access(filePath, fs.constants.F_OK, (error) => {
            if (error) {
                callback(false, error);
            } else {
                callback(true);
            }
        });
    }

    // Optional method for generating a local file URL
    getPublicUrl?(pathLocation: string, callback: (url: string | null) => void): void {
        const filePath = path.join(this.storage, pathLocation);
        callback(filePath); // Return the local file path as the URL
    }
}
