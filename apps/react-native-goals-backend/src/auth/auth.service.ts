import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from 'src/users/create-user.dto';
import { create } from 'domain';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(createUserDto : CreateUserDto) {
    Logger.log('inside AuthService -> register method')
    Logger.log({createUserDto});
    Logger.log({createUserDtoPassword: createUserDto.password});

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
    
    Logger.log({newUser})

    if(!newUser) {
      throw new Error('Registration failed');
    } else {
      return newUser;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('User not found!');
    }

    //validate password
    const givenPasswordMatches = await bcrypt.compare(password, user.password);

    if (!givenPasswordMatches) {
      throw new Error('The entered password is invalid');
    }

    // integrate jwt token
  }
}
