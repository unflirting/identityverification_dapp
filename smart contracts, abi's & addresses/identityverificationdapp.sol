// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityAttestationContract {
    mapping(bytes32 => string) public attestedIdentities;
    mapping(address => bool) public hasRegistered;

    function registerIdentityAttribute(string memory attribute, string memory value) external {
        require(!hasRegistered[msg.sender], "Identity attributes already registered.");
        bytes32 key = keccak256(abi.encodePacked(msg.sender, attribute));
        attestedIdentities[key] = value;
        hasRegistered[msg.sender] = true;
    }

    function attestIdentity(address individual, string memory attribute, string memory value) external {
        require(hasRegistered[individual], "Identity attributes not registered.");
        bytes32 key = keccak256(abi.encodePacked(individual, attribute));
        attestedIdentities[key] = value;
    }
}


contract ConsentManagementContract {
    mapping(bytes32 => bool) public consent;

    function grantConsent(address individual, address serviceProvider) external {
        bytes32 key = keccak256(abi.encodePacked(individual, serviceProvider));
        consent[key] = true;
    }

    function revokeConsent(address individual, address serviceProvider) external {
        bytes32 key = keccak256(abi.encodePacked(individual, serviceProvider));
        consent[key] = false;
    }

    function checkConsent(address individual, address serviceProvider) external view returns (bool) {
        bytes32 key = keccak256(abi.encodePacked(individual, serviceProvider));
        return consent[key];
    }
}

contract IdentityVerificationContract {
    IdentityAttestationContract public identityAttestationContract;
    ConsentManagementContract public consentManagementContract;

    constructor(address _identityAttestationContract, address _consentManagementContract) {
        identityAttestationContract = IdentityAttestationContract(_identityAttestationContract);
        consentManagementContract = ConsentManagementContract(_consentManagementContract);
    }

    function verifyIdentity(address individual, address serviceProvider, string memory attribute) public view returns (bool) {
        // Check if individual is registered
        if (!identityAttestationContract.hasRegistered(individual)) {
            return false;
        }

        // Check if consent is granted
        if (!consentManagementContract.checkConsent(individual, serviceProvider)) {
            return false;
        }

        // Check if attribute is valid
        bytes32 key = keccak256(abi.encodePacked(individual, attribute));
        string memory attestedValue = identityAttestationContract.attestedIdentities(key);
        if (bytes(attestedValue).length == 0) {
            return false;
        }

        // If all conditions are met, return true
        return true;
    }
}