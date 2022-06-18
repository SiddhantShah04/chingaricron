// import {
//   clusterApiUrl,
//   Connection,
//   Keypair,
//   LAMPORTS_PER_SOL,
//   PublicKey,
// } from "@solana/web3.js";
// import {
//   createMint,
//   getOrCreateAssociatedTokenAccount,
//   mintTo,
//   setAuthority,
//   transfer,
// } from "@solana/spl-token";

// // Connect to cluster
// const connection = new Connection(
//   "https://floral-bitter-resonance.solana-devnet.quiknode.pro/8fd9f686d74e37bcbbec59a22a9ad9107e9dc2b4/",
//   "confirmed"
// );

// const GARI_WALLET_SECRET_KEY = new Uint8Array([
//   45, 127, 220, 175, 138, 166, 34, 91, 25, 11, 84, 33, 80, 163, 7, 128, 85, 197,
//   75, 11, 25, 181, 109, 3, 184, 218, 78, 17, 140, 205, 211, 102, 130, 23, 2,
//   115, 15, 102, 207, 51, 54, 138, 233, 194, 155, 161, 77, 54, 195, 187, 16, 208,
//   233, 35, 240, 242, 20, 166, 18, 66, 234, 83, 16, 107,
// ]);

// const fromWallet = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);
// async function main() {
//   // const fromWallet = Keypair.generate();

//   // const fromAirdropSignature = await connection.requestAirdrop(
//   //   fromWallet.publicKey,
//   //   LAMPORTS_PER_SOL
//   // );

//   //   const mint = new PublicKey('HHuycf4Wv15juUKoB18nXGtoy6JHVT81RLaBvHyp49Cg');

//   // Wait for airdrop confirmation
//   // await connection.confirmTransaction(fromAirdropSignature);

//   const mint = await createMint(
//     connection,
//     fromWallet, // Payer of the transaction
//     fromWallet.publicKey, // Account that will control the minting
//     null, // Account that will control the freezing of the token
//     0 // Location of the decimal place
//   );

//   console.log("mint", mint.toString());

//   // Get the token account of the "fromWallet" Solana address. If it does not exist, create it.
//   const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
//     connection,
//     fromWallet,
//     mint,
//     fromWallet.publicKey
//   );

//   //   // Generate a new wallet to receive the newly minted token
//   const toWallet = Keypair.generate();

//   // Get the token account of the "toWallet" Solana address. If it does not exist, create it.
//   const toTokenAccount = await getOrCreateAssociatedTokenAccount(
//     connection,
//     fromWallet,
//     mint,
//     toWallet.publicKey
//   );

//   // Minting 1 new token to the "fromTokenAccount" account we just returned/created.
//   let signatureMint = await mintTo(
//     connection,
//     fromWallet, // Payer of the transaction fees
//     mint, // Mint for the account
//     fromTokenAccount.address, // Address of the account to mint to
//     fromWallet.publicKey, // Minting authority
//     1 // Amount to mint
//   );
//   console.log("Mint 100 sig", signatureMint);

//   //and disable future minting:


//   // const mintauthsig = await setAuthority(
//   //   connection,
//   //   fromWallet, // Payer of the transaction fees
//   //   mint, // Account
//   //   fromWallet.publicKey, // Current authority
//   //   0, // Authority type: "0" represents Mint Tokens
//   //   null // Setting the new Authority to null
//   // );
//   // console.log({ mintauthsig });
//   let signature = await transfer(
//     connection,
//     fromWallet, // Payer of the transaction fees
//     fromTokenAccount.address, // Source account
//     toTokenAccount.address, // Destination account
//     fromWallet.publicKey, // Owner of the source account
//     1 // Number of tokens to transfer
//   );

//   console.log("Transactions SIGNATURE", signature);
// }
// main()







// async function mintNew() {
//   // const fromWallet = Keypair.generate();

//   // const fromAirdropSignature = await connection.requestAirdrop(
//   //   fromWallet.publicKey,
//   //   LAMPORTS_PER_SOL
//   // );

//   //   const mint = new PublicKey('HHuycf4Wv15juUKoB18nXGtoy6JHVT81RLaBvHyp49Cg');

//   // Wait for airdrop confirmation
//   // await connection.confirmTransaction(fromAirdropSignature);

//   const mint = await createMint(
//     connection,
//     fromWallet, // Payer of the transaction
//     fromWallet.publicKey, // Account that will control the minting
//     null, // Account that will control the freezing of the token
//     0 // Location of the decimal place
//   );

//   console.log("mint", mint.toString());

//   // Get the token account of the "fromWallet" Solana address. If it does not exist, create it.
//   const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
//     connection,
//     fromWallet,
//     mint,
//     fromWallet.publicKey
//   );

//   //   // Generate a new wallet to receive the newly minted token
//   const toWallet = Keypair.generate();

//   // Get the token account of the "toWallet" Solana address. If it does not exist, create it.
//   const toTokenAccount = await getOrCreateAssociatedTokenAccount(
//     connection,
//     fromWallet,
//     mint,
//     toWallet.publicKey
//   );

//   // Minting 1 new token to the "fromTokenAccount" account we just returned/created.
//   let signatureMint = await mintTo(
//     connection,
//     fromWallet, // Payer of the transaction fees
//     mint, // Mint for the account
//     fromTokenAccount.address, // Address of the account to mint to
//     fromWallet.publicKey, // Minting authority
//     100 // Amount to mint
//   );
//   console.log("Mint 100 sig", signatureMint);

//   //and disable future minting:


//   let signature = await transfer(
//     connection,
//     fromWallet, // Payer of the transaction fees
//     fromTokenAccount.address, // Source account
//     toTokenAccount.address, // Destination account
//     fromWallet.publicKey, // Owner of the source account
//     1 // Number of tokens to transfer
//   );

//   console.log("Transactions SIGNATURE", signature);
// }















// //mint more token without auth
// async function minting() {
//     const mint = new PublicKey("2Lxnkhfdpywj92igTCiitaHjp273G841hDiWaWfeugwZ") 
//   const mintauthsig = await setAuthority(
//     connection,
//     fromWallet, // Payer of the transaction fees
//     mint, // Account
//     fromWallet.publicKey, // Current authority
//     0, // Authority type: "0" represents Mint Tokens
//     null // Setting the new Authority to null
//   );
// }
// // minting()
// // Generate a new wallet keypair and airdrop SOL



import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  MINT_SIZE,
} from "@solana/spl-token";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
const { PublicKey, SystemProgram } = anchor.web3; 
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    const lamports: number =
      await program.provider.connection.getMinimumBalanceForRentExemption(
        MINT_SIZE
      );
    const getMetadata = async (
      mint: anchor.web3.PublicKey
    ): Promise<anchor.web3.PublicKey> => {
      return (
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
      )[0];
    };
    const getMasterEdition = async (
      mint: anchor.web3.PublicKey
    ): Promise<anchor.web3.PublicKey> => {
      return (
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
            Buffer.from("edition"),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
      )[0];
    };
    const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();




















