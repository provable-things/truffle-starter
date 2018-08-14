pragma solidity ^0.4.0;

import "./oraclize/usingOraclize.sol";

contract YoutubeViews is usingOraclize {

    string public viewsCount;

    event LogNewYoutubeViewsCount(string views);
    event LogNewOraclizeQuery(string description);

    function YoutubeViews() {
        update();
    }

    function __callback(bytes32 myid, string result) {
        require(msg.sender == oraclize_cbAddress(), 'Caller is not Oraclize!');
        viewsCount = result;
        emit LogNewYoutubeViewsCount(viewsCount);
        // ...Do something with viewsCount, like maybe tipping the author if viewsCount > X...?
    }

    function update() payable {
        emit LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        oraclize_query('URL', 'html(https://www.youtube.com/watch?v=9bZkp7q19f0).xpath(//*[contains(@class, "watch-view-count")]/text())');
    }

}