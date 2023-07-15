export type Tachyon = {
  "version": "0.3.0",
  "name": "tachyon",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "funcLoad",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u32"
        },
        {
          "name": "xIn",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "yIn",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    },
    {
      "name": "funcEval",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "xRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "interpolation",
          "type": {
            "defined": "Interpolation"
          }
        },
        {
          "name": "saturating",
          "type": "bool"
        }
      ],
      "returns": {
        "array": [
          "u8",
          16
        ]
      }
    },
    {
      "name": "initExp",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "domainStartRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "domainEndRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    },
    {
      "name": "initLn",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "domainStartRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "domainEndRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    },
    {
      "name": "initLog10",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "domainStartRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "domainEndRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    },
    {
      "name": "initSin",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "domainStartRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "domainEndRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    },
    {
      "name": "initCos",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "domainStartRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "domainEndRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "functionData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "u32"
          },
          {
            "name": "domainStart",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "domainEnd",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "interval",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "values",
            "type": {
              "array": [
                {
                  "array": [
                    "u8",
                    16
                  ]
                },
                100000
              ]
            }
          },
          {
            "name": "valueCodes",
            "type": {
              "array": [
                "u8",
                100000
              ]
            }
          },
          {
            "name": "numValues",
            "type": "u32"
          },
          {
            "name": "numValuesLoaded",
            "type": "u32"
          },
          {
            "name": "functionType",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "functions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "exp",
            "type": "publicKey"
          },
          {
            "name": "ln",
            "type": "publicKey"
          },
          {
            "name": "log10",
            "type": "publicKey"
          },
          {
            "name": "sin",
            "type": "publicKey"
          },
          {
            "name": "cos",
            "type": "publicKey"
          },
          {
            "name": "padding0",
            "type": "publicKey"
          },
          {
            "name": "padding1",
            "type": "publicKey"
          },
          {
            "name": "padding2",
            "type": "publicKey"
          },
          {
            "name": "padding3",
            "type": "publicKey"
          },
          {
            "name": "padding4",
            "type": "publicKey"
          },
          {
            "name": "padding5",
            "type": "publicKey"
          },
          {
            "name": "padding6",
            "type": "publicKey"
          },
          {
            "name": "padding7",
            "type": "publicKey"
          },
          {
            "name": "padding8",
            "type": "publicKey"
          },
          {
            "name": "padding9",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "FunctionType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Exp"
          },
          {
            "name": "Ln"
          },
          {
            "name": "Log10"
          },
          {
            "name": "Sin"
          },
          {
            "name": "Cos"
          }
        ]
      }
    },
    {
      "name": "ValueCode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Empty"
          },
          {
            "name": "Valid"
          },
          {
            "name": "Truncated"
          }
        ]
      }
    },
    {
      "name": "Interpolation",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Linear"
          },
          {
            "name": "Quadratic"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ProgramAlreadyInitialized",
      "msg": "The program has already been initialized"
    },
    {
      "code": 6001,
      "name": "AccountAlreadyInitialized",
      "msg": "This account has already been initialized"
    },
    {
      "code": 6002,
      "name": "FunctionDoesNotTakeAdditionalParams",
      "msg": "This function does not take any additional parameters"
    },
    {
      "code": 6003,
      "name": "FunctionRequiresAdditionalParams",
      "msg": "This function requires additional parameters"
    },
    {
      "code": 6004,
      "name": "OutOfDomainBounds",
      "msg": "The input provided is out of bounds of the available domain"
    },
    {
      "code": 6005,
      "name": "MissingDataAccount",
      "msg": "The accounts for this function call were not loaded"
    },
    {
      "code": 6006,
      "name": "IncompleteDataLoading",
      "msg": "Not all of the data for this function account has been loaded"
    },
    {
      "code": 6007,
      "name": "EmptyData",
      "msg": "Data at the requested index has not been populated"
    },
    {
      "code": 6008,
      "name": "MissingImplementation",
      "msg": "Missing function implementation"
    },
    {
      "code": 6009,
      "name": "InvalidIndex",
      "msg": "Invalid index for X value"
    },
    {
      "code": 6010,
      "name": "InvalidValue",
      "msg": "Invalid Y value for X value"
    },
    {
      "code": 6011,
      "name": "DataAtIndexAlreadyLoaded",
      "msg": "The data at this index has already been loaded"
    }
  ]
};

