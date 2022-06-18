import fs from "fs";
import Arweave from "arweave";
import { actions, utils, programs, NodeWallet } from "@metaplex/js";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
async () => {
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
    logging: false,
  });

  // Upload image to Arweave
  const data = fs.readFileSync("./image2.png");

  const transaction = await arweave.createTransaction({
    data: data,
  });

  transaction.addTag("Content-Type", "image/png");

  const wallet = await arweave.wallets.generate();
  const t = await arweave.transactions.sign(transaction, wallet);
  console.log({ t });
  const response = await arweave.transactions.post(transaction);
  console.log({ response });

  const { id } = response;
  const imageUrl = id ? `https://arweave.net/${id}` : undefined;

  // Upload metadata to Arweave

  //     const metadata = {
  //         name: "Custom NFT #1",
  //         symbol: "CNFT",
  //         description:
  //           "A description about my custom NFT #1",
  //         seller_fee_basis_points: 500,
  //         external_url: "https://www.customnft.com/",
  //         attributes: [
  //             {
  //                 trait_type: "NFT type",
  //                 value: "Custom"
  //             }
  //         ],
  //         collection: {
  //           name: "Test Collection",
  //           family: "Custom NFTs",
  //         },
  //         properties: {
  //           files: [
  //             {
  //               uri: imageUrl,
  //               type: "image/png",
  //             },
  //           ],
  //           category: "image",
  //           maxSupply: 0,
  //           creators: [
  //             {
  //               address: "8e2ATWqx9YaUcJMit2WBcVVbxVxrFmAeqcUc5qsX4zPd",
  //               share: 100,
  //             },
  //           ],
  //         },
  //         image: imageUrl,
  //       }

  //     const metadataRequest = JSON.stringify(metadata);

  //     const metadataTransaction = await arweave.createTransaction({
  //         data: metadataRequest
  //     });
  //     console.log(metadataTransaction)

  //     metadataTransaction.addTag('Content-Type', 'application/json');
  //     console.log("dasfsd",await arweave.transactions.sign(metadataTransaction, wallet))
  //     // await arweave.transactions.sign(metadataTransaction, wallet);

  //    const res= await arweave.transactions.post(metadataTransaction);
  //    console.log(res)
};

const createNft = async () => {
  const GARI_WALLET_SECRET_KEY = new Uint8Array([
    5, 156, 53, 138, 34, 60, 235, 198, 123, 94, 214, 101, 214, 178, 133, 244,
    12, 201, 69, 148, 111, 177, 63, 242, 20, 69, 214, 83, 66, 36, 243, 28, 174,
    141, 61, 9, 33, 18, 66, 232, 71, 44, 212, 151, 97, 89, 168, 86, 72, 145, 30,
    122, 173, 214, 115, 145, 253, 15, 116, 178, 74, 101, 11, 10,
  ]);

  const alice = Keypair.fromSecretKey(GARI_WALLET_SECRET_KEY);
  const feePayerAirdropSignature = await connection.requestAirdrop(
    alice.publicKey,
    2
  );
  await connection.confirmTransaction(feePayerAirdropSignature);

  const mintNFTResponse = await actions.mintNFT({
    connection,
    wallet: new NodeWallet(alice),
    uri: "https://arweave.net/y5e5DJsiwH0s_ayfMwYk-SnrZtVZzHLQDSTZ5dNRUHA",
    maxSupply: 1,
  });

  console.log(mintNFTResponse);
};

createNft();
