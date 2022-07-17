var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var Verifier = artifacts.require("./Verifier.sol");

contract('SolnSquareVerifier', async (accounts) => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    // - use the contents from proof.json generated from zokrates steps
    const proofJSON = { 
        "proof": {
            "a": ["0x2f3ebc4cd8e2332f984a83fbabb5986d3c9b1f159ef5ad03f5635393b02e129b", "0x1bd4ce1ac02e910310ac30d4bc2be55112f094322c7a52210ca350cc33e12f91"],
            "b": [["0x29a27b28f3716edac59dab378dd1c957d9455dcb0439d600c8d9dfd27091a063", "0x10156d6cb7f60967889bcafed4760efb2c92e936a1797ea592c26316d1baec98"], ["0x03e6afe668f7f969b6cbad87ff8cbad938185f71663f845c7a4d910b8f4a5334", "0x07ec2d8f8c8a765d83e0c6917be3d7193e965737af29df184b8b7b0b5c6a9636"]],
            "c": ["0x0370b040864caba36e49abf8495c93a6f37e42adadf66e4441ef0a7488a11d15", "0x0e1124901bb34ad53c39aba7ea0a35b69fe191f91b18fe6f27d385acb48d1bda"]
        },
        "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000009", "0x0000000000000000000000000000000000000000000000000000000000000001"]
    }
    const proof = proofJSON['proof'];
    const inputs = proofJSON['inputs'];
    let contract;

    const _symbol = 'TUKI';
    const _name = 'Real Estate Marketplace';
    const _baseTokenURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

    describe('SolnSquareVerifier test', function () {

        beforeEach(async function () {
            const verifier = await Verifier.new();
            contract = await SolnSquareVerifier.new(verifier.address, _name, _symbol, _baseTokenURI);
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('Test if a new solution can be added for contract', async () => {
            contract.SolutionAdded()
                .on('data', (event) => {
                    console.log(`Emit SolutionAdded() address : ${event.returnValues.owner}`);
                })
                .on('error', console.error);

                const result = await contract.addSolution(
                    proof.a,
                    proof.b,
                    proof.c,
                    inputs,
                    account_one,
                    1, {
                       from: account_one
                    }); 
                assert(result, 'Test fail with Solution Added');
        })

         // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
         it('Test if an ERC721 token can be minted for contract', async () => {
            contract.Transfer()
                .on('data', (event) => {
                    console.log(`Emit Transfer() tokenId : ${event.returnValues.tokenId}`);
                })
                .on('error', console.error);

            const result = await contract.mint(account_one, 2, { from: account_one });

            assert(result, 'Test fail with minted');
        })
    });

});
