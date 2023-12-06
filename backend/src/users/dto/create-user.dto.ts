import { tags } from 'typia';
/**
 * Interface of Create User , using this interface it create a new user in @link ../users.service~UsersService
 */
export interface CreateUser {
  /**
   * User's emails which will be used to send emails and futher communication
   * @example johnsmith@gmail.com
   
   */
  email: string & tags.Format<'email'>;

  /**
   * User Id which is gotten from the auth provider like privy , torus etc...
   * @example did:lsjfdlk:ljsdlkjsdfkm
   */
  authId: string & tags.MinLength<5>;

  /**
   * The user name which is gotten from the onboarding process or page
   * @example Johnny Sins
   */
  name: string;

  /**
   * The username which is gotten from the onboarding process or page and it is unique
   * @example sins
   */
  username: string;

  /**
   * The user bio which is gotten from the onboarding process or page
   * @example Hi I am Johnny Sins
   */
  bio: string;
}
