const Web3 = require('web3')
const { waitForEvent } = require('./utils')
const ethPriceContract = artifacts.require('./EthPrice.sol')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:9545'))

contract('Eth Price Tests', ([ owner ]) => {

  let contractPrice
  let contractEvents
  let contractMethods

  const GAS_LIMIT = 3e6

  it('Should get contract instantiation for listening to events', async () => {
    const { contract } = await ethPriceContract.deployed()
    const { methods, events } = new web3.eth.Contract(
      contract._jsonInterface,
      contract._address
    )
    contractEvents = events
    contractMethods = methods
  })

  it('Should have logged a new Provable query', async () => {
    const {
      returnValues: {
        _description
      }
    } = await waitForEvent(contractEvents.LogNewProvableQuery)

    assert.strictEqual(
      _description,
      'Provable query was sent, standing by for the answer...',
      'Provable query incorrectly logged!'
    )
  })

  it('Callback should have logged a new diesel price', async () => {
    const {
      returnValues: {
        _price
      }
    } = await waitForEvent(contractEvents.LogNewDieselPrice)
    contractPrice = _price * 100
    assert.isAbove(
      parseInt(_price),
      0,
      'A price should have been retrieved from Provable call!'
    )
  })

  it('Should set diesel price correctly in contract', async () => {
    const queriedPrice = await contractMethods
      .dieselPriceUSD()
      .call()
    assert.equal(
      contractPrice,
      queriedPrice,
      'Contract\'s diesel price not set correctly!'
    )
  })

  it('Should revert on second query attempt due to lack of funds', async () => {
    const expectedError = 'revert'
    try {
      await contractMethods
        .fetchDieselPriveViaProvable()
        .send({
          from: owner,
          gas: GAS_LIMIT
        })
      assert.fail('Update transaction should not have succeeded!')
    } catch (e) {
      assert.isTrue(
        e.message.includes(expectedError),
        `Expected ${expectedError} but got ${e.message} instead!`
      )
    }
  })
})
