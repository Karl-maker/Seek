export interface IBucketStorage {
    // Method for saving file data to the bucket
    save: (path: string, callback: (url: string | null, error?: Error) => void) => void;
  
    // Method for deleting a file from the bucket
    delete: (path: string, callback: (success: boolean, error?: Error) => void) => void;
    
    // Optional method for checking if a file exists in the bucket
    exists?: (path: string, callback: (exists: boolean, error?: Error) => void) => void;
}
  