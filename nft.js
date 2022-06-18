import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  // Token,
  createInitializeMintInstruction,
  // createInitMintInstruction,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  // createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToCheckedInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createTransferCheckedInstruction,
  createTransferInstruction,
  // createCreateMasterEditionV3Instruction
  createSetAuthorityInstruction,
  createMintToInstruction,
  //  createInitMintInstruction,
  AuthorityType,
  MintLayout,
  
} from "@solana/spl-token";
import * as bs58 from "bs58";
// import { actions, utils, programs, NodeWallet } from "@metaplex/js";
import BN from 'bn.js';

const mintTransaction = async () => {
  // connection
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
  const GARI_WALLET_SECRET_KEY = new Uint8Array([
    130, 245, 83, 121, 78, 172, 55, 179, 142, 168, 27, 131, 159, 79, 126, 148,
    93, 95, 142, 237, 122, 220, 124, 37, 201, 142, 68, 197, 243, 84, 155, 167,
    113, 125, 157, 13, 172, 120, 233, 8, 80, 12, 90, 91, 81, 45, 253, 176, 198,
    40, 110, 38, 49, 207, 182, 61, 0, 79, 11, 151, 65, 151, 52, 188,
  ]);
  const alice = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);

  const mint = Keypair.generate();
  console.log(`mint: ${mint.publicKey.toString()}`);

  let ata = await getAssociatedTokenAddress(
    mint.publicKey, // mint
    alice.publicKey // owner
  );

  let transaction = new Transaction().add(
    // create mint account
    SystemProgram.createAccount({
      fromPubkey: alice.publicKey,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports: await getMinimumBalanceForRentExemptMint(connection),
      programId: TOKEN_PROGRAM_ID,
    }),
    // init mint account

    

    createInitializeMintInstruction(
      mint.publicKey, // mint pubkey
      0, // decimals
      alice.publicKey, // mint authority
      alice.publicKey // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
    ),
    // createAssociatedTokenAccountInstruction(
    //   alice.publicKey, // payer
    //   ata, // ata
    //   alice.publicKey, // owner
    //   mint.publicKey // mint
    // ),
    // createMintToCheckedInstruction(
    //   mint.publicKey, // mint
    //   ata, // receiver (sholud be a token account)
    //   alice.publicKey, // mint authority
    //   7, // amount. if your decimals is 8, you mint 10^8 for 1 token.
    //   0 // decimals
    //   // [signer1, signer2 ...], // only multisig account will use
    // ),
    // createTransferInstruction(
    //   TOKEN_PROGRAM_ID,
    //   fromWalletGariassociatedAccount,
    //   gariAssociatedAccount,
    //   fromWalletPublickey,
    //   [],
    //   amount
    // )

    // createSetAuthorityInstruction(
    //   mint.publicKey,
    //   alice.publicKey,
    //   AuthorityType.MintTokens,
    //   null
    // )
  );

  let blockhashObj = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhashObj.blockhash;

  transaction.sign(...[alice, mint]);

  let endocdeTransction = transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });
  var signature = await connection.sendRawTransaction(endocdeTransction, {
    skipPreflight: false,
  });
  console.log(signature);
  // console.log(`txhash: ${await connection.sendTransaction(tx, [alice, mint])}`);
};
// mintTransaction()

