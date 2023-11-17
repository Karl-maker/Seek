import { IAccount } from "../../modules/account-repository" 
import { IRatingServiceProfile } from "../../modules/rating-service-profile-repository";
import { IServiceProfile } from "../../modules/service-profile-repository";

export const RatingServiceProfileTopics = {
    ADDED: 'RATING_SERVICE_PROFILE_CREATED',
    REMOVED:  'RATING_SERVICE_PROFILE_DELETED',
}

export interface IRatingServiceProfileAddedPayload {
    rating: number;
    service_profile_id: string;
}

export interface IRatinfServiceProfileRemovePayload {
    rating_service_profile: Partial<IRatingServiceProfile>;
}
