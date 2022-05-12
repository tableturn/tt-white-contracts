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
  "0x608060405234801561001057600080fd5b50611dd4806100206000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80639fef0c011161008c578063ca6d56dc11610066578063ca6d56dc14610226578063e43581b814610242578063e8c9fd4514610272578063eecdac8814610290576100cf565b80639fef0c0114610195578063a230c524146101c5578063c6549ba4146101f5576100cf565b80630b1ca49a146100d457806311aee380146100f05780633c4a25d01461010e578063485cc9551461012a5780635a4c75d514610146578063738fdd1a14610177575b600080fd5b6100ee60048036038101906100e9919061148e565b6102ac565b005b6100f86103d3565b60405161010591906119d6565b60405180910390f35b610128600480360381019061012391906114b7565b6103e3565b005b610144600480360381019061013f919061155d565b61063d565b005b610160600480360381019061015b91906115c2565b610734565b60405161016e92919061183a565b60405180910390f35b61017f6107d6565b60405161018c91906118bc565b60405180910390f35b6101af60048036038101906101aa919061148e565b6107fc565b6040516101bc91906119bb565b60405180910390f35b6101df60048036038101906101da919061148e565b610834565b6040516101ec91906118a1565b60405180910390f35b61020f600480360381019061020a91906115c2565b6108c9565b60405161021d92919061183a565b60405180910390f35b610240600480360381019061023b91906114b7565b61096c565b005b61025c6004803603810190610257919061148e565b610b2a565b60405161026991906118a1565b60405180910390f35b61027a610bbf565b60405161028791906119d6565b60405180910390f35b6102aa60048036038101906102a5919061148e565b610bce565b005b33600173__$e466c31e3961a8766d3d15b47ab000296d$__6308b40aef9091836040518363ffffffff1660e01b81526004016102e9929190611992565b60206040518083038186803b15801561030157600080fd5b505af4158015610315573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103399190611534565b610378576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161036f90611972565b60405180910390fd5b61038c826003610d9190919063ffffffff16565b8173ffffffffffffffffffffffffffffffffffffffff167f6e76fb4c77256006d9c38ec7d82b45a8c8f3c27b1d6766fffc42dfb8de68449260405160405180910390a25050565b6000600360010180549050905090565b33600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166385acb0cc6040518163ffffffff1660e01b815260040160206040518083038186803b15801561044c57600080fd5b505afa158015610460573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104849190611599565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b81526004016104bc91906117f6565b60206040518083038186803b1580156104d457600080fd5b505afa1580156104e8573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061050c9190611534565b61054b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161054290611932565b60405180910390fd5b61055f82600161102990919063ffffffff16565b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16638a80e95583678ac7230489e800006040518363ffffffff1660e01b81526004016105c4929190611811565b600060405180830381600087803b1580156105de57600080fd5b505af11580156105f2573d6000803e3d6000fd5b505050508173ffffffffffffffffffffffffffffffffffffffff167fdc5a48d79e2e147530ff63ecdbed5a5a66adb9d5cf339384d5d076da197c40b560405160405180910390a25050565b60006106496001611129565b9050801561066d576001600060016101000a81548160ff0219169083151502179055505b82600060026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506106c282600361102990919063ffffffff16565b6106d682600161102990919063ffffffff16565b801561072f5760008060016101000a81548160ff0219169083151502179055507f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498600160405161072691906118d7565b60405180910390a15b505050565b6060600073__$487a23fac22966c883114cdd4da3fa5461$__632479d0656001800186866040518463ffffffff1660e01b81526004016107769392919061186a565b60006040518083038186803b15801561078e57600080fd5b505af41580156107a2573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906107cb91906114e0565b915091509250929050565b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610804611332565b604051806040016040528061081884610b2a565b1515815260200161082884610834565b15158152509050919050565b6000600373__$e466c31e3961a8766d3d15b47ab000296d$__6308b40aef9091846040518363ffffffff1660e01b8152600401610872929190611992565b60206040518083038186803b15801561088a57600080fd5b505af415801561089e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108c29190611534565b9050919050565b6060600073__$487a23fac22966c883114cdd4da3fa5461$__632479d065600360010186866040518463ffffffff1660e01b815260040161090c9392919061186a565b60006040518083038186803b15801561092457600080fd5b505af4158015610938573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525081019061096191906114e0565b915091509250929050565b33600173__$e466c31e3961a8766d3d15b47ab000296d$__6308b40aef9091836040518363ffffffff1660e01b81526004016109a9929190611992565b60206040518083038186803b1580156109c157600080fd5b505af41580156109d5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109f99190611534565b610a38576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a2f90611972565b60405180910390fd5b610a4c82600361102990919063ffffffff16565b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16638a80e95583670de0b6b3a76400006040518363ffffffff1660e01b8152600401610ab1929190611811565b600060405180830381600087803b158015610acb57600080fd5b505af1158015610adf573d6000803e3d6000fd5b505050508173ffffffffffffffffffffffffffffffffffffffff167fb251eb052afc73ffd02ffe85ad79990a8b3fed60d76dbc2fa2fdd7123dffd91460405160405180910390a25050565b6000600173__$e466c31e3961a8766d3d15b47ab000296d$__6308b40aef9091846040518363ffffffff1660e01b8152600401610b68929190611992565b60206040518083038186803b158015610b8057600080fd5b505af4158015610b94573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bb89190611534565b9050919050565b60006001800180549050905090565b33600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166385acb0cc6040518163ffffffff1660e01b815260040160206040518083038186803b158015610c3757600080fd5b505afa158015610c4b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c6f9190611599565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b8152600401610ca791906117f6565b60206040518083038186803b158015610cbf57600080fd5b505afa158015610cd3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cf79190611534565b610d36576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d2d90611932565b60405180910390fd5b610d4a826001610d9190919063ffffffff16565b8173ffffffffffffffffffffffffffffffffffffffff167f1ebe834e73d60a5fec822c1e1727d34bc79f2ad977ed504581cc1822fe20fb5b60405160405180910390a25050565b610d9b8282611219565b610dda576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dd190611952565b60405180910390fd5b600060018360010180549050610df09190611a8c565b90506000836001018281548110610e30577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905060008460000160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050808560000160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081856001018281548110610f26577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508460000160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000905584600101805480610fed577f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fd5b6001900381819060005260206000200160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905590555050505050565b6110338282611219565b15611073576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161106a90611912565b60405180910390fd5b81600101805490508260000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081600101819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b60008060019054906101000a900460ff16156111a05760018260ff1614801561115857506111563061130f565b155b611197576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161118e906118f2565b60405180910390fd5b60009050611214565b8160ff1660008054906101000a900460ff1660ff16106111f5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111ec906118f2565b60405180910390fd5b816000806101000a81548160ff021916908360ff160217905550600190505b919050565b600080836001018054905014611304578173ffffffffffffffffffffffffffffffffffffffff16836001018460000160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054815481106112bd577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614611307565b60005b905092915050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b60405180604001604052806000151581526020016000151581525090565b600061136361135e84611a16565b6119f1565b9050808382526020820190508285602086028201111561138257600080fd5b60005b858110156113b2578161139888826113d1565b845260208401935060208301925050600181019050611385565b5050509392505050565b6000813590506113cb81611d14565b92915050565b6000815190506113e081611d14565b92915050565b6000813590506113f581611d2b565b92915050565b600082601f83011261140c57600080fd5b815161141c848260208601611350565b91505092915050565b60008151905061143481611d42565b92915050565b60008135905061144981611d59565b92915050565b60008151905061145e81611d70565b92915050565b60008135905061147381611d87565b92915050565b60008151905061148881611d87565b92915050565b6000602082840312156114a057600080fd5b60006114ae848285016113bc565b91505092915050565b6000602082840312156114c957600080fd5b60006114d7848285016113e6565b91505092915050565b600080604083850312156114f357600080fd5b600083015167ffffffffffffffff81111561150d57600080fd5b611519858286016113fb565b925050602061152a85828601611479565b9150509250929050565b60006020828403121561154657600080fd5b600061155484828501611425565b91505092915050565b6000806040838503121561157057600080fd5b600061157e8582860161143a565b925050602061158f858286016113bc565b9150509250929050565b6000602082840312156115ab57600080fd5b60006115b98482850161144f565b91505092915050565b600080604083850312156115d557600080fd5b60006115e385828601611464565b92505060206115f485828601611464565b9150509250929050565b600061160a8383611625565b60208301905092915050565b61161f81611ad2565b82525050565b61162e81611ac0565b82525050565b61163d81611ac0565b82525050565b61164c81611ac0565b82525050565b600061165d82611a52565b6116678185611a6a565b935061167283611a42565b8060005b838110156116a357815161168a88826115fe565b975061169583611a5d565b925050600181019050611676565b5085935050505092915050565b8082525050565b6116c081611ae4565b82525050565b6116cf81611ae4565b82525050565b6116de81611b4b565b82525050565b6116ed81611b6f565b82525050565b6000611700602e83611a7b565b915061170b82611c21565b604082019050919050565b6000611723601683611a7b565b915061172e82611c70565b602082019050919050565b6000611746601683611a7b565b915061175182611c99565b602082019050919050565b6000611769601d83611a7b565b915061177482611cc2565b602082019050919050565b600061178c601483611a7b565b915061179782611ceb565b602082019050919050565b8082525050565b6040820160008201516117bf60008501826116b7565b5060208201516117d260208501826116b7565b50505050565b6117e181611b34565b82525050565b6117f081611b34565b82525050565b600060208201905061180b6000830184611634565b92915050565b60006040820190506118266000830185611616565b61183360208301846117d8565b9392505050565b600060408201905081810360008301526118548185611652565b905061186360208301846117d8565b9392505050565b600060608201905061187f60008301866116b0565b61188c60208301856117e7565b61189960408301846117e7565b949350505050565b60006020820190506118b660008301846116c6565b92915050565b60006020820190506118d160008301846116d5565b92915050565b60006020820190506118ec60008301846116e4565b92915050565b6000602082019050818103600083015261190b816116f3565b9050919050565b6000602082019050818103600083015261192b81611716565b9050919050565b6000602082019050818103600083015261194b81611739565b9050919050565b6000602082019050818103600083015261196b8161175c565b9050919050565b6000602082019050818103600083015261198b8161177f565b9050919050565b60006040820190506119a760008301856117a2565b6119b46020830184611643565b9392505050565b60006040820190506119d060008301846117a9565b92915050565b60006020820190506119eb60008301846117d8565b92915050565b60006119fb611a0c565b9050611a078282611b81565b919050565b6000604051905090565b600067ffffffffffffffff821115611a3157611a30611be1565b5b602082029050602081019050919050565b6000819050602082019050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b6000611a9782611b34565b9150611aa283611b34565b925082821015611ab557611ab4611bb2565b5b828203905092915050565b6000611acb82611b14565b9050919050565b6000611add82611b14565b9050919050565b60008115159050919050565b6000611afb82611ac0565b9050919050565b6000611b0d82611ac0565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b6000611b5682611b5d565b9050919050565b6000611b6882611b14565b9050919050565b6000611b7a82611b3e565b9050919050565b611b8a82611c10565b810181811067ffffffffffffffff82111715611ba957611ba8611be1565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f4164647265737320616c726561647920696e2073657400000000000000000000600082015250565b7f4d697373696e6720535043206d656d6265727368697000000000000000000000600082015250565b7f4164647265737320646f6573206e6f7420657869737420696e20736574000000600082015250565b7f4d697373696e6720676f7665726e6f7273686970000000000000000000000000600082015250565b611d1d81611ac0565b8114611d2857600080fd5b50565b611d3481611ad2565b8114611d3f57600080fd5b50565b611d4b81611ae4565b8114611d5657600080fd5b50565b611d6281611af0565b8114611d6d57600080fd5b50565b611d7981611b02565b8114611d8457600080fd5b50565b611d9081611b34565b8114611d9b57600080fd5b5056fea26469706673582212209ded63f637cfcabebfad97cee82014bdde568a7bab8ed1df41d488ad4d7aad5a64736f6c63430008040033";

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
