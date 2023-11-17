import { S3 } from 'aws-sdk';
import { IBucketStorage } from '../';

class AwsS3Storage implements IBucketStorage {
    private s3: S3;
    private bucketName: string;

    constructor(bucketName: string) {
        this.s3 = new S3();
        this.bucketName = bucketName;
    }

    // Method for saving file data to the bucket
    save(path: string, callback: (url: string | null, error?: Error) => void): void {
        const params: S3.PutObjectRequest = {
            Bucket: this.bucketName,
            Key: path,
            Body: null,
        };

        this.s3.upload(params, (err, data) => {
            if (err) {
                callback(null, err);
            } else {
                callback(data.Location, null);
            }
        });
    }

    // Method for deleting a file from the bucket
    delete(path: string, callback: (success: boolean, error?: Error) => void): void {
        const params = {
            Bucket: this.bucketName,
            Key: path,
        };

        this.s3.deleteObject(params, (err) => {
            if (err) {
                callback(false, err);
            } else {
                callback(true, null);
            }
        });
    }

    // Optional method for checking if a file exists in the bucket
    exists?(path: string, callback: (exists: boolean, error?: Error) => void): void {
        const params = {
            Bucket: this.bucketName,
            Key: path,
        };

        this.s3.headObject(params, (err) => {
            if (err) {
                callback(false, err);
            } else {
                callback(true, null);
            }
        });
    }

}

export default AwsS3Storage;
