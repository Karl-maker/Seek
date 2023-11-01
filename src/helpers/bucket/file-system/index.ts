import { IBucketStorage } from "..";

export class FileSystemBucket implements IBucketStorage {
    storage: string;
    constructor(storage: string) {
        this.storage = storage;
    }

    save: (path: string, fileData: Buffer, callback: (url: string) => void) => void;
    retrieve: (path: string, callback: (fileData: Buffer) => void) => void;
    delete: (path: string, callback: (success: boolean) => void) => void;
    exists?: (path: string, callback: (exists: boolean) => void) => void;
    getPublicUrl?: (path: string, callback: (url: string) => void) => void;

}