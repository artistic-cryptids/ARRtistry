const { toBN } = web3.utils;
const { expect } = require('chai');
const { expectRevert } = require('@openzeppelin/test-helpers');

const Governance = artifacts.require('Governance');
const MockTarget = artifacts.require('MockTarget');

contract('Governance', async accounts => {
  const moderator = accounts[1];
  const proposer = accounts[2];
  const notProposerOrModerator = accounts[3];

  const PROPOSAL_ID = toBN(0);

  let governance;
  before(async () => {
    governance = await Governance.deployed();
  });

  describe('propose', async () => {
    let target;
    let proposal;
    let data;

    before(async () => {
      target = await MockTarget.new();
      data = await target.data();
      await governance.propose(target.address, data, { from: proposer });
      proposal = await governance.getProposal(PROPOSAL_ID);
    });

    it('proposal should not be finalized', async () => {
      expect(parseInt(proposal[0])).to.equal(2);
    });

    it('proposal should have the correct target', async () => {
      expect(proposal[1]).to.equal(target.address);
    });

    it('proposal should have the correct data', async () => {
      expect(proposal[2]).to.equal(data);
    });

    it('proposal should have the correct proposer', async () => {
      expect(proposal[3]).to.equal(proposer);
    });
  });

  describe('reject', async () => {
    let proposalId;
    let proposal;

    beforeEach(async () => {
      const target = await MockTarget.new();
      const data = await target.data();
      proposalId = await governance.propose.call(target.address, data, { from: proposer });
      await governance.propose(target.address, data, { from: proposer });
      proposal = await governance.getProposal(proposalId);
    });

    it('should revert if proposal is not pending', async () => {
      await governance.reject(proposalId, { from: proposer });
      return expectRevert(governance.reject(proposalId, { from: proposer }),
        'Governance::reject: Proposal is already finalized',
      );
    });

    it('should revert if not moderator or proposer', async () => {
      return expectRevert(governance.reject(proposalId, { from: notProposerOrModerator }),
        'Governance::reject: Only the proposer or moderator can reject a proposal',
      );
    });

    it('should not revert if is moderator', async () => {
      await governance.reject(proposalId, { from: moderator });
    });

    it('should not revert if is proposer', async () => {
      await governance.reject(proposalId, { from: proposer });
    });

    it('should set the proposal status to rejected', async () => {
      await governance.reject(proposalId, { from: proposer });
      proposal = await governance.getProposal(proposalId);
      expect(parseInt(proposal[0])).to.equal(1); ;
    });
  });

  describe('approve', async () => {
    context('with a valid proposition', async () => {
      let proposalId;
      let target;
      let proposal;

      beforeEach(async () => {
        target = await MockTarget.new();
        const data = await target.data();
        proposalId = await governance.propose.call(target.address, data, { from: proposer });
        await governance.propose(target.address, data, { from: proposer });
        proposal = await governance.getProposal(proposalId);
      });

      it('should revert if proposal is not pending', async () => {
        await governance.approve(proposalId, { from: moderator });
        return expectRevert(governance.approve(proposalId, { from: moderator }),
          'Governance::approve: Proposal is already finalized',
        );
      });

      it('should revert if not moderator or proposer', async () => {
        return expectRevert(governance.approve(proposalId, { from: notProposerOrModerator }),
          'Only a moderator can do this',
        );
      });

      it('should not revert if is moderator', async () => {
        await governance.approve(proposalId, { from: moderator });
      });

      it('should revert if is proposer', async () => {
        await expectRevert(governance.approve(proposalId, { from: proposer }),
          'Only a moderator can do this',
        );
      });

      it('should set the proposal status to approved', async () => {
        await governance.approve(proposalId, { from: moderator });
        proposal = await governance.getProposal(proposalId);
        expect(parseInt(proposal[0])).to.equal(0); ;
      });

      it('should execute the proposal', async () => {
        await governance.approve(proposalId, { from: moderator });
        const value = await target.value();
        expect(value.toString()).to.be.equal('42');
      });
    });

    describe('isGovernor', async () => {
      it('should return false if not account not approved governor', async () => {
        const result = await governance.isGovernor(accounts[9]);
        expect(result).to.be.equal(false);
      });

      it('should return true if account approved governor', async () => {
        const result = await governance.isGovernor(moderator);
        expect(result).to.be.equal(true);
      });
    });

    describe('getProposals', async () => {
      let data;
      let target;
      beforeEach(async () => {
        target = await MockTarget.new();
        data = await target.data();
        governance = await Governance.new({ from: moderator });
      });

      it('should return empty list for no proposals', async () => {
        const proposalIds = await governance.getProposals();
        expect(proposalIds).to.eql([]);
      });

      it('should return list of pending proposals', async () => {
        await governance.propose(target.address, data, { from: proposer });
        await governance.propose(target.address, data, { from: proposer });
        await governance.propose(target.address, data, { from: proposer });

        const proposalIds = await governance.getProposals();
        expect(proposalIds).to.eql([toBN(0), toBN(1), toBN(2)]);
      });

      it('should ignore accepted/rejected proposals', async () => {
        await governance.propose(target.address, data, { from: proposer });
        await governance.propose(target.address, data, { from: proposer });
        await governance.propose(target.address, data, { from: proposer });

        await governance.approve(0, { from: moderator });
        await governance.reject(1, { from: moderator });

        const proposalIds = await governance.getProposals();
        expect(proposalIds).to.eql([toBN(2)]);
      });
    });

    describe('getARRs', async () => {
      let from;
      let to;
      let tokenId;
      let price;
      let location = "location";

      beforeEach(async () => {
        from = await MockTarget.new();
        to = await MockTarget.new();
        tokenId = toBN(1);
        price = toBN(1001);
        governance = await Governance.new({ from: moderator });
      });

      it('should return zero length for no ARRs', async () => {
        const arrLen = await governance.getARRLength();
        expect(arrLen).to.eql(toBN(0));
      });

      it('should be able to record ARRs', async () => {
        await governance.recordARR(from.address, to.address, tokenId, price, location);
        await governance.recordARR(from.address, to.address, tokenId, price, location);
        await governance.recordARR(from.address, to.address, tokenId, price, location);

        const arrLen = await governance.getARRLength();
        expect(arrLen).to.eql(toBN(3));
      });
    });
  });
}); // end Registry contract
