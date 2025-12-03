/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/vote_d_21.json`.
 */
export type VoteD21 = {
  "address": "7qsdAz3ta9gg3eikuzQuJMj928zFnPUB8C4rb42pr6RN",
  "metadata": {
    "name": "voteD21",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initializeCandidate",
      "discriminator": [
        210,
        107,
        118,
        204,
        255,
        97,
        112,
        26
      ],
      "accounts": [
        {
          "name": "candidate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  110,
                  100,
                  105,
                  100,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeVoter",
      "discriminator": [
        105,
        39,
        201,
        10,
        15,
        118,
        10,
        107
      ],
      "accounts": [
        {
          "name": "voter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "vote",
      "discriminator": [
        227,
        110,
        155,
        23,
        136,
        126,
        172,
        25
      ],
      "accounts": [
        {
          "name": "voter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "candidate1",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  110,
                  100,
                  105,
                  100,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "candidate1.name",
                "account": "CandidateAccount"
              }
            ]
          }
        },
        {
          "name": "candidate2",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  110,
                  100,
                  105,
                  100,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "candidate2.name",
                "account": "CandidateAccount"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "candidateKeys",
          "type": {
            "array": [
              "pubkey",
              2
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "CandidateAccount",
      "discriminator": [
        69,
        203,
        73,
        43,
        203,
        170,
        96,
        121
      ]
    },
    {
      "name": "VoterAccount",
      "discriminator": [
        24,
        202,
        161,
        124,
        196,
        184,
        105,
        236
      ]
    }
  ],
  "events": [
    {
      "name": "CandidateInitialized",
      "discriminator": [
        91,
        172,
        118,
        233,
        64,
        64,
        124,
        40
      ]
    },
    {
      "name": "VoteCast",
      "discriminator": [
        39,
        53,
        195,
        104,
        188,
        17,
        225,
        213
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AlreadyVoted",
      "msg": "This voter has already cast their votes."
    },
    {
      "code": 6001,
      "name": "DuplicateCandidates",
      "msg": "Cannot vote for the same candidate twice."
    },
    {
      "code": 6002,
      "name": "InvalidCandidate",
      "msg": "The provided candidate key is invalid."
    },
    {
      "code": 6003,
      "name": "UnauthorizedAccess",
      "msg": "Unauthorized access: signer does not match voter authority."
    },
    {
      "code": 6004,
      "name": "AccountAlreadyInitialized",
      "msg": "Account has already been initialized."
    },
    {
      "code": 6005,
      "name": "VoteOverflow",
      "msg": "Vote count overflow detected."
    }
  ],
  "types": [
    {
      "name": "CandidateAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "votes",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CandidateInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "pubkey",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "VoteCast",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "candidates",
            "type": {
              "array": [
                "pubkey",
                2
              ]
            }
          }
        ]
      }
    },
    {
      "name": "VoterAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "voted",
            "type": "bool"
          },
          {
            "name": "votes",
            "type": {
              "array": [
                "pubkey",
                2
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};

export const IDL: VoteD21 = {
  "address": "7qsdAz3ta9gg3eikuzQuJMj928zFnPUB8C4rb42pr6RN",
  "metadata": {
    "name": "voteD21",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initializeCandidate",
      "discriminator": [
        210,
        107,
        118,
        204,
        255,
        97,
        112,
        26
      ],
      "accounts": [
        {
          "name": "candidate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  110,
                  100,
                  105,
                  100,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeVoter",
      "discriminator": [
        105,
        39,
        201,
        10,
        15,
        118,
        10,
        107
      ],
      "accounts": [
        {
          "name": "voter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "vote",
      "discriminator": [
        227,
        110,
        155,
        23,
        136,
        126,
        172,
        25
      ],
      "accounts": [
        {
          "name": "voter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "candidate1",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  110,
                  100,
                  105,
                  100,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "candidate1.name",
                "account": "CandidateAccount"
              }
            ]
          }
        },
        {
          "name": "candidate2",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  110,
                  100,
                  105,
                  100,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "candidate2.name",
                "account": "CandidateAccount"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "candidateKeys",
          "type": {
            "array": [
              "pubkey",
              2
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "CandidateAccount",
      "discriminator": [
        69,
        203,
        73,
        43,
        203,
        170,
        96,
        121
      ]
    },
    {
      "name": "VoterAccount",
      "discriminator": [
        24,
        202,
        161,
        124,
        196,
        184,
        105,
        236
      ]
    }
  ],
  "events": [
    {
      "name": "CandidateInitialized",
      "discriminator": [
        91,
        172,
        118,
        233,
        64,
        64,
        124,
        40
      ]
    },
    {
      "name": "VoteCast",
      "discriminator": [
        39,
        53,
        195,
        104,
        188,
        17,
        225,
        213
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AlreadyVoted",
      "msg": "This voter has already cast their votes."
    },
    {
      "code": 6001,
      "name": "DuplicateCandidates",
      "msg": "Cannot vote for the same candidate twice."
    },
    {
      "code": 6002,
      "name": "InvalidCandidate",
      "msg": "The provided candidate key is invalid."
    },
    {
      "code": 6003,
      "name": "UnauthorizedAccess",
      "msg": "Unauthorized access: signer does not match voter authority."
    },
    {
      "code": 6004,
      "name": "AccountAlreadyInitialized",
      "msg": "Account has already been initialized."
    },
    {
      "code": 6005,
      "name": "VoteOverflow",
      "msg": "Vote count overflow detected."
    }
  ],
  "types": [
    {
      "name": "CandidateAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "votes",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CandidateInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "pubkey",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "VoteCast",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "candidates",
            "type": {
              "array": [
                "pubkey",
                2
              ]
            }
          }
        ]
      }
    },
    {
      "name": "VoterAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "voted",
            "type": "bool"
          },
          {
            "name": "votes",
            "type": {
              "array": [
                "pubkey",
                2
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
