import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prize } from 'src/prizes/entities/prize.entity';
import { Submission } from 'src/prizes/entities/submission.entity';
import { ILike, Repository } from 'typeorm';
import { CreateUser } from './dto/create-user.dto';
import { UpdateUser } from './dto/update-user.dto';
import { User } from './entities/user.entity';

/* The UsersService class is responsible for creating and retrieving user data from a repository. */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async migrateWallet(usersWallets: { wallet: string; did: string }[]) {
    // this.userRepository.queryRunner?.startTransaction();
    // const users = await this.userRepository.queryRunner?.manager.find(User)
    // if (!users) throw new HttpException('Users not found', HttpStatus.NOT_FOUND)
    await this.userRepository.queryRunner?.startTransaction();
    console.log('hiii');
    try {
      for (const wallet of usersWallets) {
        if (wallet) {
          console.log({ wallet });
          const user = await this.userRepository.manager.findOneBy(User, {
            authId: wallet.did,
          });
          console.log('user', user);
          if (user) {
            await this.userRepository.manager.update(User, user.id, {
              walletAddress: wallet.wallet,
            });
          }
        }
      }
      await this.userRepository.queryRunner?.commitTransaction();
    } catch (error) {
      console.log(error);
      await this.userRepository.queryRunner?.rollbackTransaction();
    } finally {
      await this.userRepository.queryRunner?.release();
    }
  }

  /**
   * The function creates a new user by inserting the provided user data into the user repository, and
   * returns the created user.
   * @param {CreateUser} createUserDto - The `createUserDto` parameter is an object that contains the
   * data needed to create a new user. It likely includes properties such as `name`, `email`,
   * `password`, etc.
   * @returns a Promise that resolves to a User object.
   */
  async create(createUserDto: CreateUser): Promise<User> {
    try {
      const user = await this.userRepository.create(createUserDto);
      await this.userRepository.insert(user);
      return user;
    } catch (error) {
      throw new HttpException('User Already Exists', HttpStatus.FORBIDDEN);
    }
  }

  async update(userName: string, updateUserDto: UpdateUser): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({
        username: userName,
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      await this.userRepository.update(user.id, updateUserDto);
      return this.findOneByUsername(user.username);
    } catch (error) {
      console.log(error);
      throw new HttpException(`There is some Problem`, HttpStatus.NOT_FOUND);
    }
  }

  async findUserByWallett(walletAddress: string): Promise<string> {
    console.log('fetching', new Date().toDateString());
    const user = await this.userRepository.findOne({
      where: {
        walletAddress: ILike(walletAddress),
      },
    });
    if (!user) {
      return 'Anonymous';
    }
    return user.username;
  }

  /**
   * The function finds a user by their authentication ID and throws an error if the user is not found.
   * @param {string} authId - The `authId` parameter is a string that represents the authentication ID
   * of a user which is gotten from auth provider . It is used to find a user in the database based on their authentication ID.
   *
   * @returns {Promise<User> } the user object that is found in the database based on the provided authId.
   * @see {@link User}
   */
  async findOneByAuthId(authId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        authId: authId,
      },
      relations: [],
    });
    if (!user)
      throw new HttpException(
        `User not found with authId ${authId}`,
        HttpStatus.NOT_FOUND,
      );
    return user;
  }

  /**
   * The function finds a user by their username and throws an error if the user is not found.
   * @param {string} username - The `username` parameter is a string that represents the username
   * of a user which is gotten from auth provider . It is used to find a user in the database based on their username.
   *
   * @returns {Promise<User> } the user object that is found in the database based on the provided username.
   * @see {@link User}
   */

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: [],
    });
    if (!user)
      throw new HttpException(
        `User not found with username ${username}`,
        HttpStatus.BAD_REQUEST,
      );
    return user;
  }
  /**
   * Get User Submissions by username.
   * @async
   * @param {string} username - The username
   * @returns {Promise<Submission[]>} Array of Submissions.
   */
  async findUserSubmissionsByUsername(username: string): Promise<Submission[]> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        submissions: {
          prize: true,
        },
      },
    });
    if (!user)
      throw new HttpException(
        `User not found with username ${username}`,
        HttpStatus.BAD_REQUEST,
      );
    return user.submissions;
  }
  /**
   * Get User Prizes by username.
   * @async
   * @param {string} username - The username
   * @returns {Promise<Prize[]>} Array of Prizes
   */
  async findUserPrizesByUsername(username: string): Promise<Prize[]> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: ['prizes'],
    });
    if (!user)
      throw new HttpException(
        `User not found with username ${username}`,
        HttpStatus.BAD_REQUEST,
      );
    return user.prizes;
  }

  /**
   * Checks if a user with the specified username exists.
   * @async
   * @param {string} username - The username to check.
   * @returns {Promise<boolean>} A boolean indicating if the user exists.
   */

  async exists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: [],
    });
    return !!user;
  }

  async emailExists(
    email: string,
  ): Promise<{ exists: boolean; walletAddress?: string }> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return { exists: false };
    }

    return { exists: true, walletAddress: user.walletAddress };
  }
}
