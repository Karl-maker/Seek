import { IServiceProfileAvailability } from "../../modules/service-profile-availability-repository";

export const ServiceProfileAvailabilityTopics = {
    ADD: 'SERVICE_PROFILE_AVAILABILITY_CREATED',
    UPDATE: 'SERVICE_PROFILE_AVAILABILITY_UPDATED',
}

export interface IServiceProfileAvailabilityAddPayload {
    service_profile_id: string;
    availability: Partial<IServiceProfileAvailability>;
}

export interface IServiceProfileAvailabilityUpdatePayload {
    service_profile_id: string;
    availability: Partial<IServiceProfileAvailability>;
}