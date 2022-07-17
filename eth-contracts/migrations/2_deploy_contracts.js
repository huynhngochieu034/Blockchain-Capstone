// migrating the appropriate contracts
var Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var ERC721Mintable = artifacts.require("./ERC721Mintable.sol");

module.exports = function(deployer) {
  const sysmbol = 'TUKI';
  const name = 'Real Estate Marketplace';
  const baseTokenURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

  deployer.deploy(ERC721Mintable, sysmbol, name, baseTokenURI);
  deployer.deploy(Verifier).then(() => {
    return deployer.deploy(SolnSquareVerifier, Verifier.address, name, sysmbol, baseTokenURI)
  });
};
