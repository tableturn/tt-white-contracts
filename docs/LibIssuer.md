# Solidity API

## LibIssuer

### STORAGE_VERSION

```solidity
uint16 STORAGE_VERSION
```

### STORAGE_SLOT

```solidity
bytes32 STORAGE_SLOT
```

### Data

```solidity
struct Data {
  uint16 version;
  struct LibAddressSet.Data fastSet;
  mapping(string => address) fastSymbols;
  mapping(string => struct LibAddressSet.Data) fastGroups;
}
```

### data

```solidity
function data() internal pure returns (struct LibIssuer.Data s)
```

