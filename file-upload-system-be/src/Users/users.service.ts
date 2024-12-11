import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: '$2b$10$7a8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q',
      roles: ['user'],
    },
    {
      userId: 2,
      username: 'maria',
      password: '$2b$10$7a8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q9J8Q',
      roles: ['admin'],
    },
  ];

  async findOne(username: string): Promise<any | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async createUser(user: any): Promise<any> {
    this.users.push(user);
    return user;
  }
}
