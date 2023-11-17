import IBaseRepository, { IBase } from "../base-repository";

export default interface IChatRoomRepository extends IBaseRepository<IChatRoom> {

} 

export interface IChatRoom extends IBase {
    members: IMember[]; 
}

export interface IMember {
    account_id: string;
    service_profile_id?: string;
}