async function withOutMint() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const gariMintPubkey = new PublicKey(
    "7gjQaUHVdP8m7BvrFWyPkM7L3H9p4umwm3F56q1qyLk1"
  );
  const gariAssociatedPubkey = new PublicKey(
    "CbsTsL5nBhe5LZ9fk9Ltcq5sYYiZVyRLL9WLJxNeBVM3"
  );
  // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
  const GARI_WALLET_SECRET_KEY = new Uint8Array([
    130, 245, 83, 121, 78, 172, 55, 179, 142, 168, 27, 131, 159, 79, 126, 148,
    93, 95, 142, 237, 122, 220, 124, 37, 201, 142, 68, 197, 243, 84, 155, 167,
    113, 125, 157, 13, 172, 120, 233, 8, 80, 12, 90, 91, 81, 45, 253, 176, 198,
    40, 110, 38, 49, 207, 182, 61, 0, 79, 11, 151, 65, 151, 52, 188,
  ]);

  const alice = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);
  console.log("alice", alice.publicKey.toString());
  const receiver = Keypair.generate();
  console.log("receiver pubkey", receiver.publicKey.toString());
  // console.log(`mint: ${mint.publicKey.toString()}`);
  const mintPubkey = new PublicKey(
    // "4mHVmK2Snwaf4d9KhnoiDJeokp3MYAmmWgBdzgwdNWhv"
    "2NXFLubjDdJCKbhs7BQ4UJZysQWMAoKeLAZANHSbJ5hF"
  );
  const aliceGariAssociatedAccount = await getAssociatedTokenAddress(
    gariMintPubkey, // mint
    alice.publicKey // owner
  );
  const aliceNftAssociatedAccount = await getAssociatedTokenAddress(
    mintPubkey, // mint
    alice.publicKey
  );
  console.log(aliceNftAssociatedAccount.toString());
  // let receiverAssociatedAccount = await getAssociatedTokenAddress(
  //   mintPubkey, // mint
  //   receiver.publicKey // owner
  // );
  // console.log(
  //   "aliceGariAssociatedAccount",
  //   aliceGariAssociatedAccount.toString()
  // );

  let transaction = new Transaction().add(
    createMintToCheckedInstruction(
      mintPubkey, // mint
      aliceNftAssociatedAccount, // receiver (sholud be a token account)
      alice.publicKey, // mint authority
      7, // amount. if your decimals is 8, you mint 10^8 for 1 token.
      0 // decimals
      // [signer1, signer2 ...], // only multisig account will use
    )
  );

  // await web3.sendAndConfirmTransaction(connection, transaction, [alice]);
  // await connection.sendTransaction(transaction, [alice])

  let blockhashObj = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhashObj.blockhash;

  transaction.sign(alice);

  let endocdeTransction = transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });
  var signature = await connection.sendRawTransaction(endocdeTransction, {
    skipPreflight: false,
  });
  console.log(signature);
}
// mintTransaction()

// async function nftCreate() {
//   const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
// const user = new PublicKey("8e2ATWqx9YaUcJMit2WBcVVbxVxrFmAeqcUc5qsX4zPd")
//   const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
//     "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
//   );
//   const mintKey = Keypair.generate();
//   const lamports = await connection.getMinimumBalanceForRentExemption(
//     MINT_SIZE
//   );
//   console.log("Mint pubkey", mintKey.publicKey.toString());
//   let ata = await getAssociatedTokenAddress(
//     mintKey.publicKey, // mint
//     user // owner
//   );

//   let transaction = new Transaction().add(
//     SystemProgram.createAccount({
//       fromPubkey: user,
//       newAccountPubkey: mintKey.publicKey,
//       space: MINT_SIZE,
//       lamports,
//       programId: TOKEN_PROGRAM_ID,
//     }),
//     createInitializeMintInstruction(
//       mintKey.publicKey, // mint pubkey
//       0, // decimals
//       user, // mint authority
//       user // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
//     ),
//     createAssociatedTokenAccountInstruction(user, ata, user, mintKey.publicKey),
//     createMintToInstruction(
//       mintKey.publicKey, // mint
//       ata,
//       user,
//       1
//     )
//   );

//   // Deriving the MetadataKey
//   const [metadatakey] = await PublicKey.findProgramAddress(
//     [
//       Buffer.from("metadata"),
//       TOKEN_METADATA_PROGRAM_ID.toBuffer(),
//       mintKey.publicKey.toBuffer(),
//     ],
//     TOKEN_METADATA_PROGRAM_ID
//   );
//   console.log("METADATA", metadatakey.toString());

//   const data = {
//     name: "Chingari",
//     symbol: "GARI",
//     uri: "https://metadata.degods.com/g/4924.json",
//     sellerFeeBasisPoints: 1000,
//     creators: [
//       {
//         address: new PublicKey(
//           "9iSD3wkC1aq3FcwgjJfEua9FkkZJWv7Cuxs6sKjc3VnR"
//         ),
//         verified: false,
//         share: 0,
//       },
//       {
//         address: user,
//         verified: false,
//         share: 100,
//       },
//     ],
//     collection: null,
//     uses: null,
//   };

//     const args = {
//     data,
//     isMutable: false,
//   };

// }
// nftCreate()


const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);
const METADATA_PREFIX = "metadata";
const METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
const EDITION = "edition";

  
export const findProgramAddress = async (
  seeds,
  programId,
) => {
 
  const result = await PublicKey.findProgramAddress(seeds, programId);

  return [result[0].toBase58(), result[1]];
};


async function getMetadata(tokenMint) {
  // const PROGRAM_IDS = programIds();
  return (
    await findProgramAddress(
      [
        Buffer.from(METADATA_PREFIX),
        toPublicKey(METADATA_PROGRAM_ID).toBuffer(),
        toPublicKey(tokenMint).toBuffer(),
      ],
      toPublicKey(METADATA_PROGRAM_ID)
    )
  )[0];
}

