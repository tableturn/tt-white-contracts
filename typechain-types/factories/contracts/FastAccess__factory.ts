/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  FastAccess,
  FastAccessInterface,
} from "../../contracts/FastAccess";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "governor",
        type: "address",
      },
    ],
    name: "GovernorAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "governor",
        type: "address",
      },
    ],
    name: "GovernorRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "member",
        type: "address",
      },
    ],
    name: "MemberAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "member",
        type: "address",
      },
    ],
    name: "MemberRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "a",
        type: "address",
      },
    ],
    name: "addGovernor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "a",
        type: "address",
      },
    ],
    name: "addMember",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "a",
        type: "address",
      },
    ],
    name: "flags",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "isGovernor",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isMember",
            type: "bool",
          },
        ],
        internalType: "struct IFastAccess.Flags",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "governorCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract FastRegistry",
        name: "pReg",
        type: "address",
      },
      {
        internalType: "address",
        name: "governor",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "a",
        type: "address",
      },
    ],
    name: "isGovernor",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "a",
        type: "address",
      },
    ],
    name: "isMember",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "memberCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "perPage",
        type: "uint256",
      },
    ],
    name: "paginateGovernors",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "perPage",
        type: "uint256",
      },
    ],
    name: "paginateMembers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reg",
    outputs: [
      {
        internalType: "contract FastRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "a",
        type: "address",
      },
    ],
    name: "removeGovernor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "a",
        type: "address",
      },
    ],
    name: "removeMember",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506128c0806100206000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80639fef0c011161008c578063ca6d56dc11610066578063ca6d56dc14610226578063e43581b814610242578063e8c9fd4514610272578063eecdac8814610290576100cf565b80639fef0c0114610195578063a230c524146101c5578063c6549ba4146101f5576100cf565b80630b1ca49a146100d457806311aee380146100f05780633c4a25d01461010e578063485cc9551461012a5780635a4c75d514610146578063738fdd1a14610177575b600080fd5b6100ee60048036038101906100e99190611f23565b6102ac565b005b6100f861060f565b60405161010591906124a9565b60405180910390f35b61012860048036038101906101239190611f4c565b6106a3565b005b610144600480360381019061013f9190611ff2565b610b91565b005b610160600480360381019061015b9190612057565b610e6c565b60405161016e92919061231d565b60405180910390f35b61017f610f92565b60405161018c91906123a6565b60405180910390f35b6101af60048036038101906101aa9190611f23565b610fb8565b6040516101bc919061248e565b60405180910390f35b6101df60048036038101906101da9190611f23565b611074565b6040516101ec919061238b565b60405180910390f35b61020f600480360381019061020a9190612057565b61118d565b60405161021d92919061231d565b60405180910390f35b610240600480360381019061023b9190611f4c565b6112b4565b005b61025c60048036038101906102579190611f23565b611706565b604051610269919061238b565b60405180910390f35b61027a61181f565b60405161028791906124a9565b60405180910390f35b6102aa60048036038101906102a59190611f23565b6118b2565b005b336102d97f0d841762ecac198682b8ea32abfcc9f279a87cba3ee1f6809fd4a7a2a9da08d760001b611cb1565b6103057f1fde687211155c0ca5ed2362efd77968ce615d45962f77e39a0a1d9ec3519a8260001b611cb1565b6103317f657f4035511cf550ca8f88a0ab338bfd052ea85c18f774d9971d2786a362a09d60001b611cb1565b61035d7f992b67256acd6cc19682bc89b573d7f2c3714926282a5983d321fa032f3998d460001b611cb1565b600173__$e466c31e3961a8766d3d15b47ab000296d$__6308b40aef9091836040518363ffffffff1660e01b815260040161039992919061243c565b60206040518083038186803b1580156103b157600080fd5b505af41580156103c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103e99190611fc9565b610428576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161041f9061241c565b60405180910390fd5b6104547fb01e85f113f75fa57f21f3504472986efd207029c966eaca95ebdb51a5e2396260001b611cb1565b6104807f094f044504b74ad2074524fd514f52ef1807e9c4c2e59c68e5d9b3c51dce0aaf60001b611cb1565b6104ac7f47bbd4ef995a19bd0ec03d1530a93a58457e0518e70b125c4452cae9c1ec3f4c60001b611cb1565b6104d87f23c95f8336e641b106d494e8ac4ffd8c4820188b47afce21d47bc07b7216aa0d60001b611cb1565b6105047fa640839f6dfa7767f611c7e76d2a805707b39ddaa149a4d452f3c07aed0fa90260001b611cb1565b600373__$e466c31e3961a8766d3d15b47ab000296d$__6393f482b59091846040518363ffffffff1660e01b815260040161054092919061243c565b60006040518083038186803b15801561055857600080fd5b505af415801561056c573d6000803e3d6000fd5b5050505061059c7fee11c102832def96b249949f94981586443462d4261a348614e6e41b0bf4e7e260001b611cb1565b6105c87fdcb6c7471d3d8877ad5058a2aa1befc9314cbaa0cfd3af119a8c682fec3c7c7760001b611cb1565b8173ffffffffffffffffffffffffffffffffffffffff167f6e76fb4c77256006d9c38ec7d82b45a8c8f3c27b1d6766fffc42dfb8de68449260405160405180910390a25050565b600061063d7fc73c8c5e89ba5039852ae04dd00b94d2bd62ca4c334b38434c4e08bcf60e878260001b611cb1565b6106697f35a0a760acaaa33b948bfb87d07a1ef47d470f7987e2263ff77bc6a3068f8d0360001b611cb1565b6106957f8f97df848b28d8fa2fe69e5c0efb272b9780e1bd1b52cc43e399617cea1e1ed760001b611cb1565b600360010180549050905090565b336106d07fec344608337fda7865b188a6d735ee99d90a6ca4f84d7d8f50cc5b48c648189d60001b611cb1565b6106fc7fa2d9b800c31ed26340907c0ccf5683f23152e62e2a3f1b67b8489c05ee22a90b60001b611cb1565b6107287f6badb53ef6fcb2188ee81f0a06e2c7b7afd0382ac279aa0d16e2d8d9f4dcf70a60001b611cb1565b6107547fd057b9ab27923485fc759ef67bfcb3d3ee7ec4f22176624e83d1db77220ece3f60001b611cb1565b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166385acb0cc6040518163ffffffff1660e01b815260040160206040518083038186803b1580156107bc57600080fd5b505afa1580156107d0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107f4919061202e565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b815260040161082c91906122d9565b60206040518083038186803b15801561084457600080fd5b505afa158015610858573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061087c9190611fc9565b6108bb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108b2906123fc565b60405180910390fd5b6108e77f1652072b7cc4a11765a7d3c0045713edf3808421e679a4090ca5132a5230828b60001b611cb1565b6109137f8ab5ab8ef19ec5cfdcc32e002600c65aee324e7fd25e861e2a224783eec2821660001b611cb1565b61093f7ff95b83ffb06e01161e925a562d44a29842eda9870519b01afe4bad2961506e9660001b611cb1565b61096b7fbf9de9037da079b1a65456f41843ea8d1ad5a3986ec2e5c771245dd775cad6a960001b611cb1565b6109977f8ad4b5c0acdebb050dd7025a103d1864269b3d6b1421f20055af3788df24f06a60001b611cb1565b600173__$e466c31e3961a8766d3d15b47ab000296d$__63ac7de0a09091846040518363ffffffff1660e01b81526004016109d3929190612465565b60006040518083038186803b1580156109eb57600080fd5b505af41580156109ff573d6000803e3d6000fd5b50505050610a2f7fc77a9a4aad1bb193093269455f9549f4b14eee17ac88e41b393ce1ecb75ce88c60001b611cb1565b610a5b7f62ddede7f91971f204de6f798d28069b286598c3f983413d994cba86c0e58b3f60001b611cb1565b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16638a80e95583678ac7230489e800006040518363ffffffff1660e01b8152600401610ac09291906122f4565b600060405180830381600087803b158015610ada57600080fd5b505af1158015610aee573d6000803e3d6000fd5b50505050610b1e7f2bf5d3999fc13be65c4e34ab900b503ca454a6e25dfeded75ec335f5f2b0b6f560001b611cb1565b610b4a7f201d76ac5c7644ac3032de5289489959d6eae18e19bb2872cbdc669141dc98d760001b611cb1565b8173ffffffffffffffffffffffffffffffffffffffff167fdc5a48d79e2e147530ff63ecdbed5a5a66adb9d5cf339384d5d076da197c40b560405160405180910390a25050565b6000610b9d6001611cb4565b90508015610bc1576001600060016101000a81548160ff0219169083151502179055505b610bed7f7db3415848672cac436bc13f1c5f3117fa8237d946fc73e803dde11484b1ed8a60001b611cb1565b610c197f6bb68174438e361866d627bce90175676ae05a6d6e7d05a643f2e39e96e2be8460001b611cb1565b610c457fa9945dc920fd26a218449c38faff1cd0307173ed170eddc4e55b4be1c402d40860001b611cb1565b82600060026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610cb27fd20ab368621c7122957751630b46c012f8457f380653023682ec047258f4cd3f60001b611cb1565b610cde7fa3403a73dd91eb03ae7187abe0b7bc61baa2fa2bbc68f024a57a2b5f529709ee60001b611cb1565b600373__$e466c31e3961a8766d3d15b47ab000296d$__63ac7de0a09091846040518363ffffffff1660e01b8152600401610d1a92919061243c565b60006040518083038186803b158015610d3257600080fd5b505af4158015610d46573d6000803e3d6000fd5b50505050610d767f30acc45f82e6a030f5830f2a2ab90370c59a252e8be892c877e8669eb337b73b60001b611cb1565b610da27fb93eda46e084857873a7b9a03dc37ba90ae51a33e711a7b37783ca1c8af6e8f660001b611cb1565b600173__$e466c31e3961a8766d3d15b47ab000296d$__63ac7de0a09091846040518363ffffffff1660e01b8152600401610dde92919061243c565b60006040518083038186803b158015610df657600080fd5b505af4158015610e0a573d6000803e3d6000fd5b505050508015610e675760008060016101000a81548160ff0219169083151502179055507f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024986001604051610e5e91906123c1565b60405180910390a15b505050565b60606000610e9c7f5c5a02d210504e6c1cb70d88af3b9664c126af6c6983ea885623b3a8063fcc0c60001b611cb1565b610ec87fcd95c3103378caff7dc2cd3d5acfbbe945f430c945038949d82e4a007c02566e60001b611cb1565b610ef47f33d49adb23af1a36c882fb23e9e1315daa59e5b84ceb669213e2181f45af7bc460001b611cb1565b73__$487a23fac22966c883114cdd4da3fa5461$__63f135976a6001800186866040518463ffffffff1660e01b8152600401610f329392919061234d565b60006040518083038186803b158015610f4a57600080fd5b505af4158015610f5e573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250810190610f879190611f75565b915091509250929050565b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610fc0611dc7565b610fec7f99978f95b02f954490e0f94e34516d824bb43891991affccca1ee9a8aadb38af60001b611cb1565b6110187f1a8fbe3a99dde9446712e9124c5fa00f3b2b2bf575f8c9065002d5b92d710fb060001b611cb1565b6110447fb102ef292acebff9c16c90108ae418f035acbd8625ae706aaf87f53c4717cf3260001b611cb1565b604051806040016040528061105884611706565b1515815260200161106884611074565b15158152509050919050565b60006110a27f2bb533850c27dd541d18734000eda85e70e8ede4ac3e36b92ffd608f4451f52860001b611cb1565b6110ce7f03b738dd58da9e9f1a0a2c82517ee1c056b97f63573ba386c89b9bde15a5238b60001b611cb1565b6110fa7f8601dfe79f0ceeec92f4e59ea7276b6de6ffc2c1c4819393ec0ca8f2613b993060001b611cb1565b600373__$e466c31e3961a8766d3d15b47ab000296d$__6308b40aef9091846040518363ffffffff1660e01b815260040161113692919061243c565b60206040518083038186803b15801561114e57600080fd5b505af4158015611162573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111869190611fc9565b9050919050565b606060006111bd7f17ef270b23d0cd53fd94a9da932b20184481b0b1d0ee807fb1fceaca3335cbfb60001b611cb1565b6111e97fc04e0ac9e936a8e299930559c57eca0a1cd542679c6fba2878d5f7afb88bc68d60001b611cb1565b6112157f6dd8d52bc46750f375f3ee40c5af827af6d1fdc0405e56f7213a1be045aa712b60001b611cb1565b73__$487a23fac22966c883114cdd4da3fa5461$__63f135976a600360010186866040518463ffffffff1660e01b81526004016112549392919061234d565b60006040518083038186803b15801561126c57600080fd5b505af4158015611280573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906112a99190611f75565b915091509250929050565b336112e17f0d841762ecac198682b8ea32abfcc9f279a87cba3ee1f6809fd4a7a2a9da08d760001b611cb1565b61130d7f1fde687211155c0ca5ed2362efd77968ce615d45962f77e39a0a1d9ec3519a8260001b611cb1565b6113397f657f4035511cf550ca8f88a0ab338bfd052ea85c18f774d9971d2786a362a09d60001b611cb1565b6113657f992b67256acd6cc19682bc89b573d7f2c3714926282a5983d321fa032f3998d460001b611cb1565b600173__$e466c31e3961a8766d3d15b47ab000296d$__6308b40aef9091836040518363ffffffff1660e01b81526004016113a192919061243c565b60206040518083038186803b1580156113b957600080fd5b505af41580156113cd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113f19190611fc9565b611430576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114279061241c565b60405180910390fd5b61145c7fb01e85f113f75fa57f21f3504472986efd207029c966eaca95ebdb51a5e2396260001b611cb1565b6114887f094f044504b74ad2074524fd514f52ef1807e9c4c2e59c68e5d9b3c51dce0aaf60001b611cb1565b6114b47f12a7616bee73fddebaaced295b88c788985e79fdc625226796e4499be010281460001b611cb1565b6114e07f982e09a1cb54c5882f95160e54b9a53a084fcf0d57361e152cc0e8f9d7888f4360001b611cb1565b61150c7f306ebdcad212909d7a4e840bff9cb1859f2aa334315047d188f0dc8401746fa360001b611cb1565b600373__$e466c31e3961a8766d3d15b47ab000296d$__63ac7de0a09091846040518363ffffffff1660e01b8152600401611548929190612465565b60006040518083038186803b15801561156057600080fd5b505af4158015611574573d6000803e3d6000fd5b505050506115a47fd7a79722f75258e7ccbfe57cade6fa69a486eea673f3e182671c1e1bae4d3e2360001b611cb1565b6115d07ffdf61fce4e39cb70dd35061995d34600e588fb9d1024a55cbe25e90b4e256e1a60001b611cb1565b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16638a80e95583670de0b6b3a76400006040518363ffffffff1660e01b81526004016116359291906122f4565b600060405180830381600087803b15801561164f57600080fd5b505af1158015611663573d6000803e3d6000fd5b505050506116937f0f7836abf3c0cad84aff4c9baeffc47f0f3b020f30ffca5495bf1bbeaace8c1660001b611cb1565b6116bf7f6dc31d965191e3725ed202eed59660a97928f67b3171f479f52b20dfc47c994960001b611cb1565b8173ffffffffffffffffffffffffffffffffffffffff167fb251eb052afc73ffd02ffe85ad79990a8b3fed60d76dbc2fa2fdd7123dffd91460405160405180910390a25050565b60006117347f996361c8cee70350b7b2f08a6faebba738162bc48166882379d9c787993f28ce60001b611cb1565b6117607f5cd788d2d371be67f2277a2360513943024d79461930ce96d3e14a0b5acb426960001b611cb1565b61178c7f467f17a4a6c0d91d961301aca4dbf0d69a8a8903482a7d2cf5d842c1cb24e92760001b611cb1565b600173__$e466c31e3961a8766d3d15b47ab000296d$__6308b40aef9091846040518363ffffffff1660e01b81526004016117c892919061243c565b60206040518083038186803b1580156117e057600080fd5b505af41580156117f4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118189190611fc9565b9050919050565b600061184d7f9bf3ef2fefc465a3cc2587f7fb996f451b28abb69c2b34841e532203c2f9ea1460001b611cb1565b6118797f397934e2448ac3d2a022ae07c831505054cff2094f0059878f744f00851027cf60001b611cb1565b6118a57f2a13f929b0111b2b1d4087f7bb341fe4222972991bef5f0ac4730a933dbfa51160001b611cb1565b6001800180549050905090565b336118df7fec344608337fda7865b188a6d735ee99d90a6ca4f84d7d8f50cc5b48c648189d60001b611cb1565b61190b7fa2d9b800c31ed26340907c0ccf5683f23152e62e2a3f1b67b8489c05ee22a90b60001b611cb1565b6119377f6badb53ef6fcb2188ee81f0a06e2c7b7afd0382ac279aa0d16e2d8d9f4dcf70a60001b611cb1565b6119637fd057b9ab27923485fc759ef67bfcb3d3ee7ec4f22176624e83d1db77220ece3f60001b611cb1565b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166385acb0cc6040518163ffffffff1660e01b815260040160206040518083038186803b1580156119cb57600080fd5b505afa1580156119df573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a03919061202e565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b8152600401611a3b91906122d9565b60206040518083038186803b158015611a5357600080fd5b505afa158015611a67573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a8b9190611fc9565b611aca576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ac1906123fc565b60405180910390fd5b611af67f1652072b7cc4a11765a7d3c0045713edf3808421e679a4090ca5132a5230828b60001b611cb1565b611b227f8ab5ab8ef19ec5cfdcc32e002600c65aee324e7fd25e861e2a224783eec2821660001b611cb1565b611b4e7fa950e4a4501a9e596463828aa77cb8b5dfa7e5b6b52a695e82cb23470a66d3ce60001b611cb1565b611b7a7f9b72bb012beee5c88b842ba1c563572c99737616abab0b81e042ec0e2004fe5960001b611cb1565b611ba67f65e7977b86ecaef76f5587384028a194c28b1d56a6340c6b0f51f6fdb960c97c60001b611cb1565b600173__$e466c31e3961a8766d3d15b47ab000296d$__6393f482b59091846040518363ffffffff1660e01b8152600401611be292919061243c565b60006040518083038186803b158015611bfa57600080fd5b505af4158015611c0e573d6000803e3d6000fd5b50505050611c3e7f879b789464516106552b8c2a4d2227591f4d0698aa08ebe6d6e2e15ee38db71060001b611cb1565b611c6a7f2cb46cef3cb45b7790670901ab7bce5c08b48a1aca408f3a9fb4132f9eb7066060001b611cb1565b8173ffffffffffffffffffffffffffffffffffffffff167f1ebe834e73d60a5fec822c1e1727d34bc79f2ad977ed504581cc1822fe20fb5b60405160405180910390a25050565b50565b60008060019054906101000a900460ff1615611d2b5760018260ff16148015611ce35750611ce130611da4565b155b611d22576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611d19906123dc565b60405180910390fd5b60009050611d9f565b8160ff1660008054906101000a900460ff1660ff1610611d80576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611d77906123dc565b60405180910390fd5b816000806101000a81548160ff021916908360ff160217905550600190505b919050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b60405180604001604052806000151581526020016000151581525090565b6000611df8611df3846124e9565b6124c4565b90508083825260208201905082856020860282011115611e1757600080fd5b60005b85811015611e475781611e2d8882611e66565b845260208401935060208301925050600181019050611e1a565b5050509392505050565b600081359050611e6081612800565b92915050565b600081519050611e7581612800565b92915050565b600081359050611e8a81612817565b92915050565b600082601f830112611ea157600080fd5b8151611eb1848260208601611de5565b91505092915050565b600081519050611ec98161282e565b92915050565b600081359050611ede81612845565b92915050565b600081519050611ef38161285c565b92915050565b600081359050611f0881612873565b92915050565b600081519050611f1d81612873565b92915050565b600060208284031215611f3557600080fd5b6000611f4384828501611e51565b91505092915050565b600060208284031215611f5e57600080fd5b6000611f6c84828501611e7b565b91505092915050565b60008060408385031215611f8857600080fd5b600083015167ffffffffffffffff811115611fa257600080fd5b611fae85828601611e90565b9250506020611fbf85828601611f0e565b9150509250929050565b600060208284031215611fdb57600080fd5b6000611fe984828501611eba565b91505092915050565b6000806040838503121561200557600080fd5b600061201385828601611ecf565b925050602061202485828601611e51565b9150509250929050565b60006020828403121561204057600080fd5b600061204e84828501611ee4565b91505092915050565b6000806040838503121561206a57600080fd5b600061207885828601611ef9565b925050602061208985828601611ef9565b9150509250929050565b600061209f83836120e1565b60208301905092915050565b60006120b7838361210e565b60208301905092915050565b6120cc81612648565b82525050565b6120db816125cf565b82525050565b6120ea816125bd565b82525050565b6120f9816125bd565b82525050565b612108816125bd565b82525050565b612117816125bd565b82525050565b60006121288261253a565b612132818561256a565b935061213d83612515565b8060005b8381101561216e5781516121558882612093565b975061216083612550565b925050600181019050612141565b5085935050505092915050565b600061218682612545565b612190818561257b565b935061219b83612525565b8060005b838110156121d3576121b08261272e565b6121ba88826120ab565b97506121c58361255d565b92505060018101905061219f565b5085935050505092915050565b6121e9816125e1565b82525050565b6121f8816125e1565b82525050565b6122078161265a565b82525050565b6122168161267e565b82525050565b6000612229602e8361258c565b91506122348261275f565b604082019050919050565b600061224c60168361258c565b9150612257826127ae565b602082019050919050565b600061226f60148361258c565b915061227a826127d7565b602082019050919050565b8082525050565b6040820160008201516122a260008501826121e0565b5060208201516122b560208501826121e0565b50505050565b6122c481612631565b82525050565b6122d381612631565b82525050565b60006020820190506122ee60008301846120f0565b92915050565b600060408201905061230960008301856120d2565b61231660208301846122bb565b9392505050565b60006040820190508181036000830152612337818561211d565b905061234660208301846122bb565b9392505050565b60006060820190508181036000830152612367818661217b565b905061237660208301856122ca565b61238360408301846122ca565b949350505050565b60006020820190506123a060008301846121ef565b92915050565b60006020820190506123bb60008301846121fe565b92915050565b60006020820190506123d6600083018461220d565b92915050565b600060208201905081810360008301526123f58161221c565b9050919050565b600060208201905081810360008301526124158161223f565b9050919050565b6000602082019050818103600083015261243581612262565b9050919050565b60006040820190506124516000830185612285565b61245e60208301846120ff565b9392505050565b600060408201905061247a6000830185612285565b61248760208301846120c3565b9392505050565b60006040820190506124a3600083018461228c565b92915050565b60006020820190506124be60008301846122bb565b92915050565b60006124ce6124df565b90506124da82826126ce565b919050565b6000604051905090565b600067ffffffffffffffff821115612504576125036126ff565b5b602082029050602081019050919050565b6000819050602082019050919050565b60008190508160005260206000209050919050565b600081519050919050565b600081549050919050565b6000602082019050919050565b6000600182019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006125c882612611565b9050919050565b60006125da82612611565b9050919050565b60008115159050919050565b60006125f8826125bd565b9050919050565b600061260a826125bd565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b600061265382612690565b9050919050565b60006126658261266c565b9050919050565b600061267782612611565b9050919050565b60006126898261263b565b9050919050565b600061269b826126a2565b9050919050565b60006126ad82612611565b9050919050565b60006126c76126c283612752565b61259d565b9050919050565b6126d782612741565b810181811067ffffffffffffffff821117156126f6576126f56126ff565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600061273a82546126b4565b9050919050565b6000601f19601f8301169050919050565b60008160001c9050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f4d697373696e6720535043206d656d6265727368697000000000000000000000600082015250565b7f4d697373696e6720676f7665726e6f7273686970000000000000000000000000600082015250565b612809816125bd565b811461281457600080fd5b50565b612820816125cf565b811461282b57600080fd5b50565b612837816125e1565b811461284257600080fd5b50565b61284e816125ed565b811461285957600080fd5b50565b612865816125ff565b811461287057600080fd5b50565b61287c81612631565b811461288757600080fd5b5056fea2646970667358221220990d34ab518b7a4e835888ca8f62f93596e5db7021daccc5f1638ab99649e89e64736f6c63430008040033";

