// import {
//   clusterApiUrl,
//   Connection,
//   Keypair,
//   Transaction,
//   SystemProgram,
//   PublicKey,
//   SYSVAR_RENT_PUBKEY,
//   TransactionInstruction,
// } from "@solana/web3.js";

import {
  Connection,
  clusterApiUrl,
  Transaction,
  TransactionInstruction
} from "web5";
import {
  // Token,
  // createInitializeMintInstruction,
  // createInitMintInstruction,
  // MINT_SIZE,
  // getMinimumBalanceForRentExemptMint,
  // createAssociatedTokenAccountInstruction,
  // getAssociatedTokenAddress,
  // createMintToCheckedInstruction,
  // ASSOCIATED_TOKEN_PROGRAM_ID,
  // createTransferCheckedInstruction,
  // createTransferInstruction,
  // createCreateMasterEditionV3Instruction
  // createSetAuthorityInstruction,
  // createMintToInstruction,
  //  createInitMintInstruction,
  // AuthorityType,
  // MintLayout,`
  // createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import * as bs58 from "bs58";
// import { actions, utils, programs, NodeWallet } from "@metaplex/js";
import BN from "bn.js";
import axios from "axios";

function toPublicKey(key) {
  if (typeof key !== "string") {
    return key;
  }
  return new PublicKey(key);
}

const findProgramAddress = async (seeds, programId) => {
  const result = await PublicKey.findProgramAddress(seeds, programId);

  return [result[0].toBase58(), result[1]];
};

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
const METADATA_PREFIX = "metadata";
const METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
const EDITION = "edition";

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

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
  const GARI_WALLET_SECRET_KEY = new Uint8Array([
    5, 156, 53, 138, 34, 60, 235, 198, 123, 94, 214, 101, 214, 178, 133, 244,
    12, 201, 69, 148, 111, 177, 63, 242, 20, 69, 214, 83, 66, 36, 243, 28, 174,
    141, 61, 9, 33, 18, 66, 232, 71, 44, 212, 151, 97, 89, 168, 86, 72, 145, 30,
    122, 173, 214, 115, 145, 253, 15, 116, 178, 74, 101, 11, 10,
  ]);
  const alice = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);

  console.log("alice",alice.publicKey.toString())


  // const GARI_WALLET_SECRET_KEY_MINT = new Uint8Array([
  //   185, 138, 255, 140, 36, 155, 254, 67, 11, 200, 123, 210, 55, 236, 180, 159,
  //   203, 178, 236, 35, 15, 37, 49, 157, 52, 166, 30, 122, 247, 217, 114, 0, 79,
  //   160, 102, 156, 55, 130, 46, 60, 29, 188, 33, 228, 19, 233, 16, 161, 140,
  //   198, 230, 71, 192, 195, 12, 6, 149, 181, 137, 158, 79, 149, 131, 109,
  // ]);
  // const mint = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY_MINT);

  const mint = Keypair.generate();
  // console.log(`mint: ${mint.publicKey.toString()}`);

  const mintOld = new PublicKey("4NsrHY7zfQ5yehx2ySbf62d3o4YJucdkXiFD66PxtqhM");

  const mintTokenAccountPubKey = new PublicKey(
    "7AqTiPjUdzBrNBQiaiQsN92226vUWZDKYQJdGrmkGeWr"
  );
  const editionToken = new BN(17);

  let ata = await getAssociatedTokenAddress(
    mint.publicKey, // mint
    alice.publicKey // owner
  );

  //   const newMetadataKey = await getMetadata(mint.publicKey.toString());
  //   const masterMetadataKey = await getMetadata(mintOld.toString());

  let instructions = [];

  await mintNewEditionFromMasterEditionViaToken(
    mint.publicKey,
    mintOld,
    alice.publicKey.toString(),
    alice.publicKey.toString(),
    alice.publicKey.toString(),
    mintTokenAccountPubKey,
    instructions,
    alice.publicKey.toString(),
    editionToken
  );

  let transaction = new Transaction({ feePayer: alice.publicKey }).add(
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
    createAssociatedTokenAccountInstruction(
      alice.publicKey, // payer
      ata, // ata
      alice.publicKey, // owner
      mint.publicKey // mint
    ),
    createMintToCheckedInstruction(
      mint.publicKey, // mint
      ata, // receiver (sholud be a token account)
      alice.publicKey, // mint authority
      1, // amount. if your decimals is 8, you mint 10^8 for 1 token.
      0 // decimals
      // [signer1, signer2 ...], // only multisig account will use
    )
  );

  // transaction.add(transaction)

  let blockhashObj = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhashObj.blockhash;

  transaction.partialSign(...[alice]);
  transaction.partialSign(...[mint]);

  let endocdeTransction = transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });
  //   console.log(Buffer.from(endocdeTransction))
  console.log(endocdeTransction.toString("base64"));

  //   var signature = await connection.sendRawTransaction(endocdeTransction, {
  //     skipPreflight: false,
  //   });
  //   console.log(signature);
}

