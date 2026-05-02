export class CreateAdminDto {
  readonly name: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
}

export class LoginAdminDto {
  readonly username: string;
  readonly password: string;
}
