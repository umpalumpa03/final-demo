export interface personalInfoState {
    pId: string | null;
    phoneNumber: string | null;
    loading: boolean;
    error: string | null;
    phoneUpdateChallengeId: string | null;
    phoneUpdateLoading: boolean;
    phoneUpdateError: string | null;
    phoneUpdatePendingPhone: string | null;
    phoneUpdateResendCount: number;
}

export interface PersonalInfoDto {
    pId: string | null;
    phone: string;
}


export interface UpdatePersonalInfoDto {
    pId: string | null;
}