import { tags } from 'typia';

/**
 * Interface of Create Pactt , using this interface it create a new pact in pact.service.ts
 * @see {@link PactsService}
 */
export interface CreatePact {
  /**
   * Name of the pact i.e the title, which is gotten in the pact form 
   * @example johnsmith
   
   */
  name: string;
  /**
   * Terms of the pact i.e the Description
   * @example test
   */
  terms: string;

  /**
   * Address of the pact on the blockchain
   * @example 0xe7399b79838acc8caaa567fF84e5EFd0d11BB010
   
  */
  address: string & tags.MaxLength<44>;

  /**
   * Transaction hash of the pact on the blockchain
   * @example 0x2e8937d96e633c82df2f8f5a19aafa132795496cd98d0ca3d3c336a6c79f09e4
   
  */
  transactionHash: string & tags.MaxLength<66>;

  /**
   * Block hash of the pact on the blockchain
   * @example 0x2e8937d96e633c82df2f8f5a19aafa132795496cd98d0ca3d3c336a6c79f09e4
   
  */
  blockHash?: string;
}
