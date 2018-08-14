const {waitForEvent, PREFIX} = require('./utils')
    , youTubeViews = artifacts.require('YoutubeViews.sol')
    , diesel       = artifacts.require('./DieselPrice.sol')

contract('Solidity Contract Tests', () => {

  describe(`Diesel Price Tests`, async () => {

    let contractPrice

    it('Should have logged a new Oraclize query', async () => {
      const {contract} = await diesel.deployed()
          , {args:{description}} = await waitForEvent(contract.LogNewOraclizeQuery({}, {fromBlock: 0, toBlock: 'latest'}))
      assert.equal(description, 'Oraclize query was sent, standing by for the answer..', 'Oraclize query incorrectly logged!')
    })

    it('Callback should have logged a new diesel price', async () => {
      const {contract}     = await diesel.deployed()
          , {args:{price}} = await waitForEvent(contract.LogNewDieselPrice({}, {fromBlock: 0, toBlock: 'latest'}))
      contractPrice = price * 100 // let's save it as $ cents
      assert.notEqual(price, 0, 'A price should have been retrieved from Oraclize call!')
    })

    it('Should set diesel price correctly in contract', async () => {
      const {contract}   = await diesel.deployed()
          , queriedPrice = await contract.dieselPriceUSD.call()
      assert.equal(contractPrice, queriedPrice.toNumber(), 'Contract\'s diesel price not set correctly!')
    })

    it('Should revert on second query attempt due to lack of funds', async () => {
      const contract = await diesel.deployed()
          , expErr   = 'revert'
      try {
        await contract.update()
        assert.fail('Update transaction should not have succeeded!')
      } catch (e) {
        assert.isTrue(e.message.startsWith(`${PREFIX}${expErr}`), `Expected ${expErr} but got ${e.message} instead!`)
      }
    })
  })

  describe(`YouTube View Tests`, async () => {

    let views

    it('Should have logged a new Oraclize query', async () => {
      const {contract} = await youTubeViews.deployed()
          , {args:{description}} = await waitForEvent(contract.LogNewOraclizeQuery({}, {fromBlock: 0, toBlock: 'latest'}))
      assert.equal(description, 'Oraclize query was sent, standing by for the answer..', 'Oraclize query incorrectly logged!')
    })
  
    it('Callback should have logged a new YouTube views event', async () => {
      const {contract} = await youTubeViews.deployed()
          , viewsLog   = await waitForEvent(contract.LogNewYoutubeViewsCount({}, {fromBlock: 0, toBlock: 'latest'}))
      views = viewsLog.args.views
      assert.equal(viewsLog.event, 'LogNewYoutubeViewsCount', 'Wrong event emitted for YouTube views event!')
    })
  
    it('Should store YouTube views correctly in contract', async () => {
      const {contract}   = await youTubeViews.deployed()
          , queriedViews = await contract.viewsCount.call()
      assert.equal(views, queriedViews, 'Contract\'s YouTube views not set correctly!')
    })
  
    it('Should revert on second query attempt due to lack of funds', async () => {
      const contract = await youTubeViews.deployed()
          , expErr   = 'revert'
      try {
        await contract.update()
        assert.fail('Update transaction should not have succeeded!')
      } catch (e) {
        assert.isTrue(e.message.startsWith(`${PREFIX}${expErr}`), `Expected ${expErr} but got ${e.message} instead!`)
      }
    })
  })
})