// main()

async function newtest() {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const GARI_WALLET_SECRET_KEY = new Uint8Array([
      247, 37, 85, 129, 208, 2, 9, 197, 234, 50, 217, 4, 232, 20, 123, 187, 209,
      79, 108, 81, 213, 36, 4, 79, 33, 40, 90, 89, 5, 153, 212, 109, 207, 219,
      126, 184, 23, 119, 245, 12, 133, 71, 63, 66, 169, 40, 214, 52, 3, 23, 219,
      201, 220, 230, 3, 104, 39, 78, 198, 81, 46, 146, 212, 98,
    ]);
    const alice = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);

    const GARI_WALLET_SECRET_KEY_MINT = new Uint8Array([
      45, 127, 220, 175, 138, 166, 34, 91, 25, 11, 84, 33, 80, 163, 7, 128, 85,
      197, 75, 11, 25, 181, 109, 3, 184, 218, 78, 17, 140, 205, 211, 102, 130,
      23, 2, 115, 15, 102, 207, 51, 54, 138, 233, 194, 155, 161, 77, 54, 195,
      187, 16, 208, 233, 35, 240, 242, 20, 166, 18, 66, 234, 83, 16, 107,
    ]);
    const gari = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY_MINT);

    const encodedTransactionsNew = await axios.get(
      "https://eks-dev-gari.chingari.io/nft/encodedTransaction",

      {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiJ9.YjhkY2JhZjBlZWFiODc0ZjZhZjYxNWVhZTUyMTI3YTQ6NjY4MDhhNzEzOGM5NzBiMWE3MDQ5MzI1MTcxNTE1ZGNmNTE5MmMxOWY0NTkzZGE4OWRlOWVkOGJhNDhhYmJhMGJlNjMwNDFiZDRjMDgyNTJlNTc1NWIwYjE1YjAzOGM0OWE0OTZhNjM5MzQ5ZmFlN2I5NDc5MTY5YTdmNjJlYmI2OGVmNjczZTc3NjlkYzYyYTJmNmFkN2M1NDU5NDZiNjRmODQ1Nzk5ZmI3MTg0ODg0YTJhM2EzMGM4MWUwMWM0ZTZlNzUzYTYyNmNhNWQzMmI4NzAxMTlkYTZlNzc3YjNmNzJkZTVkMzg3ODM1YjJkNzYwYjkyZmFlMGRmZTA5OGVmZDczNmQ4ZTBlMDA5NmZlNmJmNjFlM2IwOTNhMDRkNzBjZjBmN2NiMTMwNjI1M2NlOGI4ZDA3Y2U4ZjhjNTE2YWNkN2MwNGRlZDFkYzExMDc5MTQzMjM5NDcyZjgyZWE5MjlmZDZlMTMzY2E4NWFjMWFhZmUwNTFhZGExZjA3Y2Y0MGJjMzYzMWU0M2VjMGZmYzU3Njg1ZTQyN2Q2Y2VjNzVmNjFjMmExNmNjOTExMThjMTc0ZjAwN2IzZjI4OTliNDgzOTY2OWM3NjJjODFmZmExMGYwYzA5M2FjZGMzOWRmMWIxOGQ4N2YxMzAwMWJmNjIyMWEzMWVkNTU0MTMwYTg0ZDczMjJkYWE4Zjk5NzI0YWFiNWJlNDgwZGQyMThmMDA3ZGE4N2RkOGU5MTNkN2UwNGQ4YzgzYmYwMGY0NjUyMWJmNTE2OTE2NjA1ZTc4MmU4Mzg5OGMxZWEwNzI5MmVmNGYzZjg5NDZhM2VjNjZjZTEyZTY1NGY0Nzg3NzhkYzJiMTNiZGFjODYyOWZlNDEzYmQyYWUxZWZkMjdhMzM2Yzk4ZTU1ZDAxOTAyNWM4NjVmMmE5MTlkZjU1ZjBjYzRiZjRhZjJiNGMxOTIwZDgxNjZhNzI3OTY1NmFjOQ.hVbRezznmqa4dB52iWdBYtFdPnOUqwZJn0w35lN32tE", //the token is a variable which holds the token
        },
      }
    ); // return
    const encodedTransactions =
      encodedTransactionsNew.data.data.encodedTransactions;

    let newEncodedBuffer = Buffer.from(encodedTransactions, "base64"); // get encoded buffer

    let transaction = Transaction.from(newEncodedBuffer);
    transaction.add(
      new TransactionInstruction({
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        keys: [],
        data: Buffer.from("memo", "utf8"),
      })
    );
    transaction.partialSign(alice);
    transaction.partialSign(gari);

    let endocdeTransction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    var signature = await connection.sendRawTransaction(endocdeTransction);

    console.log(signature);

    return;
  } catch (error) {
    console.log(error);
  }

  return;

  const GARI_WALLET_SECRET_KEY = new Uint8Array([
    5, 156, 53, 138, 34, 60, 235, 198, 123, 94, 214, 101, 214, 178, 133, 244,
    12, 201, 69, 148, 111, 177, 63, 242, 20, 69, 214, 83, 66, 36, 243, 28, 174,
    141, 61, 9, 33, 18, 66, 232, 71, 44, 212, 151, 97, 89, 168, 86, 72, 145, 30,
    122, 173, 214, 115, 145, 253, 15, 116, 178, 74, 101, 11, 10,
  ]);
  const alice = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);

  const GARI_WALLET_SECRET_KEY_MINT = new Uint8Array([
    185, 138, 255, 140, 36, 155, 254, 67, 11, 200, 123, 210, 55, 236, 180, 159,
    203, 178, 236, 35, 15, 37, 49, 157, 52, 166, 30, 122, 247, 217, 114, 0, 79,
    160, 102, 156, 55, 130, 46, 60, 29, 188, 33, 228, 19, 233, 16, 161, 140,
    198, 230, 71, 192, 195, 12, 6, 149, 181, 137, 158, 79, 149, 131, 109,
  ]);
  const gari = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY_MINT);
  console.log(alice.publicKey.toString());

  let encodedTransactionsNew =
    "AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABs0yjWmYfJcrksDAieyA6lhWcDIj691+oL3iq4862Re4V0Cm4Z75KFh6NVgeF/qTP4TCzKOQn+pGZJHS2XE6IEAgAFC66NPQkhEkLoRyzUl2FZqFZIkR56rdZzkf0PdLJKZQsKKgCDnvpCMb/Mm3FV3idKbgnWX9c0w8Qax6EsuuGd+RNzW0GyrXmsZyfdTpYGr3028Hjglo5OS34kvHD92mMH/oF6z6RTu1uT0Y+bSqpGjwyFy7eETP3ECP3w2Miwh2Z6pYgbidDcD/Yy8nelrbsyBQDTkq7KD+XEG33bsxKzpZMOqNCtJPc8KhNArljIeshmsKpdKy0Frc7vUiyjqN8qnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjJclj04kifG7PRApFI4NgwtaE5na/xCEBI572Nvp+FkLcGWx49F8RTidUn9rBMPNWLhscxqg/bVJttG8A/gpRgan1RcZLFxRIYzJTD1K8X9Y2u4Im6H9ROPb2YoAAAAABt324ddloZPZy+FGzut5rBy0he1fWzeROoz1hX7/AKnGaWAa/lqtOYst8tzdxb5yKbstXHZ5vKQ24gC3vY8hzQgGAgADDAIAAAAAlDV3AAAAAAYCAAE0AAAAAGBNFgAAAAAAUgAAAAAAAAAG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqQoCAQlDAACujT0JIRJC6Ecs1JdhWahWSJEeeq3Wc5H9D3SySmULCgGujT0JIRJC6Ecs1JdhWahWSJEeeq3Wc5H9D3SySmULCgcHAAUAAQYKCQAKAwEFAAkHAQAAAAAAAAAIBwQBAAAABgmQARAMAAAASGFja2VyIEhvdXNlAgAAAEhIJwAAAGh0dHBzOi8vbWV0YWRhdGEuZGVnb2RzLmNvbS9nLzUyNjcuanNvbugDAQIAAACcyvEkJTC9LKGT+4q5GAFqgwPK4yYEYrjW5urFYYxpfQBkro09CSESQuhHLNSXYVmoVkiRHnqt1nOR/Q90skplCwoAAAAAAAgJAgEAAAAECgYJChEBAQAAAAAAAAAIAgQAtQEPAQwAAABIYWNrZXIgSG91c2UCAAAASEgnAAAAaHR0cHM6Ly9tZXRhZGF0YS5kZWdvZHMuY29tL2cvNTI2Ny5qc29u6AMBAgAAAJzK8SQlML0soZP7irkYAWqDA8rjJgRiuNbm6sVhjGl9AGSujT0JIRJC6Ecs1JdhWahWSJEeeq3Wc5H9D3SySmULCgAAAAABgXrPpFO7W5PRj5tKqkaPDIXLt4RM/cQI/fDYyLCHZnoBAQEB";

  let newEncodedBuffer = Buffer.from(encodedTransactionsNew, "base64"); // get encoded buffer

  let transaction = Transaction.from(newEncodedBuffer);
  transaction.partialSign(alice);
  // transaction.partialSign(gari)

  let endocdeTransction = transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });

  var signature = await connection.sendRawTransaction(endocdeTransction);

  console.log(signature);
}
// newtest();

