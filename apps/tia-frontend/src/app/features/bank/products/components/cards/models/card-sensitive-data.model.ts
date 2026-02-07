export interface CardSensitiveData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface CardOtpChallengeResponse {
  challengeId: string;
  method: string;
}

export interface VerifyCardOtpRequest {
  challengeId: string;
  code: string;
}