async function getEdition(tokenMint) {
  return (
    await findProgramAddress(
      [
        Buffer.from(METADATA_PREFIX),
        toPublicKey(METADATA_PROGRAM_ID).toBuffer(),
        toPublicKey(tokenMint).toBuffer(),
        Buffer.from(EDITION),
      ],
      toPublicKey(METADATA_PROGRAM_ID)
    )
  )[0];
}
async function getEditionMarkPda(mint, edition) {
  const editionNumber = Math.floor(edition.toNumber() / 248);

  return (
    await findProgramAddress(
      [
        Buffer.from(METADATA_PREFIX),
        toPublicKey(METADATA_PROGRAM_ID).toBuffer(),
        toPublicKey(mint).toBuffer(),
        Buffer.from(EDITION),
        Buffer.from(editionNumber.toString()),
      ],
      toPublicKey(METADATA_PROGRAM_ID)
    )
  )[0];
}

function toPublicKey(key) {
  if (typeof key !== 'string') {
    return key;
  }
  return new PublicKey(key);
}

async function mintNewEditionFromMasterEditionViaToken(
  newMint,
  tokenMint,
  newMintAuthority,
  newUpdateAuthority,
  tokenOwner,
  tokenAccount,
  instructions,
  payer,
  edition
) {
  const metadataProgramId = METADATA_PROGRAM_ID;
  // let instructions = [];
  const newMetadataKey = await getMetadata(newMint);
  const masterMetadataKey = await getMetadata(tokenMint);
  const newEdition = await getEdition(newMint);
  const masterEdition = await getEdition(tokenMint);
  const editionMarkPda = await getEditionMarkPda(tokenMint, edition);

  const data = Buffer.from([11, ...edition.toArray("le", 8)]);

  const keys = [
    {
      pubkey: toPublicKey(newMetadataKey),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(newEdition),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(masterEdition),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(newMint),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(editionMarkPda),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(newMintAuthority),
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(payer),
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(tokenOwner),
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(tokenAccount),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(newUpdateAuthority),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(masterMetadataKey),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];

  instructions.push(
    new TransactionInstruction({
      keys,
      programId: toPublicKey(metadataProgramId),
      data,
    })
  );
}

function createUninitializedMint(
  instructions ,
  payer,
  amount,
  signers,
) {

  const account = Keypair.generate();
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: account.publicKey,
      lamports: amount,
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID,
    }),
  );

  signers.push(account);

  return account.publicKey;
}

function createAssociatedTokenAccountInstruction(
  instructions,
  associatedTokenAddress,
  payer,
  walletAddress,
  splTokenMintAddress,
) {
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  instructions.push(
    new TransactionInstruction({
      keys,
      programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      data: Buffer.from([]),
    }),
  );
}

function createMint(
  instructions ,
  payer,
  mintRentExempt,
  decimals,
  owner,
  freezeAuthority,
  signers,
) {
  const account = createUninitializedMint(
    instructions,
    payer,
    mintRentExempt,
    signers,
  );

  // /     mint.publicKey, // mint pubkey
  //     0, // decimals
  //     alice.publicKey, // mint authority
  //     alice.publicKey 
 

  // TOKEN_PROGRAM_ID,
  // account,
  // decimals,
  // owner,
  // freezeAuthority,
  // instructions.push(
  //   createInitMintInstruction(
  //     TOKEN_PROGRAM_ID,
  //     account,
  //     decimals,
  //     owner,
  //     freezeAuthority,
  //   ),
  // );
  instructions.push(
    Token.createInitMintInstruction(
      account,
      decimals,
      owner,
      freezeAuthority,
    ),
  );

  return account;
}

