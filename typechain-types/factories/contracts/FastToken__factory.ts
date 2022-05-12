/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { FastToken, FastTokenInterface } from "../../contracts/FastToken";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
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
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "addTransferCredits",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowances",
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
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
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
    inputs: [],
    name: "decimals",
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
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "detectTransferRestriction",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "drainTransferCredits",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "hasFixedSupply",
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
        internalType: "contract FastRegistry",
        name: "_reg",
        type: "address",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_decimals",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_hasFixedSupply",
        type: "bool",
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
        internalType: "uint8",
        name: "restrictionCode",
        type: "uint8",
      },
    ],
    name: "messageForTransferRestriction",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "ref",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
        internalType: "bool",
        name: "_hasFixedSupply",
        type: "bool",
      },
    ],
    name: "setHasFixedSupply",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "transferCredits",
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
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "ref",
        type: "string",
      },
    ],
    name: "transferFromWithRef",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "ref",
        type: "string",
      },
    ],
    name: "transferWithRef",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506137a7806100206000396000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c806370a08231116100c3578063c485bb961161007c578063c485bb9614610402578063d4ce141514610432578063dd62ed3e14610462578063ddb2d22b14610492578063ddee550c146104b0578063e8edd0e3146104ce5761014d565b806370a0823114610306578063738fdd1a1461033657806377097fc8146103545780637f4ab1dd1461038457806395d89b41146103b4578063a9059cbb146103d25761014d565b8063296a24f111610115578063296a24f11461021e578063300059161461023a578063313ce5671461026a57806344ce66da1461028857806355b6ed5c146102b85780636ba09c5c146102e85761014d565b806306fdde0314610152578063095ea7b31461017057806318160ddd146101a057806323b872dd146101be57806327e235e3146101ee575b600080fd5b61015a6104fe565b60405161016791906130d4565b60405180910390f35b61018a60048036038101906101859190612bc9565b61058c565b6040516101979190613083565b60405180910390f35b6101a8610857565b6040516101b591906131d6565b60405180910390f35b6101d860048036038101906101d39190612aff565b61085d565b6040516101e59190613083565b60405180910390f35b61020860048036038101906102039190612a9a565b6108a9565b60405161021591906131d6565b60405180910390f35b61023860048036038101906102339190612cbe565b6108c1565b005b610254600480360381019061024f9190612de0565b610a10565b6040516102619190613083565b60405180910390f35b610272610b9d565b60405161027f91906131d6565b60405180910390f35b6102a2600480360381019061029d9190612c6c565b610ba3565b6040516102af9190613083565b60405180910390f35b6102d260048036038101906102cd9190612ac3565b610d31565b6040516102df91906131d6565b60405180910390f35b6102f0610d56565b6040516102fd91906131d6565b60405180910390f35b610320600480360381019061031b9190612a9a565b610d5c565b60405161032d91906131d6565b60405180910390f35b61033e610da5565b60405161034b919061309e565b60405180910390f35b61036e60048036038101906103699190612e09565b610dcb565b60405161037b9190613083565b60405180910390f35b61039e60048036038101906103999190612e5d565b611118565b6040516103ab91906130d4565b60405180910390f35b6103bc61127d565b6040516103c991906130d4565b60405180910390f35b6103ec60048036038101906103e79190612bc9565b61130b565b6040516103f99190613083565b60405180910390f35b61041c60048036038101906104179190612b4e565b611357565b6040516104299190613083565b60405180910390f35b61044c60048036038101906104479190612aff565b611a5f565b6040516104599190613221565b60405180910390f35b61047c60048036038101906104779190612ac3565b611cea565b60405161048991906131d6565b60405180910390f35b61049a611f1d565b6040516104a79190613083565b60405180910390f35b6104b8611f30565b6040516104c59190613083565b60405180910390f35b6104e860048036038101906104e39190612c05565b6120aa565b6040516104f59190613083565b60405180910390f35b6001805461050b9061344d565b80601f01602080910402602001604051908101604052809291908181526020018280546105379061344d565b80156105845780601f1061055957610100808354040283529160200191610584565b820191906000526020600020905b81548152906001019060200180831161056757829003601f168201915b505050505081565b600033600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371907f176040518163ffffffff1660e01b815260040160206040518083038186803b1580156105f757600080fd5b505afa15801561060b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062f9190612d65565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b8152600401610667919061300e565b60206040518083038186803b15801561067f57600080fd5b505afa158015610693573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106b79190612c95565b806106ee5750600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b6040518060400160405280601981526020017f4d697373696e672073656e646572206d656d626572736869700000000000000081525090610765576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161075c91906130d4565b60405180910390fd5b5082600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508373ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258560405161084491906131d6565b60405180910390a3600191505092915050565b60045481565b60006108a08484846040518060400160405280601781526020017f556e737065636966696564202d20766961204552433230000000000000000000815250611357565b90509392505050565b60076020528060005260406000206000915090505481565b60006108cd60016120c2565b905080156108f1576001600060016101000a81548160ff0219169083151502179055505b85600060026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550848484600060016000600260006003600060046000889190505587919050558691905090805190602001906109689291906128d2565b508591905090805190602001906109809291906128d2565b505050505060008260056000600660008491906101000a81548160ff021916908315150217905550839190505550508015610a085760008060016101000a81548160ff0219169083151502179055507f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249860016040516109ff91906130b9565b60405180910390a15b505050505050565b600033600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166385acb0cc6040518163ffffffff1660e01b815260040160206040518083038186803b158015610a7b57600080fd5b505afa158015610a8f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ab39190612db7565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b8152600401610aeb919061300e565b60206040518083038186803b158015610b0357600080fd5b505afa158015610b17573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b3b9190612c95565b610b7a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b7190613156565b60405180910390fd5b8260056000828254610b8c91906132ae565b925050819055506001915050919050565b60035481565b600033600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166385acb0cc6040518163ffffffff1660e01b815260040160206040518083038186803b158015610c0e57600080fd5b505afa158015610c22573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c469190612db7565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b8152600401610c7e919061300e565b60206040518083038186803b158015610c9657600080fd5b505afa158015610caa573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cce9190612c95565b610d0d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d0490613156565b60405180910390fd5b82600660006101000a81548160ff0219169083151502179055506001915050919050565b6008602052816000526040600020602052806000526040600020600091509150505481565b60055481565b6000600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600033600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166385acb0cc6040518163ffffffff1660e01b815260040160206040518083038186803b158015610e3657600080fd5b505afa158015610e4a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e6e9190612db7565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b8152600401610ea6919061300e565b60206040518083038186803b158015610ebe57600080fd5b505afa158015610ed2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ef69190612c95565b610f35576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f2c90613156565b60405180910390fd5b600660009054906101000a900460ff161580610f5357506000600454145b610f92576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f8990613196565b60405180910390fd5b83600760008073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610fe191906132ae565b925050819055508360046000828254610ffa91906132ae565b92505081905550600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166398daac836040518163ffffffff1660e01b815260040160206040518083038186803b15801561106957600080fd5b505afa15801561107d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110a19190612d8e565b73ffffffffffffffffffffffffffffffffffffffff1663843d00e685856040518363ffffffff1660e01b81526004016110db9291906131f1565b600060405180830381600087803b1580156110f557600080fd5b505af1158015611109573d6000803e3d6000fd5b50505050600191505092915050565b6060600160ff168260ff161415611166576040518060400160405280601c81526020017f496e737566696369656e74207472616e736665722063726564697473000000008152509050611278565b600260ff168260ff1614156111b2576040518060400160405280601981526020017f4d697373696e672073656e646572206d656d62657273686970000000000000008152509050611278565b600360ff168260ff1614156111fe576040518060400160405280601c81526020017f4d697373696e6720726563697069656e74206d656d62657273686970000000008152509050611278565b600061123f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161123690613116565b60405180910390fd5b6040518060400160405280601981526020017f556e6b6e6f776e207265737472696374696f6e20636f64652e0000000000000081525090505b919050565b6002805461128a9061344d565b80601f01602080910402602001604051908101604052809291908181526020018280546112b69061344d565b80156113035780601f106112d857610100808354040283529160200191611303565b820191906000526020600020905b8154815290600101906020018083116112e657829003601f168201915b505050505081565b600061134f333385856040518060400160405280601781526020017f556e737065636966696564202d207669612045524332300000000000000000008152506121b2565b905092915050565b6000828060055410156040518060400160405280601c81526020017f496e737566696369656e74207472616e73666572206372656469747300000000815250906113d7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113ce91906130d4565b60405180910390fd5b5085600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371907f176040518163ffffffff1660e01b815260040160206040518083038186803b15801561144157600080fd5b505afa158015611455573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114799190612d65565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b81526004016114b1919061300e565b60206040518083038186803b1580156114c957600080fd5b505afa1580156114dd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115019190612c95565b806115385750600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b6040518060400160405280601981526020017f4d697373696e672073656e646572206d656d6265727368697000000000000000815250906115af576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115a691906130d4565b60405180910390fd5b5085600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371907f176040518163ffffffff1660e01b815260040160206040518083038186803b15801561161957600080fd5b505afa15801561162d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116519190612d65565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b8152600401611689919061300e565b60206040518083038186803b1580156116a157600080fd5b505afa1580156116b5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116d99190612c95565b6040518060400160405280601c81526020017f4d697373696e6720726563697069656e74206d656d626572736869700000000081525090611750576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161174791906130d4565b60405180910390fd5b50600073ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff1614156118f257600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371907f176040518163ffffffff1660e01b815260040160206040518083038186803b1580156117ee57600080fd5b505afa158015611802573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118269190612d65565b73ffffffffffffffffffffffffffffffffffffffff1663e43581b8336040518263ffffffff1660e01b815260040161185e919061300e565b60206040518083038186803b15801561187657600080fd5b505afa15801561188a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118ae9190612c95565b6118ed576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016118e4906131b6565b60405180910390fd5b611a45565b85600860008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156119b1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016119a8906130f6565b60405180910390fd5b85600860008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611a3d9190613304565b925050819055505b611a5233898989896121b2565b9350505050949350505050565b6000816005541015611a745760019050611ce3565b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371907f176040518163ffffffff1660e01b815260040160206040518083038186803b158015611adc57600080fd5b505afa158015611af0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b149190612d65565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524856040518263ffffffff1660e01b8152600401611b4c919061300e565b60206040518083038186803b158015611b6457600080fd5b505afa158015611b78573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b9c9190612c95565b611ba95760029050611ce3565b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371907f176040518163ffffffff1660e01b815260040160206040518083038186803b158015611c1157600080fd5b505afa158015611c25573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611c499190612d65565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524846040518263ffffffff1660e01b8152600401611c81919061300e565b60206040518083038186803b158015611c9957600080fd5b505afa158015611cad573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611cd19190612c95565b611cde5760039050611ce3565b600090505b9392505050565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16148015611e4b5750600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371907f176040518163ffffffff1660e01b815260040160206040518083038186803b158015611d8a57600080fd5b505afa158015611d9e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611dc29190612d65565b73ffffffffffffffffffffffffffffffffffffffff1663e43581b8836040518263ffffffff1660e01b8152600401611dfa919061300e565b60206040518083038186803b158015611e1257600080fd5b505afa158015611e26573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611e4a9190612c95565b5b15611e9757600760008073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050611f17565b600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b92915050565b600660009054906101000a900460ff1681565b600033600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166385acb0cc6040518163ffffffff1660e01b815260040160206040518083038186803b158015611f9b57600080fd5b505afa158015611faf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611fd39190612db7565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b815260040161200b919061300e565b60206040518083038186803b15801561202357600080fd5b505afa158015612037573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061205b9190612c95565b61209a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161209190613156565b60405180910390fd5b6000600581905550600191505090565b60006120b933338686866121b2565b90509392505050565b60008060019054906101000a900460ff16156121395760018260ff161480156120f157506120ef306128af565b155b612130576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161212790613136565b60405180910390fd5b600090506121ad565b8160ff1660008054906101000a900460ff1660ff161061218e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161218590613136565b60405180910390fd5b816000806101000a81548160ff021916908360ff160217905550600190505b919050565b6000828060055410156040518060400160405280601c81526020017f496e737566696369656e74207472616e7366657220637265646974730000000081525090612232576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161222991906130d4565b60405180910390fd5b5085600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371907f176040518163ffffffff1660e01b815260040160206040518083038186803b15801561229c57600080fd5b505afa1580156122b0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122d49190612d65565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b815260040161230c919061300e565b60206040518083038186803b15801561232457600080fd5b505afa158015612338573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061235c9190612c95565b806123935750600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b6040518060400160405280601981526020017f4d697373696e672073656e646572206d656d62657273686970000000000000008152509061240a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161240191906130d4565b60405180910390fd5b5085600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371907f176040518163ffffffff1660e01b815260040160206040518083038186803b15801561247457600080fd5b505afa158015612488573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124ac9190612d65565b73ffffffffffffffffffffffffffffffffffffffff1663a230c524826040518263ffffffff1660e01b81526004016124e4919061300e565b60206040518083038186803b1580156124fc57600080fd5b505afa158015612510573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125349190612c95565b6040518060400160405280601c81526020017f4d697373696e6720726563697069656e74206d656d6265727368697000000000815250906125ab576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016125a291906130d4565b60405180910390fd5b5085600760008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101561262e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161262590613176565b60405180910390fd5b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166398daac836040518163ffffffff1660e01b815260040160206040518083038186803b15801561269657600080fd5b505afa1580156126aa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906126ce9190612d8e565b73ffffffffffffffffffffffffffffffffffffffff1663ee6710838a8a8a8a8a6040518663ffffffff1660e01b815260040161270e959493929190613029565b600060405180830381600087803b15801561272857600080fd5b505af115801561273c573d6000803e3d6000fd5b50505050600073ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff161461278e5785600560008282546127869190613304565b925050819055505b85600760008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546127dd9190613304565b9250508190555085600760008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461283391906132ae565b925050819055508673ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8860405161289791906131d6565b60405180910390a36001935050505095945050505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b8280546128de9061344d565b90600052602060002090601f0160209004810192826129005760008555612947565b82601f1061291957805160ff1916838001178555612947565b82800160010185558215612947579182015b8281111561294657825182559160200191906001019061292b565b5b5090506129549190612958565b5090565b5b80821115612971576000816000905550600101612959565b5090565b600061298861298384613261565b61323c565b9050828152602081018484840111156129a057600080fd5b6129ab84828561340b565b509392505050565b6000813590506129c2816136b9565b92915050565b6000813590506129d7816136d0565b92915050565b6000815190506129ec816136d0565b92915050565b600081359050612a01816136e7565b92915050565b600081519050612a16816136fe565b92915050565b600081519050612a2b81613715565b92915050565b600081519050612a408161372c565b92915050565b600082601f830112612a5757600080fd5b8135612a67848260208601612975565b91505092915050565b600081359050612a7f81613743565b92915050565b600081359050612a948161375a565b92915050565b600060208284031215612aac57600080fd5b6000612aba848285016129b3565b91505092915050565b60008060408385031215612ad657600080fd5b6000612ae4858286016129b3565b9250506020612af5858286016129b3565b9150509250929050565b600080600060608486031215612b1457600080fd5b6000612b22868287016129b3565b9350506020612b33868287016129b3565b9250506040612b4486828701612a70565b9150509250925092565b60008060008060808587031215612b6457600080fd5b6000612b72878288016129b3565b9450506020612b83878288016129b3565b9350506040612b9487828801612a70565b925050606085013567ffffffffffffffff811115612bb157600080fd5b612bbd87828801612a46565b91505092959194509250565b60008060408385031215612bdc57600080fd5b6000612bea858286016129b3565b9250506020612bfb85828601612a70565b9150509250929050565b600080600060608486031215612c1a57600080fd5b6000612c28868287016129b3565b9350506020612c3986828701612a70565b925050604084013567ffffffffffffffff811115612c5657600080fd5b612c6286828701612a46565b9150509250925092565b600060208284031215612c7e57600080fd5b6000612c8c848285016129c8565b91505092915050565b600060208284031215612ca757600080fd5b6000612cb5848285016129dd565b91505092915050565b600080600080600060a08688031215612cd657600080fd5b6000612ce4888289016129f2565b955050602086013567ffffffffffffffff811115612d0157600080fd5b612d0d88828901612a46565b945050604086013567ffffffffffffffff811115612d2a57600080fd5b612d3688828901612a46565b9350506060612d4788828901612a70565b9250506080612d58888289016129c8565b9150509295509295909350565b600060208284031215612d7757600080fd5b6000612d8584828501612a07565b91505092915050565b600060208284031215612da057600080fd5b6000612dae84828501612a1c565b91505092915050565b600060208284031215612dc957600080fd5b6000612dd784828501612a31565b91505092915050565b600060208284031215612df257600080fd5b6000612e0084828501612a70565b91505092915050565b60008060408385031215612e1c57600080fd5b6000612e2a85828601612a70565b925050602083013567ffffffffffffffff811115612e4757600080fd5b612e5385828601612a46565b9150509250929050565b600060208284031215612e6f57600080fd5b6000612e7d84828501612a85565b91505092915050565b612e8f81613338565b82525050565b612e9e8161334a565b82525050565b612ead816133d5565b82525050565b612ebc816133f9565b82525050565b6000612ecd82613292565b612ed7818561329d565b9350612ee781856020860161341a565b612ef08161353d565b840191505092915050565b6000612f0860158361329d565b9150612f138261354e565b602082019050919050565b6000612f2b60188361329d565b9150612f3682613577565b602082019050919050565b6000612f4e602e8361329d565b9150612f59826135a0565b604082019050919050565b6000612f7160168361329d565b9150612f7c826135ef565b602082019050919050565b6000612f9460118361329d565b9150612f9f82613618565b602082019050919050565b6000612fb760218361329d565b9150612fc282613641565b604082019050919050565b6000612fda60148361329d565b9150612fe582613690565b602082019050919050565b612ff9816133be565b82525050565b613008816133c8565b82525050565b60006020820190506130236000830184612e86565b92915050565b600060a08201905061303e6000830188612e86565b61304b6020830187612e86565b6130586040830186612e86565b6130656060830185612ff0565b81810360808301526130778184612ec2565b90509695505050505050565b60006020820190506130986000830184612e95565b92915050565b60006020820190506130b36000830184612ea4565b92915050565b60006020820190506130ce6000830184612eb3565b92915050565b600060208201905081810360008301526130ee8184612ec2565b905092915050565b6000602082019050818103600083015261310f81612efb565b9050919050565b6000602082019050818103600083015261312f81612f1e565b9050919050565b6000602082019050818103600083015261314f81612f41565b9050919050565b6000602082019050818103600083015261316f81612f64565b9050919050565b6000602082019050818103600083015261318f81612f87565b9050919050565b600060208201905081810360008301526131af81612faa565b9050919050565b600060208201905081810360008301526131cf81612fcd565b9050919050565b60006020820190506131eb6000830184612ff0565b92915050565b60006040820190506132066000830185612ff0565b81810360208301526132188184612ec2565b90509392505050565b60006020820190506132366000830184612fff565b92915050565b6000613246613257565b9050613252828261347f565b919050565b6000604051905090565b600067ffffffffffffffff82111561327c5761327b61350e565b5b6132858261353d565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b60006132b9826133be565b91506132c4836133be565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156132f9576132f86134b0565b5b828201905092915050565b600061330f826133be565b915061331a836133be565b92508282101561332d5761332c6134b0565b5b828203905092915050565b60006133438261339e565b9050919050565b60008115159050919050565b600061336182613338565b9050919050565b600061337382613338565b9050919050565b600061338582613338565b9050919050565b600061339782613338565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60006133e0826133e7565b9050919050565b60006133f28261339e565b9050919050565b6000613404826133c8565b9050919050565b82818337600083830152505050565b60005b8381101561343857808201518184015260208101905061341d565b83811115613447576000848401525b50505050565b6000600282049050600182168061346557607f821691505b60208210811415613479576134786134df565b5b50919050565b6134888261353d565b810181811067ffffffffffffffff821117156134a7576134a661350e565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f496e737566696369656e7420616c6c6f77616e63650000000000000000000000600082015250565b7f556e6b6e6f776e207265737472696374696f6e20636f64650000000000000000600082015250565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f4d697373696e6720535043206d656d6265727368697000000000000000000000600082015250565b7f496e737566696369656e742066756e6473000000000000000000000000000000600082015250565b7f4d696e74696e67206e6f7420706f737369626c6520617420746869732074696d60008201527f6500000000000000000000000000000000000000000000000000000000000000602082015250565b7f4d697373696e6720676f7665726e6f7273686970000000000000000000000000600082015250565b6136c281613338565b81146136cd57600080fd5b50565b6136d98161334a565b81146136e457600080fd5b50565b6136f081613356565b81146136fb57600080fd5b50565b61370781613368565b811461371257600080fd5b50565b61371e8161337a565b811461372957600080fd5b50565b6137358161338c565b811461374057600080fd5b50565b61374c816133be565b811461375757600080fd5b50565b613763816133c8565b811461376e57600080fd5b5056fea2646970667358221220b9ece6fb3b566aaeee20d033eeec908668f0deaf27414c5ec030c48ec6a6e8c664736f6c63430008040033";

type FastTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FastTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FastToken__factory extends ContractFactory {
  constructor(...args: FastTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<FastToken> {
    return super.deploy(overrides || {}) as Promise<FastToken>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): FastToken {
    return super.attach(address) as FastToken;
  }
  override connect(signer: Signer): FastToken__factory {
    return super.connect(signer) as FastToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FastTokenInterface {
    return new utils.Interface(_abi) as FastTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FastToken {
    return new Contract(address, _abi, signerOrProvider) as FastToken;
  }
}
