/**
 * @typedef {import('@privy-io/react-auth').User} User
 * @typedef {import('types/app-user').CreateUserDto} CreateUserDto
 */

import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQueries, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import useAppUserStore from 'store/app-user';
import { CreateUserDto } from 'types/app-user';

/**
 * Custom hook for managing app user data.
 * @returns {{
 *   refreshQuery: import('react-query').UseQueryResult<any, unknown>,
 *   uploadUserMutation: import('react-query').UseMutationResult<any, unknown, Omit<CreateUserDto, 'userId'>>,
 *   logoutMutation: import('react-query').UseMutationResult<any, unknown>,
 *   appUser: User,
 *   loginMutation: import('react-query').UseMutationResult<any, unknown>
 * }}
 */
export default function useAppUser() {
  const router = useRouter();
  const appUser = useAppUserStore((state) => state.user);
  const refreshUser = useAppUserStore((state) => state.refreshUser);
  const uploadUser = useAppUserStore((state) => state.uploadUser);
  const clearUser = useAppUserStore((state) => state.clearUser);
  const { user, logout } = usePrivy();
  const { login } = useLogin({
    /**
     * Callback function called when login is completed.
     * @param {User} user - The logged-in user.
     * @param {boolean} isNewUser - Indicates if the user is a new user.
     * @param {boolean} wasAlreadyAuthenticated - Indicates if the user was already authenticated.
     */
    onComplete(user, isNewUser, wasAlreadyAuthenticated) {
      if (isNewUser && !wasAlreadyAuthenticated) {
        router.push('/onboarding');
      }
    },
    /**
     * Callback function called when an error occurs during login.
     * @param {Error} error - The error object.
     */
    onError(error) {
      toast.error(`Error: ${error} While Logging In `);
    },
  });

  if (!user) {
    throw new Error('User not Logged In');
  }
  if (!appUser) {
    throw new Error("Can't use hook if appUser is not define");
  }

  /**
   * Uploads user data with Privy.
   * @param {Omit<CreateUserDto, 'userId'>} userWithoutUserId - The user data without userId.
   * @returns {Promise<any>} - The result of the upload operation.
   */
  const uploadUserWithPrivy = async (userWithoutUserId: Omit<CreateUserDto, 'userId'>) => {
    return uploadUser({
      ...userWithoutUserId,
      userId: user.id,
    });
  };

  /**
   * Logs in the user.
   * @returns {Promise<void>} - A promise that resolves when the login is completed.
   */
  const loginUser = async () => {
    await login();
    await refreshUser(user.id);
  };

  /**
   * Logs out the user.
   * @returns {Promise<void>} - A promise that resolves when the logout is completed.
   */
  const logoutUser = async () => {
    await logout();
    clearUser();
  };

  /**
   * Query for refreshing the app user data.
   * @type {import('react-query').UseQueryResult<any, unknown>}
   */
  const refreshQuery = useQuery(['appUser', user.id], () => refreshUser(user.id), {
    enabled: !!user,
  });

  /**
   * Mutation for logging out the user.
   * @type {import('react-query').UseMutationResult<any, unknown>}
   */
  const logoutMutation = useMutation(logoutUser);

  /**
   * Mutation for logging in the user.
   * @type {import('react-query').UseMutationResult<any, unknown>}
   */
  const loginMutation = useMutation(loginUser);

  /**
   * Mutation for uploading user data with Privy.
   * @type {import('react-query').UseMutationResult<any, unknown, Omit<CreateUserDto, 'userId'>>}
   */
  const uploadUserMutation = useMutation(uploadUserWithPrivy);

  return {
    refreshQuery,
    uploadUserMutation,
    logoutMutation,
    appUser,
    loginMutation,
  };
}
