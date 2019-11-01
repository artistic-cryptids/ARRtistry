const { toBN } = web3.utils;
const { constants, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

function shouldBehaveLikeERC721ApprovalEnumerable (
  minter,
  [owner, approved, anotherApproved, other],
) {
  const firstTokenId = toBN(1);
  const secondTokenId = toBN(2);

  describe('like an ERC721ApprovalEnumerable', function () {
    beforeEach(async function () {
      await this.token.mockMint(owner, firstTokenId, { from: minter });
      await this.token.mockMint(owner, secondTokenId, { from: minter });
      this.toWhom = other; // default to anyone for toWhom in context-dependent tests
    });

    describe('getOperatorTokenIds', function () {
      context('when attempting to get operator token ids for zero address', function () {
        it('reverts', async function () {
          await expectRevert(
            this.token.getOperatorTokenIds(ZERO_ADDRESS, { from: owner }),
            'ERC721ApprovalEnumerable: operator token ids query for the zero address',
          );
        });
      });
    });

    describe('approve', function () {
      const otherAccountsApprovedTokenListRemainsEmpty = function (otherUsers) {
        it('other accounts\' approved token list remain empty', async function () {
          for (const otherUser of otherUsers) {
            expect(await this.token.getOperatorTokenIds(otherUser)).to.eql([]);
          }
        });
      };

      context('when clearing approval (approving a zero address)', function () {
        context('when there was no prior approval', function () {
          beforeEach(async function () {
            await this.token.approve(ZERO_ADDRESS, firstTokenId, { from: owner });
          });

          otherAccountsApprovedTokenListRemainsEmpty([owner, approved, anotherApproved, other]);
        });

        context('when there were prior approvals', function () {
          beforeEach(async function () {
            await this.token.approve(approved, firstTokenId, { from: owner });
            await this.token.approve(approved, secondTokenId, { from: owner });
            await this.token.approve(ZERO_ADDRESS, firstTokenId, { from: owner });
          });

          it('removes specified token id from approved token list', async function () {
            expect(await this.token.getOperatorTokenIds(approved)).to.eql([secondTokenId]);
          });
          otherAccountsApprovedTokenListRemainsEmpty([owner, anotherApproved, other]);

          it('can remove the last token id from approved token list', async function () {
            await this.token.approve(ZERO_ADDRESS, secondTokenId, { from: owner });
            expect(await this.token.getOperatorTokenIds(approved)).to.eql([]);
          });
        });
      });

      context('when approving a non-zero address', function () {
        beforeEach(async function () {
          await this.token.approve(approved, firstTokenId, { from: owner });
        });

        it('adds token to operator approved token list', async function () {
          expect(await this.token.getOperatorTokenIds(approved)).to.eql([firstTokenId]);
        });
        otherAccountsApprovedTokenListRemainsEmpty([owner, anotherApproved, other]);
      });

      context('when approving multiple tokens to the same non-zero address', function () {
        beforeEach(async function () {
          await this.token.approve(approved, firstTokenId, { from: owner });
          await this.token.approve(approved, secondTokenId, { from: owner });
        });

        it('adds tokens to operator approved token list', async function () {
          expect(await this.token.getOperatorTokenIds(approved)).to.eql([firstTokenId, secondTokenId]);
        });
        otherAccountsApprovedTokenListRemainsEmpty([owner, anotherApproved, other]);
      });

      context('when approving the same token multiple times to the same non-zero address', function () {
        beforeEach(async function () {
          await this.token.approve(approved, firstTokenId, { from: owner });
          await this.token.approve(approved, firstTokenId, { from: owner });
        });

        it('duplicate tokens are not added to operator approved token list', async function () {
          expect(await this.token.getOperatorTokenIds(approved)).to.eql([firstTokenId]);
        });
        otherAccountsApprovedTokenListRemainsEmpty([owner, anotherApproved, other]);
      });

      context('when approving the same token to different addresses', function () {
        beforeEach(async function () {
          await this.token.approve(approved, firstTokenId, { from: owner });
          await this.token.approve(anotherApproved, firstTokenId, { from: owner });
        });

        it('most recently approved operator\'s approved token list contains the specified token', async function () {
          expect(await this.token.getOperatorTokenIds(anotherApproved)).to.eql([firstTokenId]);
        });
        otherAccountsApprovedTokenListRemainsEmpty([owner, approved, other]);
      });
    });

    describe('transfers', function () {
      beforeEach(async function () {
        await this.token.approve(approved, firstTokenId, { from: owner });
        await this.token.approve(approved, secondTokenId, { from: owner });
      });

      context('transferFrom', function () {
        context('when approved is transferring', function () {
          it('removes token id from operator approved token list', async function () {
            await this.token.transferFrom(owner, other, firstTokenId, { from: approved });
            expect(await this.token.getOperatorTokenIds(approved)).to.eql([secondTokenId]);
          });
        });

        context('when owner is transferring', function () {
          it('removes token id from operator approved token list', async function () {
            await this.token.transferFrom(owner, other, firstTokenId, { from: owner });
            expect(await this.token.getOperatorTokenIds(approved)).to.eql([secondTokenId]);
          });
        });
      });

      context('safeTransferFrom', function () {
        context('when approved is transferring', function () {
          it('removes token id from operator approved token list', async function () {
            await this.token.safeTransferFrom(owner, other, firstTokenId, { from: approved });
            expect(await this.token.getOperatorTokenIds(approved)).to.eql([secondTokenId]);
          });
        });

        context('when owner is transferring', function () {
          it('removes token id from operator approved token list', async function () {
            await this.token.safeTransferFrom(owner, other, firstTokenId, { from: owner });
            expect(await this.token.getOperatorTokenIds(approved)).to.eql([secondTokenId]);
          });
        });
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeERC721ApprovalEnumerable,
};
