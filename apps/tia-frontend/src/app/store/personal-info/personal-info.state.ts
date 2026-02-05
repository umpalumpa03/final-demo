export interface personalInfoState {
    pId: string | null;
    phoneNumber: string | null;
    loading: boolean;
    error: string | null;
}

export interface PersonalInfoDto {
    pId: string | null;
    phone: string;
}


export interface UpdatePersonalInfoDto {
    pId: string | null;
}