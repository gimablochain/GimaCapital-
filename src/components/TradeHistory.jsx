import React from 'react';

const TradeHistory = ({ isDarkMode, tradeHistory, showTradeDetails, setShowTradeDetails, clearTradeHistory, formatUnits }) => {
  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Trade History</h2>
        <button
          onClick={clearTradeHistory}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>
      <div className="space-y-2">
        {tradeHistory.length === 0 ? (
          <p>No trades yet.</p>
        ) : (
          tradeHistory.map((trade, index) => (
            <div
              key={index}
              className="p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setShowTradeDetails(trade)}
            >
              <p>Trade {index + 1}: {formatUnits(trade.amount)} ETH</p>
            </div>
          ))
        )}
      </div>
      {showTradeDetails && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-md font-semibold">Trade Details</h3>
          <p>Amount: {formatUnits(showTradeDetails.amount)} ETH</p>
          <button
            onClick={() => setShowTradeDetails(null)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeHistory;