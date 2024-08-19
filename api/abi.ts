export const abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20[]",
        name: "_allowed_tokens",
        type: "address[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    "anonymous": false,
    inputs: [
      {
        "indexed": false,
        internalType: "uint256",
        name: "index",
        type: "uint256"
      },
      {
        "indexed": false,
        internalType: "contract IERC20",
        name: "_token",
        type: "address"
      },
      {
        "indexed": false,
        internalType: "uint256",
        name: "_claimAmount",
        type: "uint256"
      },
      {
        "indexed": false,
        internalType: "uint256",
        name: "_fid",
        type: "uint256"
      },
      {
        "indexed": false,
        internalType: "address",
        name: "_account",
        type: "address"
      }
    ],
    name: "Claim",
    type: "event"
  },
  {
    "anonymous": false,
    inputs: [
      {
        "indexed": false,
        internalType: "uint256",
        name: "index",
        type: "uint256"
      },
      {
        "indexed": false,
        internalType: "contract IERC20",
        name: "_token",
        type: "address"
      },
      {
        "indexed": false,
        internalType: "uint256",
        name: "_claimAmount",
        type: "uint256"
      },
      {
        "indexed": false,
        internalType: "uint256",
        name: "_fid",
        type: "uint256"
      },
      {
        "indexed": false,
        internalType: "address",
        name: "_account",
        type: "address"
      }
    ],
    name: "GetBack",
    type: "event"
  },
  {
    "anonymous": false,
    inputs: [
      {
        "indexed": false,
        internalType: "uint256",
        name: "index",
        type: "uint256"
      },
      {
        "indexed": false,
        internalType: "enum HelloPayRedPackageFactory.RedPackageType",
        name: "_redPackgeType",
        type: "uint8"
      },
      {
        "indexed": false,
        internalType: "contract IERC20",
        name: "_token",
        type: "address"
      },
      {
        "indexed": false,
        internalType: "uint256",
        name: "_totalAmount",
        type: "uint256"
      },
      {
        "indexed": false,
        internalType: "uint256",
        name: "_totalNumber",
        type: "uint256"
      },
      {
        "indexed": false,
        internalType: "uint256",
        name: "_fid",
        type: "uint256"
      },
      {
        "indexed": false,
        internalType: "address",
        name: "_account",
        type: "address"
      },
      {
        "indexed": false,
        internalType: "string",
        name: "_memo",
        type: "string"
      }
    ],
    name: "NewRedPackage",
    type: "event"
  },
  {
    "anonymous": false,
    inputs: [
      {
        "indexed": true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        "indexed": true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [],
    name: "MAX_NUMBER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "MIN_NUMBER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address"
      }
    ],
    name: "allowed_tokens",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_fid",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_targetIndex",
        type: "uint256"
      }
    ],
    name: "claimRedPackage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "expiration_time",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_targetIndex",
        type: "uint256"
      }
    ],
    name: "getBackExpiratedRedPackage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "globalIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "redPackages",
    outputs: [
      {
        internalType: "enum HelloPayRedPackageFactory.RedPackageType",
        name: "redPackageType",
        type: "uint8"
      },
      {
        internalType: "bool",
        name: "isNativeToken",
        type: "bool"
      },
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "remainAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "totalNumber",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "remainNumber",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "starttime",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "fid",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "enum HelloPayRedPackageFactory.RedPackageType",
        name: "_redPackgeType",
        type: "uint8"
      },
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_totalAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_totalNumber",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_fid",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_memo",
        type: "string"
      }
    ],
    name: "sendRedPackage",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IERC20[]",
        name: "_allowed_tokens",
        type: "address[]"
      },
      {
        internalType: "bool[]",
        name: "_status",
        type: "bool[]"
      }
    ],
    name: "setAllowedTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const