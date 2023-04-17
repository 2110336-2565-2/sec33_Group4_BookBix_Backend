export class GeneratePasswordResetTokenDto {
  email: string;
}

export class UpdatePasswordUsingTokenDto {
  password: string;
  confirmPassword: string;
}