export const IDL: Tachyon = {
  "version": "0.3.0",
  "name": "tachyon",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "funcLoad",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u32"
        },
        {
          "name": "xIn",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "yIn",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    },
    {
      "name": "funcEval",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "xRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "interpolation",
          "type": {
            "defined": "Interpolation"
          }
        },
        {
          "name": "saturating",
          "type": "bool"
        }
      ],
      "returns": {
        "array": [
          "u8",
          16
        ]
      }
    },
    {
      "name": "initExp",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "domainStartRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "domainEndRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    },
    {
      "name": "initLn",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "domainStartRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "domainEndRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    },
    {
      "name": "initLog10",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "domainStartRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "domainEndRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    },
    {
      "name": "initSin",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "domainStartRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "domainEndRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    },
    {
      "name": "initCos",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "functions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "f",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "domainStartRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "domainEndRaw",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "functionData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "u32"
          },
          {
            "name": "domainStart",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "domainEnd",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "interval",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "values",
            "type": {
              "array": [
                {
                  "array": [
                    "u8",
                    16
                  ]
                },
                100000
              ]
            }
          },
          {
            "name": "valueCodes",
            "type": {
              "array": [
                "u8",
                100000
              ]
            }
          },
          {
            "name": "numValues",
            "type": "u32"
          },
          {
            "name": "numValuesLoaded",
            "type": "u32"
          },
          {
            "name": "functionType",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "functions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "exp",
            "type": "publicKey"
          },
          {
            "name": "ln",
            "type": "publicKey"
          },
          {
            "name": "log10",
            "type": "publicKey"
          },
          {
            "name": "sin",
            "type": "publicKey"
          },
          {
            "name": "cos",
            "type": "publicKey"
          },
          {
            "name": "padding0",
            "type": "publicKey"
          },
          {
            "name": "padding1",
            "type": "publicKey"
          },
          {
            "name": "padding2",
            "type": "publicKey"
          },
          {
            "name": "padding3",
            "type": "publicKey"
          },
          {
            "name": "padding4",
            "type": "publicKey"
          },
          {
            "name": "padding5",
            "type": "publicKey"
          },
          {
            "name": "padding6",
            "type": "publicKey"
          },
          {
            "name": "padding7",
            "type": "publicKey"
          },
          {
            "name": "padding8",
            "type": "publicKey"
          },
          {
            "name": "padding9",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "FunctionType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Exp"
          },
          {
            "name": "Ln"
          },
          {
            "name": "Log10"
          },
          {
            "name": "Sin"
          },
          {
            "name": "Cos"
          }
        ]
      }
    },
    {
      "name": "ValueCode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Empty"
          },
          {
            "name": "Valid"
          },
          {
            "name": "Truncated"
          }
        ]
      }
    },
    {
      "name": "Interpolation",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Linear"
          },
          {
            "name": "Quadratic"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ProgramAlreadyInitialized",
      "msg": "The program has already been initialized"
    },
    {
      "code": 6001,
      "name": "AccountAlreadyInitialized",
      "msg": "This account has already been initialized"
    },
    {
      "code": 6002,
      "name": "FunctionDoesNotTakeAdditionalParams",
      "msg": "This function does not take any additional parameters"
    },
    {
      "code": 6003,
      "name": "FunctionRequiresAdditionalParams",
      "msg": "This function requires additional parameters"
    },
    {
      "code": 6004,
      "name": "OutOfDomainBounds",
      "msg": "The input provided is out of bounds of the available domain"
    },
    {
      "code": 6005,
      "name": "MissingDataAccount",
      "msg": "The accounts for this function call were not loaded"
    },
    {
      "code": 6006,
      "name": "IncompleteDataLoading",
      "msg": "Not all of the data for this function account has been loaded"
    },
    {
      "code": 6007,
      "name": "EmptyData",
      "msg": "Data at the requested index has not been populated"
    },
    {
      "code": 6008,
      "name": "MissingImplementation",
      "msg": "Missing function implementation"
    },
    {
      "code": 6009,
      "name": "InvalidIndex",
      "msg": "Invalid index for X value"
    },
    {
      "code": 6010,
      "name": "InvalidValue",
      "msg": "Invalid Y value for X value"
    },
    {
      "code": 6011,
      "name": "DataAtIndexAlreadyLoaded",
      "msg": "The data at this index has already been loaded"
    }
  ]
};
