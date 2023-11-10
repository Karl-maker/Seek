import { IAccount } from "../../modules/account-repository" 
import { IServiceProfile } from "../../modules/service-profile-repository";

export const ServiceProfileTopics = {
    CREATE: 'SERVICE_PROFILE_CREATED',
    UPLOAD_PICTURE: 'SERVICE_PROFILE_UPLOADED_PICTURE',
    UPDATE: 'SERVICE_PROFILE_UPDATE',
    DELETE: 'SERVICE_PROFILE_DELETE',
    UPDATE_LOCATION: 'SERVICE_PROFILE_UPDATE_PROFILE'
}

export interface IServiceProfileCreatePayload {
    account: Partial<IAccount>;
    service_profile: Partial<IServiceProfile>;
}

export interface IServiceProfileUploadedPicturePayload {
    service_profile: Partial<IServiceProfile>;
}

export interface IServiceProfileUpdatePayload {
    service_profile: Partial<IServiceProfile>;
}

export interface IServiceProfileDeletePayload {
    service_profile: Partial<IServiceProfile>;
}

export interface IServiceProfileUpdateLocationPayload {
    service_profile_id: string;
    coordinates: {
        longitude: number;
        latitude: number;    
    }
}