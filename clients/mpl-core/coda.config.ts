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
  updateAccountsVisitor,
  updateDefinedTypesVisitor,
  updateInstructionsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-mpl-core",
  },

  // mpl-core assets and collections are keypair-generated accounts rather than
  // PDAs, so the only PDA the program derives is the per-asset signing PDA used
  // by the `executeV1` instruction.
  visitors: [
    addPdasVisitor({
      mplCoreProgram: [
        {
          name: "assetSigner",
          docs: ["The signing PDA for an asset, used by executeV1"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "mpl-core-execute"),
            variablePdaSeedNode(
              "asset",
              publicKeyTypeNode(),
              "The address of the asset account",
            ),
          ],
        },
      ],
    }),

    setInstructionAccountDefaultValuesVisitor([
      {
        account: "assetSigner",
        instruction: "executeV1",
        defaultValue: pdaValueNode(pdaLinkNode("assetSigner"), [
          pdaSeedValueNode("asset", accountValueNode("asset")),
        ]),
      },
    ]),

    // -----------------------------------------------------------------------
    // Documentation. MPL Core is a next-gen single-account NFT standard: an
    // asset (or collection) is one keypair-generated Solana account holding
    // its owner/authority, name and URI, extended by a plugin system (internal
    // plugins stored inline, external plugin adapters for third-party data and
    // CPI hooks). The IDL ships docs for instruction accounts but not for
    // instructions, their arguments, or the ~120 shared types, so we inject
    // them here.
    // -----------------------------------------------------------------------
    updateInstructionsVisitor({
      createV1: {
        docs: [
          "Creates a new Core asset — a single Solana account holding an",
          "NFT's owner, update authority, name, URI and plugins, with no",
          "separate mint, token account or metadata account.",
          "",
          "The asset account is a freshly generated keypair (not a PDA). If",
          "`collection` is provided, the asset is minted into that",
          "collection and inherits its collection-level plugins.",
        ],
        arguments: {
          createV1Args: {
            docs: ["The asset's initial data state, name, URI and plugins."],
          },
        },
      },
      createCollectionV1: {
        docs: [
          "Creates a new Core collection — a single account that groups",
          "assets under a shared update authority and collection-level",
          "plugins (e.g. shared royalties).",
          "",
          "Like assets, collections are keypair-generated accounts rather",
          "than PDAs.",
        ],
        arguments: {
          createCollectionV1Args: {
            docs: ["The collection's name, URI and initial plugins."],
          },
        },
      },
      addPluginV1: {
        docs: [
          "Adds a new plugin to an asset.",
          "",
          "Fails if the asset already has a plugin of the same",
          "`PluginType`, or if the asset (or its collection) has an",
          "`AddBlocker` plugin active and the caller can't bypass it.",
        ],
        arguments: {
          addPluginV1Args: {
            docs: [
              "The plugin to add, and the authority to assign it if not",
              "the default.",
            ],
          },
        },
      },
      addCollectionPluginV1: {
        docs: [
          "Adds a new plugin to a collection. It applies to every asset in",
          "the collection unless an asset defines its own plugin of the",
          "same type.",
        ],
        arguments: {
          addCollectionPluginV1Args: {
            docs: [
              "The plugin to add, and the authority to assign it if not",
              "the default.",
            ],
          },
        },
      },
      removePluginV1: {
        docs: [
          "Removes a plugin from an asset by its `PluginType`, freeing the",
          "space it occupied in the asset's account.",
        ],
        arguments: {
          removePluginV1Args: {
            docs: ["The type of plugin to remove."],
          },
        },
      },
      removeCollectionPluginV1: {
        docs: ["Removes a plugin from a collection by its `PluginType`."],
        arguments: {
          removeCollectionPluginV1Args: {
            docs: ["The type of plugin to remove."],
          },
        },
      },
      updatePluginV1: {
        docs: [
          "Overwrites the data of an existing plugin on an asset.",
          "",
          "The plugin's `PluginType` (and thus its authority) is",
          "unchanged; only its configuration is replaced.",
        ],
        arguments: {
          updatePluginV1Args: {
            docs: [
              "The full replacement data for the plugin, identified by",
              "its variant.",
            ],
          },
        },
      },
      updateCollectionPluginV1: {
        docs: ["Overwrites the data of an existing plugin on a collection."],
        arguments: {
          updateCollectionPluginV1Args: {
            docs: [
              "The full replacement data for the plugin, identified by",
              "its variant.",
            ],
          },
        },
      },
      approvePluginAuthorityV1: {
        docs: [
          "Sets (or replaces) the authority allowed to manage a specific",
          "plugin on an asset — e.g. delegating a `FreezeDelegate` or",
          "`TransferDelegate` plugin to a marketplace program.",
        ],
        arguments: {
          approvePluginAuthorityV1Args: {
            docs: ["The plugin to update and its new authority."],
          },
        },
      },
      approveCollectionPluginAuthorityV1: {
        docs: [
          "Sets (or replaces) the authority allowed to manage a specific",
          "plugin on a collection.",
        ],
        arguments: {
          approveCollectionPluginAuthorityV1Args: {
            docs: ["The plugin to update and its new authority."],
          },
        },
      },
      revokePluginAuthorityV1: {
        docs: [
          "Resets a plugin on an asset back to its default authority,",
          "revoking any delegate previously approved with",
          "`ApprovePluginAuthorityV1`.",
        ],
        arguments: {
          revokePluginAuthorityV1Args: {
            docs: ["The type of plugin whose authority should be revoked."],
          },
        },
      },
      revokeCollectionPluginAuthorityV1: {
        docs: [
          "Resets a plugin on a collection back to its default authority.",
        ],
        arguments: {
          revokeCollectionPluginAuthorityV1Args: {
            docs: ["The type of plugin whose authority should be revoked."],
          },
        },
      },
      burnV1: {
        docs: [
          "Permanently destroys an asset and refunds its rent to `payer`.",
          "",
          "Requires the owner, or a delegate approved via the",
          "`BurnDelegate` / `PermanentBurnDelegate` plugin.",
        ],
        arguments: {
          burnV1Args: {
            docs: [
              "A compression proof, required only if the asset is",
              "currently compressed (`LedgerState`).",
            ],
          },
        },
      },
      burnCollectionV1: {
        docs: [
          "Permanently destroys an empty collection and refunds its rent",
          "to `payer`. Fails if any assets still belong to the collection.",
        ],
        arguments: {
          burnCollectionV1Args: {
            docs: [
              "A compression proof, required only if the collection is",
              "currently compressed.",
            ],
          },
        },
      },
      transferV1: {
        docs: [
          "Transfers ownership of an asset to `newOwner`.",
          "",
          "Callable by the current owner, or a delegate approved via the",
          "`TransferDelegate` / `PermanentTransferDelegate` plugin. Fails",
          "if the asset is frozen by an active `FreezeDelegate` or",
          "`PermanentFreezeDelegate` plugin.",
        ],
        arguments: {
          transferV1Args: {
            docs: [
              "A compression proof, required only if the asset is",
              "currently compressed.",
            ],
          },
        },
      },
      updateV1: {
        docs: [
          "Updates an asset's name, URI and/or update authority.",
          "",
          "Callable by the update authority or a delegate approved via",
          "the `UpdateDelegate` plugin, unless blocked by",
          "`ImmutableMetadata`.",
        ],
        arguments: {
          updateV1Args: {
            docs: ["The fields to change; omitted fields are left untouched."],
          },
        },
      },
      updateCollectionV1: {
        docs: ["Updates a collection's name and/or URI."],
        arguments: {
          updateCollectionV1Args: {
            docs: ["The fields to change; omitted fields are left untouched."],
          },
        },
      },
      compressV1: {
        docs: [
          "Compresses an asset from on-chain `AccountState` into the",
          "hashed `LedgerState` representation (`HashedAssetV1`),",
          "reclaiming most of the account's rent.",
          "",
          "Compression is not currently enabled by the on-chain program;",
          "calling this instruction returns an error.",
        ],
        arguments: {
          compressV1Args: {
            docs: ["Reserved for future use; currently carries no data."],
          },
        },
      },
      decompressV1: {
        docs: [
          "Restores a compressed (`LedgerState`) asset back to a full",
          "on-chain `AssetV1` account, verified against the supplied",
          "`CompressionProof`.",
          "",
          "Decompression is not currently enabled by the on-chain program;",
          "calling this instruction returns an error.",
        ],
        arguments: {
          decompressV1Args: {
            docs: [
              "The proof of the asset's pre-compression state, used to",
              "rebuild it.",
            ],
          },
        },
      },
      collect: {
        docs: [
          "Sweeps SOL protocol fees accumulated by the program (e.g. from",
          "`CreateV1`) out to two fixed recipient accounts.",
          "",
          "A permissionless maintenance instruction — no signer is",
          "required.",
        ],
      },
      createV2: {
        docs: [
          "Creates a new Core asset, like `CreateV1`, but also accepts",
          "external plugin adapters (Oracle, AppData, LifecycleHook, etc.)",
          "at creation time via `externalPluginAdapters`.",
        ],
        arguments: {
          createV2Args: {
            docs: [
              "The asset's initial data state, name, URI, plugins and",
              "external plugin adapters.",
            ],
          },
        },
      },
      createCollectionV2: {
        docs: [
          "Creates a new Core collection, like `CreateCollectionV1`, but",
          "also accepts external plugin adapters at creation time via",
          "`externalPluginAdapters`.",
        ],
        arguments: {
          createCollectionV2Args: {
            docs: [
              "The collection's name, URI, initial plugins and external",
              "plugin adapters.",
            ],
          },
        },
      },
      addExternalPluginAdapterV1: {
        docs: [
          "Adds a new external plugin adapter (Oracle, AppData,",
          "LifecycleHook, etc.) to an asset.",
        ],
        arguments: {
          addExternalPluginAdapterV1Args: {
            docs: ["The adapter variant to add and its initialization data."],
          },
        },
      },
      addCollectionExternalPluginAdapterV1: {
        docs: ["Adds a new external plugin adapter to a collection."],
        arguments: {
          addCollectionExternalPluginAdapterV1Args: {
            docs: ["The adapter variant to add and its initialization data."],
          },
        },
      },
      removeExternalPluginAdapterV1: {
        docs: [
          "Removes an external plugin adapter from an asset, identified",
          "by its key.",
        ],
        arguments: {
          removeExternalPluginAdapterV1Args: {
            docs: [
              "Identifies which adapter (and, for keyed variants, which",
              "address) to remove.",
            ],
          },
        },
      },
      removeCollectionExternalPluginAdapterV1: {
        docs: [
          "Removes an external plugin adapter from a collection,",
          "identified by its key.",
        ],
        arguments: {
          removeCollectionExternalPluginAdapterV1Args: {
            docs: ["Identifies which adapter to remove."],
          },
        },
      },
      updateExternalPluginAdapterV1: {
        docs: [
          "Updates the configuration of an existing external plugin",
          "adapter on an asset.",
        ],
        arguments: {
          updateExternalPluginAdapterV1Args: {
            docs: [
              "Identifies the adapter to update and the fields to change.",
            ],
          },
        },
      },
      updateCollectionExternalPluginAdapterV1: {
        docs: [
          "Updates the configuration of an existing external plugin",
          "adapter on a collection.",
        ],
        arguments: {
          updateCollectionExternalPluginAdapterV1Args: {
            docs: [
              "Identifies the adapter to update and the fields to change.",
            ],
          },
        },
      },
      writeExternalPluginAdapterDataV1: {
        docs: [
          "Writes (or clears) the raw bytes backing an `AppData`,",
          "`LinkedAppData` or `DataSection` external plugin adapter on an",
          "asset.",
          "",
          "Only the adapter's `dataAuthority` may call this. The payload",
          "can be supplied inline via `data`, or sourced from the optional",
          "`buffer` account for payloads too large for a single",
          "instruction.",
        ],
        arguments: {
          writeExternalPluginAdapterDataV1Args: {
            docs: [
              "The target adapter and the bytes to write, or `None` to clear it.",
            ],
          },
        },
      },
      writeCollectionExternalPluginAdapterDataV1: {
        docs: [
          "Writes (or clears) the raw bytes backing an `AppData`,",
          "`LinkedAppData` or `DataSection` external plugin adapter on a",
          "collection.",
        ],
        arguments: {
          writeCollectionExternalPluginAdapterDataV1Args: {
            docs: [
              "The target adapter and the bytes to write, or `None` to clear it.",
            ],
          },
        },
      },
      updateV2: {
        docs: [
          "Updates an asset's name, URI and/or update authority, like",
          "`UpdateV1`, and additionally allows moving the asset into a",
          "different collection (or out of its collection) via",
          "`newCollection`.",
        ],
        arguments: {
          updateV2Args: {
            docs: ["The fields to change; omitted fields are left untouched."],
          },
        },
      },
      executeV1: {
        docs: [
          "Invokes an arbitrary instruction on another program via CPI,",
          "signed by the asset's own program-derived `assetSigner`",
          "address.",
          "",
          "This lets an asset act as its own transaction signer (e.g. to",
          "control a wallet or vault it owns). Requires the owner or an",
          "authorized delegate, and increments the asset's sequence",
          "number. Not available for compressed assets.",
        ],
        arguments: {
          executeV1Args: {
            docs: [
              "The raw, serialized instruction data to invoke via the",
              "asset-signer PDA.",
            ],
          },
        },
      },
      updateCollectionInfoV1: {
        docs: [
          "Updates a collection's `numMinted` and `currentSize` counters.",
          "",
          "Invoked via CPI (signed by the `bubblegumSigner` PDA) by the",
          "Bubblegum program when compressed NFTs are minted into, or",
          "removed from, a Core collection, so the collection's on-chain",
          "size stays accurate without every compressed asset living in a",
          "Core account.",
        ],
        arguments: {
          updateCollectionInfoV1Args: {
            docs: [
              "Whether to record a mint or an add/remove, and by how much.",
            ],
          },
        },
      },
      addCollectionsToGroupV1: {
        docs: [
          "Adds one or more collections to a group, recording the",
          "membership as a `ChildGroup` relationship. The collections to",
          "add are passed as remaining accounts.",
        ],
        arguments: {
          addCollectionsToGroupV1Args: {
            docs: [
              "Reserved; the collections to add are passed as remaining",
              "accounts.",
            ],
          },
        },
      },
      removeCollectionsFromGroupV1: {
        docs: ["Removes one or more collections from a group."],
        arguments: {
          removeCollectionsFromGroupV1Args: {
            docs: [
              "The addresses of the collections to remove from the group.",
            ],
          },
        },
      },
      addAssetsToGroupV1: {
        docs: [
          "Adds one or more assets to a group, recording the membership as",
          "an `Asset` relationship. The assets to add are passed as",
          "remaining accounts.",
        ],
        arguments: {
          addAssetsToGroupV1Args: {
            docs: [
              "Reserved; the assets to add are passed as remaining accounts.",
            ],
          },
        },
      },
      removeAssetsFromGroupV1: {
        docs: ["Removes one or more assets from a group."],
        arguments: {
          removeAssetsFromGroupV1Args: {
            docs: ["The addresses of the assets to remove from the group."],
          },
        },
      },
      addGroupsToGroupV1: {
        docs: [
          "Nests one or more child groups under a parent group, forming a",
          "group hierarchy.",
        ],
        arguments: {
          addGroupsToGroupV1Args: {
            docs: ["The addresses of the child groups to add to the parent."],
          },
        },
      },
      removeGroupsFromGroupV1: {
        docs: ["Removes one or more child groups from a parent group."],
        arguments: {
          removeGroupsFromGroupV1Args: {
            docs: [
              "The addresses of the child groups to remove from the parent.",
            ],
          },
        },
      },
      createGroupV1: {
        docs: [
          "Creates a new group — a keypair-generated account used to",
          "organize assets, collections and other groups under a shared",
          "update authority, independent of (and orthogonal to) the",
          "collection hierarchy.",
        ],
        arguments: {
          createGroupV1Args: {
            docs: ["The group's name, URI and initial member relationships."],
          },
        },
      },
      closeGroupV1: {
        docs: [
          "Closes an empty group account and refunds its rent to `payer`.",
        ],
        arguments: {
          closeGroupV1Args: {
            docs: ["Reserved for future use; currently carries no data."],
          },
        },
      },
      updateGroupV1: {
        docs: ["Updates a group's name, URI and/or update authority."],
        arguments: {
          updateGroupV1Args: {
            docs: ["The fields to change; omitted fields are left untouched."],
          },
        },
      },
    }),

    updateAccountsVisitor({
      assetV1: {
        docs: [
          "An MPL Core asset: a single account holding an NFT's owner,",
          "update authority, name, URI and sequence number, with its",
          "plugins stored afterward in the same account.",
        ],
      },
      collectionV1: {
        docs: [
          "An MPL Core collection: a single account grouping assets under",
          "a shared update authority, with collection-level plugins",
          "stored afterward in the same account.",
        ],
      },
      groupV1: {
        docs: [
          "An MPL Core group: a single account organizing assets,",
          "collections and other groups under a shared update authority,",
          "independent of the collection hierarchy.",
        ],
      },
      hashedAssetV1: {
        docs: [
          "The compressed (`LedgerState`) representation of an asset:",
          "just a discriminator and a hash committing to its full data,",
          "restorable via `decompressV1`.",
        ],
      },
      pluginHeaderV1: {
        docs: [
          "Marker account data written after an asset/collection's core",
          "fields once it has at least one plugin, pointing to the",
          "`PluginRegistryV1` that follows.",
        ],
      },
      pluginRegistryV1: {
        docs: [
          "The index of every internal plugin and external plugin adapter",
          "attached to an asset or collection, stored after the",
          "`PluginHeaderV1`.",
        ],
      },
    }),

    updateDefinedTypesVisitor({
      // -- Instruction argument types ---------------------------------------
      addAssetsToGroupV1Args: {
        docs: [
          "Arguments for `addAssetsToGroupV1`; the assets to add are",
          "passed as remaining accounts.",
        ],
      },
      addCollectionExternalPluginAdapterV1Args: {
        docs: ["Arguments for `addCollectionExternalPluginAdapterV1`."],
      },
      addCollectionPluginV1Args: {
        docs: ["Arguments for `addCollectionPluginV1`."],
      },
      addCollectionsToGroupV1Args: {
        docs: [
          "Arguments for `addCollectionsToGroupV1`; the collections to",
          "add are passed as remaining accounts.",
        ],
      },
      addExternalPluginAdapterV1Args: {
        docs: ["Arguments for `addExternalPluginAdapterV1`."],
      },
      addGroupsToGroupV1Args: {
        docs: ["Arguments for `addGroupsToGroupV1`."],
      },
      addPluginV1Args: {
        docs: ["Arguments for `addPluginV1`."],
      },
      approveCollectionPluginAuthorityV1Args: {
        docs: ["Arguments for `approveCollectionPluginAuthorityV1`."],
      },
      approvePluginAuthorityV1Args: {
        docs: ["Arguments for `approvePluginAuthorityV1`."],
      },
      burnCollectionV1Args: {
        docs: ["Arguments for `burnCollectionV1`."],
      },
      burnV1Args: {
        docs: ["Arguments for `burnV1`."],
      },
      closeGroupV1Args: {
        docs: ["Arguments for `closeGroupV1`; currently carries no data."],
      },
      compressV1Args: {
        docs: ["Arguments for `compressV1`; currently carries no data."],
      },
      createCollectionV1Args: {
        docs: ["Arguments for `createCollectionV1`."],
      },
      createCollectionV2Args: {
        docs: ["Arguments for `createCollectionV2`."],
      },
      createGroupV1Args: {
        docs: ["Arguments for `createGroupV1`."],
      },
      createV1Args: {
        docs: ["Arguments for `createV1`."],
      },
      createV2Args: {
        docs: ["Arguments for `createV2`."],
      },
      decompressV1Args: {
        docs: ["Arguments for `decompressV1`."],
      },
      executeV1Args: {
        docs: ["Arguments for `executeV1`."],
      },
      removeAssetsFromGroupV1Args: {
        docs: ["Arguments for `removeAssetsFromGroupV1`."],
      },
      removeCollectionExternalPluginAdapterV1Args: {
        docs: ["Arguments for `removeCollectionExternalPluginAdapterV1`."],
      },
      removeCollectionPluginV1Args: {
        docs: ["Arguments for `removeCollectionPluginV1`."],
      },
      removeCollectionsFromGroupV1Args: {
        docs: ["Arguments for `removeCollectionsFromGroupV1`."],
      },
      removeExternalPluginAdapterV1Args: {
        docs: ["Arguments for `removeExternalPluginAdapterV1`."],
      },
      removeGroupsFromGroupV1Args: {
        docs: ["Arguments for `removeGroupsFromGroupV1`."],
      },
      removePluginV1Args: {
        docs: ["Arguments for `removePluginV1`."],
      },
      revokeCollectionPluginAuthorityV1Args: {
        docs: ["Arguments for `revokeCollectionPluginAuthorityV1`."],
      },
      revokePluginAuthorityV1Args: {
        docs: ["Arguments for `revokePluginAuthorityV1`."],
      },
      transferV1Args: {
        docs: ["Arguments for `transferV1`."],
      },
      updateCollectionExternalPluginAdapterV1Args: {
        docs: ["Arguments for `updateCollectionExternalPluginAdapterV1`."],
      },
      updateCollectionInfoV1Args: {
        docs: ["Arguments for `updateCollectionInfoV1`."],
      },
      updateCollectionPluginV1Args: {
        docs: ["Arguments for `updateCollectionPluginV1`."],
      },
      updateCollectionV1Args: {
        docs: ["Arguments for `updateCollectionV1`."],
      },
      updateExternalPluginAdapterV1Args: {
        docs: ["Arguments for `updateExternalPluginAdapterV1`."],
      },
      updateGroupV1Args: {
        docs: ["Arguments for `updateGroupV1`."],
      },
      updatePluginV1Args: {
        docs: ["Arguments for `updatePluginV1`."],
      },
      updateV1Args: {
        docs: ["Arguments for `updateV1`."],
      },
      updateV2Args: {
        docs: ["Arguments for `updateV2`."],
      },
      writeCollectionExternalPluginAdapterDataV1Args: {
        docs: ["Arguments for `writeCollectionExternalPluginAdapterDataV1`."],
      },
      writeExternalPluginAdapterDataV1Args: {
        docs: ["Arguments for `writeExternalPluginAdapterDataV1`."],
      },

      // -- Internal plugins ---------------------------------------------------
      addBlocker: {
        docs: [
          "Internal plugin that prevents any other plugin from being",
          "added to the asset or collection.",
        ],
      },
      attribute: {
        docs: ["A single key/value pair stored by the `Attributes` plugin."],
      },
      attributes: {
        docs: [
          "Internal plugin that stores an arbitrary list of on-chain",
          "key/value attributes.",
        ],
      },
      autograph: {
        docs: [
          "Internal plugin that collects a guestbook of signatures left",
          "by arbitrary addresses.",
        ],
      },
      autographSignature: {
        docs: ["A single signature entry recorded by the `Autograph` plugin."],
      },
      bubblegumV2: {
        docs: [
          "Internal plugin marking the asset as linked to / managed via",
          "the Bubblegum V2 compressed NFT program.",
        ],
      },
      burnDelegate: {
        docs: [
          "Internal plugin whose authority is allowed to burn the asset",
          "on the owner's behalf.",
        ],
      },
      creator: {
        docs: [
          "A single creator entry used by the `Royalties` plugin, with",
          "their address and royalty share.",
        ],
      },
      edition: {
        docs: [
          "Internal plugin that assigns an edition number to an asset",
          "printed from a `MasterEdition`.",
        ],
      },
      freezeDelegate: {
        docs: [
          "Internal plugin whose authority can freeze the asset, blocking",
          "transfers while frozen.",
        ],
      },
      freezeExecute: {
        docs: [
          "Internal plugin whose authority can freeze the asset's ability",
          "to be used with `executeV1`.",
        ],
      },
      groups: {
        docs: [
          "Internal plugin recording the groups an asset or collection belongs to.",
        ],
      },
      immutableMetadata: {
        docs: [
          "Internal plugin that permanently locks the asset's name and",
          "URI against further updates.",
        ],
      },
      masterEdition: {
        docs: [
          "Internal plugin marking a collection as a template that assets",
          "can be printed from as numbered `Edition`s.",
        ],
      },
      permanentBurnDelegate: {
        docs: [
          "Internal plugin, addable only at creation, whose authority",
          "permanently retains the right to burn the asset.",
        ],
      },
      permanentFreezeDelegate: {
        docs: [
          "Internal plugin, addable only at creation, whose authority",
          "permanently retains the right to freeze the asset.",
        ],
      },
      permanentFreezeExecute: {
        docs: [
          "Internal plugin, addable only at creation, whose authority",
          "permanently retains the right to freeze the asset's",
          "`executeV1` capability.",
        ],
      },
      permanentTransferDelegate: {
        docs: [
          "Internal plugin, addable only at creation, whose authority",
          "permanently retains the right to transfer the asset.",
        ],
      },
      plugin: {
        docs: [
          "A configured internal plugin and its current data, keyed by plugin type.",
        ],
      },
      pluginAuthorityPair: {
        docs: [
          "A plugin paired with the authority that should manage it,",
          "used when creating an asset/collection or adding a plugin.",
        ],
      },
      pluginType: {
        docs: [
          "The kind of internal plugin, without its configuration or data.",
        ],
      },
      royalties: {
        docs: [
          "Internal plugin enforcing creator royalty payments on secondary sales.",
        ],
      },
      ruleSet: {
        docs: [
          "Restricts which programs may transfer an asset with the",
          "`Royalties` plugin: `None`, a `ProgramAllowList`, or a",
          "`ProgramDenyList`.",
        ],
      },
      transferDelegate: {
        docs: [
          "Internal plugin whose authority can transfer the asset on the",
          "owner's behalf.",
        ],
      },
      updateDelegate: {
        docs: [
          "Internal plugin whose authority (and any `additionalDelegates`)",
          "can update the asset's metadata alongside the update",
          "authority.",
        ],
      },
      verifiedCreators: {
        docs: [
          "Internal plugin listing creators who have cryptographically",
          "verified their inclusion, similar to the legacy Token",
          "Metadata creators array.",
        ],
      },
      verifiedCreatorsSignature: {
        docs: [
          "A single creator entry recorded by the `VerifiedCreators` plugin.",
        ],
      },

      // -- External plugin adapters --------------------------------------------
      agentIdentity: {
        docs: [
          "External plugin adapter that attaches an off-chain agent",
          "identity descriptor to the asset.",
        ],
      },
      agentIdentityInitInfo: {
        docs: [
          "Initialization data for the `AgentIdentity` external plugin adapter.",
        ],
      },
      agentIdentityUpdateInfo: {
        docs: ["Update data for the `AgentIdentity` external plugin adapter."],
      },
      appData: {
        docs: [
          "External plugin adapter storing arbitrary application data,",
          "writable only by its `dataAuthority`.",
        ],
      },
      appDataInitInfo: {
        docs: [
          "Initialization data for the `AppData` external plugin adapter.",
        ],
      },
      appDataUpdateInfo: {
        docs: ["Update data for the `AppData` external plugin adapter."],
      },
      dataSection: {
        docs: [
          "Internal storage plugin holding the raw payload for a",
          "`LinkedAppData` or `LinkedLifecycleHook` adapter. Managed",
          "automatically; has no authority of its own.",
        ],
      },
      dataSectionInitInfo: {
        docs: [
          "Initialization data for the `DataSection` external plugin adapter.",
        ],
      },
      dataSectionUpdateInfo: {
        docs: [
          "Update data for the `DataSection` external plugin adapter;",
          "currently carries no data.",
        ],
      },
      externalCheckResult: {
        docs: [
          "A bitmask of the `ValidationResult` values an external plugin",
          "adapter may return for a checked lifecycle event.",
        ],
      },
      externalPluginAdapter: {
        docs: [
          "A configured external plugin adapter and its current data,",
          "keyed by adapter type: `LifecycleHook`, `Oracle`, `AppData`,",
          "`LinkedLifecycleHook`, `LinkedAppData`, `DataSection` or",
          "`AgentIdentity`.",
        ],
      },
      externalPluginAdapterInitInfo: {
        docs: [
          "Initialization data for adding a new external plugin adapter,",
          "keyed by adapter type.",
        ],
      },
      externalPluginAdapterKey: {
        docs: [
          "Identifies a specific external plugin adapter instance, e.g.",
          "an `Oracle` by its account address or `AppData` by its data",
          "authority.",
        ],
      },
      externalPluginAdapterSchema: {
        docs: [
          "The serialization format used for an external plugin",
          "adapter's stored data: `Binary`, `Json` or `MsgPack`.",
        ],
      },
      externalPluginAdapterType: {
        docs: [
          "The kind of external plugin adapter, without its configuration or data.",
        ],
      },
      externalPluginAdapterUpdateInfo: {
        docs: [
          "Update data for an existing external plugin adapter, keyed by",
          "adapter type.",
        ],
      },
      externalRegistryRecord: {
        docs: [
          "An entry in `PluginRegistryV1` describing one external plugin",
          "adapter and where its config/data live in the account.",
        ],
      },
      externalValidationResult: {
        docs: [
          "The outcome of an external plugin adapter's check for a",
          "lifecycle event: `Approved`, `Rejected` or `Pass` (abstain).",
        ],
      },
      extraAccount: {
        docs: [
          "An additional account to forward to a `LifecycleHook`'s",
          "hooked program: either a preconfigured well-known account",
          "(asset, collection, owner, recipient, program) or a custom",
          "PDA derived from `seeds`.",
        ],
      },
      hookableLifecycleEvent: {
        docs: [
          "A lifecycle event that can trigger an external plugin",
          "adapter's check: `Create`, `Transfer`, `Burn`, `Update` or",
          "`Execute`.",
        ],
      },
      lifecycleHook: {
        docs: [
          "External plugin adapter that invokes a program via CPI at",
          "configured lifecycle events.",
        ],
      },
      lifecycleHookInitInfo: {
        docs: [
          "Initialization data for the `LifecycleHook` external plugin adapter.",
        ],
      },
      lifecycleHookUpdateInfo: {
        docs: ["Update data for the `LifecycleHook` external plugin adapter."],
      },
      linkedAppData: {
        docs: [
          "External plugin adapter like `AppData`, but for collections:",
          "its data is shared by every asset in the collection via a",
          "`DataSection`.",
        ],
      },
      linkedAppDataInitInfo: {
        docs: [
          "Initialization data for the `LinkedAppData` external plugin adapter.",
        ],
      },
      linkedAppDataUpdateInfo: {
        docs: ["Update data for the `LinkedAppData` external plugin adapter."],
      },
      linkedDataKey: {
        docs: [
          "Identifies which linked adapter (`LinkedLifecycleHook` or",
          "`LinkedAppData`) a `DataSection` belongs to.",
        ],
      },
      linkedLifecycleHook: {
        docs: [
          "External plugin adapter like `LifecycleHook`, but for",
          "collections, sharing its data via a `DataSection`.",
        ],
      },
      linkedLifecycleHookInitInfo: {
        docs: [
          "Initialization data for the `LinkedLifecycleHook` external",
          "plugin adapter.",
        ],
      },
      linkedLifecycleHookUpdateInfo: {
        docs: [
          "Update data for the `LinkedLifecycleHook` external plugin adapter.",
        ],
      },
      oracle: {
        docs: [
          "External plugin adapter that reads a `ValidationResult` from",
          "an external account to gate lifecycle events.",
        ],
      },
      oracleInitInfo: {
        docs: ["Initialization data for the `Oracle` external plugin adapter."],
      },
      oracleUpdateInfo: {
        docs: ["Update data for the `Oracle` external plugin adapter."],
      },
      oracleValidation: {
        docs: [
          "The result stored in an oracle account: `Uninitialized`, or",
          "`V1` with a separate `ExternalValidationResult` per lifecycle",
          "event.",
        ],
      },

      // -- Compression ----------------------------------------------------------
      compressionProof: {
        docs: [
          "The asset's core data and plugins as they existed at the time",
          "it was compressed, used to verify and rebuild it on",
          "`decompressV1`.",
        ],
      },
      hashablePluginSchema: {
        docs: [
          "A plugin's index, authority and data as included in a",
          "`HashedAssetSchema` hash.",
        ],
      },
      hashedAssetSchema: {
        docs: [
          "The schema hashed to produce a `HashedAssetV1`'s commitment:",
          "the asset's core data hash plus a hash per plugin.",
        ],
      },

      // -- Registries -------------------------------------------------------------
      registryRecord: {
        docs: [
          "An entry in `PluginRegistryV1` describing one internal plugin",
          "and where its data lives in the account.",
        ],
      },

      // -- Groups -----------------------------------------------------------------
      relationshipEntry: {
        docs: [
          "A single membership relationship (e.g. to a collection or",
          "group) recorded in a `CreateGroupV1` call.",
        ],
      },
      relationshipKind: {
        docs: [
          "The kind of relationship a `RelationshipEntry` records:",
          "membership in a `Collection`, a `ChildGroup`, a",
          "`ParentGroup`, or an `Asset`.",
        ],
      },
      updateType: {
        docs: [
          "Whether an `updateCollectionInfoV1` call records a `Mint`, or",
          "an `Add`/`Remove` adjustment to collection size.",
        ],
      },

      // -- Shared enums -------------------------------------------------------------
      authority: {
        docs: [
          "Identifies who manages a plugin or external plugin adapter:",
          "nobody (`None`), the asset/collection `Owner`, its",
          "`UpdateAuthority`, or a specific `Address`.",
        ],
      },
      dataState: {
        docs: [
          "Whether an asset/collection's data lives fully on-chain",
          "(`AccountState`) or in the compressed, off-chain-hashed form",
          "(`LedgerState`).",
        ],
      },
      key: {
        docs: [
          "Account discriminator identifying which kind of MPL Core",
          "account a given account is.",
        ],
      },
      seed: {
        docs: [
          "A single seed component used to derive a `CustomPda` account",
          "for a `LifecycleHook`'s extra accounts.",
        ],
      },
      updateAuthority: {
        docs: [
          "The update authority of an asset: unset (`None`), a specific",
          "`Address`, or inherited from a `Collection`.",
        ],
      },
      validationResult: {
        docs: [
          "The outcome of a plugin's check for a lifecycle event:",
          "`Approved`, `Rejected`, `Pass` (abstain), or `ForceApproved`.",
        ],
      },
      validationResultsOffset: {
        docs: [
          "Where within an oracle account to read its `OracleValidation`:",
          "no offset, past the 8-byte Anchor discriminator, or a",
          "`Custom` byte offset.",
        ],
      },
    }),

    setStructFieldDocsVisitor({
      // -- Accounts -----------------------------------------------------------
      assetV1: {
        key: "Account discriminator; always `Key.AssetV1`.",
        owner: "The current owner of the asset.",
        updateAuthority:
          "The authority allowed to update the asset's metadata and plugins.",
        name: "The asset's display name.",
        uri: "The URI pointing to the asset's off-chain JSON metadata.",
        seq: [
          "Sequence number incremented on certain mutations (e.g.",
          "`executeV1`); present once the asset has been touched by such",
          "an instruction, used to detect stale off-chain indexes.",
        ],
      },
      collectionV1: {
        key: "Account discriminator; always `Key.CollectionV1`.",
        updateAuthority:
          "The authority allowed to update the collection and manage its plugins.",
        name: "The collection's display name.",
        uri: "The URI pointing to the collection's off-chain JSON metadata.",
        numMinted:
          "The total number of assets ever minted into this collection.",
        currentSize:
          "The number of assets currently belonging to this collection.",
      },
      groupV1: {
        key: "Account discriminator; always `Key.GroupV1`.",
        updateAuthority:
          "The authority allowed to update the group and manage its membership.",
        name: "The group's display name.",
        uri: "The URI pointing to the group's off-chain JSON metadata.",
        collections:
          "The addresses of the collections that are direct members of this group.",
        groups: "The addresses of the child groups nested under this group.",
        parentGroups:
          "The addresses of the groups that this group is itself a member of.",
        assets:
          "The addresses of the assets that are direct members of this group.",
      },
      hashedAssetV1: {
        key: "Account discriminator; always `Key.HashedAssetV1`.",
        hash: [
          "The 32-byte hash committing to the asset's full data and",
          "plugin state while compressed.",
        ],
      },
      pluginHeaderV1: {
        key: "Account discriminator; always `Key.PluginHeaderV1`.",
        pluginRegistryOffset: [
          "The byte offset, within the asset/collection account, at",
          "which the `PluginRegistryV1` data begins.",
        ],
      },
      pluginRegistryV1: {
        key: "Account discriminator; always `Key.PluginRegistryV1`.",
        registry:
          "The internal plugins attached to the asset/collection, and where each one's data lives.",
        externalRegistry: [
          "The external plugin adapters attached to the asset/collection,",
          "and where each one's data lives.",
        ],
      },

      // -- Instruction argument structs ----------------------------------------
      createV1Args: {
        dataState: [
          "Whether the asset is created directly in `AccountState`",
          "(typical) or already-compressed `LedgerState`.",
        ],
        name: "The asset's display name.",
        uri: "The URI pointing to the asset's off-chain JSON metadata.",
        plugins:
          "Plugins to attach at creation, each paired with an optional authority override.",
      },
      createV2Args: {
        dataState: [
          "Whether the asset is created directly in `AccountState`",
          "(typical) or already-compressed `LedgerState`.",
        ],
        name: "The asset's display name.",
        uri: "The URI pointing to the asset's off-chain JSON metadata.",
        plugins:
          "Plugins to attach at creation, each paired with an optional authority override.",
        externalPluginAdapters:
          "External plugin adapters to attach at creation.",
      },
      createCollectionV1Args: {
        name: "The collection's display name.",
        uri: "The URI pointing to the collection's off-chain JSON metadata.",
        plugins:
          "Plugins to attach at creation, each paired with an optional authority override.",
      },
      createCollectionV2Args: {
        name: "The collection's display name.",
        uri: "The URI pointing to the collection's off-chain JSON metadata.",
        plugins:
          "Plugins to attach at creation, each paired with an optional authority override.",
        externalPluginAdapters:
          "External plugin adapters to attach at creation.",
      },
      createGroupV1Args: {
        name: "The group's display name.",
        uri: "The URI pointing to the group's off-chain JSON metadata.",
        relationships: [
          "Initial member relationships (assets, collections or child",
          "groups) to record on the group.",
        ],
      },
      addPluginV1Args: {
        plugin: "The plugin variant and its configuration to add.",
        initAuthority: [
          "The authority to manage the plugin; defaults to the plugin",
          "type's standard authority if omitted.",
        ],
      },
      addCollectionPluginV1Args: {
        plugin: "The plugin variant and its configuration to add.",
        initAuthority: [
          "The authority to manage the plugin; defaults to the plugin",
          "type's standard authority if omitted.",
        ],
      },
      removePluginV1Args: {
        pluginType: "The type of plugin to remove.",
      },
      removeCollectionPluginV1Args: {
        pluginType: "The type of plugin to remove.",
      },
      updatePluginV1Args: {
        plugin: "The plugin variant and its full replacement configuration.",
      },
      updateCollectionPluginV1Args: {
        plugin: "The plugin variant and its full replacement configuration.",
      },
      approvePluginAuthorityV1Args: {
        pluginType: "The type of plugin whose authority is being set.",
        newAuthority: "The authority to grant management of the plugin.",
      },
      approveCollectionPluginAuthorityV1Args: {
        pluginType: "The type of plugin whose authority is being set.",
        newAuthority: "The authority to grant management of the plugin.",
      },
      revokePluginAuthorityV1Args: {
        pluginType: [
          "The type of plugin whose authority should be reset to its",
          "default.",
        ],
      },
      revokeCollectionPluginAuthorityV1Args: {
        pluginType: [
          "The type of plugin whose authority should be reset to its",
          "default.",
        ],
      },
      burnV1Args: {
        compressionProof: [
          "Proof of the asset's current compressed state; required only",
          "if the asset is compressed.",
        ],
      },
      burnCollectionV1Args: {
        compressionProof: [
          "Proof of the collection's current compressed state; required",
          "only if the collection is compressed.",
        ],
      },
      transferV1Args: {
        compressionProof: [
          "Proof of the asset's current compressed state; required only",
          "if the asset is compressed.",
        ],
      },
      decompressV1Args: {
        compressionProof: [
          "Proof of the asset's pre-compression state, used to rebuild",
          "the on-chain account.",
        ],
      },
      updateV1Args: {
        newName: "The asset's new display name, if changing.",
        newUri: "The asset's new metadata URI, if changing.",
        newUpdateAuthority: "The asset's new update authority, if changing.",
      },
      updateV2Args: {
        newName: "The asset's new display name, if changing.",
        newUri: "The asset's new metadata URI, if changing.",
        newUpdateAuthority: "The asset's new update authority, if changing.",
      },
      updateCollectionV1Args: {
        newName: "The collection's new display name, if changing.",
        newUri: "The collection's new metadata URI, if changing.",
      },
      updateGroupV1Args: {
        newName: "The group's new display name, if changing.",
        newUri: "The group's new metadata URI, if changing.",
      },
      executeV1Args: {
        instructionData:
          "The serialized instruction to invoke via the asset-signer PDA.",
      },
      updateCollectionInfoV1Args: {
        updateType: [
          "Whether this call records a `Mint`, or an `Add`/`Remove` of",
          "collection size.",
        ],
        amount: "The amount by which to adjust the collection's counters.",
      },
      addExternalPluginAdapterV1Args: {
        initInfo:
          "The external plugin adapter variant and its initialization data.",
      },
      addCollectionExternalPluginAdapterV1Args: {
        initInfo:
          "The external plugin adapter variant and its initialization data.",
      },
      removeExternalPluginAdapterV1Args: {
        key: "Identifies which external plugin adapter to remove.",
      },
      removeCollectionExternalPluginAdapterV1Args: {
        key: "Identifies which external plugin adapter to remove.",
      },
      updateExternalPluginAdapterV1Args: {
        key: "Identifies which external plugin adapter to update.",
        updateInfo: "The fields to change on the adapter.",
      },
      updateCollectionExternalPluginAdapterV1Args: {
        key: "Identifies which external plugin adapter to update.",
        updateInfo: "The fields to change on the adapter.",
      },
      writeExternalPluginAdapterDataV1Args: {
        key: "Identifies which external plugin adapter's data to write.",
        data: "The bytes to store, or `None` to clear the adapter's data.",
      },
      writeCollectionExternalPluginAdapterDataV1Args: {
        key: "Identifies which external plugin adapter's data to write.",
        data: "The bytes to store, or `None` to clear the adapter's data.",
      },
      removeAssetsFromGroupV1Args: {
        assets: "The addresses of the assets to remove from the group.",
      },
      removeCollectionsFromGroupV1Args: {
        collections:
          "The addresses of the collections to remove from the group.",
      },
      addGroupsToGroupV1Args: {
        groups: "The addresses of the child groups to add to the parent.",
      },
      removeGroupsFromGroupV1Args: {
        groups: "The addresses of the child groups to remove from the parent.",
      },

      // -- Plugins & adapters ---------------------------------------------------
      pluginAuthorityPair: {
        plugin: "The plugin variant and its configuration.",
        authority: [
          "The authority to manage the plugin; defaults to the plugin",
          "type's standard authority if omitted.",
        ],
      },
      attribute: {
        key: "The attribute's name.",
        value: "The attribute's value.",
      },
      attributes: {
        attributeList: "The list of key/value attributes stored on the asset.",
      },
      autographSignature: {
        address: "The address that signed.",
        message: "An optional message left alongside the signature.",
      },
      autograph: {
        signatures: "The signatures collected on the asset.",
      },
      verifiedCreatorsSignature: {
        address: "The creator's address.",
        verified: "Whether this creator has signed to verify their inclusion.",
      },
      verifiedCreators: {
        signatures: "The list of creators and their verification status.",
      },
      creator: {
        address: "The creator's address.",
        percentage: [
          "The creator's share of royalties, in whole percentage points",
          "(0-100).",
        ],
      },
      royalties: {
        basisPoints:
          "The royalty rate, in basis points (1/100th of a percent).",
        creators: [
          "The creators who split the royalty payment, with their",
          "address and percentage share.",
        ],
        ruleSet:
          "Restricts which programs may transfer the asset, to enforce royalty payment.",
      },
      updateDelegate: {
        additionalDelegates: [
          "Extra addresses, beyond the update authority, allowed to",
          "update the asset.",
        ],
      },
      freezeDelegate: {
        frozen: "Whether the asset is currently frozen.",
      },
      freezeExecute: {
        frozen:
          "Whether the asset's `executeV1` capability is currently frozen.",
      },
      permanentFreezeDelegate: {
        frozen: "Whether the asset is currently frozen.",
      },
      permanentFreezeExecute: {
        frozen:
          "Whether the asset's `executeV1` capability is currently frozen.",
      },
      edition: {
        number: "The edition number assigned to this asset.",
      },
      masterEdition: {
        maxSupply: [
          "The maximum number of editions that may be printed from this",
          "master edition, if capped.",
        ],
        name: "An override name to apply to editions printed from this master, if set.",
        uri: "An override URI to apply to editions printed from this master, if set.",
      },
      groups: {
        groups:
          "The addresses of the groups this asset or collection belongs to.",
      },
      oracle: {
        baseAddress:
          "The address of the oracle account, or the base address used to derive it.",
        baseAddressConfig: [
          "How to derive the actual oracle account from `baseAddress`",
          "(e.g. a PDA keyed by the asset), if not `baseAddress` itself.",
        ],
        resultsOffset:
          "Where within the oracle account to read the `OracleValidation` result.",
      },
      oracleInitInfo: {
        baseAddress:
          "The address of the oracle account, or the base address used to derive it.",
        initPluginAuthority: [
          "The authority to manage this adapter; defaults to the",
          "adapter type's standard authority if omitted.",
        ],
        lifecycleChecks: [
          "The lifecycle events this adapter should be consulted for,",
          "and how its result should be interpreted.",
        ],
        baseAddressConfig: [
          "How to derive the actual oracle account from `baseAddress`,",
          "if not `baseAddress` itself.",
        ],
        resultsOffset:
          "Where within the oracle account to read the `OracleValidation` result.",
      },
      oracleUpdateInfo: {
        lifecycleChecks:
          "The lifecycle events this adapter should be consulted for, if changing.",
        baseAddressConfig:
          "How to derive the oracle account from its base address, if changing.",
        resultsOffset:
          "Where within the oracle account to read the result, if changing.",
      },
      appData: {
        dataAuthority: "The authority allowed to write this adapter's data.",
        schema: "The serialization format used for this adapter's stored data.",
      },
      linkedAppData: {
        dataAuthority: "The authority allowed to write this adapter's data.",
        schema: "The serialization format used for this adapter's stored data.",
      },
      appDataInitInfo: {
        dataAuthority: "The authority allowed to write this adapter's data.",
        initPluginAuthority: [
          "The authority to manage this adapter; defaults to the",
          "adapter type's standard authority if omitted.",
        ],
        schema:
          "The serialization format to use for this adapter's stored data.",
      },
      linkedAppDataInitInfo: {
        dataAuthority: "The authority allowed to write this adapter's data.",
        initPluginAuthority: [
          "The authority to manage this adapter; defaults to the",
          "adapter type's standard authority if omitted.",
        ],
        schema:
          "The serialization format to use for this adapter's stored data.",
      },
      appDataUpdateInfo: {
        schema:
          "The new serialization format for this adapter's stored data, if changing.",
      },
      linkedAppDataUpdateInfo: {
        schema:
          "The new serialization format for this adapter's stored data, if changing.",
      },
      dataSection: {
        parentKey: [
          "The linked adapter (`LinkedAppData` or `LinkedLifecycleHook`)",
          "whose data this section stores.",
        ],
        schema: "The serialization format used for the stored data.",
      },
      dataSectionInitInfo: {
        parentKey: [
          "The linked adapter (`LinkedAppData` or `LinkedLifecycleHook`)",
          "whose data this section stores.",
        ],
        schema: "The serialization format used for the stored data.",
      },
      lifecycleHook: {
        hookedProgram:
          "The program invoked via CPI at the configured lifecycle events.",
        extraAccounts: "Additional accounts to forward to the hooked program.",
        dataAuthority:
          "The authority allowed to write data returned by the hook, if any.",
        schema: "The serialization format used for data returned by the hook.",
      },
      linkedLifecycleHook: {
        hookedProgram:
          "The program invoked via CPI at the configured lifecycle events.",
        extraAccounts: "Additional accounts to forward to the hooked program.",
        dataAuthority:
          "The authority allowed to write data returned by the hook, if any.",
        schema: "The serialization format used for data returned by the hook.",
      },
      lifecycleHookInitInfo: {
        hookedProgram:
          "The program to invoke via CPI at the configured lifecycle events.",
        initPluginAuthority: [
          "The authority to manage this adapter; defaults to the",
          "adapter type's standard authority if omitted.",
        ],
        lifecycleChecks: [
          "The lifecycle events that should trigger the hook, and how",
          "its result should be interpreted.",
        ],
        extraAccounts: "Additional accounts to forward to the hooked program.",
        dataAuthority:
          "The authority allowed to write data returned by the hook, if any.",
        schema:
          "The serialization format to use for data returned by the hook.",
      },
      linkedLifecycleHookInitInfo: {
        hookedProgram:
          "The program to invoke via CPI at the configured lifecycle events.",
        initPluginAuthority: [
          "The authority to manage this adapter; defaults to the",
          "adapter type's standard authority if omitted.",
        ],
        lifecycleChecks: [
          "The lifecycle events that should trigger the hook, and how",
          "its result should be interpreted.",
        ],
        extraAccounts: "Additional accounts to forward to the hooked program.",
        dataAuthority:
          "The authority allowed to write data returned by the hook, if any.",
        schema:
          "The serialization format to use for data returned by the hook.",
      },
      lifecycleHookUpdateInfo: {
        lifecycleChecks:
          "The lifecycle events that should trigger the hook, if changing.",
        extraAccounts:
          "Additional accounts to forward to the hooked program, if changing.",
        schema: "The serialization format for hook data, if changing.",
      },
      linkedLifecycleHookUpdateInfo: {
        lifecycleChecks:
          "The lifecycle events that should trigger the hook, if changing.",
        extraAccounts:
          "Additional accounts to forward to the hooked program, if changing.",
        schema: "The serialization format for hook data, if changing.",
      },
      agentIdentity: {
        uri: "The URI pointing to the agent's off-chain identity metadata.",
      },
      agentIdentityInitInfo: {
        uri: "The URI pointing to the agent's off-chain identity metadata.",
        initPluginAuthority: [
          "The authority to manage this adapter; defaults to the",
          "adapter type's standard authority if omitted.",
        ],
        lifecycleChecks: [
          "The lifecycle events this adapter should be consulted for,",
          "and how its result should be interpreted.",
        ],
      },
      agentIdentityUpdateInfo: {
        uri: "The agent's new identity metadata URI, if changing.",
        lifecycleChecks:
          "The lifecycle events this adapter should be consulted for, if changing.",
      },
      externalCheckResult: {
        flags: [
          "A bitmask of the `ValidationResult`s this adapter may return",
          "for the checked lifecycle event.",
        ],
      },

      // -- Registries & compression ---------------------------------------------
      registryRecord: {
        pluginType: "The type of the internal plugin this record describes.",
        authority: "The authority currently allowed to manage the plugin.",
        offset: [
          "The byte offset, within the plugin registry, at which this",
          "plugin's data begins.",
        ],
      },
      externalRegistryRecord: {
        pluginType:
          "The type of the external plugin adapter this record describes.",
        authority: "The authority currently allowed to manage the adapter.",
        lifecycleChecks: [
          "The lifecycle events this adapter is consulted for, and how",
          "its result should be interpreted.",
        ],
        offset: [
          "The byte offset, within the plugin registry, at which this",
          "adapter's config begins.",
        ],
        dataOffset: [
          "The byte offset at which this adapter's separate data",
          "payload begins, if it stores one.",
        ],
        dataLen: [
          "The length, in bytes, of this adapter's separate data",
          "payload, if it stores one.",
        ],
      },
      relationshipEntry: {
        kind: [
          "The kind of relationship this entry represents (e.g.",
          "collection membership, group nesting).",
        ],
        key: "The address of the related account.",
      },
      hashablePluginSchema: {
        index:
          "The plugin's position within the plugin registry at the time it was hashed.",
        authority: "The plugin's authority at the time it was hashed.",
        plugin:
          "The plugin variant and configuration at the time it was hashed.",
      },
      hashedAssetSchema: {
        assetHash: [
          "The hash of the asset's core data (owner, update authority,",
          "name, URI, sequence number).",
        ],
        pluginHashes:
          "The hash of each plugin attached to the asset, in registry order.",
      },
      compressionProof: {
        owner: "The asset's owner at the time it was compressed.",
        updateAuthority:
          "The asset's update authority at the time it was compressed.",
        name: "The asset's name at the time it was compressed.",
        uri: "The asset's URI at the time it was compressed.",
        seq: "The asset's sequence number at the time it was compressed.",
        plugins: "The asset's plugins at the time it was compressed.",
      },
    }),
  ],
});
