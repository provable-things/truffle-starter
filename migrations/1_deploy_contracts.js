var DieselPrice = artifacts.require("DieselPrice.sol");
var YoutubeViews = artifacts.require("YoutubeViews.sol");
var usingOraclize = artifacts.require("usingOraclize.sol");

module.exports = function(deployer) {
    deployer.deploy(DieselPrice);
    deployer.deploy(YoutubeViews);
    deployer.deploy(usingOraclize);
};