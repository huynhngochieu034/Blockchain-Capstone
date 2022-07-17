var ERC721Mintable = artifacts.require("./ERC721Mintable.sol");

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    const _symbol = 'TUKI';
    const _name = 'Real Estate Marketplace';
    const _baseTokenURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';
    const numberMintToken = 5;

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new(_name, _symbol, _baseTokenURI, {from: account_one});

            // TODO: mint multiple tokens
            for (let i = 1; i <= numberMintToken; i++) {
                await this.contract.mint(account_one, i, { from: account_one });
            }
        })

        it('should return total supply', async function () { 
            const numberToken = await this.contract.totalSupply();
            assert.equal(numberToken, numberMintToken, "Total supply is wrong");
        })

        it('should get token balance', async function () { 
            const balance = await this.contract.balanceOf(account_one);
            assert.equal(balance, numberMintToken, "Total balance is wrong");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const uriTokenId = _baseTokenURI + '1';
            const uri = await this.contract.tokenURI(1, { from: account_one });
            assert.equal(uri, uriTokenId, "Wrong token URI");
        })

        it('should transfer token from one owner to another', async function () { 
            const tokenId = 1;
            await this.contract.approve(account_two, tokenId, { from: account_one });
            await this.contract.transferFrom(account_one, account_two, tokenId, { from: account_one });
            const newOwner = await this.contract.ownerOf(tokenId);
            assert.equal(newOwner, account_two, "Token is not transfered");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new(_name, _symbol, _baseTokenURI, {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let error = false;
            try {
                await this.contract.mint(account_two, numberMintToken + 1, { from: account_two });
            }
            catch (e) {
                error = true;
            }

            assert.equal(error, true, "Should fail when minting when address is not contract owner");

        })

        it('should return contract owner', async function () { 
            const owner = await this.contract.owner();
            assert.equal(owner, account_one, "Address is not contract owner");
        })

    });
})