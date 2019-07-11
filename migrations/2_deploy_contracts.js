const contracts = [
  artifacts.require('./EthPrice.sol'),
  artifacts.require('./usingProvable')
]

module.exports = deployer =>
  contracts.map(contract =>
    deployer.deploy(contract))
