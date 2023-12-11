import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/create-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('local.strategy.ts LOGIN');
    const createUserDto: CreateUserDto = { email, password };
    const validatedUser = await this.authService.validateUser(createUserDto);
    if (!validatedUser) {
      throw new UnauthorizedException();
    }
    console.log({ validatedUser });
    return validatedUser;
  }
}
