pragma solidity ^0.4.24;

import "./oraclize/usingOraclize.sol";

contract DieselPrice is usingOraclize {

    uint public dieselPriceUSD;

    event LogNewDieselPrice(string price);
    event LogNewOraclizeQuery(string description);

    function DieselPrice() {
        update(); // first check at contract creation
    }

    function __callback(bytes32 myid, string result) {
        require(msg.sender == oraclize_cbAddress(), 'Caller is not Oraclize!');
        emit LogNewDieselPrice(result);
        dieselPriceUSD = parseInt(result, 2); // let's save it as $ cents
        // ...Do something with the USD Diesel price...
    }

    function update() payable {
        emit LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        oraclize_query("URL", "xml(https://www.fueleconomy.gov/ws/rest/fuelprices).fuelPrices.diesel");
    }

}