const newTEstPra = async () => {
  try {
    const endpoint = "https://metaplex.devnet.rpcpool.com/";
    const connection = new Connection(endpoint, "confirmed");

    const GARI_WALLET_SECRET_KEY = new Uint8Array([
      5, 156, 53, 138, 34, 60, 235, 198, 123, 94, 214, 101, 214, 178, 133, 244,
      12, 201, 69, 148, 111, 177, 63, 242, 20, 69, 214, 83, 66, 36, 243, 28,
      174, 141, 61, 9, 33, 18, 66, 232, 71, 44, 212, 151, 97, 89, 168, 86, 72,
      145, 30, 122, 173, 214, 115, 145, 253, 15, 116, 178, 74, 101, 11, 10,
    ]);
    const alice = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);

    const GARI_WALLET_SECRET_KEY_MINT = new Uint8Array([
      45, 127, 220, 175, 138, 166, 34, 91, 25, 11, 84, 33, 80, 163, 7, 128, 85,
      197, 75, 11, 25, 181, 109, 3, 184, 218, 78, 17, 140, 205, 211, 102, 130,
      23, 2, 115, 15, 102, 207, 51, 54, 138, 233, 194, 155, 161, 77, 54, 195,
      187, 16, 208, 233, 35, 240, 242, 20, 166, 18, 66, 234, 83, 16, 107,
    ]);
    const gari = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY_MINT); //   { //     "account":"CkNrP4YYe5FiSUKrr8s7fgBHTYhMFShzi4rji3q623Kw" // }

    const encodedTransactionsNew = await axios.post(
      "https://dev-nft-badge.chingari.io/api/nft/create",
      // "http://localhost:5000/api/nft/create",
      {
        userPublicKey: alice.publicKey.toString(),
        badge: "BasicCreatorBadge",
        type: "Creator",
        usdToGari:0.2,
      }
    ); // return


    let newEncodedBuffer = Buffer.from(
      encodedTransactionsNew.data.transaction,
      "base64"
    ); // get encoded buffer
   

    const transaction = Transaction.from(newEncodedBuffer);

    // console.log(transaction); // let transaction = Transaction.from(newEncodedBuffer);

    let blockhashObj = await connection.getRecentBlockhash("single");
    transaction.recentBlockhash = blockhashObj.blockhash;

    transaction.partialSign(...[gari]);
    transaction.partialSign(...[alice]);
    let endocdeTransction = transaction.serialize();

    var signature = await connection.sendRawTransaction(endocdeTransction);

    console.log({signature});
  } catch (error) {
    console.log(error);
  }
};
newTEstPra()
const badgesLocalTest = async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const GARI_WALLET_SECRET_KEY = new Uint8Array([
      5, 156, 53, 138, 34, 60, 235, 198, 123, 94, 214, 101, 214, 178, 133, 244,
      12, 201, 69, 148, 111, 177, 63, 242, 20, 69, 214, 83, 66, 36, 243, 28,
      174, 141, 61, 9, 33, 18, 66, 232, 71, 44, 212, 151, 97, 89, 168, 86, 72,
      145, 30, 122, 173, 214, 115, 145, 253, 15, 116, 178, 74, 101, 11, 10,
    ]);
    const alice = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);

    const GARI_WALLET_SECRET_KEY_MINT = new Uint8Array([
      45, 127, 220, 175, 138, 166, 34, 91, 25, 11, 84, 33, 80, 163, 7, 128, 85,
      197, 75, 11, 25, 181, 109, 3, 184, 218, 78, 17, 140, 205, 211, 102, 130,
      23, 2, 115, 15, 102, 207, 51, 54, 138, 233, 194, 155, 161, 77, 54, 195,
      187, 16, 208, 233, 35, 240, 242, 20, 166, 18, 66, 234, 83, 16, 107,
    ]);
    const gari = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY_MINT); //   { //     "account":"CkNrP4YYe5FiSUKrr8s7fgBHTYhMFShzi4rji3q623Kw" // }

    const encodedTransactionsNew = await axios.post(
      // "https://dev-nft-badge.chingari.io/api/nft",
      "http://localhost:5000/api/nft/update",
      {
        userPublicKey: alice.publicKey.toString(),
        badge: "BasicCreatorBadge",
        type: "Creator",
        usdToGari: 20,
      }
    ); // return

    let newEncodedBuffer = Buffer.from(
      encodedTransactionsNew.data.transaction,
      "base64"
    ); // get encoded buffer
    console.log(newEncodedBuffer);

    const transaction = Transaction.from(newEncodedBuffer);

    // console.log(transaction); // let transaction = Transaction.from(newEncodedBuffer);

    transaction.partialSign(alice);
    transaction.partialSign(gari);
    let endocdeTransction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    var signature = await connection.sendRawTransaction(endocdeTransction);

    console.log(signature);
  } catch (error) {
    console.log(error);
  }
};

