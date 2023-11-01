export interface IBucketStorage {
    // Method for saving file data to the bucket
    save: (path: string, fileData: Buffer, callback: (url: string | null, error?: Error) => void) => void;
  
    // Method for retrieving file data from the bucket
    retrieve: (path: string, callback: (fileData: Buffer | null, error?: Error) => void) => void;
  
    // Method for deleting a file from the bucket
    delete: (path: string, callback: (success: boolean, error?: Error) => void) => void;
    
    // Optional method for checking if a file exists in the bucket
    exists?: (path: string, callback: (exists: boolean, error?: Error) => void) => void;
    
    // Optional method for generating a public URL for a file in the bucket
    getPublicUrl?: (path: string, callback: (url: string | null, error?: Error) => void) => void;
}
  