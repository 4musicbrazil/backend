export class CreateTokenDto {
  readonly uuid: string;

  readonly userUuid: string;

  readonly expireIn: number;

  readonly expireAt: Date;

  readonly updatedAt: Date;

  readonly createdAt: Date;
}
