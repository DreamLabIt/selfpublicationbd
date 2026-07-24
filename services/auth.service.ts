import {
    postData,
} from "@/lib/query";

import type {
    AuthResponse,
    ForgotPasswordPayload,
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
} from "@/types";

export const registerUser = (
    data: RegisterPayload
): Promise<AuthResponse> => {
    return postData<AuthResponse>("auth/register", data);
};

export const loginUser = (
    data: LoginPayload
): Promise<AuthResponse> => {
    return postData<AuthResponse>("auth/login", data);
};

export const forgotPassword = (
    data: ForgotPasswordPayload
): Promise<AuthResponse> => {
    return postData<AuthResponse>("auth/forgot-password", data);
};

export const resetPassword = (
    token: string,
    data: ResetPasswordPayload
): Promise<AuthResponse> => {
    return postData<AuthResponse>(
        `auth/reset-password/${token}`,
        data
    );
};