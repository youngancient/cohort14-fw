import { Transaction, TxnStatus, Signer } from "./multisig-types";

export const MOCK_SIGNERS = [
  "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF",
  "0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69",
  "0x1efF47bc3a10a45D4B230B5d10E37751FE6AA718",
  "0xe1AB8145F7E55DC933d51a18c793F901A3A0b276",
];

export const MOCK_THRESHOLD = 3;
export const MOCK_MAX_SIGNERS = 5;
export const MOCK_TOKEN_SYMBOL = "VMTK";
export const MOCK_VAULT_BALANCE = 8_245_120.48;
export const MOCK_CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    to: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    amount: 25000,
    approvals: 3,
    initiatorApproved: true,
    executed: true,
    status: TxnStatus.successful,
    txnInitiator: MOCK_SIGNERS[0],
    executedTime: Date.now() / 1000 - 86400 * 3,
  },
  {
    id: 2,
    to: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
    amount: 147820.5,
    approvals: 2,
    initiatorApproved: true,
    executed: false,
    status: TxnStatus.pending,
    txnInitiator: MOCK_SIGNERS[1],
    executedTime: 0,
  },
  {
    id: 3,
    to: "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
    amount: 500,
    approvals: 0,
    initiatorApproved: false,
    executed: false,
    status: TxnStatus.pending,
    txnInitiator: MOCK_SIGNERS[0],
    executedTime: 0,
  },
  {
    id: 4,
    to: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
    amount: 10000,
    approvals: 3,
    initiatorApproved: true,
    executed: true,
    status: TxnStatus.successful,
    txnInitiator: MOCK_SIGNERS[2],
    executedTime: Date.now() / 1000 - 86400 * 7,
  },
  {
    id: 5,
    to: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    amount: 75000,
    approvals: 1,
    initiatorApproved: true,
    executed: false,
    status: TxnStatus.canceled,
    txnInitiator: MOCK_SIGNERS[3],
    executedTime: 0,
  },
  {
    id: 6,
    to: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
    amount: 3200,
    approvals: 1,
    initiatorApproved: true,
    executed: false,
    status: TxnStatus.pending,
    txnInitiator: MOCK_SIGNERS[0],
    executedTime: 0,
  },
];

export const MOCK_TXN_SIGNERS: Signer[] = [
  { signerAddress: MOCK_SIGNERS[0], txnId: 1, timeSigned: Date.now() / 1000 - 86400 * 4 },
  { signerAddress: MOCK_SIGNERS[1], txnId: 1, timeSigned: Date.now() / 1000 - 86400 * 3.5 },
  { signerAddress: MOCK_SIGNERS[2], txnId: 1, timeSigned: Date.now() / 1000 - 86400 * 3 },
  { signerAddress: MOCK_SIGNERS[1], txnId: 2, timeSigned: Date.now() / 1000 - 86400 * 1 },
  { signerAddress: MOCK_SIGNERS[3], txnId: 2, timeSigned: Date.now() / 1000 - 3600 },
  { signerAddress: MOCK_SIGNERS[2], txnId: 4, timeSigned: Date.now() / 1000 - 86400 * 8 },
  { signerAddress: MOCK_SIGNERS[0], txnId: 4, timeSigned: Date.now() / 1000 - 86400 * 7.5 },
  { signerAddress: MOCK_SIGNERS[4], txnId: 4, timeSigned: Date.now() / 1000 - 86400 * 7 },
  { signerAddress: MOCK_SIGNERS[3], txnId: 5, timeSigned: Date.now() / 1000 - 86400 * 2 },
  { signerAddress: MOCK_SIGNERS[0], txnId: 6, timeSigned: Date.now() / 1000 - 3600 * 2 },
];