type FastAccessConstructorParams =
  | [linkLibraryAddresses: FastAccessLibraryAddresses, signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FastAccessConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => {
  return (
    typeof xs[0] === "string" ||
    (Array.isArray as (arg: any) => arg is readonly any[])(xs[0]) ||
    "_isInterface" in xs[0]
  );
};

export class FastAccess__factory extends ContractFactory {
  constructor(...args: FastAccessConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      const [linkLibraryAddresses, signer] = args;
      super(
        _abi,
        FastAccess__factory.linkBytecode(linkLibraryAddresses),
        signer
      );
    }
  }

  static linkBytecode(
    linkLibraryAddresses: FastAccessLibraryAddresses
  ): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$e466c31e3961a8766d3d15b47ab000296d\\$__", "g"),
      linkLibraryAddresses["contracts/lib/AddressSetLib.sol:AddressSetLib"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$487a23fac22966c883114cdd4da3fa5461\\$__", "g"),
      linkLibraryAddresses["contracts/lib/PaginationLib.sol:PaginationLib"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<FastAccess> {
    return super.deploy(overrides || {}) as Promise<FastAccess>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): FastAccess {
    return super.attach(address) as FastAccess;
  }
  override connect(signer: Signer): FastAccess__factory {
    return super.connect(signer) as FastAccess__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FastAccessInterface {
    return new utils.Interface(_abi) as FastAccessInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FastAccess {
    return new Contract(address, _abi, signerOrProvider) as FastAccess;
  }
}

export interface FastAccessLibraryAddresses {
  ["contracts/lib/AddressSetLib.sol:AddressSetLib"]: string;
  ["contracts/lib/PaginationLib.sol:PaginationLib"]: string;
}
