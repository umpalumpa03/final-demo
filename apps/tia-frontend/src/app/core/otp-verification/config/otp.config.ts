import { OtpSettingsConfiguration } from "../models/otp-verification.models";

export const DEFAULT_SETTING_CONFIG: OtpSettingsConfiguration = ({
    otp: {
      expirationMinutes: 5,
      maxResendAttempts: 3,
      maxVerifyAttempts: 5,
      resendTimeoutMs: 60000,
    },
  }) as const;