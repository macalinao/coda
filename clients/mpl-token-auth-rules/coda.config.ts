import {
  accountValueNode,
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  setInstructionAccountDefaultValuesVisitor,
  setStructFieldDocsVisitor,
  stringTypeNode,
  updateDefinedTypesVisitor,
  updateInstructionsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-mpl-token-auth-rules",
  },

  visitors: [
    addPdasVisitor({
      mplTokenAuthRules: [
        {
          name: "ruleSet",
          docs: ["RuleSet PDA storing a named set of authorization rules"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "rule_set"),
            variablePdaSeedNode(
              "owner",
              publicKeyTypeNode(),
              "The owner (creator) of the rule set",
            ),
            variablePdaSeedNode(
              "name",
              stringTypeNode("utf8"),
              "The name of the rule set",
            ),
          ],
        },
        {
          name: "ruleSetBuffer",
          docs: ["Buffer PDA used to assemble large rule sets before applying"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "rule_set"),
            variablePdaSeedNode(
              "owner",
              publicKeyTypeNode(),
              "The owner (creator) of the rule set",
            ),
          ],
        },
      ],
    }),

    setInstructionAccountDefaultValuesVisitor(
      // The buffer PDA is fully derivable from the payer.
      ["createOrUpdate", "writeToBuffer"].map((instruction) => ({
        account: "bufferPda",
        instruction,
        defaultValue: pdaValueNode(pdaLinkNode("ruleSetBuffer"), [
          pdaSeedValueNode("owner", accountValueNode("payer")),
        ]),
      })),
    ),

    // -----------------------------------------------------------------------
    // Documentation. Token Auth Rules stores named "rule sets" that gate token
    // operations (used most notably by Token Metadata's programmable NFTs). The
    // IDL ships account-level docs but no docs for the instructions, their
    // arguments, or the shared types, so we inject them here.
    // -----------------------------------------------------------------------
    updateInstructionsVisitor({
      createOrUpdate: {
        docs: [
          "Creates or updates a RuleSet stored in a program-derived account.",
          "",
          "A RuleSet is a named, versioned collection of authorization rules",
          "owned by its creator. Each call appends a new revision to the PDA;",
          "existing revisions are preserved so previously-signed operations",
          "remain reproducible. Pass a serialized RuleSet built with the",
          "auth-rules Rust/JS SDK.",
        ],
        arguments: {
          createOrUpdateArgs: {
            docs: ["The (versioned) CBOR-serialized RuleSet to store."],
          },
        },
      },
      validate: {
        docs: [
          "Validates an operation against a stored RuleSet.",
          "",
          "Normally invoked via CPI by another program (e.g. Token Metadata)",
          "to decide whether a token operation is permitted. Returns an error",
          "if any rule for the operation fails. When `updateRuleState` is set,",
          "stateful rules such as Frequency are advanced and persisted to the",
          "rule-set state PDA.",
        ],
        arguments: {
          validateArgs: {
            docs: ["The operation to validate together with its rule payload."],
          },
        },
      },
      writeToBuffer: {
        docs: [
          "Appends serialized RuleSet bytes to a buffer PDA.",
          "",
          "RuleSets larger than a single transaction can hold are streamed in",
          "chunks to a buffer account, then applied in one `createOrUpdate`",
          "call that reads from the buffer.",
        ],
        arguments: {
          writeToBufferArgs: {
            docs: ["The chunk of serialized RuleSet data to append."],
          },
        },
      },
      puffRuleSet: {
        docs: [
          "Grows a RuleSet PDA by reallocating additional space.",
          "",
          'Used to pre-allocate ("puff up") the account to the size a large',
          "RuleSet will need before writing to it, since a single instruction",
          "can only grow an account by a limited amount.",
        ],
        arguments: {
          puffRuleSetArgs: {
            docs: ["Identifies the RuleSet to grow by name."],
          },
        },
      },
    }),

    updateDefinedTypesVisitor({
      createOrUpdateArgs: {
        docs: ["Versioned arguments for the `createOrUpdate` instruction."],
      },
      validateArgs: {
        docs: ["Versioned arguments for the `validate` instruction."],
      },
      writeToBufferArgs: {
        docs: ["Versioned arguments for the `writeToBuffer` instruction."],
      },
      puffRuleSetArgs: {
        docs: ["Versioned arguments for the `puffRuleSet` instruction."],
      },
      seedsVec: {
        docs: [
          "A list of seeds used to derive and match a program address in a rule.",
        ],
      },
      proofInfo: {
        docs: [
          "A Merkle proof used to validate membership against a rule's root hash.",
        ],
      },
      payload: {
        docs: [
          "The runtime values passed to `validate`, keyed by the field name a",
          "rule expects (e.g. the destination address, amount, or a Merkle proof).",
        ],
      },
      ruleSetHeader: {
        docs: [
          "On-chain header at the start of a RuleSet PDA, locating its revision map.",
        ],
      },
      ruleSetRevisionMapV1: {
        docs: ["Maps each RuleSet revision to its byte offset within the PDA."],
      },
      payloadType: {
        docs: ["A single typed value supplied in a `validate` payload."],
      },
      key: {
        docs: ["Discriminator identifying the type of an auth-rules account."],
      },
    }),

    setStructFieldDocsVisitor({
      createOrUpdateArgs: {
        serializedRuleSet: "The CBOR-serialized RuleSet payload to store.",
      },
      validateArgs: {
        operation:
          "The name of the operation being validated (e.g. `Transfer`).",
        payload: "The runtime values the operation's rules will evaluate.",
        updateRuleState:
          "Whether stateful rules (e.g. Frequency) should be advanced and persisted.",
        ruleSetRevision:
          "Optional revision to validate against; defaults to the latest.",
      },
      writeToBufferArgs: {
        serializedRuleSet: "The chunk of serialized RuleSet data to append.",
        overwrite:
          "Whether to overwrite the buffer from the start instead of appending.",
      },
      puffRuleSetArgs: {
        ruleSetName: "The name of the RuleSet to grow.",
      },
      seedsVec: {
        seeds: "The ordered seed byte-strings.",
      },
      proofInfo: {
        proof: "The sibling hashes forming the Merkle proof.",
      },
      payload: {
        map: "Field name to typed value expected by the operation's rules.",
      },
      ruleSetHeader: {
        key: "Account discriminator (always `RuleSet`).",
        revMapVersionLocation:
          "Byte offset of the revision map within the PDA.",
      },
      ruleSetRevisionMapV1: {
        ruleSetRevisions:
          "Byte offset of each revision, indexed by revision number.",
      },
    }),
  ],
});
