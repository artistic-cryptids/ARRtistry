const { toBN } = web3.utils;
const { constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

function shouldBehaveLikeERC721ApprovalEnumerable (
  creator,
  minter,
  [owner, approved, anotherApproved, operator, other]
) {
  const firstTokenId = toBN(1);
  const secondTokenId = toBN(2);

  describe('like an ERC721ApprovalEnumerable', function () {
    beforeEach(async function () {
      await this.token.mockMint(owner, firstTokenId, { from: minter });
      await this.token.mockMint(owner, secondTokenId, { from: minter });
      this.toWhom = other; // default to anyone for toWhom in context-dependent tests
    });

    describe('transferFrom', function () {
      const tokenId = firstTokenId;
      context('when approved is transferring', function () {
        beforeEach(async function () {
          await this.token.approve(approved, tokenId, { from: owner });
          await this.token.approve(approved, secondTokenId, { from: owner });
        });

        it('removes tokenId from operator approved token list', async function () {
          await this.token.transferFrom(owner, other, tokenId, { from: approved });
          expect(await this.token.getOperatorTokenIds(approved)).to.eql([secondTokenId]);
        });

        it('removes tokenId from operator approved token list', async function () {
          await this.token.transferFrom(owner, other, secondTokenId, { from: owner });
          expect(await this.token.getOperatorTokenIds(approved)).to.eql([firstTokenId]);
        });
      })

      context('when owner is transferring', function () {
        beforeEach(async function () {
          await this.token.approve(approved, tokenId, { from: owner });
          await this.token.approve(approved, secondTokenId, { from: owner });
        });

        it('removes tokenId from operator approved token list', async function () {
          await this.token.transferFrom(owner, other, tokenId, { from: owner });
          expect(await this.token.getOperatorTokenIds(approved)).to.eql([secondTokenId]);
        });

        it('removes tokenId from operator approved token list', async function () {
          await this.token.transferFrom(owner, other, secondTokenId, { from: owner });
          expect(await this.token.getOperatorTokenIds(approved)).to.eql([firstTokenId]);
        });
      })
    });

    describe('safeTransferFrom', function () {
      const tokenId = firstTokenId;
      context('when approved is transferring', function () {
        beforeEach(async function () {
          await this.token.approve(approved, tokenId, { from: owner });
          await this.token.approve(approved, secondTokenId, { from: owner });
        });

        it('removes tokenId from operator approved token list', async function () {
          await this.token.safeTransferFrom(owner, other, tokenId, { from: approved });
          expect(await this.token.getOperatorTokenIds(approved)).to.eql([secondTokenId]);
        });

        it('removes tokenId from operator approved token list', async function () {
          await this.token.safeTransferFrom(owner, other, secondTokenId, { from: owner });
          expect(await this.token.getOperatorTokenIds(approved)).to.eql([firstTokenId]);
        });
      })

      context('when owner is transferring', function () {
        beforeEach(async function () {
          await this.token.approve(approved, tokenId, { from: owner });
          await this.token.approve(approved, secondTokenId, { from: owner });
        });

        it('removes tokenId from operator approved token list', async function () {
          await this.token.safeTransferFrom(owner, other, tokenId, { from: owner });
          expect(await this.token.getOperatorTokenIds(approved)).to.eql([secondTokenId]);
        });

        it('removes tokenId from operator approved token list', async function () {
          await this.token.safeTransferFrom(owner, other, secondTokenId, { from: owner });
          expect(await this.token.getOperatorTokenIds(approved)).to.eql([firstTokenId]);
        });
      })
    });

    describe('approve', function () {
      const tokenId = firstTokenId;

      context('when clearing approval', function () {
        context('when there was a prior approval', function () {
          beforeEach(async function () {
            await this.token.approve(approved, tokenId, { from: owner });
            await this.token.approve(approved, secondTokenId, { from: owner });
            await this.token.approve(ZERO_ADDRESS, tokenId, { from: owner });
          });

          it('removes tokenId from operator approved token list', async function () {
            expect(await this.token.getOperatorTokenIds(approved)).to.eql([secondTokenId]);
          });
        });
      });

      context('when approving a non-zero address', function () {
        context('multiple times when there was no prior approval', function () {
          beforeEach(async function () {
            await this.token.approve(approved, tokenId, { from: owner });
            await this.token.approve(approved, secondTokenId, { from: owner });
          });

          it('adds tokens to operator approved token list', async function () {
            expect(await this.token.getOperatorTokenIds(approved)).to.eql([tokenId, secondTokenId]);
          });
        });

        context('when there was no prior approval', function () {
          beforeEach(async function () {
            await this.token.approve(approved, tokenId, { from: owner });
          });

          it('adds token to operator approved token list', async function () {
            expect(await this.token.getOperatorTokenIds(approved)).to.eql([tokenId]);
          });
        });

        context('when there was a prior approval to the same address', function () {
          beforeEach(async function () {
            await this.token.approve(approved, tokenId, { from: owner });
            await this.token.approve(approved, tokenId, { from: owner });
          });

          it('operator approved token list remains the same', async function () {
            expect(await this.token.getOperatorTokenIds(approved)).to.eql([tokenId]);
          });
        });

        context('when there was a prior approval to a different address', function () {
          beforeEach(async function () {
            await this.token.approve(anotherApproved, tokenId, { from: owner });
            await this.token.approve(anotherApproved, tokenId, { from: owner });
          });

          it('adds token to other operator approved token list', async function () {
            expect(await this.token.getOperatorTokenIds(anotherApproved)).to.eql([tokenId]);
          });

          it('operator approved token list remains empty', async function () {
            expect(await this.token.getOperatorTokenIds(approved)).to.eql([]);
          });
        });
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeERC721ApprovalEnumerable,
};