//  badgesLocalTest();

async function badgesUpdateFlowUpdate() {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const GARI_WALLET_SECRET_KEY = new Uint8Array([
      5, 156, 53, 138, 34, 60, 235, 198, 123, 94, 214, 101, 214, 178, 133, 244,
      12, 201, 69, 148, 111, 177, 63, 242, 20, 69, 214, 83, 66, 36, 243, 28,
      174, 141, 61, 9, 33, 18, 66, 232, 71, 44, 212, 151, 97, 89, 168, 86, 72,
      145, 30, 122, 173, 214, 115, 145, 253, 15, 116, 178, 74, 101, 11, 10,
    ]);
    const alice = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);

    const GARI_WALLET_SECRET_KEY_MINT = new Uint8Array([
      45, 127, 220, 175, 138, 166, 34, 91, 25, 11, 84, 33, 80, 163, 7, 128, 85,
      197, 75, 11, 25, 181, 109, 3, 184, 218, 78, 17, 140, 205, 211, 102, 130,
      23, 2, 115, 15, 102, 207, 51, 54, 138, 233, 194, 155, 161, 77, 54, 195,
      187, 16, 208, 233, 35, 240, 242, 20, 166, 18, 66, 234, 83, 16, 107,
    ]);
    const gari = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY_MINT); //   { //     "account":"CkNrP4YYe5FiSUKrr8s7fgBHTYhMFShzi4rji3q623Kw" // }

    const encodedTransactionsNew = await axios.post(
      // "https://dev-nft-badge.chingari.io/api/nft",
      // "http://localhost:5000/api/nft/create",
      "http://localhost:5000/api/nft/update",

      {
        userPublicKey: alice.publicKey.toString(),
        badge: "BronzeCreatorBadge",
        type: "Creator",
        usdToGari: 20,
        mint: "D8dNSYd4G2JyE77EJ2hvnuE2wkGZkGUBJLDX8DvRgMtz",
      }
    ); // return

    let newEncodedBuffer = Buffer.from(
      encodedTransactionsNew.data.transaction,
      "base64"
    ); // get encoded buffer
    console.log(newEncodedBuffer);

    const transaction = Transaction.from(newEncodedBuffer);

    // console.log(transaction); // let transaction = Transaction.from(newEncodedBuffer);

    transaction.partialSign(alice);
    transaction.partialSign(gari);
    let endocdeTransction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    var signature = await connection.sendRawTransaction(endocdeTransction);

    console.log(signature);
  } catch (error) {
    console.log(error);
  }
}
// badgesUpdateFlowUpdate()

