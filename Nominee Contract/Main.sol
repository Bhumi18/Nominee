//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

/// @title Owner & Nominee Functionality
/// @author Bhumi Sadariya

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Main is Ownable {
    constructor() Ownable() {}

    // all owners' arrays and mappings to check if the owner is already added or not.
    address[] public owners;
    mapping(address => bool) public isOwnerAdded;

    // Owner structure and address mapping with owner structure
    struct Owner {
        string owner_name;
        string owner_email;
        string image_cid;
        bool isEmailVerified;
        bool isAlive;
    }
    mapping(address => Owner) public addressToOwner;

    //Nominee structure, mapping of owner to nominee's id array, and mapping of id to nominee structure
    struct Nominee {
        string nominee_name;
        string nominee_email;
        address nominee_address;
        bool isClaimed;
    }
    mapping(address => address[]) public ownerToNominees;
    mapping(address => Nominee) public addressToNominee;

    //Asset Structure: mapping of the nominee's address to the array of assets' structures
    struct Assets {
        address token_address;
        string token_name;
        uint256 token_amount;
        uint256 nft_id;
        bool isToken;
        bool hasRight;
    }
    mapping(address => Assets[]) public nomineeToAssets;

    //struct to the store owner's response
    struct Response {
        string date;
        bool isResponsed;
    }
    mapping(address => Response) public ownerToResponse;

    ///@param name is the owner's name, and email is the owner's email.
    function addOwnerDetails(
        string memory name,
        string memory email,
        string memory cid
    ) public {
        if (!isOwnerAdded[msg.sender]) {
            owners.push(msg.sender);
            isOwnerAdded[msg.sender] = true;
            addressToOwner[msg.sender] = Owner(name, email, cid, false, true);
        }
    }

    ///@param _owner is the owner's address.
    function verifyOwner(address _owner) public onlyOwner {
        addressToOwner[_owner].isEmailVerified = true;
    }

    ///@param name is the nominee's name, email is the nominee's email, and nominee_address
    ///is the nominee's address
    function addNomineesDetails(
        string memory name,
        string memory email,
        address nominee_address
    ) public {
        addressToNominee[nominee_address] = Nominee(
            name,
            email,
            nominee_address,
            false
        );
        ownerToNominees[msg.sender].push(nominee_address);
    }

    ///@param name is the nominee's name, email is the nominee's email, and nominee_address
    ///is the nominee's address
    function editNomineeDetails(
        address _owner,
        address _oldNomineeAddress,
        string memory name,
        string memory email,
        address nominee_address
    ) public {
        if (_oldNomineeAddress == nominee_address) {
            addressToNominee[_oldNomineeAddress].nominee_name = name;
            addressToNominee[_oldNomineeAddress].nominee_email = email;
        } else {
            addressToNominee[nominee_address].nominee_name = name;
            addressToNominee[nominee_address].nominee_email = email;
            addressToNominee[nominee_address].nominee_address = nominee_address;
            for (uint256 i = 0; i < ownerToNominees[_owner].length; i++) {
                if (ownerToNominees[_owner][i] == _oldNomineeAddress) {
                    ownerToNominees[_owner][i] = nominee_address;
                }
            }
        }
    }

    /// @return array of nominees's id
    function getNominees(address _owner)
        public
        view
        returns (address[] memory)
    {
        return ownerToNominees[_owner];
    }

    /// @param _nominee is the nominee address
    /// @return nominee structure
    function getNomineeDetails(address _nominee)
        public
        view
        returns (Nominee memory)
    {
        return addressToNominee[_nominee];
    }

    /// @param owner_address is the owner's address
    /// @return owner structure
    function getOwnerDetails(address owner_address)
        public
        view
        returns (Owner memory)
    {
        return addressToOwner[owner_address];
    }

    /// @param nominee_address is the nominee address, _token_address is the token address, _approvedBalance is the amount of token approved
    //_nftId is the token id of nft
    function assignAssetsToNominee(
        address nominee_address,
        string memory _token_name,
        address _token_address,
        uint256 _approvedBalance,
        uint256 _nftId
    ) public {
        if (_approvedBalance > 0) {
            nomineeToAssets[nominee_address].push(
                Assets(
                    _token_address,
                    _token_name,
                    _approvedBalance,
                    0,
                    true,
                    true
                )
            );
        } else {
            nomineeToAssets[nominee_address].push(
                Assets(_token_address, "", 0, _nftId, false, true)
            );
        }
    }

    /// @param old_nominee is the address of the nominee who was holding an asset.,
    // new_nominee is the address of the nominee to whom the owner wants to assign,
    // _token_address is the token address; _approved Balance is the amount of tokens approved.
    //_nftId is the token id of nft.
    function ChangeAssetsToNomiee(
        address old_nominee,
        address new_nominee,
        string memory _token_name,
        address _token_address,
        uint256 _approvedBalance,
        uint256 _nftId
    ) public {
        for (uint16 i = 0; i < nomineeToAssets[old_nominee].length; i++) {
            if (
                nomineeToAssets[old_nominee][i].token_address == _token_address
            ) {
                nomineeToAssets[old_nominee][i].hasRight = false;
            }
        }
        if (_approvedBalance > 0) {
            nomineeToAssets[new_nominee].push(
                Assets(
                    _token_address,
                    _token_name,
                    _approvedBalance,
                    0,
                    true,
                    true
                )
            );
        } else {
            nomineeToAssets[new_nominee].push(
                Assets(_token_address, "", 0, _nftId, false, true)
            );
        }
    }

    /// @return an array of owner's address
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    /// @param _owner is the owner's address, _date is the date on which we sent the first mail to the nominee.
    function setResponseDate(address _owner, string memory _date)
        public
        onlyOwner
    {
        ownerToResponse[_owner].date = _date;
    }

    /// @param _owner is the owner's address, _response is whether the owner has replied to the email or not.
    function setResponse(address _owner, bool _response) public {
        ownerToResponse[_owner].isResponsed = _response;
    }

    /// @param _owner is the owner's address
    function setOwnerNotAlive(address _owner) public onlyOwner {
        addressToOwner[_owner].isAlive = false;
    }

    /// @return string of the owner's date when we first send mail to the owner
    function getResponseDate(address _owner)
        public
        view
        returns (string memory)
    {
        return ownerToResponse[_owner].date;
    }

    /// @return bool of owner's response
    function getResponse(address _owner) public view returns (bool) {
        return ownerToResponse[_owner].isResponsed;
    }

    /// @return boolean showing whether the owner is alive or not
    function getOwnerAlive(address _owner) public view returns (bool) {
        return addressToOwner[_owner].isAlive;
    }

    /// @return bool of email is verified or not
    function checkVerification(address _owner) public view returns (bool) {
        return addressToOwner[_owner].isEmailVerified;
    }

    /// @param _nominee is the nominee's address
    function claim(address _nominee) public {
        addressToNominee[_nominee].isClaimed = true;
    }
}
