//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

/// @title Owner & Nominee Functionality
/// @author Bhumi Sadariya

contract Main {
    // all owners' arrays and mapping to check if the owner is already added or not.
    address[] public owners;
    mapping(address => bool) public isOwnerAdded;

    // owner structure and address mapping with owner structure
    struct Owner {
        string owner_name;
        string owner_email;
        string image_cid;
    }
    mapping(address => Owner) public addressToOwner;

    //Nominee Structure, mapping of owner to nominee's id array, and mapping of id to nominee structure
    struct Nominee {
        uint256 id;
        string nominee_name;
        string nominee_email;
        address nominee_address;
    }
    mapping(address => uint256[]) public ownerToNominees;
    mapping(uint256 => Nominee) public idToNominee;
    uint256 nominee_id = 1;

    struct Assets {
        address token_address;
        string token_name;
        uint256 token_amount;
        uint256 nft_id;
        bool isToken;
        bool hasRight;
    }
    mapping(address => Assets[]) public nomineeToAssets;

    //struct to store owner's response
    struct Response {
        string date;
        bool isResponsed;
    }
    mapping(address => Response) public ownerToResponse;

    ///@param name is the owner's name and email is the owner's email
    function addOwnerDetails(
        string memory name,
        string memory email,
        string memory cid
    ) public {
        if (!isOwnerAdded[msg.sender]) {
            owners.push(msg.sender);
            isOwnerAdded[msg.sender] = true;
            addressToOwner[msg.sender] = Owner(name, email, cid);
        }
    }

    ///@param name is the nominee's name, email is the nominee's email, and nominee_address
    ///is the nominee's address
    function addNomineesDetails(
        string memory name,
        string memory email,
        address nominee_address
    ) public {
        idToNominee[nominee_id] = Nominee(
            nominee_id,
            name,
            email,
            nominee_address
        );
        ownerToNominees[msg.sender].push(nominee_id);
        nominee_id++;
    }

    ///@param id is the nominee's id, name is the nominee's name, email is the nominee's email, and nominee_address
    ///is the nominee's address
    function editNomineeDetails(
        uint256 id,
        string memory name,
        string memory email,
        address nominee_address
    ) public {
        idToNominee[id].nominee_name = name;
        idToNominee[id].nominee_email = email;
        idToNominee[id].nominee_address = nominee_address;
    }

    /// @return array of nominees's id
    function getNominees(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        return ownerToNominees[_owner];
    }

    /// @param id is the nominee id
    /// @return nominee structure
    function getNomineeDetails(uint256 id)
        public
        view
        returns (Nominee memory)
    {
        return idToNominee[id];
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

    function setResponseDate(address _owner, string memory _date) public {
        ownerToResponse[_owner].date = _date;
    }

    function setResponse(address _owner, bool _response) public {
        ownerToResponse[_owner].isResponsed = _response;
    }

    function getResponseDate(address _owner)
        public
        view
        returns (string memory)
    {
        return ownerToResponse[_owner].date;
    }

    function getResponse(address _owner) public view returns (bool) {
        return ownerToResponse[_owner].isResponsed;
    }

    function claim() public {}
}
