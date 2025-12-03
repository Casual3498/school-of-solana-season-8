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
      "docs": [
        "Initialize a candidate account with a unique name.",
        "Seeds: [\"candidate\", name.as_bytes()]",
        "Fails if PDA already exists."
      ],
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
      "docs": [
        "Initialize a voter account for a specific authority.",
        "Seeds: [\"voter\", authority.key().as_ref()]",
        "Marks voted = false initially."
      ],
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
          "docs": [
            "The authority who will control this voter account"
          ],
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
      "docs": [
        "Cast votes for two distinct candidates.",
        "Requires signer authority match, prevents duplicate candidates and double voting."
      ],
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
                "account": "candidateAccount"
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
                "account": "candidateAccount"
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
      "name": "candidateAccount",
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
      "name": "voterAccount",
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
      "name": "candidateInitialized",
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
      "name": "voteCast",
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
      "name": "alreadyVoted",
      "msg": "This voter has already cast their votes."
    },
    {
      "code": 6001,
      "name": "duplicateCandidates",
      "msg": "Cannot vote for the same candidate twice."
    },
    {
      "code": 6002,
      "name": "invalidCandidate",
      "msg": "The provided candidate key is invalid."
    },
    {
      "code": 6003,
      "name": "unauthorizedAccess",
      "msg": "Unauthorized access: signer does not match voter authority."
    },
    {
      "code": 6004,
      "name": "accountAlreadyInitialized",
      "msg": "Account has already been initialized."
    },
    {
      "code": 6005,
      "name": "voteOverflow",
      "msg": "Vote count overflow detected."
    }
  ],
  "types": [
    {
      "name": "candidateAccount",
      "docs": [
        "Candidate account storing candidate information and vote count"
      ],
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
      "name": "candidateInitialized",
      "docs": [
        "Event emitted when a candidate is initialized"
      ],
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
      "name": "voteCast",
      "docs": [
        "Event emitted when a vote is cast"
      ],
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
      "name": "voterAccount",
      "docs": [
        "Voter account tracking voter's authority and voting status"
      ],
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
