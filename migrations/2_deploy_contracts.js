const contracts = [
  artifacts.require('./DieselPrice.sol'),
  artifacts.require('./YoutubeViews.sol'),
  artifacts.require('./usingOraclize.sol')
]

module.exports = deployer => 
  contracts.map(contract => 
      deployer.deploy(contract))