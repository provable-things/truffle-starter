const contracts = [
  artifacts.require('./usingProvable'),
  artifacts.require('./DieselPrice.sol')
]

module.exports = deployer =>
  contracts.map(contract =>
    deployer.deploy(contract))