async function createMintAndAccountWithOne(
  wallet,
  receiverWallet,
  mintRent,
  instructions,
  signers,
) {

  const mint = createMint(
    instructions,
    wallet.publicKey,
    mintRent,
    0,
    wallet.publicKey,
    wallet.publicKey,
    signers,
  );
  
  // console.log("receiverWallet",PROGRAM_IDS.token.toString())

  const account = (
    await findProgramAddress(
      [
        toPublicKey(receiverWallet).toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    )
  )[0];

  createAssociatedTokenAccountInstruction(
    instructions,
    toPublicKey(account),
    wallet.publicKey,
    toPublicKey(receiverWallet),
    mint,
  );


  instructions.push(
    createMintToInstruction(
      mint,
      toPublicKey(account),
      wallet.publicKey,
      1,
    ),
  );

  return { mint: mint.toBase58() };
}


async function metaplexMint() {
let instructions =[]
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
  const GARI_WALLET_SECRET_KEY = new Uint8Array([
    5, 156, 53, 138, 34, 60, 235, 198, 123, 94, 214, 101, 214, 178, 133, 244,
    12, 201, 69, 148, 111, 177, 63, 242, 20, 69, 214, 83, 66, 36, 243, 28, 174,
    141, 61, 9, 33, 18, 66, 232, 71, 44, 212, 151, 97, 89, 168, 86, 72, 145, 30,
    122, 173, 214, 115, 145, 253, 15, 116, 178, 74, 101, 11, 10,
  ]);
  const alice = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);

  const mint = Keypair.generate();
  console.log(`mint: ${mint.publicKey.toString()}`);
  const newMint = mint.publicKey;

  // let ata = await getAssociatedTokenAddress(
  //   mint.publicKey, // mint
  //   alice.publicKey // owner
  // );

  const mintOld = new PublicKey("4NsrHY7zfQ5yehx2ySbf62d3o4YJucdkXiFD66PxtqhM");


  const mintTokenAccountPubKey = new PublicKey("7AqTiPjUdzBrNBQiaiQsN92226vUWZDKYQJdGrmkGeWr")

  const editionToken=new BN(1)   


  // instructions.push( SystemProgram.createAccount({
  //   fromPubkey: alice.publicKey,
  //   newAccountPubkey: mint.publicKey, // this needs to be signer
  //   space: MINT_SIZE,
  //   lamports: await connection.getMinimumBalanceForRentExemption(MintLayout.span),
  //   programId: TOKEN_PROGRAM_ID,
  // }))

  // instructions.push(
  //   createInitializeMintInstruction(
  //     mint.publicKey, // mint pubkey
  //     0, // decimals
  //     alice.publicKey, // mint authority
  //     alice.publicKey // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
  //   ),
  // );

  
  // const account = (
  //   await findProgramAddress(
  //     [
  //       toPublicKey(alice.publicKey).toBuffer(),
  //       TOKEN_PROGRAM_ID.toBuffer(),
  //       mint.publicKey.toBuffer(),
  //     ],
  //     SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  //   )
  // )[0];
  // createAssociatedTokenAccountInstruction(
  //   instructions,
  //   toPublicKey(account),
  //   alice.publicKey,
  //   toPublicKey(alice.publicKey),
  //   mint.publicKey,
  // );
  
  // // mint, destination, authority, amount, multiSigners = [], programId = TOKEN_PROGRAM_ID
 // createMintToCheckedInstruction(
    //   mint.publicKey, // mint
    //   ata, // receiver (sholud be a token account)
    //   alice.publicKey, // mint authority
    //   7, // amount. if your decimals is 8, you mint 10^8 for 1 token.
    //   0 // decimals
    //   // [signer1, signer2 ...], // only multisig account will use
    // ),
  // instructions.push(
  //   createMintToInstruction(
  //     TOKEN_PROGRAM_ID,
  //     toPublicKey(account),
  //     alice.publicKey,
  //     1,
  //     [],
  //     mint.publicKey,
  //   ),
  // );

  //   instructions.push(
  //   createMintToCheckedInstruction(
  //     mint.publicKey,
  //     toPublicKey(account),
  //     alice.publicKey,
  //     1,
  //     0,
  //     [],
  //   ),
  // );
  const mintRentExempt = await connection.getMinimumBalanceForRentExemption(
    MintLayout.span,
  );

const signers =[]
  const   newMintMetaplex  = await createMintAndAccountWithOne(
    alice,
    alice.publicKey.toString(),
    mintRentExempt,
    instructions,
    signers,
  );

    
  console.log([
    "newMint",newMintMetaplex.mint.toString(),
    "tokenMint",mintOld.toString(),
   "walletPubKey", alice.publicKey.toString(),
   "walletPubKey",alice.publicKey.toString(),
    "mintTokenAccountOwner",alice.publicKey.toString(),
    "mintTokenAccountPubKey",mintTokenAccountPubKey.toString(),
    // "instructions",instructions,
    "walletPubKey",alice.publicKey.toString(),
    "edition",editionToken,]
  )

  // console.log(JSON.stringify(instructions))

 await mintNewEditionFromMasterEditionViaToken(
  newMintMetaplex.mint,
    mintOld,
    alice.publicKey.toString(),
    alice.publicKey.toString(),
    alice.publicKey.toString(),
    mintTokenAccountPubKey,
    instructions,
    alice.publicKey.toString(),
    editionToken
  );

  let transaction = new Transaction();
  instructions.forEach(instruction => transaction.add(instruction));


  let blockhashObj = await connection.getLatestBlockhash('single');
  transaction.recentBlockhash = blockhashObj.blockhash;

  transaction.sign(...[alice, signers[0]]);

  let endocdeTransction = transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });
  var signature = await connection.sendRawTransaction(endocdeTransction, {
    skipPreflight: false,
  });
  console.log(signature);
  
}
metaplexMint();
