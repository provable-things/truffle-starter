const contracts = [
  artifacts.require('./usingOraclize'),
  artifacts.require('./DieselPrice.sol')
]

module.exports = deployer =>
  contracts.map(contract =>
      deployer.deploy(contract))
