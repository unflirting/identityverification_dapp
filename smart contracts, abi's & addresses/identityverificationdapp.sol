// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityAttestationContract {
    // Mapping to store attested identities
    mapping(bytes32 => string) public attestedIdentities;
    
    // Mapping to track if an address has registered identity attributes
    mapping(address => bool) public hasRegistered;

    // Function to register an identity attribute
    function registerIdentityAttribute(string memory attribute, string memory value) external {
        // Check if the address has already registered identity attributes
        require(!hasRegistered[msg.sender], "Identity attributes already registered.");
        
        // Generate a unique key for the identity attribute using the sender's address and attribute name
        bytes32 key = keccak256(abi.encodePacked(msg.sender, attribute));
        
        // Store the value of the identity attribute
        attestedIdentities[key] = value;
        
        // Mark the address as having registered identity attributes
        hasRegistered[msg.sender] = true;
    }

    // Function to attest an identity attribute
    function attestIdentity(address individual, string memory attribute, string memory value) external {
        // Check if the individual has registered identity attributes
        require(hasRegistered[individual], "Identity attributes not registered.");
        
        // Generate a unique key for the identity attribute using the individual's address and attribute name
        bytes32 key = keccak256(abi.encodePacked(individual, attribute));
        
        // Store the value of the identity attribute
        attestedIdentities[key] = value;
    }
}

contract ConsentManagementContract {
    // Mapping to store consent status
    mapping(bytes32 => bool) public consent;

    // Function to grant consent
    function grantConsent(address individual, address serviceProvider) external {
        // Generate a unique key for the consent using the individual's and service provider's addresses
        bytes32 key = keccak256(abi.encodePacked(individual, serviceProvider));
        
        // Set the consent status to true
        consent[key] = true;
    }

    // Function to revoke consent
    function revokeConsent(address individual, address serviceProvider) external {
        // Generate a unique key for the consent using the individual's and service provider's addresses
        bytes32 key = keccak256(abi.encodePacked(individual, serviceProvider));
        
        // Set the consent status to false
        consent[key] = false;
    }

    // Function to check consent status
    function checkConsent(address individual, address serviceProvider) external view returns (bool) {
        // Generate a unique key for the consent using the individual's and service provider's addresses
        bytes32 key = keccak256(abi.encodePacked(individual, serviceProvider));
        
        // Return the consent status
        return consent[key];
    }
}

contract IdentityVerificationContract {
    // Reference to the IdentityAttestationContract
    IdentityAttestationContract public identityAttestationContract;
    
    // Reference to the ConsentManagementContract
    ConsentManagementContract public consentManagementContract;

    // Constructor to set the addresses of the IdentityAttestationContract and ConsentManagementContract
    constructor(address _identityAttestationContract, address _consentManagementContract) {
        identityAttestationContract = IdentityAttestationContract(_identityAttestationContract);
        consentManagementContract = ConsentManagementContract(_consentManagementContract);
    }

    // Function to verify the identity of an individual
    function verifyIdentity(address individual, address serviceProvider, string memory attribute) public view returns (bool) {
        // Check if the individual has registered identity attributes
        if (!identityAttestationContract.hasRegistered(individual)) {
            return false;
        }

        // Check if consent is granted by the individual to the service provider
        if (!consentManagementContract.checkConsent(individual, serviceProvider)) {
            return false;
        }

        // Check if the attribute is valid and has an attested value
        bytes32 key = keccak256(abi.encodePacked(individual, attribute));
        string memory attestedValue = identityAttestationContract.attestedIdentities(key);
        if (bytes(attestedValue).length == 0) {
            return false;
        }

        // If all conditions are met, return true
        return true;
    }
}