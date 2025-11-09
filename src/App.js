import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function TokenInfoApp() {
  const [address, setAddress] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTokenInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://api.dexscreener.io/latest/dex/tokens/${address}`);
      const data = await res.json();
      if (!data.pairs || data.pairs.length === 0) {
        setError('❌ Token not found or invalid address');
      } else {
        setTokenData(data.pairs[0]);
      }
    } catch (err) {
      setError('⚠️ Failed to fetch token info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white flex flex-col items-center justify-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        💰 Token Info Mini App
      </motion.h1>

      <div className="flex gap-3 mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter Contract Address (CA)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-1 p-3 rounded-xl text-black outline-none"
        />
        <button
          onClick={fetchTokenInfo}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white"
        >
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {tokenData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-purple-300">
              {tokenData.baseToken.symbol}
            </h2>
            <p>
              💵 <strong>Price:</strong> $
              {parseFloat(tokenData.priceUsd).toFixed(6)}
            </p>
            <p>
              📈 <strong>Market Cap:</strong> $
              {tokenData.fdv ? tokenData.fdv.toLocaleString() : 'N/A'}
            </p>
            <p>
              📊 <strong>24h Volume:</strong> $
              {tokenData.volume?.h24
                ? tokenData.volume.h24.toLocaleString()
                : 'N/A'}
            </p>
            <p>
              💧 <strong>Liquidity:</strong> $
              {tokenData.liquidity?.usd
                ? tokenData.liquidity.usd.toLocaleString()
                : 'N/A'}
            </p>
            <p>
              🌐 <strong>DEX:</strong> {tokenData.dexId}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
