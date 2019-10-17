// Based on openzeppelin-contracts/test/token/ERC721/ERC721.test.js

const { constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

const { shouldBehaveLikeERC721 } = require('./behaviours/ERC721.behavior.js');
const ArtistryCore = artifacts.require('./ArtistryCore.sol');
const { BigNumber } = web3;

contract('Registry', async accounts => {
  beforeEach(async function () {
    this.token = await ERC721Mock.new({ from: creator });
  });

  shouldBehaveLikeERC721(creator, creator, accounts);

  describe('internal functions', function () {
    const tokenId = new BigNumber('5042');

    describe('_mint(address, uint256)', function () {
      it('reverts with a null destination address', async function () {
        await expectRevert(
          this.token.mint(ZERO_ADDRESS, tokenId), 'ERC721: mint to the zero address'
        );
      });

      context('with minted token', async function () {
        beforeEach(async function () {
          ({ logs: this.logs } = await this.token.mint(owner, tokenId));
        });

        it('emits a Transfer event', function () {
          expectEvent.inLogs(this.logs, 'Transfer', { from: ZERO_ADDRESS, to: owner, tokenId });
        });

        it('creates the token', async function () {
          expect(await this.token.balanceOf(owner)).to.be.bignumber.equal('1');
          expect(await this.token.ownerOf(tokenId)).to.equal(owner);
        });

        it('reverts when adding a token id that already exists', async function () {
          await expectRevert(this.token.mint(owner, tokenId), 'ERC721: token already minted');
        });
      });
    });

    describe('_burn(address, uint256)', function () {
      it('reverts when burning a non-existent token id', async function () {
        await expectRevert(
          this.token.methods['burn(address,uint256)'](owner, tokenId), 'ERC721: owner query for nonexistent token'
        );
      });

      context('with minted token', function () {
        beforeEach(async function () {
          await this.token.mint(owner, tokenId);
        });

        it('reverts when the account is not the owner', async function () {
          await expectRevert(
            this.token.methods['burn(address,uint256)'](other, tokenId), 'ERC721: burn of token that is not own'
          );
        });

        context('with burnt token', function () {
          beforeEach(async function () {
            ({ logs: this.logs } = await this.token.methods['burn(address,uint256)'](owner, tokenId));
          });

          it('emits a Transfer event', function () {
            expectEvent.inLogs(this.logs, 'Transfer', { from: owner, to: ZERO_ADDRESS, tokenId });
          });

          it('deletes the token', async function () {
            expect(await this.token.balanceOf(owner)).to.be.bignumber.equal('0');
            await expectRevert(
              this.token.ownerOf(tokenId), 'ERC721: owner query for nonexistent token'
            );
          });

          it('reverts when burning a token id that has been deleted', async function () {
            await expectRevert(
              this.token.methods['burn(address,uint256)'](owner, tokenId),
              'ERC721: owner query for nonexistent token'
            );
          });
        });
      });
    });

    describe('_burn(uint256)', function () {
      it('reverts when burning a non-existent token id', async function () {
        await expectRevert(
          this.token.methods['burn(uint256)'](tokenId), 'ERC721: owner query for nonexistent token'
        );
      });

      context('with minted token', function () {
        beforeEach(async function () {
          await this.token.mint(owner, tokenId);
        });

        context('with burnt token', function () {
          beforeEach(async function () {
            ({ logs: this.logs } = await this.token.methods['burn(uint256)'](tokenId));
          });

          it('emits a Transfer event', function () {
            expectEvent.inLogs(this.logs, 'Transfer', { from: owner, to: ZERO_ADDRESS, tokenId });
          });

          it('deletes the token', async function () {
            expect(await this.token.balanceOf(owner)).to.be.bignumber.equal('0');
            await expectRevert(
              this.token.ownerOf(tokenId), 'ERC721: owner query for nonexistent token'
            );
          });

          it('reverts when burning a token id that has been deleted', async function () {
            await expectRevert(
              this.token.methods['burn(uint256)'](tokenId), 'ERC721: owner query for nonexistent token'
            );
          });
        });
      });
    });
  });
}); // end Registry contract