const badgesLocalTestNew = async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const GARI_WALLET_SECRET_KEY = new Uint8Array([
      5, 156, 53, 138, 34, 60, 235, 198, 123, 94, 214, 101, 214, 178, 133, 244,
      12, 201, 69, 148, 111, 177, 63, 242, 20, 69, 214, 83, 66, 36, 243, 28,
      174, 141, 61, 9, 33, 18, 66, 232, 71, 44, 212, 151, 97, 89, 168, 86, 72,
      145, 30, 122, 173, 214, 115, 145, 253, 15, 116, 178, 74, 101, 11, 10,
    ]);
    const alice = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);

    const GARI_WALLET_SECRET_KEY_MINT = new Uint8Array([
      45, 127, 220, 175, 138, 166, 34, 91, 25, 11, 84, 33, 80, 163, 7, 128, 85,
      197, 75, 11, 25, 181, 109, 3, 184, 218, 78, 17, 140, 205, 211, 102, 130,
      23, 2, 115, 15, 102, 207, 51, 54, 138, 233, 194, 155, 161, 77, 54, 195,
      187, 16, 208, 233, 35, 240, 242, 20, 166, 18, 66, 234, 83, 16, 107,
    ]);
    const gari = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY_MINT); //   { //     "account":"CkNrP4YYe5FiSUKrr8s7fgBHTYhMFShzi4rji3q623Kw" // }

    const encodedTransactionsNew = await axios.get(
      // "https://dev-nft-badge.chingari.io/api/nft/create",
      // "http://localhost:5000/api/nft/create",
      // "http://localhost:5001/nft/encodedTransaction/User",
      {
        headers: {
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.MDVhODQyOTA1YTBhNzM2ZGUyOTliNzU1YTkxNjBiZDk6YWJlODE3ZmM5NmRhODc4ZGY3M2I3YTc4NGMwMmU2ODNhYmU2MDg2YzE1Mjk0NzJmZmY3Nzk5MDA0ZThlZjQzOWMwZmNlZDE2MDZiMDk3ZjViOGQwMDc2MTNhZDFhNDRiOTIyZGExOWJmNDVlOWRjNGY4MjI4ZDUwOWUzZThkM2M0MGIzMDgxZTU2OTA5ODQ4MGQyYWM3Y2NiYmQ5ZWNhNDkzMjRkZTAxYThjYTI3YjY3NDlkNGU3NjJlODFjNjRiMmIzZjhjMzRjMzgyYzljYTNmMmI5NTY1NjgwNGYyYTE0NmEyNWViODdkNDdkMzIyMjg1OTFhYTZiODkzYjViOWZmYjcyYmI2NTYyNjAxNTUyNGU4MzQ5NGJjMDk4ZDQwOWViNTE2ZmJmOTI3MDdkNTRhODQ1NGZhMWVkNzFkMWEyYTdmZWM0MWM4NTRiMWIzN2ZjNDhiNWU5ZmJlZjliMTU3YzI4ZGMyMmY3ZjYwZGEzZjAyYjQwMTEyZDJhMmY1OGFkN2NmYTIxNTcyMWJiMzM1MjU3YWU1NjVkY2ZjMmI1NDIxMTYyMDkxNGUwMTU5NDVhODM1ZTU3MGRlZGRiMDY1ZGE4MWU4ZDZhYzNiMGJmN2QyNWYwYWY4OGY2ZTFkNzkyODcxMDdkODAyM2IyMzg1MGM1NjM2NWEyYmEzMzY.JlUdhuN87OLbTHrbZqJ9e8VIVCdBAyj4rjFq6iseYj4",
        },
      }
    ); // return

    const { data } = encodedTransactionsNew;

    console.log(alice.publicKey.toString());
    let newEncodedBuffer = Buffer.from(data.data.encodedTransaction, "base64"); // get encoded buffer

    const transaction = Transaction.from(newEncodedBuffer);

    transaction.partialSign(alice);
    let endocdeTransction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    const buyResponse = await axios.post(
      "http://localhost:5001/nft/buy",
      // "http://localhost:5000/api/nft/create",
      {
        encodedTransaction: endocdeTransction,
        badgeLevel: "BasicUserBadge",
        badgeType: "User",
      },

      {
        headers: {
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.MDVhODQyOTA1YTBhNzM2ZGUyOTliNzU1YTkxNjBiZDk6YWJlODE3ZmM5NmRhODc4ZGY3M2I3YTc4NGMwMmU2ODNhYmU2MDg2YzE1Mjk0NzJmZmY3Nzk5MDA0ZThlZjQzOWMwZmNlZDE2MDZiMDk3ZjViOGQwMDc2MTNhZDFhNDRiOTIyZGExOWJmNDVlOWRjNGY4MjI4ZDUwOWUzZThkM2M0MGIzMDgxZTU2OTA5ODQ4MGQyYWM3Y2NiYmQ5ZWNhNDkzMjRkZTAxYThjYTI3YjY3NDlkNGU3NjJlODFjNjRiMmIzZjhjMzRjMzgyYzljYTNmMmI5NTY1NjgwNGYyYTE0NmEyNWViODdkNDdkMzIyMjg1OTFhYTZiODkzYjViOWZmYjcyYmI2NTYyNjAxNTUyNGU4MzQ5NGJjMDk4ZDQwOWViNTE2ZmJmOTI3MDdkNTRhODQ1NGZhMWVkNzFkMWEyYTdmZWM0MWM4NTRiMWIzN2ZjNDhiNWU5ZmJlZjliMTU3YzI4ZGMyMmY3ZjYwZGEzZjAyYjQwMTEyZDJhMmY1OGFkN2NmYTIxNTcyMWJiMzM1MjU3YWU1NjVkY2ZjMmI1NDIxMTYyMDkxNGUwMTU5NDVhODM1ZTU3MGRlZGRiMDY1ZGE4MWU4ZDZhYzNiMGJmN2QyNWYwYWY4OGY2ZTFkNzkyODcxMDdkODAyM2IyMzg1MGM1NjM2NWEyYmEzMzY.JlUdhuN87OLbTHrbZqJ9e8VIVCdBAyj4rjFq6iseYj4",
        },
      }
    );

    console.log(buyResponse);
  } catch (error) {
    console.log(error);
  }
};

