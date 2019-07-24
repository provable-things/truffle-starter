const contracts = [ artifacts.require('./EthPrice.sol') ]

module.exports = _deployer =>
  contracts.map(_contract =>
    _deployer.deploy(_contract))
