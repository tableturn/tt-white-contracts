# Solidity API

## IssuerFrontendFacet

### paginateDetailedFasts

```solidity
function paginateDetailedFasts(uint256 cursor, uint256 perPage) external view returns (struct FastFrontendFacet.Details[], uint256)
```

Paginates the FAST diamonds registered with this Issuer based on a starting cursor and
       a number of records per page. It returns rich details for each FAST diamond.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| cursor | uint256 | The index at which to start. |
| perPage | uint256 | How many records should be returned at most. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct FastFrontendFacet.Details[] | A `address[]` list of values at most `perPage` big. |
| [1] | uint256 | A `uint256` index to the next page. |

### paginateDetailedFastsInGroup

```solidity
function paginateDetailedFastsInGroup(string group, uint256 cursor, uint256 perPage) external view returns (struct FastFrontendFacet.Details[], uint256)
```

Paginates the FAST diamonds registered with this Issuer based on a group, starting cursor and a
       number of records per page. It returns rich details for each FAST diamond.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| group | string | The group to paginate. |
| cursor | uint256 | The index at which to start. |
| perPage | uint256 | How many records should be returned at most. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct FastFrontendFacet.Details[] | A `address[]` list of values at most `perPage` big. |
| [1] | uint256 | A `uint256` index to the next page. |

