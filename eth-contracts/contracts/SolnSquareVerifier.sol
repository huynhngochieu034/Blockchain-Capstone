pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import './ERC721Mintable.sol';
import './Verifier.sol';

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable {
    Verifier verifier;

// TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint[2]  a;
        uint[2][2]  b;
        uint[2]  c;
        uint[2]  inputs;
        address to;
        uint256 tokenId;
    }

// TODO define an array of the above struct
mapping(bytes32 => Solution) solutions;

// TODO define a mapping to store unique solutions submitted
mapping(bytes32 => bool) solutionsUnique;


// TODO Create an event to emit when a solution is added
event SolutionAdded(address indexed owner);

 constructor(address _address, string memory _name, string memory _symbol, string memory _baseTokenURI )
        ERC721Mintable(_name, _symbol, _baseTokenURI) public
    {
        verifier = Verifier(_address);
    }

// TODO Create a function to add the solutions to the array and emit the event
function addSolution(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory inputs, address to, uint256 tokenId) public returns (bool)
    {
        Solution memory solution = Solution(a, b, c, inputs, to, tokenId);
        bytes32 key = keccak256(abi.encodePacked(a, b, c, inputs, to, tokenId));
        solutions[key] = solution;
        bool success = mintNFTWhenSolutionVerified(key, to, tokenId);

        emit SolutionAdded(msg.sender);
        return success;
    }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
function mintNFTWhenSolutionVerified( bytes32 key, address to, uint256 tokenId) public returns (bool) {
        bool isSuccess = false;
        Solution memory solution = solutions[key];

        if (solutionsUnique[key] != true) {
          
          bool verification = verifier.verifyTx(solution.a, solution.b, solution.c, solution.inputs);
          
          if (verification == true) {
              solutionsUnique[key] = true;
              super.mint(to, tokenId);
              return true;
           }
        }
        return false;
    }
  

}
