// badgesLocalTestNew();

const update = async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const GARI_WALLET_SECRET_KEY = new Uint8Array([
      56, 84, 95, 46, 165, 177, 121, 169, 94, 165, 56, 6, 83, 179, 241, 184,
      236, 103, 43, 250, 33, 65, 210, 141, 14, 210, 148, 102, 38, 251, 217, 123,
      225, 245, 200, 42, 212, 153, 12, 46, 18, 175, 218, 19, 175, 65, 53, 44,
      116, 199, 20, 83, 247, 222, 41, 18, 205, 141, 56, 147, 128, 23, 51, 50,
    ]);
    const alice = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);

    const GARI_WALLET_SECRET_KEY_MINT = new Uint8Array([
      45, 127, 220, 175, 138, 166, 34, 91, 25, 11, 84, 33, 80, 163, 7, 128, 85,
      197, 75, 11, 25, 181, 109, 3, 184, 218, 78, 17, 140, 205, 211, 102, 130,
      23, 2, 115, 15, 102, 207, 51, 54, 138, 233, 194, 155, 161, 77, 54, 195,
      187, 16, 208, 233, 35, 240, 242, 20, 166, 18, 66, 234, 83, 16, 107,
    ]);
    const gari = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY_MINT); //   { //     "account":"CkNrP4YYe5FiSUKrr8s7fgBHTYhMFShzi4rji3q623Kw" // }

    const encodedTransactionsNew = await axios.get(
      // "https://dev-nft-badge.chingari.io/api/nft/create",
      // "http://localhost:5000/api/nft/create",
      "http://localhost:5001/nft/encodedTransaction/User",
      // "https://eks-dev-gari.chingari.io/nft/encodedTransaction/User",
      {
        headers: {
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.MmI1OWYxNzhkM2I5NzBiYWI2N2MwZTUyYTliNmRkYTk6ZDkzMDU0YmM4ZTg5MjBjNzQwMmY5ODkyZjlmZGE4NjVlY2U4MGQyNjg2YzdhYWFkMTE3ZDc5MjBlMDBmZDY5ZjkyOTI4OThkODM5MGE5N2U2Y2YyOGMxNjljNGY1ODBhMmZkMDZlMGQyZWNjMTMxZDlkNjUyYjQ4NGY4MTZjNmUzMzU2ZjA1Y2M4OTk2NmRlZGNlM2NlZTMzMWM1NDQ5ZTMxNWM4NmI4ZmM0NDAwZGNhM2UyZThkMTJhMmVlMDJkYzdlNzhmMGRlM2FjYjNkNDA4YjQ2ZWIyZjU1NDBhN2NlOWExM2JmNWUwYzFmYzhiNmEzZGQ5NTE3OWRiYWRlMzdmNDA1MGUwMjVkYjA5Y2Q5MmVkZjhhMDU4YzRlMjQ3Njc2NWUwZTdkYTA4MDcyZDVlMmFmZTNkMDFiYmU4MThmMDllMGZiMzA2OGNhYWEyYmU1Nzk0N2RiMjMxMWQ4ZGYyMzRkZDBlYjk0Njc3MTE2ZDU4NTg4YjY5MjYwZGM4MGQ2MjNmNjMwNTIxNDkxNWI1ZmMwYjU0ZjM4ODA0MjMxZTI0OTZiNmI0MDJkZjc1ODQ2YzdlODYyMWE2ZmU1YjU3NWYzMWQ2YTMyMTIyMGM2ZGRkNzQ3YTZkYzJjNTU3OTJhZjRlMTAyYjFmMzBlNTcxOTJmYThjNTQwYzBkZDAzMmZkYTdiNGEwMGQ5ZTgzMjk0MTkzZThiOTg0MWVlOGZjNWViOTkwOTE5NDI2MjJmM2YyNjhjYzE1ZTgwNjIzM2NhYTI3YjEwNTI5MWRiZjQwZjIwN2YzYTg1ODkzYWY0ZTMzNTBjN2YxMWFhYmU0NzQ3MWU2NTU3Y2U2Y2ZmYmM4ZWVlOGE4ZGQzNWE4YmFiODc2NjY2OGQ1MWM4MjdlY2M3NWMwZGI0NmNiZmNjN2Q5ZjUyZWM5ZjA0NzMxNzUyOWY2Zjg5ZTZkMmNmZjI2M2YwOGE1MDRlMDYwMWMzYQ.kxcyBYx_ABAlZwWX8Tf4kLIq4WXQ46chU1E4pWKzPLk",
        },
      }
    ); // return

    const { data } = encodedTransactionsNew;
    console.log(data);

    // console.log(alice.publicKey.toString());
    let newEncodedBuffer = Buffer.from(data.data.encodedTransaction, "base64"); // get encoded buffer

    const transaction = Transaction.from(newEncodedBuffer);

    transaction.partialSign(alice);
    let endocdeTransction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    const buyResponse = await axios.post(
      "http://localhost:5001/nft/buy",
      // "http://localhost:5000/api/nft/create",
      // "https://eks-dev-gari.chingari.io/nft/buy",
      {
        encodedTransaction: endocdeTransction,
        badgeLevel: "BasicUserBadge",
        badgeType: "User",
      },

      {
        headers: {
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.MmI1OWYxNzhkM2I5NzBiYWI2N2MwZTUyYTliNmRkYTk6ZDkzMDU0YmM4ZTg5MjBjNzQwMmY5ODkyZjlmZGE4NjVlY2U4MGQyNjg2YzdhYWFkMTE3ZDc5MjBlMDBmZDY5ZjkyOTI4OThkODM5MGE5N2U2Y2YyOGMxNjljNGY1ODBhMmZkMDZlMGQyZWNjMTMxZDlkNjUyYjQ4NGY4MTZjNmUzMzU2ZjA1Y2M4OTk2NmRlZGNlM2NlZTMzMWM1NDQ5ZTMxNWM4NmI4ZmM0NDAwZGNhM2UyZThkMTJhMmVlMDJkYzdlNzhmMGRlM2FjYjNkNDA4YjQ2ZWIyZjU1NDBhN2NlOWExM2JmNWUwYzFmYzhiNmEzZGQ5NTE3OWRiYWRlMzdmNDA1MGUwMjVkYjA5Y2Q5MmVkZjhhMDU4YzRlMjQ3Njc2NWUwZTdkYTA4MDcyZDVlMmFmZTNkMDFiYmU4MThmMDllMGZiMzA2OGNhYWEyYmU1Nzk0N2RiMjMxMWQ4ZGYyMzRkZDBlYjk0Njc3MTE2ZDU4NTg4YjY5MjYwZGM4MGQ2MjNmNjMwNTIxNDkxNWI1ZmMwYjU0ZjM4ODA0MjMxZTI0OTZiNmI0MDJkZjc1ODQ2YzdlODYyMWE2ZmU1YjU3NWYzMWQ2YTMyMTIyMGM2ZGRkNzQ3YTZkYzJjNTU3OTJhZjRlMTAyYjFmMzBlNTcxOTJmYThjNTQwYzBkZDAzMmZkYTdiNGEwMGQ5ZTgzMjk0MTkzZThiOTg0MWVlOGZjNWViOTkwOTE5NDI2MjJmM2YyNjhjYzE1ZTgwNjIzM2NhYTI3YjEwNTI5MWRiZjQwZjIwN2YzYTg1ODkzYWY0ZTMzNTBjN2YxMWFhYmU0NzQ3MWU2NTU3Y2U2Y2ZmYmM4ZWVlOGE4ZGQzNWE4YmFiODc2NjY2OGQ1MWM4MjdlY2M3NWMwZGI0NmNiZmNjN2Q5ZjUyZWM5ZjA0NzMxNzUyOWY2Zjg5ZTZkMmNmZjI2M2YwOGE1MDRlMDYwMWMzYQ.kxcyBYx_ABAlZwWX8Tf4kLIq4WXQ46chU1E4pWKzPLk",
        },
      }
    );

    console.log(buyResponse);
  } catch (error) {
    console.log(error);
  }
};

// update();
