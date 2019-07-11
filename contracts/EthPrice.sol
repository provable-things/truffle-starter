pragma solidity 0.5.0;

import "./provableAPI.sol";

contract EthPrice is usingProvable {

    uint public dieselPriceUSD;

    event LogNewDieselPrice(string _price);
    event LogNewProvableQuery(string _description);

    constructor()
        public
    {
        fetchDieselPriveViaProvable();
    }

    function __callback(bytes32 _queryID, string memory _result)
        public
    {
        require(msg.sender == provable_cbAddress());
        emit LogNewDieselPrice(_result);
        dieselPriceUSD = parseInt(_result, 2); // Let's save it as cents...
    }

    function fetchDieselPriveViaProvable()
        public
        payable
    {
        emit LogNewProvableQuery("Provable query was sent, standing by for the answer...");
        provable_query("URL", "xml(https://www.fueleconomy.gov/ws/rest/fuelprices).fuelPrices.diesel");
    }
}
