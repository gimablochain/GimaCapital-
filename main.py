
# from quart import Quart, jsonify, request
# import pandas as pd 
# import numpy as np
# import sys
# sys.modules['numpy.NaN'] = np.nan  
# import pandas_ta as ta
# import joblib
# import ccxt
# from quart_cors import cors
# import os
# from dotenv import load_dotenv
# import traceback
# import logging
# from datetime import datetime, timedelta
# import time
# import asyncio
# import openai



# # Load environment variables from .env file
# load_dotenv()
# # Load OpenAI API key from .env
# openai.api_key = os.getenv("OPENAI_API_KEY")
# # Initialize logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Initialize Quart app with CORS
# app = Quart(__name__)
# app = cors(app, allow_origin="*")

# def initialize_exchange():
#     api_key = os.getenv('BYBIT_API_KEY')
#     api_secret = os.getenv('BYBIT_SECRET')
    
#     if not api_key or not api_secret:
#         logger.error("Bybit API credentials not found in environment variables")
#         raise ValueError("API credentials are required to initialize the exchange.")
    
#     return ccxt.bybit({
#         'enableRateLimit': True,
#         'options': {
#             'defaultType': 'spot',
#             'adjustForTimeDifference': True,
#         },
#         'timeout': 30000,
#         'apiKey': api_key,
#         'secret': api_secret,
#     })

# exchange = initialize_exchange()

# async def fetch_current_price(symbol):
#     try:
#         formatted_symbol = symbol.replace("/", "")
#         ticker = await asyncio.get_event_loop().run_in_executor(None, exchange.fetch_ticker, formatted_symbol)
#         return ticker['last']  # Return the last price
#     except Exception as e:
#         logger.error(f"Error fetching current price for {symbol}: {e}")
#         traceback.print_exc()
#         return None

# async def fetch_current_market_data(symbol, timeframe):
#     try:
#         await asyncio.get_event_loop().run_in_executor(None, exchange.load_markets)
        
#         current_time = int(time.time() * 1000)
        
#         if timeframe.endswith('m'):
#             minutes = int(timeframe[:-1])
#             start_time = current_time - (minutes * 60 * 1000 * 250)  # 250 periods
#         elif timeframe.endswith('h'):
#             hours = int(timeframe[:-1])
#             start_time = current_time - (hours * 60 * 60 * 1000 * 250)
        
#         formatted_symbol = symbol.replace("/", "")
        
#         loop = asyncio.get_event_loop()
#         ohlcv = await loop.run_in_executor(
#             None, 
#             lambda: exchange.fetch_ohlcv(formatted_symbol, timeframe, since=start_time, limit=250)
#         )
        
#         if not ohlcv:
#             logger.warning(f"No current OHLCV data returned for {symbol}")
#             return pd.DataFrame()
            
#         df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
#         df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        
#         logger.info(f"Fetched market data for {symbol}: {df.shape[0]} rows")
#         return df
#     except Exception as e:
#         logger.error(f"Error fetching current data for {symbol}: {e}")
#         traceback.print_exc()
#         return pd.DataFrame()
    
# def add_features(df):
#     if df.empty or 'close' not in df.columns:
#         logger.warning("DataFrame is empty or missing 'close' column.")
#         return df

#     try:
#         df['SMA_50'] = ta.sma(df['close'], length=50)
#         df['SMA_200'] = ta.sma(df['close'], length=200)
#         df['EMA_50'] = ta.ema(df['close'], length=50)
#         df['EMA_200'] = ta.ema(df['close'], length=200)
#         df['RSI'] = ta.rsi(df['close'], length=14)

#         # Calculate Stochastic RSI
#         stochrsi = ta.stochrsi(df['close'], length=14)
        
#         # Check if the expected columns exist
#         if 'STOCHRSIk_14_14_3_3' in stochrsi.columns and 'STOCHRSId_14_14_3_3' in stochrsi.columns:
#             df['StochRSI_K'] = stochrsi['STOCHRSIk_14_14_3_3']
#             df['StochRSI_D'] = stochrsi['STOCHRSId_14_14_3_3']
#         else:
#             logger.error("Stochastic RSI calculation did not return expected columns.")
#             logger.error(f"Returned columns: {stochrsi.columns}")
#             return df  # Return early if columns are missing

#         df['ROC'] = ta.roc(df['close'], length=12)

#         bb = ta.bbands(df['close'], length=20)
#         df['BB_upper'] = bb['BBU_20_2.0']
#         df['BB_middle'] = bb['BBM_20_2.0']
#         df['BB_lower'] = bb['BBL_20_2.0']

#         macd = ta.macd(df['close'])
#         df['MACD'] = macd['MACD_12_26_9']
#         df['MACD_signal'] = macd['MACDs_12_26_9']
#         df['MACD_hist'] = macd['MACDh_12_26_9']

#         df['VMA'] = ta.sma(df['volume'], length=20)
#         df['OBV'] = ta.obv(df['close'], df['volume'])

#         df.dropna(inplace=True)

#         if not df.empty:
#             df = df.tail(1)

#         return df

#     except Exception as e:
#         logger.error(f"Error calculating technical indicators: {e}")
#         traceback.print_exc()
#         return df
    

   

# async def generate_insights_with_openai(market_data):
#     """
#     Generate insights and recommendations using OpenAI's GPT model.
#     """
#     try:
#         # Prepare the prompt for OpenAI
#         prompt = f"""
#         Analyze the following market data and provide actionable insights, summarize market trends, and recommend trading actions (Buy, Sell, Hold):
#         - Symbol: {market_data['symbol']}
#         - Current Price: {market_data['current_price']}
#         - RSI: {market_data['RSI']}
#         - MACD: {market_data['MACD']}
#         - SMA_50: {market_data['SMA_50']}
#         - SMA_200: {market_data['SMA_200']}
#         - Volume: {market_data['volume']}
#         - Bollinger Bands: Upper={market_data['BB_upper']}, Middle={market_data['BB_middle']}, Lower={market_data['BB_lower']}
#         - Stochastic RSI: K={market_data['StochRSI_K']}, D={market_data['StochRSI_D']}
#         - ROC: {market_data['ROC']}
#         - OBV: {market_data['OBV']}
#         - VMA: {market_data['VMA']}
#         - MACD Histogram: {market_data['MACD_hist']}

#         Provide a concise summary of the market trend, key insights, and a recommended action (Buy, Sell, Hold) with reasoning.
#         """

#         # Call OpenAI API
#         response = openai.ChatCompletion.create(
#             model="gpt-4",  # Use GPT-4 or GPT-3.5-turbo
#             messages=[
#                 {"role": "system", "content": "You are a financial analyst specializing in cryptocurrency trading."},
#                 {"role": "user", "content": prompt}
#             ],
#             max_tokens=500,  # Limit response length
#             temperature=0.7  # Control creativity (0 = deterministic, 1 = creative)
#         )

#         # Extract the generated insights
#         insights = response.choices[0].message['content']
#         return insights

#     except Exception as e:
#         logger.error(f"Error generating insights with OpenAI: {e}")
#         traceback.print_exc()
#         return "Unable to generate insights at this time."


# async def analyze_current_signals(symbol, timeframe, leverage=1):
#     try:
#         start_time = time.time()
#         logger.info(f"Analyzing current signals for {symbol}")
        
#         # Fetch current market data
#         df = await fetch_current_market_data(symbol, timeframe)
#         if df.empty:
#             logger.warning(f"No market data for {symbol}.")
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

#         # Add features for analysis
#         df = add_features(df)
#         logger.info(f"DataFrame after adding features for {symbol}: {df}")
        
#         # Handle missing values
#         if df.isnull().values.any():
#             logger.warning(f"DataFrame contains NaN values for {symbol}.")
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

#         # Fetch the current price
#         current_price = await fetch_current_price(symbol)
#         if current_price is None:
#             logger.warning(f"Could not fetch current price for {symbol}.")
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

#         # Extract the last row for analysis
#         last_row = df.iloc[-1]
#         logger.info(f"Last row indicators for {symbol}: {last_row.to_dict()}")

#         # Define buy/sell conditions
#         buy_conditions = [
#             last_row['close'] > last_row['SMA_50'],
#             last_row['RSI'] < 70,
#             last_row['MACD'] > last_row['MACD_signal'],
#             last_row['StochRSI_K'] > last_row['StochRSI_D'],
#             last_row['ROC'] > 0
#         ]
#         sell_conditions = [
#             last_row['close'] < last_row['SMA_50'],
#             last_row['RSI'] > 30,
#             last_row['MACD'] < last_row['MACD_signal'],
#             last_row['StochRSI_K'] < last_row['StochRSI_D'],
#             last_row['ROC'] < 0
#         ]

#         buy_count = sum(buy_conditions)
#         sell_count = sum(sell_conditions)
#         threshold = 3
#         total_conditions = len(buy_conditions)  # NEW: Total number of conditions

#         # NEW: Confidence calculation logic
#         def get_confidence_level(count):
#             confidence_percent = (count / total_conditions) * 100
#             if confidence_percent >= 75:
#                 return "high", confidence_percent
#             elif confidence_percent >= 50:
#                 return "medium", confidence_percent
#             else:
#                 return "low", confidence_percent

#         # Determine signal and confidence
#         signal = "Hold"
#         confidence = "low"  # NEW: Default confidence for "Hold"
#         confidence_percent = 0.0  # NEW: Confidence percentage

#         if buy_count >= threshold:
#             signal = "Buy"
#             confidence, confidence_percent = get_confidence_level(buy_count)  # NEW
#         elif sell_count >= threshold:
#             signal = "Sell"
#             confidence, confidence_percent = get_confidence_level(sell_count)  # NEW

#               # NEW: Generate insights using OpenAI
#         market_data = {
#             "symbol": symbol,
#             "current_price": current_price,
#             "RSI": last_row['RSI'],
#             "MACD": last_row['MACD'],
#             "SMA_50": last_row['SMA_50'],
#             "SMA_200": last_row['SMA_200'],
#             "volume": last_row['volume'],
#             "BB_upper": last_row['BB_upper'],
#             "BB_middle": last_row['BB_middle'],
#             "BB_lower": last_row['BB_lower'],
#             "StochRSI_K": last_row['StochRSI_K'],
#             "StochRSI_D": last_row['StochRSI_D'],
#             "ROC": last_row['ROC'],
#             "OBV": last_row['OBV'],
#             "VMA": last_row['VMA'],
#             "MACD_hist": last_row['MACD_hist']
#         }
#         insights = await generate_insights_with_openai(market_data)


#         trade_opportunities = []

#         if signal in ["Buy", "Sell"]:
#             trade_size_dollars = 20
#             trade_size_asset = trade_size_dollars / current_price
#             exit_price = current_price * (1 + (0.02 if signal == "Buy" else -0.02))
#             potential_profit_without_leverage = abs(exit_price - current_price) * trade_size_asset
#             potential_profit_with_leverage = potential_profit_without_leverage * leverage

#             trade_opportunities.append({
#                 "symbol": symbol.replace("/", ""),
#                 "action": signal,
#                 "current_price": round(current_price, 2),
#                 "risk_reward_ratio": 2.0,
#                 "confidence": confidence,  # NEW: Dynamic confidence
#                 "confidence_percent": round(confidence_percent, 2),  # NEW: Added percentage
#                 "entry_time": datetime.now().isoformat(),
#                 "exit_time": (datetime.now() + timedelta(minutes=15)).isoformat(),
#                 "trade_size_dollars": trade_size_dollars,
#                 "trade_size_asset": round(trade_size_asset, 6),
#                 "entry_price": round(current_price, 2),
#                 "exit_price": round(exit_price, 2),
#                 "leverage": leverage,
#                 "potential_profit_without_leverage": round(potential_profit_without_leverage, 2),
#                 "potential_profit_with_leverage": round(potential_profit_with_leverage, 2),
#                 "indicators": {
#                     "RSI": round(last_row['RSI'], 2),
#                     "MACD_hist": round(last_row['MACD_hist'], 4),
#                     "StochRSI": f"{round(last_row['StochRSI_K'], 2)}/{round(last_row['StochRSI_D'], 2)}",
#                     "SMA_crossover": f"Price {round(last_row['close'], 2)} vs SMA50 {round(last_row['SMA_50'], 2)}",
#                     "insights": insights,  # NEW: Include OpenAI-generated insights
#                 }
#             })
#         else:
#             # NEW: Updated Hold signal with dynamic confidence
#             trade_opportunities.append({
#                 "symbol": symbol.replace("/", ""),
#                 "action": "Hold",
#                 "current_price": round(current_price, 2),
#                 "confidence": confidence,  # Now "low" instead of "Hold"
#                 "confidence_percent": round(confidence_percent, 2),  # NEW
#                 "indicators": {
#                     "RSI": round(last_row['RSI'], 2),
#                     "MACD_hist": round(last_row['MACD_hist'], 4),
#                     "StochRSI": f"{round(last_row['StochRSI_K'], 2)}/{round(last_row['StochRSI_D'], 2)}",
#                     "SMA_crossover": f"Price {round(last_row['close'], 2)} vs SMA50 {round(last_row['SMA_50'], 2)}",
#                     "insights": insights,  # NEW: Include OpenAI-generated insights
#                 }
#             })

#         analysis_time = time.time() - start_time
#         logger.info(f"Analysis completed for {symbol} in {analysis_time:.2f}s")
#         return trade_opportunities, analysis_time

#     except Exception as e:
#         logger.error(f"Error analyzing current signals for {symbol}: {str(e)}")
#         traceback.print_exc()
#         return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0
 

# @app.route('/api/trades', methods=['POST'])
# async def trades():
#     try:
#         data = await request.json
#         symbols = data.get('symbols', ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'])
#         timeframe = data.get('timeframe', ' 15m')
#         leverage = int(data.get('leverage', 1))
        
#         logger.info(f"Processing current trade request for symbols: {symbols}")
        
#         all_trades = {}
#         analysis_times = {}
#         for symbol in symbols:
#             symbol_without_slash = symbol.replace("/", "")
#             trades, analysis_time = await analyze_current_signals(symbol, timeframe, leverage)
#             logger.info(f"Current trades for {symbol}: {trades}")
#             all_trades[symbol_without_slash] = trades
#             analysis_times[symbol_without_slash] = analysis_time
        
#         return jsonify({"trades": all_trades, "analysis_times": analysis_times})
#     except Exception as e:
#         logger.error(f"Error processing trade request: {e}")
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5000)

# from quart import Quart, jsonify, request
# import pandas as pd 
# import numpy as np
# import sys
# sys.modules['numpy.NaN'] = np.nan  
# import pandas_ta as ta
# import ccxt
# import httpx 
# from quart_cors import cors
# import os
# from dotenv import load_dotenv
# import traceback
# import logging
# from datetime import datetime, timedelta
# import time
# import asyncio
# from openai import OpenAI, RateLimitError
# from functools import lru_cache
# import json

# # Load environment variables from .env file
# load_dotenv()

# # Initialize logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Initialize Quart app with CORS
# app = Quart(__name__)
# app = cors(app, allow_origin="*")

# HF_API_KEY = os.getenv("HF_API_KEY")
# HF_MODEL_ID = "EleutherAI/gpt-neo-125M"  # Change to a model of your choice


# # Global OpenAI configuration
# MAX_RETRIES = 5
# RETRY_DELAY = 2.0
# API_INTERVAL = 1.5
# RATE_LIMIT_BUFFER = 0.1
# LAST_API_CALL = 0
# API_USAGE = {}

# # Circuit Breaker
# class CircuitBreaker:
#     def __init__(self, max_errors=5, reset_timeout=60):
#         self.error_count = 0
#         self.last_error = None
#         self.max_errors = max_errors
#         self.reset_timeout = reset_timeout
        
#     async def check(self):
#         if self.error_count >= self.max_errors:
#             if time.time() - self.last_error > self.reset_timeout:
#                 self.reset()
#             else:
#                 raise Exception("API circuit breaker open")
                
#     def record_error(self):
#         self.error_count += 1
#         self.last_error = time.time()
        
#     def reset(self):
#         self.error_count = 0

# breaker = CircuitBreaker()

# def initialize_openai():
#     openai_api_key = os.getenv("OPENAI_API_KEY")
#     if not openai_api_key:
#         raise ValueError("OpenAI API key not found in environment variables.")
#     return OpenAI(api_key=openai_api_key)

# client = initialize_openai()

# def convert_value(value):
#     """Recursively convert non-serializable types to serializable ones."""
#     if isinstance(value, np.generic):
#         return value.item()
#     elif isinstance(value, pd.Timestamp):
#         return value.isoformat()
#     elif isinstance(value, dict):
#         return {k: convert_value(v) for k, v in value.items()}
#     elif isinstance(value, list):
#         return [convert_value(item) for item in value]
#     else:
#         return value

# def initialize_exchange():
#     api_key = os.getenv('BYBIT_API_KEY')
#     api_secret = os.getenv('BYBIT_SECRET')
    
#     if not api_key or not api_secret:
#         logger.error("Bybit API credentials not found")
#         raise ValueError("API credentials required")
    
#     return ccxt.bybit({
#         'enableRateLimit': True,
#         'options': {'defaultType': 'spot'},
#         'timeout': 30000,
#         'apiKey': api_key,
#         'secret': api_secret,
#     })

# exchange = initialize_exchange()

# async def fetch_current_price(symbol):
#     try:
#         logger.info(f"Attempting to fetch ticker for {symbol}")
#         formatted_symbol = symbol.replace("/", "")
#         ticker = await asyncio.get_event_loop().run_in_executor(
#             None, exchange.fetch_ticker, formatted_symbol
#         )
#         logger.info(f"Ticker fetched: {ticker}")
#         return ticker['last']
#     except Exception as e:
#         logger.error(f"Price fetch error for {symbol}: {e}")
#         return None


# async def fetch_current_market_data(symbol, timeframe):
#     try:
#         await asyncio.get_event_loop().run_in_executor(None, exchange.load_markets)
        
#         current_time = int(time.time() * 1000)
#         periods = 250  # Number of periods
        
#         # Map timeframe units to milliseconds
#         timeframe_map = {
#             'm': 60 * 1000,
#             'h': 60 * 60 * 1000
#         }
#         multiplier = int(timeframe[:-1])
#         unit = timeframe[-1]
#         start_time = current_time - (multiplier * timeframe_map[unit] * periods)
        
#         formatted_symbol = symbol.replace("/", "")
#         ohlcv = await asyncio.get_event_loop().run_in_executor(
#             None, exchange.fetch_ohlcv, formatted_symbol, timeframe, start_time, periods
#         )
        
#         if not ohlcv:
#             logger.warning(f"No data for {symbol}")
#             return pd.DataFrame()
            
#         df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
#         df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
#         return df
    
    
#     except Exception as e:
#         logger.error(f"Data fetch error for {symbol}: {e}")
#         return pd.DataFrame()
    

# def add_features(df):
#     if df.empty or 'close' not in df.columns:
#         logger.warning("DataFrame is empty or missing 'close' column.")
#         return df
    
    

#     try:
#         # Calculate Simple Moving Averages
#         df['SMA_50'] = ta.sma(df['close'], length=50)
#         df['SMA_200'] = ta.sma(df['close'], length=200)
        
#         # Calculate RSI
#         df['RSI'] = ta.rsi(df['close'], length=14)
        
#         # Calculate Stochastic RSI and rename columns
#         stochrsi = ta.stochrsi(df['close'], length=14)
#         if 'STOCHRSIk_14_14_3_3' in stochrsi.columns and 'STOCHRSId_14_14_3_3' in stochrsi.columns:
#             df['StochRSI_K'] = stochrsi['STOCHRSIk_14_14_3_3']
#             df['StochRSI_D'] = stochrsi['STOCHRSId_14_14_3_3']
#         else:
#             logger.error("StochRSI columns not found.")
#             return df
        
#         # Calculate Rate of Change
#         df['ROC'] = ta.roc(df['close'], length=12)
        
#         # Calculate Bollinger Bands
#         bb = ta.bbands(df['close'], length=20)
#         df['BB_upper'] = bb['BBU_20_2.0']
#         df['BB_middle'] = bb['BBM_20_2.0']
#         df['BB_lower'] = bb['BBL_20_2.0']
        
#         # Calculate MACD and explicitly set column names
#         macd = ta.macd(df['close'])
#         df['MACD'] = macd['MACD_12_26_9']
#         df['MACD_signal'] = macd['MACDs_12_26_9']
#         df['MACD_hist'] = macd['MACDh_12_26_9']
        
#         # Calculate Volume Moving Average and OBV
#         df['VMA'] = ta.sma(df['volume'], length=20)
#         df['OBV'] = ta.obv(df['close'], df['volume'])
        
#         df.dropna(inplace=True)
#         return df.tail(1) if not df.empty else df

#     except Exception as e:
#         logger.error(f"Feature engineering error: {e}")
#         traceback.print_exc()
#         return df

# def basic_technical_analysis(last_row):
#     analysis = []
#     if last_row['RSI'] < 30:
#         analysis.append("Oversold (RSI < 30)")
#     if last_row['MACD'] > last_row['MACD_signal']:
#         analysis.append("Bullish MACD crossover")
#     return "Basic analysis: " + ", ".join(analysis) if analysis else "No strong signals"

# # @lru_cache(maxsize=100)
# # async def generate_insights_with_openai(market_data_str):
# #     global LAST_API_CALL, API_USAGE

# #     try:
# #         await breaker.check()

# #         current_time = time.time()
# #         elapsed = current_time - LAST_API_CALL
# #         if elapsed < (API_INTERVAL + RATE_LIMIT_BUFFER):
# #             await asyncio.sleep(API_INTERVAL + RATE_LIMIT_BUFFER - elapsed)

# #         market_data = json.loads(market_data_str)
# #         today = datetime.today().strftime('%Y-%m-%d')

# #         if API_USAGE.get(today, 0) > 950:
# #             logger.warning("Approaching daily API limit")
# #             return basic_technical_analysis(market_data)

# #         prompt = f"""Analyze these market indicators:
# # - Symbol: {market_data['symbol']}
# # - Price: {market_data['current_price']}
# # - RSI: {market_data['RSI']:.2f}
# # - MACD: {market_data['MACD']:.4f}
# # - SMA50: {market_data['SMA_50']:.2f}
# # - Volume: {market_data['volume']:.2f}

# # Provide concise trading insights and a recommendation (Buy, Sell, or Hold) along with your reasoning."""

# #         max_retries = MAX_RETRIES  # number of attempts to retry the API call
# #         base_delay = RETRY_DELAY   # base delay (in seconds) for exponential backoff

# #         for attempt in range(max_retries):
# #             try:
# #                 response = await asyncio.to_thread(
# #                     client.chat.completions.create,
# #                     model="gpt-3.5-turbo-0125",
# #                     messages=[
# #                         {"role": "system", "content": "You are a crypto trading analyst."},
# #                         {"role": "user", "content": prompt}
# #                     ],
# #                     temperature=0.7,
# #                     max_tokens=300
# #                 )
# #                 LAST_API_CALL = time.time()
# #                 API_USAGE[today] = API_USAGE.get(today, 0) + 1
# #                 return response.choices[0].message.content

# #             except RateLimitError as rle:
# #                 # If a rate limit error is encountered, use the provided Retry-After header or a default value.
# #                 try:
# #                     wait_time = int(rle.response.headers.get('Retry-After', 60))
# #                 except Exception:
# #                     wait_time = 60
# #                 logger.warning(f"OpenAI rate limit hit. Waiting {wait_time}s (attempt {attempt+1}/{max_retries})")
# #                 await asyncio.sleep(wait_time)
# #                 continue

# #             except Exception as e:
# #                 logger.error(f"API call failed on attempt {attempt+1}: {str(e)}")
# #                 breaker.record_error()
# #                 # Apply exponential backoff
# #                 delay = base_delay * (2 ** attempt)
# #                 if delay > 60:
# #                     delay = 60
# #                 logger.warning(f"Retrying after {delay:.1f}s (attempt {attempt+1}/{max_retries})")
# #                 await asyncio.sleep(delay)
# #                 continue

# #         # If all attempts fail, fallback to basic technical analysis
# #         return basic_technical_analysis(market_data)

# #     except Exception as e:
# #         logger.error(f"AI analysis failed: {str(e)}")
# #         return basic_technical_analysis(market_data)


# async def generate_insights_with_hf(market_data_str):
#     try:
#         market_data = json.loads(market_data_str)
#         today = datetime.today().strftime('%Y-%m-%d')
        
#         # Build the prompt using your market indicators
#         prompt = f"""Analyze these market indicators:
# - Symbol: {market_data['symbol']}
# - Price: {market_data['current_price']}
# - RSI: {market_data['RSI']:.2f}
# - MACD: {market_data['MACD']:.4f}
# - SMA50: {market_data['SMA_50']:.2f}
# - Volume: {market_data['volume']:.2f}

# Provide concise trading insights and a recommendation (Buy, Sell, or Hold) along with your reasoning."""
        
#         payload = {
#             "inputs": prompt,
#             "parameters": {
#                 "max_new_tokens": 150,
#                 "temperature": 0.7,
#             }
#         }
#         headers = {"Authorization": f"Bearer {HF_API_KEY}"}

#         async with httpx.AsyncClient() as client:
#             response = await client.post(
#                 f"https://api-inference.huggingface.co/models/{HF_MODEL_ID}",
#                 headers=headers,
#                 json=payload,
#                 timeout=30.0
#             )
        
#         if response.status_code != 200:
#             # Log and fallback to basic technical analysis if needed
#             logger.error(f"Hugging Face API error {response.status_code}: {response.text}")
#             return basic_technical_analysis(market_data)

#         result = response.json()
#         # The response format may vary by model. Here we check for the "generated_text" key.
#         if isinstance(result, list) and "generated_text" in result[0]:
#             return result[0]["generated_text"]
#         else:
#             # Fallback if the expected output is not present.
#             return basic_technical_analysis(market_data)

#     except Exception as e:
#         logger.error(f"HF insights generation failed: {str(e)}")
#         return basic_technical_analysis(market_data)


# async def analyze_current_signals(symbol, timeframe, leverage=1):
#     try:
#         start_time = time.time()
#         logger.info(f"Analyzing {symbol}")
        
#         # Limit leverage between 1 and 10
#         leverage = max(1, min(leverage, 10))
        
#         # Fetch and process market data
#         df = await fetch_current_market_data(symbol, timeframe)
#         if df.empty:
#             logger.warning(f"No data available for {symbol}.")
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

#         df = add_features(df)
#         if df.empty or df.isnull().values.any():
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

#         current_price = await fetch_current_price(symbol)
#         if not current_price:
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

#         last_row = df.iloc[-1].to_dict()
        
#         # Calculate signals based on indicator conditions
#         buy_conditions = [
#             last_row['close'] > last_row['SMA_50'],
#             last_row['RSI'] < 70,
#             last_row['MACD'] > last_row['MACD_signal'],
#             last_row['StochRSI_K'] > last_row['StochRSI_D'],
#             last_row['ROC'] > 0
#         ]
#         sell_conditions = [
#             last_row['close'] < last_row['SMA_50'],
#             last_row['RSI'] > 30,
#             last_row['MACD'] < last_row['MACD_signal'],
#             last_row['StochRSI_K'] < last_row['StochRSI_D'],
#             last_row['ROC'] < 0
#         ]
#         buy_count = sum(buy_conditions)
#         sell_count = sum(sell_conditions)
#         threshold = 3

#         # Determine confidence level
#         def get_confidence(count):
#             percent = (count / 5) * 100
#             if percent >= 75:
#                 return "high", percent
#             elif percent >= 50:
#                 return "medium", percent
#             else:
#                 return "low", percent

#         signal = "Hold"
#         confidence = "low"
#         confidence_percent = 0.0
        
#         if buy_count >= threshold:
#             signal = "Buy"
#             confidence, confidence_percent = get_confidence(buy_count)
#         elif sell_count >= threshold:
#             signal = "Sell"
#             confidence, confidence_percent = get_confidence(sell_count)
#         else:
#             max_count = max(buy_count, sell_count)
#             confidence, confidence_percent = get_confidence(max_count)


#         # Prepare market data for OpenAI analysis
#         market_data = {k: convert_value(v) for k, v in last_row.items()}
#         market_data.update({
#             "symbol": symbol,
#             "current_price": current_price
#         })
        
#         # insights = await generate_insights_with_openai(json.dumps(market_data, default=str))
#         insights = await generate_insights_with_hf(json.dumps(market_data, default=str))
     

#         # Construct trade opportunity
#         trade_size = 20  # Fixed risk amount
#         exit_percent = 0.02  # 2% target
        
#         trade = {
#             "symbol": symbol.replace("/", ""),
#             "action": signal,
#             "current_price": round(current_price, 2),
#             "confidence": confidence,
#             "confidence_percent": round(confidence_percent, 1),
#             "leverage": leverage,
#             "insights": insights,
#             "indicators": {
#                 "RSI": round(last_row['RSI'], 2),
#                 "MACD_hist": round(last_row['MACD_hist'], 4),
#                 "SMA_crossover": f"Price {last_row['close']:.2f} vs SMA50 {last_row['SMA_50']:.2f}"
#             }
#         }

#         if signal != "Hold":
#             exit_price = current_price * (1 + (exit_percent if signal == "Buy" else -exit_percent))
#             trade_size_asset = trade_size / current_price
#             profit = abs(exit_price - current_price) * trade_size_asset
#             trade.update({
#                 "entry_time": datetime.now().isoformat(),
#                 "exit_time": (datetime.now() + timedelta(minutes=15)).isoformat(),
#                 "entry_price": round(current_price, 2),
#                 "exit_price": round(exit_price, 2),
#                 "potential_profit": round(profit * leverage, 2)
#             })

#         analysis_time = time.time() - start_time
#         logger.info(f"Analysis completed for {symbol} in {analysis_time:.1f}s")
#         return [trade], analysis_time

#     except Exception as e:
#         logger.error(f"Analysis error for {symbol}: {str(e)}")
#         traceback.print_exc()
#         return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

# @app.route('/api/trades', methods=['POST'])
# async def trades():
#     try:
#         data = await request.json
#         symbols = data.get('symbols', ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'])
#         timeframe = data.get('timeframe', '15m').strip()  # Remove any extra spaces
#         leverage = max(1, min(int(data.get('leverage', 1)), 10))
        
#         logger.info(f"Processing request for {symbols}")
        
#         results = {}
#         for symbol in symbols:
#             trade_list, _ = await analyze_current_signals(symbol, timeframe, leverage)
#             results[symbol.replace("/", "")] = trade_list
        
#         return jsonify({"trades": results})
    
#     except Exception as e:
#         logger.error(f"API error: {str(e)}")
#         traceback.print_exc()
#         return jsonify({"error": "Server error"}), 500

# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5000)










from quart import Quart, jsonify, request
import pandas as pd 
import numpy as np
import sys
sys.modules['numpy.NaN'] = np.nan  
import pandas_ta as ta
import ccxt
import httpx 
from quart_cors import cors
import os
from dotenv import load_dotenv
import traceback
import logging
from datetime import datetime, timedelta
import time
import asyncio
from openai import OpenAI, RateLimitError
from functools import lru_cache
import json

# Load environment variables from .env file
load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Quart app with CORS
app = Quart(__name__)
app = cors(app, allow_origin="*")

HF_API_KEY = os.getenv("HF_API_KEY")
HF_MODEL_ID = "EleutherAI/gpt-neo-125M"  # Change to a model of your choice


# Global OpenAI configuration
MAX_RETRIES = 5
RETRY_DELAY = 2.0
API_INTERVAL = 1.5
RATE_LIMIT_BUFFER = 0.1
LAST_API_CALL = 0
API_USAGE = {}

# Circuit Breaker
class CircuitBreaker:
    def __init__(self, max_errors=5, reset_timeout=60):
        self.error_count = 0
        self.last_error = None
        self.max_errors = max_errors
        self.reset_timeout = reset_timeout
        
    async def check(self):
        if self.error_count >= self.max_errors:
            if time.time() - self.last_error > self.reset_timeout:
                self.reset()
            else:
                raise Exception("API circuit breaker open")
                
    def record_error(self):
        self.error_count += 1
        self.last_error = time.time()
        
    def reset(self):
        self.error_count = 0

breaker = CircuitBreaker()

def initialize_openai():
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OpenAI API key not found in environment variables.")
    return OpenAI(api_key=openai_api_key)

client = initialize_openai()

def convert_value(value):
    """Recursively convert non-serializable types to serializable ones."""
    if isinstance(value, np.generic):
        return value.item()
    elif isinstance(value, pd.Timestamp):
        return value.isoformat()
    elif isinstance(value, dict):
        return {k: convert_value(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [convert_value(item) for item in value]
    else:
        return value

def initialize_exchange():
    api_key = os.getenv('BYBIT_API_KEY')
    api_secret = os.getenv('BYBIT_SECRET')
    
    if not api_key or not api_secret:
        logger.error("Bybit API credentials not found")
        raise ValueError("API credentials required")
    
    return ccxt.bybit({
        'enableRateLimit': True,
        'options': {'defaultType': 'spot'},
        'timeout': 30000,
        'apiKey': api_key,
        'secret': api_secret,
    })

exchange = initialize_exchange()

async def fetch_current_price(symbol):
    try:
        logger.info(f"Attempting to fetch ticker for {symbol}")
        formatted_symbol = symbol.replace("/", "")
        ticker = await asyncio.get_event_loop().run_in_executor(
            None, exchange.fetch_ticker, formatted_symbol
        )
        logger.info(f"Ticker fetched: {ticker}")
        return ticker['last']
    except Exception as e:
        logger.error(f"Price fetch error for {symbol}: {e}")
        return None


async def fetch_current_market_data(symbol, timeframe):
    try:
        await asyncio.get_event_loop().run_in_executor(None, exchange.load_markets)
        
        current_time = int(time.time() * 1000)
        periods = 250  # Number of periods
        
        # Map timeframe units to milliseconds
        timeframe_map = {
            'm': 60 * 1000,
            'h': 60 * 60 * 1000
        }
        multiplier = int(timeframe[:-1])
        unit = timeframe[-1]
        start_time = current_time - (multiplier * timeframe_map[unit] * periods)
        
        formatted_symbol = symbol.replace("/", "")
        ohlcv = await asyncio.get_event_loop().run_in_executor(
            None, exchange.fetch_ohlcv, formatted_symbol, timeframe, start_time, periods
        )
        
        if not ohlcv:
            logger.warning(f"No data for {symbol}")
            return pd.DataFrame()
            
        df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        return df
    
    
    except Exception as e:
        logger.error(f"Data fetch error for {symbol}: {e}")
        return pd.DataFrame()
    

def add_features(df):
    if df.empty or 'close' not in df.columns:
        logger.warning("DataFrame is empty or missing 'close' column.")
        return df
    
    

    try:
        # Calculate Simple Moving Averages
        df['SMA_50'] = ta.sma(df['close'], length=50)
        df['SMA_200'] = ta.sma(df['close'], length=200)
        
        # Calculate RSI
        df['RSI'] = ta.rsi(df['close'], length=14)
        
        # Calculate Stochastic RSI and rename columns
        stochrsi = ta.stochrsi(df['close'], length=14)
        if 'STOCHRSIk_14_14_3_3' in stochrsi.columns and 'STOCHRSId_14_14_3_3' in stochrsi.columns:
            df['StochRSI_K'] = stochrsi['STOCHRSIk_14_14_3_3']
            df['StochRSI_D'] = stochrsi['STOCHRSId_14_14_3_3']
        else:
            logger.error("StochRSI columns not found.")
            return df
        
        # Calculate Rate of Change
        df['ROC'] = ta.roc(df['close'], length=12)
        
        # Calculate Bollinger Bands
        bb = ta.bbands(df['close'], length=20)
        df['BB_upper'] = bb['BBU_20_2.0']
        df['BB_middle'] = bb['BBM_20_2.0']
        df['BB_lower'] = bb['BBL_20_2.0']
        
        # Calculate MACD and explicitly set column names
        macd = ta.macd(df['close'])
        df['MACD'] = macd['MACD_12_26_9']
        df['MACD_signal'] = macd['MACDs_12_26_9']
        df['MACD_hist'] = macd['MACDh_12_26_9']
        
        # Calculate Volume Moving Average and OBV
        df['VMA'] = ta.sma(df['volume'], length=20)
        df['OBV'] = ta.obv(df['close'], df['volume'])
        
        df.dropna(inplace=True)
        return df.tail(1) if not df.empty else df

    except Exception as e:
        logger.error(f"Feature engineering error: {e}")
        traceback.print_exc()
        return df

def basic_technical_analysis(last_row):
    analysis = []
    if last_row['RSI'] < 30:
        analysis.append("Oversold (RSI < 30)")
    if last_row['MACD'] > last_row['MACD_signal']:
        analysis.append("Bullish MACD crossover")
    return "Basic analysis: " + ", ".join(analysis) if analysis else "No strong signals"


async def generate_insights_with_hf(market_data_str):
    try:
        market_data = json.loads(market_data_str)
        today = datetime.today().strftime('%Y-%m-%d')
        
        # Build the prompt using your market indicators
        prompt = f"""Analyze these market indicators:
- Symbol: {market_data['symbol']}
- Price: {market_data['current_price']}
- RSI: {market_data['RSI']:.2f}
- MACD: {market_data['MACD']:.4f}
- SMA50: {market_data['SMA_50']:.2f}
- Volume: {market_data['volume']:.2f}

Provide concise trading insights and a recommendation (Buy, Sell, or Hold) along with your reasoning."""
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 150,
                "temperature": 0.7,
            }
        }
        headers = {"Authorization": f"Bearer {HF_API_KEY}"}

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api-inference.huggingface.co/models/{HF_MODEL_ID}",
                headers=headers,
                json=payload,
                timeout=30.0
            )
        
        if response.status_code != 200:
            # Log and fallback to basic technical analysis if needed
            logger.error(f"Hugging Face API error {response.status_code}: {response.text}")
            return basic_technical_analysis(market_data)

        result = response.json()
        # The response format may vary by model. Here we check for the "generated_text" key.
        if isinstance(result, list) and "generated_text" in result[0]:
            return result[0]["generated_text"]
        else:
            # Fallback if the expected output is not present.
            return basic_technical_analysis(market_data)

    except Exception as e:
        logger.error(f"HF insights generation failed: {str(e)}")
        return basic_technical_analysis(market_data)


async def analyze_current_signals(symbol, timeframe, leverage=1):
    try:
        start_time = time.time()
        logger.info(f"Analyzing {symbol}")
        
        # Limit leverage between 1 and 10
        leverage = max(1, min(leverage, 10))
        
        # Fetch and process market data
        df = await fetch_current_market_data(symbol, timeframe)
        if df.empty:
            logger.warning(f"No data available for {symbol}.")
            return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

        df = add_features(df)
        if df.empty or df.isnull().values.any():
            return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

        current_price = await fetch_current_price(symbol)
        if not current_price:
            return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

        last_row = df.iloc[-1].to_dict()
        
        # Calculate signals based on indicator conditions
        buy_conditions = [
            last_row['close'] > last_row['SMA_50'],
            last_row['RSI'] < 70,
            last_row['MACD'] > last_row['MACD_signal'],
            last_row['StochRSI_K'] > last_row['StochRSI_D'],
            last_row['ROC'] > 0
        ]
        sell_conditions = [
            last_row['close'] < last_row['SMA_50'],
            last_row['RSI'] > 30,
            last_row['MACD'] < last_row['MACD_signal'],
            last_row['StochRSI_K'] < last_row['StochRSI_D'],
            last_row['ROC'] < 0
        ]
        buy_count = sum(buy_conditions)
        sell_count = sum(sell_conditions)
        threshold = 3

        # Determine confidence level
        def get_confidence(count):
            percent = (count / 5) * 100
            if percent >= 75:
                return "high", percent
            elif percent >= 50:
                return "medium", percent
            else:
                return "low", percent

        signal = "Hold"
        confidence = "low"
        confidence_percent = 0.0
        
        if buy_count >= threshold:
            signal = "Buy"
            confidence, confidence_percent = get_confidence(buy_count)
        elif sell_count >= threshold:
            signal = "Sell"
            confidence, confidence_percent = get_confidence(sell_count)
        else:
            max_count = max(buy_count, sell_count)
            confidence, confidence_percent = get_confidence(max_count)


        # Prepare market data for OpenAI analysis
        market_data = {k: convert_value(v) for k, v in last_row.items()}
        market_data.update({
            "symbol": symbol,
            "current_price": current_price
        })
        
        # insights = await generate_insights_with_openai(json.dumps(market_data, default=str))
        insights = await generate_insights_with_hf(json.dumps(market_data, default=str))
     

        # Construct trade opportunity
        trade_size = 20  # Fixed risk amount
        exit_percent = 0.02  # 2% target
        
        trade = {
            "symbol": symbol.replace("/", ""),
            "action": signal,
            "current_price": round(current_price, 2),
            "confidence": confidence,
            "confidence_percent": round(confidence_percent, 1),
            "leverage": leverage,
            "insights": insights,
            "indicators": {
                "RSI": round(last_row['RSI'], 2),
                "MACD_hist": round(last_row['MACD_hist'], 4),
                "SMA_crossover": f"Price {last_row['close']:.2f} vs SMA50 {last_row['SMA_50']:.2f}"
            }
        }

        if signal != "Hold":
            exit_price = current_price * (1 + (exit_percent if signal == "Buy" else -exit_percent))
            trade_size_asset = trade_size / current_price
            profit = abs(exit_price - current_price) * trade_size_asset
            trade.update({
                "entry_time": datetime.now().isoformat(),
                "exit_time": (datetime.now() + timedelta(minutes=15)).isoformat(),
                "entry_price": round(current_price, 2),
                "exit_price": round(exit_price, 2),
                "potential_profit": round(profit * leverage, 2)
            })

        analysis_time = time.time() - start_time
        logger.info(f"Analysis completed for {symbol} in {analysis_time:.1f}s")
        return [trade], analysis_time

    except Exception as e:
        logger.error(f"Analysis error for {symbol}: {str(e)}")
        traceback.print_exc()
        return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

@app.route('/api/trades', methods=['POST'])
async def trades():
    try:
        data = await request.json
        symbols = data.get('symbols', ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'])
        timeframe = data.get('timeframe', '15m').strip()  # Remove any extra spaces
        leverage = max(1, min(int(data.get('leverage', 1)), 10))
        
        logger.info(f"Processing request for {symbols}")
        
        results = {}
        for symbol in symbols:
            trade_list, _ = await analyze_current_signals(symbol, timeframe, leverage)
            results[symbol.replace("/", "")] = trade_list
        
        return jsonify({"trades": results})
    
    except Exception as e:
        logger.error(f"API error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": "Server error"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)







# from quart import Quart, jsonify, request
# import pandas as pd 
# import numpy as np
# import sys
# sys.modules['numpy.NaN'] = np.nan  
# import pandas_ta as ta
# import ccxt
# import httpx 
# from quart_cors import cors
# import os
# from dotenv import load_dotenv
# import traceback
# import logging
# from datetime import datetime, timedelta
# import time
# import asyncio
# from openai import OpenAI, RateLimitError
# from functools import lru_cache
# import json


# import stripe
# from google.cloud import firestore
# # import firebase_admin
# # from firebase_admin import credentials



# # Load environment variables from .env file
# load_dotenv()

# # Initialize logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Initialize Quart app with CORS
# app = Quart(__name__)
# app = cors(app, allow_origin="*")

# # db = firestore.Client()

# # # Parse the JSON string from the environment variable
# # service_account_info = os.getenv("FIREBASE_SERVICE_ACCOUNT")
# # if service_account_info:
# #     service_account_dict = json.loads(service_account_info)

# # # Initialize Firebase with the parsed credentials
# # cred = credentials.Certificate(service_account_dict)
# # firebase_admin.initialize_app(cred)

# # Set up Stripe
# stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# HF_API_KEY = os.getenv("HF_API_KEY")
# HF_MODEL_ID = "EleutherAI/gpt-neo-125M"  # Change to a model of your choice


# # Global OpenAI configuration
# MAX_RETRIES = 5
# RETRY_DELAY = 2.0
# API_INTERVAL = 1.5
# RATE_LIMIT_BUFFER = 0.1
# LAST_API_CALL = 0
# API_USAGE = {}

# # Circuit Breaker
# class CircuitBreaker:
#     def __init__(self, max_errors=5, reset_timeout=60):
#         self.error_count = 0
#         self.last_error = None
#         self.max_errors = max_errors
#         self.reset_timeout = reset_timeout
        
#     async def check(self):
#         if self.error_count >= self.max_errors:
#             if time.time() - self.last_error > self.reset_timeout:
#                 self.reset()
#             else:
#                 raise Exception("API circuit breaker open")
                
#     def record_error(self):
#         self.error_count += 1
#         self.last_error = time.time()
        
#     def reset(self):
#         self.error_count = 0

# breaker = CircuitBreaker()

# def initialize_openai():
#     openai_api_key = os.getenv("OPENAI_API_KEY")
#     if not openai_api_key:
#         raise ValueError("OpenAI API key not found in environment variables.")
#     return OpenAI(api_key=openai_api_key)

# client = initialize_openai()

# def convert_value(value):
#     """Recursively convert non-serializable types to serializable ones."""
#     if isinstance(value, np.generic):
#         return value.item()
#     elif isinstance(value, pd.Timestamp):
#         return value.isoformat()
#     elif isinstance(value, dict):
#         return {k: convert_value(v) for k, v in value.items()}
#     elif isinstance(value, list):
#         return [convert_value(item) for item in value]
#     else:
#         return value

# def initialize_exchange():
#     api_key = os.getenv('BYBIT_API_KEY')
#     api_secret = os.getenv('BYBIT_SECRET')
    
#     if not api_key or not api_secret:
#         logger.error("Bybit API credentials not found")
#         raise ValueError("API credentials required")
    
#     return ccxt.bybit({
#         'enableRateLimit': True,
#         'options': {'defaultType': 'spot'},
#         'timeout': 30000,
#         'apiKey': api_key,
#         'secret': api_secret,
#     })

# exchange = initialize_exchange()

# async def fetch_current_price(symbol):
#     try:
#         logger.info(f"Attempting to fetch ticker for {symbol}")
#         formatted_symbol = symbol.replace("/", "")
#         ticker = await asyncio.get_event_loop().run_in_executor(
#             None, exchange.fetch_ticker, formatted_symbol
#         )
#         logger.info(f"Ticker fetched: {ticker}")
#         return ticker['last']
#     except Exception as e:
#         logger.error(f"Price fetch error for {symbol}: {e}")
#         # Check if this is an API key expiration error
#         if hasattr(e, 'args') and len(e.args) > 0:
#             error_msg = str(e.args[0])
#             if isinstance(error_msg, str) and "api key has expired" in error_msg.lower():
#                 raise ValueError("API key expired")
#         return None


# async def fetch_current_market_data(symbol, timeframe):
#     try:
#         await asyncio.get_event_loop().run_in_executor(None, exchange.load_markets)
        
#         current_time = int(time.time() * 1000)
#         periods = 250  # Number of periods
        
#         # Map timeframe units to milliseconds
#         timeframe_map = {
#             'm': 60 * 1000,
#             'h': 60 * 60 * 1000
#         }
#         multiplier = int(timeframe[:-1])
#         unit = timeframe[-1]
#         start_time = current_time - (multiplier * timeframe_map[unit] * periods)
        
#         formatted_symbol = symbol.replace("/", "")
#         ohlcv = await asyncio.get_event_loop().run_in_executor(
#             None, exchange.fetch_ohlcv, formatted_symbol, timeframe, start_time, periods
#         )
        
#         if not ohlcv:
#             logger.warning(f"No data available for {symbol}")
#             return pd.DataFrame()
            
#         df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
#         df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
#         return df
    
#     except Exception as e:
#         logger.error(f"Data fetch error for {symbol}: {e}")
#         # Check if this is an API key expiration error
#         if hasattr(e, 'args') and len(e.args) > 0:
#             error_msg = str(e.args[0])
#             if isinstance(error_msg, str) and "api key has expired" in error_msg.lower():
#                 raise ValueError("API key expired")
#         return pd.DataFrame()
    

# def add_features(df):
#     if df.empty or 'close' not in df.columns:
#         logger.warning("DataFrame is empty or missing 'close' column.")
#         return df
    
#     try:
#         # Calculate Simple Moving Averages
#         df['SMA_50'] = ta.sma(df['close'], length=50)
#         df['SMA_200'] = ta.sma(df['close'], length=200)
        
#         # Calculate RSI
#         df['RSI'] = ta.rsi(df['close'], length=14)
        
#         # Calculate Stochastic RSI and rename columns
#         stochrsi = ta.stochrsi(df['close'], length=14)
#         if 'STOCHRSIk_14_14_3_3' in stochrsi.columns and 'STOCHRSId_14_14_3_3' in stochrsi.columns:
#             df['StochRSI_K'] = stochrsi['STOCHRSIk_14_14_3_3']
#             df['StochRSI_D'] = stochrsi['STOCHRSId_14_14_3_3']
#         else:
#             logger.error("StochRSI columns not found.")
#             return df
        
#         # Calculate Rate of Change
#         df['ROC'] = ta.roc(df['close'], length=12)
        
#         # Calculate Bollinger Bands
#         bb = ta.bbands(df['close'], length=20)
#         df['BB_upper'] = bb['BBU_20_2.0']
#         df['BB_middle'] = bb['BBM_20_2.0']
#         df['BB_lower'] = bb['BBL_20_2.0']
        
#         # Calculate MACD and explicitly set column names
#         macd = ta.macd(df['close'])
#         df['MACD'] = macd['MACD_12_26_9']
#         df['MACD_signal'] = macd['MACDs_12_26_9']
#         df['MACD_hist'] = macd['MACDh_12_26_9']
        
#         # Calculate Volume Moving Average and OBV
#         df['VMA'] = ta.sma(df['volume'], length=20)
#         df['OBV'] = ta.obv(df['close'], df['volume'])
        
#         df.dropna(inplace=True)
#         return df.tail(1) if not df.empty else df

#     except Exception as e:
#         logger.error(f"Feature engineering error: {e}")
#         traceback.print_exc()
#         return df

# def basic_technical_analysis(last_row):
#     analysis = []
#     if last_row['RSI'] < 30:
#         analysis.append("Oversold (RSI < 30)")
#     if last_row['MACD'] > last_row['MACD_signal']:
#         analysis.append("Bullish MACD crossover")
#     return "Basic analysis: " + ", ".join(analysis) if analysis else "No strong signals"


# async def generate_insights_with_hf(market_data_str):
#     try:
#         market_data = json.loads(market_data_str)
#         today = datetime.today().strftime('%Y-%m-%d')
        
#         # Build the prompt using your market indicators
#         prompt = f"""Analyze these market indicators:
# - Symbol: {market_data['symbol']}
# - Price: {market_data['current_price']}
# - RSI: {market_data['RSI']:.2f}
# - MACD: {market_data['MACD']:.4f}
# - SMA50: {market_data['SMA_50']:.2f}
# - Volume: {market_data['volume']:.2f}

# Provide concise trading insights and a recommendation (Buy, Sell, or Hold) along with your reasoning."""
        
#         payload = {
#             "inputs": prompt,
#             "parameters": {
#                 "max_new_tokens": 150,
#                 "temperature": 0.7,
#             }
#         }
#         headers = {"Authorization": f"Bearer {HF_API_KEY}"}

#         async with httpx.AsyncClient() as client:
#             response = await client.post(
#                 f"https://api-inference.huggingface.co/models/{HF_MODEL_ID}",
#                 headers=headers,
#                 json=payload,
#                 timeout=30.0
#             )
        
#         if response.status_code != 200:
#             # Log and fallback to basic technical analysis if needed
#             logger.error(f"Hugging Face API error {response.status_code}: {response.text}")
#             return basic_technical_analysis(market_data)

#         result = response.json()
#         # The response format may vary by model. Here we check for the "generated_text" key.
#         if isinstance(result, list) and "generated_text" in result[0]:
#             return result[0]["generated_text"]
#         else:
#             # Fallback if the expected output is not present.
#             return basic_technical_analysis(market_data)

#     except Exception as e:
#         logger.error(f"HF insights generation failed: {str(e)}")
#         return basic_technical_analysis(market_data)


# async def analyze_current_signals(symbol, timeframe, leverage=1):
#     try:
#         start_time = time.time()
#         logger.info(f"Analyzing {symbol}")
        
#         # Limit leverage between 1 and 10
#         leverage = max(1, min(leverage, 10))
        
#         # Fetch and process market data
#         df = await fetch_current_market_data(symbol, timeframe)
#         if df.empty:
#             logger.warning(f"No data available for {symbol}.")
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

#         df = add_features(df)
#         if df.empty or df.isnull().values.any():
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

#         current_price = await fetch_current_price(symbol)
#         if not current_price:
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

#         last_row = df.iloc[-1].to_dict()
        
#         # Calculate signals based on indicator conditions
#         buy_conditions = [
#             last_row['close'] > last_row['SMA_50'],
#             last_row['RSI'] < 70,
#             last_row['MACD'] > last_row['MACD_signal'],
#             last_row['StochRSI_K'] > last_row['StochRSI_D'],
#             last_row['ROC'] > 0
#         ]
#         sell_conditions = [
#             last_row['close'] < last_row['SMA_50'],
#             last_row['RSI'] > 30,
#             last_row['MACD'] < last_row['MACD_signal'],
#             last_row['StochRSI_K'] < last_row['StochRSI_D'],
#             last_row['ROC'] < 0
#         ]
#         buy_count = sum(buy_conditions)
#         sell_count = sum(sell_conditions)
#         threshold = 3

#         # Determine confidence level
#         def get_confidence(count):
#             percent = (count / 5) * 100
#             if percent >= 75:
#                 return "high", percent
#             elif percent >= 50:
#                 return "medium", percent
#             else:
#                 return "low", percent

#         signal = "Hold"
#         confidence = "low"
#         confidence_percent = 0.0
        
#         if buy_count >= threshold:
#             signal = "Buy"
#             confidence, confidence_percent = get_confidence(buy_count)
#         elif sell_count >= threshold:
#             signal = "Sell"
#             confidence, confidence_percent = get_confidence(sell_count)
#         else:
#             max_count = max(buy_count, sell_count)
#             confidence, confidence_percent = get_confidence(max_count)


#         # Prepare market data for OpenAI analysis
#         market_data = {k: convert_value(v) for k, v in last_row.items()}
#         market_data.update({
#             "symbol": symbol,
#             "current_price": current_price
#         })
        
#         # insights = await generate_insights_with_openai(json.dumps(market_data, default=str))
#         insights = await generate_insights_with_hf(json.dumps(market_data, default=str))
     

#         # Construct trade opportunity
#         trade_size = 20  # Fixed risk amount
#         exit_percent = 0.02  # 2% target
        
#         trade = {
#             "symbol": symbol.replace("/", ""),
#             "action": signal,
#             "current_price": round(current_price, 2),
#             "confidence": confidence,
#             "confidence_percent": round(confidence_percent, 1),
#             "leverage": leverage,
#             "insights": insights,
#             "indicators": {
#                 "RSI": round(last_row['RSI'], 2),
#                 "MACD_hist": round(last_row['MACD_hist'], 4),
#                 "SMA_crossover": f"Price {last_row['close']:.2f} vs SMA50 {last_row['SMA_50']:.2f}"
#             }
#         }

#         if signal != "Hold":
#             exit_price = current_price * (1 + (exit_percent if signal == "Buy" else -exit_percent))
#             trade_size_asset = trade_size / current_price
#             profit = abs(exit_price - current_price) * trade_size_asset
#             trade.update({
#                 "entry_time": datetime.now().isoformat(),
#                 "exit_time": (datetime.now() + timedelta(minutes=15)).isoformat(),
#                 "entry_price": round(current_price, 2),
#                 "exit_price": round(exit_price, 2),
#                 "potential_profit": round(profit * leverage, 2)
#             })

#         analysis_time = time.time() - start_time
#         logger.info(f"Analysis completed for {symbol} in {analysis_time:.1f}s")
#         return [trade], analysis_time

#     except ValueError as e:
#         if str(e) == "API key expired":
#             # Pass the API key expired error up the chain
#             raise
#         logger.error(f"Analysis value error for {symbol}: {str(e)}")
#         return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0
#     except Exception as e:
#         logger.error(f"Analysis error for {symbol}: {str(e)}")
#         traceback.print_exc()
#         return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

# @app.route('/api/trades', methods=['POST'])
# async def trades():
#     try:
#         data = await request.json
#         symbols = data.get('symbols', ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'])
#         timeframe = data.get('timeframe', '15m').strip()  # Remove any extra spaces
#         leverage = max(1, min(int(data.get('leverage', 1)), 10))
        
#         logger.info(f"Processing request for {symbols}")
        
#         try:
#             results = {}
#             for symbol in symbols:
#                 trade_list, _ = await analyze_current_signals(symbol, timeframe, leverage)
#                 results[symbol.replace("/", "")] = trade_list
            
#             return jsonify({"trades": results})
#         except ValueError as e:
#             if str(e) == "API key expired":
#                 return jsonify({"error": "API key expired", "error_code": 33004}), 400
#             raise
    
#     except Exception as e:
#         logger.error(f"API error: {str(e)}")
#         traceback.print_exc()
#         return jsonify({"error": "Server error"}), 500
    







# @app.route('/create-checkout-session', methods=['POST'])
# async def create_checkout_session():
#     try:
#         data = await request.json
#         amount = data.get('amount')
#         if not amount or float(amount) <= 0:
#             return jsonify({'error': 'Invalid amount'}), 400

#         # Create Stripe Checkout Session
#         session = stripe.checkout.Session.create(
#             payment_method_types=['card'],
#             line_items=[{
#                 'price_data': {
#                     'currency': 'usd',
#                     'product_data': {
#                         'name': 'Deposit Funds',
#                     },
#                     'unit_amount': int(float(amount) * 100),  # Amount in cents
#                 },
#                 'quantity': 1,
#             }],
#             mode='payment',
#             success_url='http://localhost:3000/success',  # Adjust URL
#             cancel_url='http://localhost:3000/cancel',  # Adjust URL
#         )

#         return jsonify({'sessionId': session.id}), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# @app.route('/webhook', methods=['POST'])
# async def stripe_webhook():
#     payload = await request.data
#     sig_header = request.headers.get('Stripe-Signature')

#     try:
#         event = stripe.Webhook.construct_event(
#             payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
#         )
#     except stripe.error.SignatureVerificationError:
#         return jsonify({'error': 'Webhook signature verification failed'}), 400

#     # Handle event
#     if event['type'] == 'checkout.session.completed':
#         session = event['data']['object']
#         # Save deposit record in Firestore
#         db.collection('deposits').add({
#             'user_email': session['customer_email'],  # Or pass user info
#             'amount': session['amount_total'] / 100,  # Convert to dollars
#             'status': 'completed',
#             'timestamp': firestore.SERVER_TIMESTAMP
#         })

#     return jsonify({'status': 'success'}), 200

    

# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5000)










# from quart import Quart, jsonify, request
# import pandas as pd 
# import numpy as np
# import sys
# sys.modules['numpy.NaN'] = np.nan  
# import pandas_ta as ta
# import ccxt
# import httpx 
# from quart_cors import cors
# import os
# from dotenv import load_dotenv
# import traceback
# import logging
# from datetime import datetime, timedelta
# import time
# import asyncio
# from openai import OpenAI, RateLimitError
# import json
# import stripe
# from google.cloud import firestore
# import firebase_admin
# from firebase_admin import credentials, firestore as firebase_firestore

# # Load environment variables from .env file
# load_dotenv()

# # Initialize logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Initialize Quart app with CORS
# app = Quart(__name__)
# app = cors(app, allow_origin="*")

# def initialize_firebase():
#     if not firebase_admin._apps:
#         serviceAccountKey = os.environ.get('FIREBASE_SERVICE_ACCOUNT')
#         if serviceAccountKey:
#             try:
#                 cred_dict = json.loads(serviceAccountKey)
#                 cred = credentials.Certificate(cred_dict)
#                 firebase_admin.initialize_app(cred)
#                 print("Firebase app initialized successfully.")
#             except json.JSONDecodeError as e:
#                 print(f"Failed to decode JSON from serviceAccountKey: {e}")
#             except Exception as e:
#                 print(f"Error initializing Firebase app: {e}")
#         else:
#             raise ValueError("serviceAccountKey environment variable not set.")

# def get_firestore_client():
#     return firestore.client()

# initialize_firebase()

# # Get the Firestore client
# db = firestore.client()
# # Set up Stripe
# stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# HF_API_KEY = os.getenv("HF_API_KEY")
# HF_MODEL_ID = "EleutherAI/gpt-neo-125M"  # Change to a model of your choice



# # Global OpenAI configuration
# MAX_RETRIES = 5
# RETRY_DELAY = 2.0
# API_INTERVAL = 1.5
# RATE_LIMIT_BUFFER = 0.1
# LAST_API_CALL = 0
# API_USAGE = {}

# # Circuit Breaker
# class CircuitBreaker:
#     def __init__(self, max_errors=5, reset_timeout=60):
#         self.error_count = 0
#         self.last_error = None
#         self.max_errors = max_errors
#         self.reset_timeout = reset_timeout
        
#     async def check(self):
#         if self.error_count >= self.max_errors:
#             if time.time() - self.last_error > self.reset_timeout:
#                 self.reset()
#             else:
#                 raise Exception("API circuit breaker open")
                
#     def record_error(self):
#         self.error_count += 1
#         self.last_error = time.time()
        
#     def reset(self):
#         self.error_count = 0

# breaker = CircuitBreaker()

# def initialize_openai():
#     openai_api_key = os.getenv("OPENAI_API_KEY")
#     if not openai_api_key:
#         raise ValueError("OpenAI API key not found in environment variables.")
#     return OpenAI(api_key=openai_api_key)

# client = initialize_openai()

# def convert_value(value):
#     """Recursively convert non-serializable types to serializable ones."""
#     if isinstance(value, np.generic):
#         return value.item()
#     elif isinstance(value, pd.Timestamp):
#         return value.isoformat()
#     elif isinstance(value, dict):
#         return {k: convert_value(v) for k, v in value.items()}
#     elif isinstance(value, list):
#         return [convert_value(item) for item in value]
#     else:
#         return value

# def initialize_exchange():
#     api_key = os.getenv('BYBIT_API_KEY')
#     api_secret = os.getenv('BYBIT_SECRET')
    
#     if not api_key or not api_secret:
#         logger.error("Bybit API credentials not found")
#         raise ValueError("API credentials required")
    
#     return ccxt.bybit({
#         'enableRateLimit': True,
#         'options': {'defaultType': 'spot'},
#         'timeout': 30000,
#         'apiKey': api_key,
#         'secret': api_secret,
#     })

# exchange = initialize_exchange()

# async def fetch_current_price(symbol):
#     try:
#         logger.info(f"Attempting to fetch ticker for {symbol}")
#         formatted_symbol = symbol.replace("/", "")
#         ticker = await asyncio.get_event_loop().run_in_executor(
#             None, exchange.fetch_ticker, formatted_symbol
#         )
#         logger.info(f"Ticker fetched: {ticker}")
#         return ticker['last']
#     except Exception as e:
#         logger.error(f"Price fetch error for {symbol}: {e}")
#         if hasattr(e, 'args') and len(e.args) > 0:
#             error_msg = str(e.args[0])
#             if isinstance(error_msg, str) and "api key has expired" in error_msg.lower():
#                 raise ValueError("API key expired")
#         return None

# async def fetch_current_market_data(symbol, timeframe):
#     try:
#         await asyncio.get_event_loop().run_in_executor(None, exchange.load_markets)
        
#         current_time = int(time.time() * 1000)
#         periods = 250  # Number of periods
        
#         timeframe_map = {
#             'm': 60 * 1000,
#             'h': 60 * 60 * 1000
#         }
#         multiplier = int(timeframe[:-1])
#         unit = timeframe[-1]
#         start_time = current_time - (multiplier * timeframe_map[unit] * periods)
        
#         formatted_symbol = symbol.replace("/", "")
#         ohlcv = await asyncio.get_event_loop().run_in_executor(
#             None, exchange.fetch_ohlcv, formatted_symbol, timeframe, start_time, periods
#         )
        
#         if not ohlcv:
#             logger.warning(f"No data available for {symbol}")
#             return pd.DataFrame()
            
#         df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
#         df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
#         return df
    
#     except Exception as e:
#         logger.error(f"Data fetch error for {symbol}: {e}")
#         if hasattr(e, 'args') and len(e.args) > 0:
#             error_msg = str(e.args[0])
#             if isinstance(error_msg, str) and "api key has expired" in error_msg.lower():
#                 raise ValueError("API key expired")
#         return pd.DataFrame()
    
# def add_features(df):
#     if df.empty or 'close' not in df.columns:
#         logger.warning("DataFrame is empty or missing 'close' column.")
#         return df
    
#     try:
#         df['SMA_50'] = ta.sma(df['close'], length=50)
#         df['SMA_200'] = ta.sma(df['close'], length=200)
#         df['RSI'] = ta.rsi(df['close'], length=14)
        
#         stochrsi = ta.stochrsi(df['close'], length=14)
#         if 'STOCHRSIk_14_14_3_3' in stochrsi.columns and 'STOCHRSId_14_14_3_3' in stochrsi.columns:
#             df['StochRSI_K'] = stochrsi['STOCHRSIk_14_14_3_3']
#             df['StochRSI_D'] = stochrsi['STOCHRSId_14_14_3_3']
#         else:
#             logger.error("StochRSI columns not found.")
#             return df
        
#         df['ROC'] = ta.roc(df['close'], length=12)
        
#         bb = ta.bbands(df['close'], length=20)
#         df['BB_upper'] = bb['BBU_20_2.0']
#         df['BB_middle'] = bb['BBM_20_2.0']
#         df['BB_lower'] = bb['BBL_20_2.0']
        
#         macd = ta.macd(df['close'])
#         df['MACD'] = macd['MACD_12_26_9']
#         df['MACD_signal'] = macd['MACDs_12_26_9']
#         df['MACD_hist'] = macd['MACDh_12_26_9']
        
#         df['VMA'] = ta.sma(df['volume'], length=20)
#         df['OBV'] = ta.obv(df['close'], df['volume'])
        
#         df.dropna(inplace=True)
#         return df.tail(1) if not df.empty else df

#     except Exception as e:
#         logger.error(f"Feature engineering error: {e}")
#         traceback.print_exc()
#         return df

# def basic_technical_analysis(last_row):
#     analysis = []
#     if last_row['RSI'] < 30:
#         analysis.append("Oversold (RSI < 30)")
#     if last_row['MACD'] > last_row['MACD_signal']:
#         analysis.append("Bullish MACD crossover")
#     return "Basic analysis: " + ", ".join(analysis) if analysis else "No strong signals"

# async def generate_insights_with_hf(market_data_str):
#     try:
#         market_data = json.loads(market_data_str)
#         today = datetime.today().strftime('%Y-%m-%d')
        
#         prompt = f"""Analyze these market indicators:
# - Symbol: {market_data['symbol']}
# - Price: {market_data['current_price']}
# - RSI: {market_data['RSI']:.2f}
# - MACD: {market_data['MACD']:.4f}
# - SMA50: {market_data['SMA_50']:.2f}
# - Volume: {market_data['volume']:.2f}

# Provide concise trading insights and a recommendation (Buy, Sell, or Hold) along with your reasoning."""
        
#         payload = {
#             "inputs": prompt,
#             "parameters": {
#                 "max_new_tokens": 150,
#                 "temperature": 0.7,
#             }
#         }
#         headers = {"Authorization": f"Bearer {HF_API_KEY}"}

#         async with httpx.AsyncClient() as client:
#             response = await client.post(
#                 f"https://api-inference.huggingface.co/models/{HF_MODEL_ID}",
#                 headers=headers,
#                 json=payload,
#                 timeout=30.0
#             )
        
#         if response.status_code != 200:
#             logger.error(f"Hugging Face API error {response.status_code}: {response.text}")
#             return basic_technical_analysis(market_data)

#         result = response.json()
#         if isinstance(result, list) and "generated_text" in result[0]:
#             return result[0]["generated_text"]
#         else:
#             return basic_technical_analysis(market_data)

#     except Exception as e:
#         logger.error(f"HF insights generation failed: {str(e)}")
#         return basic_technical_analysis(market_data)

# async def analyze_current_signals(symbol, timeframe, leverage=1):
#     try:
#         start_time = time.time()
#         logger.info(f"Analyzing {symbol}")
        
#         leverage = max(1, min(leverage, 10))
        
#         df = await fetch_current_market_data(symbol, timeframe)
#         if df.empty:
#             logger.warning(f"No data available for {symbol}.")
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

#         df = add_features(df)
#         if df.empty or df.isnull().values.any():
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

#         current_price = await fetch_current_price(symbol)
#         if not current_price:
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

#         last_row = df.iloc[-1].to_dict()
        
#         buy_conditions = [
#             last_row['close'] > last_row['SMA_50'],
#             last_row['RSI'] < 70,
#             last_row['MACD'] > last_row['MACD_signal'],
#             last_row['StochRSI_K'] > last_row['StochRSI_D'],
#             last_row['ROC'] > 0
#         ]
#         sell_conditions = [
#             last_row['close'] < last_row['SMA_50'],
#             last_row['RSI'] > 30,
#             last_row['MACD'] < last_row['MACD_signal'],
#             last_row['StochRSI_K'] < last_row['StochRSI_D'],
#             last_row['ROC'] < 0
#         ]
#         buy_count = sum(buy_conditions)
#         sell_count = sum(sell_conditions)
#         threshold = 3

#         def get_confidence(count):
#             percent = (count / 5) * 100
#             if percent >= 75:
#                 return "high", percent
#             elif percent >= 50:
#                 return "medium", percent
#             else:
#                 return "low", percent

#         signal = "Hold"
#         confidence = "low"
#         confidence_percent = 0.0
        
#         if buy_count >= threshold:
#             signal = "Buy"
#             confidence, confidence_percent = get_confidence(buy_count)
#         elif sell_count >= threshold:
#             signal = "Sell"
#             confidence, confidence_percent = get_confidence(sell_count)
#         else:
#             max_count = max(buy_count, sell_count)
#             confidence, confidence_percent = get_confidence(max_count)

#         market_data = {k: convert_value(v) for k, v in last_row.items()}
#         market_data.update({
#             "symbol": symbol,
#             "current_price": current_price
#         })
        
#         insights = await generate_insights_with_hf(json.dumps(market_data, default=str))
     
#         trade_size = 20
#         exit_percent = 0.02
        
#         trade = {
#             "symbol": symbol.replace("/", ""),
#             "action": signal,
#             "current_price": round(current_price, 2),
#             "confidence": confidence,
#             "confidence_percent": round(confidence_percent, 1),
#             "leverage": leverage,
#             "insights": insights,
#             "indicators": {
#                 "RSI": round(last_row['RSI'], 2),
#                 "MACD_hist": round(last_row['MACD_hist'], 4),
#                 "SMA_crossover": f"Price {last_row['close']:.2f} vs SMA50 {last_row['SMA_50']:.2f}"
#             }
#         }

#         if signal != "Hold":
#             exit_price = current_price * (1 + (exit_percent if signal == "Buy" else -exit_percent))
#             trade_size_asset = trade_size / current_price
#             profit = abs(exit_price - current_price) * trade_size_asset
#             trade.update({
#                 "entry_time": datetime.now().isoformat(),
#                 "exit_time": (datetime.now() + timedelta(minutes=15)).isoformat(),
#                 "entry_price": round(current_price, 2),
#                 "exit_price": round(exit_price, 2),
#                 "potential_profit": round(profit * leverage, 2)
#             })

#         analysis_time = time.time() - start_time
#         logger.info(f"Analysis completed for {symbol} in {analysis_time:.1f}s")
#         return [trade], analysis_time

#     except ValueError as e:
#         if str(e) == "API key expired":
#             raise
#         logger.error(f"Analysis value error for {symbol}: {str(e)}")
#         return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0
#     except Exception as e:
#         logger.error(f"Analysis error for {symbol}: {str(e)}")
#         traceback.print_exc()
#         return [{"symbol": symbol.replace("/", ""), "action": "Hold"}], 0

# @app.route('/api/trades', methods=['POST'])
# async def trades():
#     try:
#         data = await request.json
#         symbols = data.get('symbols', ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'])
#         timeframe = data.get('timeframe', '15m').strip()
#         leverage = max(1, min(int(data.get('leverage', 1)), 10))
        
#         logger.info(f"Processing request for {symbols}")
        
#         try:
#             results = {}
#             for symbol in symbols:
#                 trade_list, _ = await analyze_current_signals(symbol, timeframe, leverage)
#                 results[symbol.replace("/", "")] = trade_list
            
#             return jsonify({"trades": results})
#         except ValueError as e:
#             if str(e) == "API key expired":
#                 return jsonify({"error": "API key expired", "error_code": 33004}), 400
#             raise
    
#     except Exception as e:
#         logger.error(f"API error: {str(e)}")
#         traceback.print_exc()
#         return jsonify({"error": "Server error"}), 500

# @app.route('/create-checkout-session', methods=['POST'])
# async def create_checkout_session():
#     try:
#         # Verify user token
#         token = request.headers.get('Authorization')
#         if not token or not token.startswith('Bearer '):
#             return jsonify({'error': 'Unauthorized'}), 401

#         # In a real app, verify the token with Firebase
#         # For now, we'll just use the email from the request
#         data = request.get_json()
#         amount = data.get('amount')
#         user_email = data.get('email')
        
#         if not amount or float(amount) <= 0:
#             return jsonify({'error': 'Invalid amount'}), 400

#         session = stripe.checkout.Session.create(
#             payment_method_types=['card'],
#             line_items=[{
#                 'price_data': {
#                     'currency': 'usd',
#                     'product_data': {
#                         'name': 'Deposit Funds',
#                     },
#                     'unit_amount': int(float(amount) * 100),
#                 },
#                 'quantity': 1,
#             }],
#             mode='payment',
#             success_url='http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
#             cancel_url='http://localhost:3000/dashboard/deposit',
#             metadata={
#                 'user_email': user_email,
#                 'amount': amount
#             }
#         )

#         return jsonify({'sessionId': session.id}), 200

#     except Exception as e:
#         print(f"Error creating checkout session: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/verify-payment', methods=['POST'])
# async def verify_payment():
#     try:
#         data = request.get_json()
#         session_id = data.get('session_id')
        
#         if not session_id:
#             return jsonify({'error': 'Missing session ID'}), 400

#         # Retrieve the session from Stripe
#         session = stripe.checkout.Session.retrieve(session_id)
        
#         if session.payment_status != 'paid':
#             return jsonify({'error': 'Payment not completed'}), 400

#         # Get user email from metadata
#         user_email = session.metadata.get('user_email')
#         amount = float(session.metadata.get('amount'))
        
#         if not user_email:
#             return jsonify({'error': 'User  email not found'}), 400

#         # Update user balance in Firestore
#         users_ref = db.collection('users')
#         query = users_ref.where('email', '==', user_email).limit(1)
#         docs = query.get()
        
#         if not docs:
#             return jsonify({'error': 'User  not found'}), 404

#         for doc in docs:
#             current_balance = doc.to_dict().get('balance', 0)
#             new_balance = current_balance + amount
#             doc.reference.update({'balance': new_balance})
            
#             # Record the deposit
#             db.collection('deposits').add({
#                 'user_email': user_email,
#                 'amount': amount,
#                 'status': 'completed',
#                 'timestamp': firestore.SERVER_TIMESTAMP,
#                 'stripe_session_id': session_id
#             })

#         return jsonify({
#             'status': 'success',
#             'amount': amount,
#             'balance': new_balance
#         }), 200

#     except Exception as e:
#         print(f"Error verifying payment: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/webhook', methods=['POST'])
# async def stripe_webhook():
#     payload = request.data
#     sig_header = request.headers.get('Stripe-Signature')

#     try:
#         event = stripe.Webhook.construct_event(
#             payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
#         )
#     except stripe.error.SignatureVerificationError as e:
#         print(f"Webhook signature verification failed: {str(e)}")
#         return jsonify({'error': 'Webhook signature verification failed'}), 400

#     if event['type'] == 'checkout.session.completed':
#         session = event['data']['object']
        
#         try:
#             user_email = session.get('metadata', {}).get('user_email') or session.get('customer_email')
#             amount = float(session.get('metadata', {}).get('amount', session['amount_total'] / 100))
            
#             # Add to Firestore
#             deposit_data = {
#                 'user_email': user_email,
#                 'amount': amount,
#                 'currency': session['currency'],
#                 'payment_intent': session['payment_intent'],
#                 'status': 'completed',
#                 'timestamp': firestore.SERVER_TIMESTAMP
#             }
            
#             db.collection('deposits').add(deposit_data)
            
#             print(f"Successfully processed deposit for {user_email}")
            
#         except Exception as e:
#             print(f"Error processing webhook: {str(e)}")
#             return jsonify({'error': str(e)}), 500

#     return jsonify({'status': 'success'}), 200

# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5000)




# from quart import Quart, jsonify, request
# import pandas as pd 
# import numpy as np
# import sys
# sys.modules['numpy.NaN'] = np.nan  
# import pandas_ta as ta
# import ccxt
# import httpx 
# from quart_cors import cors
# import os
# from dotenv import load_dotenv
# import traceback
# import logging
# from datetime import datetime, timedelta
# import time
# import asyncio
# from openai import OpenAI, RateLimitError
# import json
# import stripe
# from google.cloud import firestore
# import firebase_admin
# from firebase_admin import credentials, firestore as firebase_firestore

# # Load environment variables from .env file
# load_dotenv()

# # Initialize logging with better formatting
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     handlers=[
#         logging.StreamHandler(),  # This ensures output goes to terminal
#         logging.FileHandler('app.log')  # Optional: also log to file
#     ]
# )
# logger = logging.getLogger(__name__)

# # Initialize Quart app with CORS
# app = Quart(__name__)
# app = cors(app, allow_origin="*")

# def initialize_firebase():
#     """Initialize Firebase with proper error handling"""
#     print("🔄 Starting Firebase initialization...")  # Console print for immediate visibility
#     logger.info("Starting Firebase initialization...")
    
#     if not firebase_admin._apps:
#         serviceAccountKey = os.environ.get('FIREBASE_SERVICE_ACCOUNT')
#         if serviceAccountKey:
#             try:
#                 print("🔑 Firebase service account key found")
#                 logger.info("Firebase service account key found")
                
#                 cred_dict = json.loads(serviceAccountKey)
#                 cred = credentials.Certificate(cred_dict)
#                 firebase_admin.initialize_app(cred)
                
#                 print("✅ Firebase app initialized successfully!")
#                 logger.info("Firebase app initialized successfully.")
                
#             except json.JSONDecodeError as e:
#                 print(f"❌ Failed to decode JSON from serviceAccountKey: {e}")
#                 logger.error(f"Failed to decode JSON from serviceAccountKey: {e}")
#                 raise
#             except Exception as e:
#                 print(f"❌ Error initializing Firebase app: {e}")
#                 logger.error(f"Error initializing Firebase app: {e}")
#                 raise
#         else:
#             print("❌ FIREBASE_SERVICE_ACCOUNT environment variable not set.")
#             logger.error("FIREBASE_SERVICE_ACCOUNT environment variable not set.")
#             raise ValueError("FIREBASE_SERVICE_ACCOUNT environment variable not set.")
#     else:
#         print("✅ Firebase app already initialized")
#         logger.info("Firebase app already initialized")

# def get_firestore_client():
#     """Get Firestore client with error handling"""
#     try:
#         print("🔄 Getting Firestore client...")
#         logger.info("Getting Firestore client...")
        
#         client = firestore.client()
        
#         print("✅ Firestore client initialized successfully!")
#         logger.info("Firestore client initialized successfully!")
        
#         return client
#     except Exception as e:
#         print(f"❌ Failed to get Firestore client: {e}")
#         logger.error(f"Failed to get Firestore client: {e}")
#         raise

# # Initialize Firebase and Firestore
# print("🚀 Initializing Firebase services...")
# try:
#     initialize_firebase()
#     db = get_firestore_client()
#     print("✅ All Firebase services initialized successfully!")
#     logger.info("All Firebase services initialized successfully!")
# except Exception as e:
#     print(f"❌ Firebase initialization failed: {e}")
#     logger.error(f"Firebase initialization failed: {e}")
#     db = None

# # Set up Stripe
# stripe_secret_key = os.getenv('STRIPE_SECRET_KEY')
# if not stripe_secret_key:
#     logger.warning("STRIPE_SECRET_KEY not found in environment variables")
# else:
#     stripe.api_key = stripe_secret_key

# # Hugging Face configuration
# HF_API_KEY = os.getenv("HF_API_KEY")
# HF_MODEL_ID = "EleutherAI/gpt-neo-125M"

# # Global OpenAI configuration
# MAX_RETRIES = 5
# RETRY_DELAY = 2.0
# API_INTERVAL = 1.5
# RATE_LIMIT_BUFFER = 0.1
# LAST_API_CALL = 0
# API_USAGE = {}

# class CircuitBreaker:
#     """Circuit breaker for API calls"""
#     def __init__(self, max_errors=5, reset_timeout=60):
#         self.error_count = 0
#         self.last_error = None
#         self.max_errors = max_errors
#         self.reset_timeout = reset_timeout
        
#     async def check(self):
#         if self.error_count >= self.max_errors:
#             if time.time() - self.last_error > self.reset_timeout:
#                 self.reset()
#             else:
#                 raise Exception("API circuit breaker open")
                
#     def record_error(self):
#         self.error_count += 1
#         self.last_error = time.time()
        
#     def reset(self):
#         self.error_count = 0

# breaker = CircuitBreaker()

# def initialize_openai():
#     """Initialize OpenAI client with error handling"""
#     openai_api_key = os.getenv("OPENAI_API_KEY")
#     if not openai_api_key:
#         logger.warning("OpenAI API key not found in environment variables.")
#         return None
#     try:
#         return OpenAI(api_key=openai_api_key)
#     except Exception as e:
#         logger.error(f"Failed to initialize OpenAI client: {e}")
#         return None

# client = initialize_openai()

# def convert_value(value):
#     """Recursively convert non-serializable types to serializable ones."""
#     if isinstance(value, np.generic):
#         return value.item()
#     elif isinstance(value, pd.Timestamp):
#         return value.isoformat()
#     elif isinstance(value, dict):
#         return {k: convert_value(v) for k, v in value.items()}
#     elif isinstance(value, list):
#         return [convert_value(item) for item in value]
#     elif pd.isna(value):
#         return None
#     else:
#         return value

# def initialize_exchange():
#     """Initialize exchange with proper error handling"""
#     api_key = os.getenv('BYBIT_API_KEY')
#     api_secret = os.getenv('BYBIT_SECRET')
    
#     if not api_key or not api_secret:
#         logger.error("Bybit API credentials not found in environment variables")
#         raise ValueError("BYBIT_API_KEY and BYBIT_SECRET environment variables are required")
    
#     try:
#         return ccxt.bybit({
#             'enableRateLimit': True,
#             'options': {'defaultType': 'spot'},
#             'timeout': 30000,
#             'apiKey': api_key,
#             'secret': api_secret,
#         })
#     except Exception as e:
#         logger.error(f"Failed to initialize exchange: {e}")
#         raise

# try:
#     exchange = initialize_exchange()
# except Exception as e:
#     logger.error(f"Exchange initialization failed: {e}")
#     exchange = None

# async def fetch_current_price(symbol):
#     """Fetch current price with improved error handling"""
#     if not exchange:
#         logger.error("Exchange not initialized")
#         return None
        
#     try:
#         logger.info(f"Attempting to fetch ticker for {symbol}")
#         formatted_symbol = symbol.replace("/", "")
#         ticker = await asyncio.get_event_loop().run_in_executor(
#             None, exchange.fetch_ticker, formatted_symbol
#         )
#         logger.info(f"Successfully fetched ticker for {symbol}")
#         return ticker.get('last')
#     except Exception as e:
#         logger.error(f"Price fetch error for {symbol}: {e}")
#         if hasattr(e, 'args') and len(e.args) > 0:
#             error_msg = str(e.args[0])
#             if isinstance(error_msg, str) and "api key has expired" in error_msg.lower():
#                 raise ValueError("API key expired")
#         return None

# async def fetch_current_market_data(symbol, timeframe):
#     """Fetch market data with improved error handling"""
#     if not exchange:
#         logger.error("Exchange not initialized")
#         return pd.DataFrame()
        
#     try:
#         await asyncio.get_event_loop().run_in_executor(None, exchange.load_markets)
        
#         current_time = int(time.time() * 1000)
#         periods = 250  # Number of periods
        
#         timeframe_map = {
#             'm': 60 * 1000,
#             'h': 60 * 60 * 1000
#         }
        
#         # Parse timeframe (e.g., "15m" -> multiplier=15, unit='m')
#         if timeframe[-1] not in timeframe_map:
#             raise ValueError(f"Unsupported timeframe unit: {timeframe[-1]}")
            
#         multiplier = int(timeframe[:-1])
#         unit = timeframe[-1]
#         start_time = current_time - (multiplier * timeframe_map[unit] * periods)
        
#         formatted_symbol = symbol.replace("/", "")
#         ohlcv = await asyncio.get_event_loop().run_in_executor(
#             None, exchange.fetch_ohlcv, formatted_symbol, timeframe, start_time, periods
#         )
        
#         if not ohlcv:
#             logger.warning(f"No data available for {symbol}")
#             return pd.DataFrame()
            
#         df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
#         df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
#         return df
    
#     except Exception as e:
#         logger.error(f"Data fetch error for {symbol}: {e}")
#         if hasattr(e, 'args') and len(e.args) > 0:
#             error_msg = str(e.args[0])
#             if isinstance(error_msg, str) and "api key has expired" in error_msg.lower():
#                 raise ValueError("API key expired")
#         return pd.DataFrame()
    
# def add_features(df):
#     """Add technical indicators with improved error handling"""
#     if df.empty or 'close' not in df.columns:
#         logger.warning("DataFrame is empty or missing 'close' column.")
#         return df
    
#     try:
#         # Ensure we have enough data
#         if len(df) < 200:
#             logger.warning(f"Insufficient data for technical analysis: {len(df)} rows")
#             return pd.DataFrame()
        
#         df = df.copy()  # Avoid modifying original dataframe
        
#         # Simple Moving Averages
#         df['SMA_50'] = ta.sma(df['close'], length=50)
#         df['SMA_200'] = ta.sma(df['close'], length=200)
        
#         # RSI
#         df['RSI'] = ta.rsi(df['close'], length=14)
        
#         # Stochastic RSI
#         stochrsi = ta.stochrsi(df['close'], length=14)
#         if isinstance(stochrsi, pd.DataFrame):
#             if 'STOCHRSIk_14_14_3_3' in stochrsi.columns and 'STOCHRSId_14_14_3_3' in stochrsi.columns:
#                 df['StochRSI_K'] = stochrsi['STOCHRSIk_14_14_3_3']
#                 df['StochRSI_D'] = stochrsi['STOCHRSId_14_14_3_3']
#             else:
#                 logger.warning("Expected StochRSI columns not found, using default values")
#                 df['StochRSI_K'] = 50
#                 df['StochRSI_D'] = 50
#         else:
#             logger.warning("StochRSI calculation failed, using default values")
#             df['StochRSI_K'] = 50
#             df['StochRSI_D'] = 50
        
#         # Rate of Change
#         df['ROC'] = ta.roc(df['close'], length=12)
        
#         # Bollinger Bands
#         bb = ta.bbands(df['close'], length=20)
#         if isinstance(bb, pd.DataFrame):
#             df['BB_upper'] = bb.get('BBU_20_2.0', df['close'] * 1.02)
#             df['BB_middle'] = bb.get('BBM_20_2.0', df['close'])
#             df['BB_lower'] = bb.get('BBL_20_2.0', df['close'] * 0.98)
#         else:
#             df['BB_upper'] = df['close'] * 1.02
#             df['BB_middle'] = df['close']
#             df['BB_lower'] = df['close'] * 0.98
        
#         # MACD
#         macd = ta.macd(df['close'])
#         if isinstance(macd, pd.DataFrame):
#             df['MACD'] = macd.get('MACD_12_26_9', 0)
#             df['MACD_signal'] = macd.get('MACDs_12_26_9', 0)
#             df['MACD_hist'] = macd.get('MACDh_12_26_9', 0)
#         else:
#             df['MACD'] = 0
#             df['MACD_signal'] = 0
#             df['MACD_hist'] = 0
        
#         # Volume indicators
#         df['VMA'] = ta.sma(df['volume'], length=20)
#         df['OBV'] = ta.obv(df['close'], df['volume'])
        
#         # Drop rows with NaN values
#         df.dropna(inplace=True)
        
#         return df.tail(1) if not df.empty else df

#     except Exception as e:
#         logger.error(f"Feature engineering error: {e}")
#         traceback.print_exc()
#         return df

# def basic_technical_analysis(last_row):
#     """Basic technical analysis fallback"""
#     analysis = []
#     try:
#         if 'RSI' in last_row and last_row['RSI'] < 30:
#             analysis.append("Oversold (RSI < 30)")
#         elif 'RSI' in last_row and last_row['RSI'] > 70:
#             analysis.append("Overbought (RSI > 70)")
            
#         if 'MACD' in last_row and 'MACD_signal' in last_row:
#             if last_row['MACD'] > last_row['MACD_signal']:
#                 analysis.append("Bullish MACD crossover")
#             else:
#                 analysis.append("Bearish MACD crossover")
                
#         return "Basic analysis: " + ", ".join(analysis) if analysis else "No strong signals detected"
#     except Exception as e:
#         logger.error(f"Basic analysis error: {e}")
#         return "Analysis unavailable"

# async def generate_insights_with_hf(market_data_str):
#     """Generate insights using Hugging Face API"""
#     if not HF_API_KEY:
#         logger.warning("Hugging Face API key not available")
#         try:
#             market_data = json.loads(market_data_str)
#             return basic_technical_analysis(market_data)
#         except:
#             return "Technical analysis unavailable"
    
#     try:
#         market_data = json.loads(market_data_str)
        
#         prompt = f"""Analyze these market indicators:
# - Symbol: {market_data.get('symbol', 'Unknown')}
# - Price: {market_data.get('current_price', 'N/A')}
# - RSI: {market_data.get('RSI', 'N/A')}
# - MACD: {market_data.get('MACD', 'N/A')}
# - SMA50: {market_data.get('SMA_50', 'N/A')}
# - Volume: {market_data.get('volume', 'N/A')}

# Provide concise trading insights and a recommendation (Buy, Sell, or Hold) along with your reasoning."""
        
#         payload = {
#             "inputs": prompt,
#             "parameters": {
#                 "max_new_tokens": 150,
#                 "temperature": 0.7,
#             }
#         }
#         headers = {"Authorization": f"Bearer {HF_API_KEY}"}

#         async with httpx.AsyncClient() as client:
#             response = await client.post(
#                 f"https://api-inference.huggingface.co/models/{HF_MODEL_ID}",
#                 headers=headers,
#                 json=payload,
#                 timeout=30.0
#             )
        
#         if response.status_code != 200:
#             logger.error(f"Hugging Face API error {response.status_code}: {response.text}")
#             return basic_technical_analysis(market_data)

#         result = response.json()
#         if isinstance(result, list) and len(result) > 0 and "generated_text" in result[0]:
#             return result[0]["generated_text"]
#         else:
#             return basic_technical_analysis(market_data)

#     except Exception as e:
#         logger.error(f"HF insights generation failed: {str(e)}")
#         try:
#             market_data = json.loads(market_data_str)
#             return basic_technical_analysis(market_data)
#         except:
#             return "Analysis unavailable"

# async def analyze_current_signals(symbol, timeframe, leverage=1):
#     """Analyze current trading signals with comprehensive error handling"""
#     try:
#         start_time = time.time()
#         logger.info(f"Analyzing {symbol}")
        
#         leverage = max(1, min(leverage, 10))
        
#         df = await fetch_current_market_data(symbol, timeframe)
#         if df.empty:
#             logger.warning(f"No data available for {symbol}.")
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold", "error": "No data available"}], 0

#         df = add_features(df)
#         if df.empty:
#             logger.warning(f"No features could be calculated for {symbol}")
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold", "error": "Insufficient data for analysis"}], 0

#         current_price = await fetch_current_price(symbol)
#         if not current_price:
#             logger.warning(f"Could not fetch current price for {symbol}")
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold", "error": "Price unavailable"}], 0

#         last_row = df.iloc[-1].to_dict()
        
#         # Check for required indicators
#         required_indicators = ['close', 'SMA_50', 'RSI', 'MACD', 'MACD_signal', 'StochRSI_K', 'StochRSI_D', 'ROC']
#         missing_indicators = [ind for ind in required_indicators if ind not in last_row or pd.isna(last_row[ind])]
        
#         if missing_indicators:
#             logger.warning(f"Missing indicators for {symbol}: {missing_indicators}")
#             return [{"symbol": symbol.replace("/", ""), "action": "Hold", "error": f"Missing indicators: {missing_indicators}"}], 0
        
#         # Trading signal logic
#         buy_conditions = [
#             last_row['close'] > last_row['SMA_50'],
#             last_row['RSI'] < 70,
#             last_row['MACD'] > last_row['MACD_signal'],
#             last_row['StochRSI_K'] > last_row['StochRSI_D'],
#             last_row['ROC'] > 0
#         ]
        
#         sell_conditions = [
#             last_row['close'] < last_row['SMA_50'],
#             last_row['RSI'] > 30,
#             last_row['MACD'] < last_row['MACD_signal'],
#             last_row['StochRSI_K'] < last_row['StochRSI_D'],
#             last_row['ROC'] < 0
#         ]
        
#         buy_count = sum(buy_conditions)
#         sell_count = sum(sell_conditions)
#         threshold = 3

#         def get_confidence(count):
#             percent = (count / 5) * 100
#             if percent >= 75:
#                 return "high", percent
#             elif percent >= 50:
#                 return "medium", percent
#             else:
#                 return "low", percent

#         signal = "Hold"
#         confidence = "low"
#         confidence_percent = 0.0
        
#         if buy_count >= threshold:
#             signal = "Buy"
#             confidence, confidence_percent = get_confidence(buy_count)
#         elif sell_count >= threshold:
#             signal = "Sell"
#             confidence, confidence_percent = get_confidence(sell_count)
#         else:
#             max_count = max(buy_count, sell_count)
#             confidence, confidence_percent = get_confidence(max_count)

#         # Prepare market data for insights
#         market_data = {k: convert_value(v) for k, v in last_row.items()}
#         market_data.update({
#             "symbol": symbol,
#             "current_price": current_price
#         })
        
#         insights = await generate_insights_with_hf(json.dumps(market_data, default=str))
     
#         trade_size = 20
#         exit_percent = 0.02
        
#         trade = {
#             "symbol": symbol.replace("/", ""),
#             "action": signal,
#             "current_price": round(float(current_price), 2),
#             "confidence": confidence,
#             "confidence_percent": round(confidence_percent, 1),
#             "leverage": leverage,
#             "insights": insights,
#             "indicators": {
#                 "RSI": round(float(last_row['RSI']), 2),
#                 "MACD_hist": round(float(last_row['MACD_hist']), 4),
#                 "SMA_crossover": f"Price {float(last_row['close']):.2f} vs SMA50 {float(last_row['SMA_50']):.2f}"
#             }
#         }

#         if signal != "Hold":
#             exit_price = current_price * (1 + (exit_percent if signal == "Buy" else -exit_percent))
#             trade_size_asset = trade_size / current_price
#             profit = abs(exit_price - current_price) * trade_size_asset
#             trade.update({
#                 "entry_time": datetime.now().isoformat(),
#                 "exit_time": (datetime.now() + timedelta(minutes=15)).isoformat(),
#                 "entry_price": round(float(current_price), 2),
#                 "exit_price": round(float(exit_price), 2),
#                 "potential_profit": round(float(profit * leverage), 2)
#             })

#         analysis_time = time.time() - start_time
#         logger.info(f"Analysis completed for {symbol} in {analysis_time:.1f}s")
#         return [trade], analysis_time

#     except ValueError as e:
#         if str(e) == "API key expired":
#             raise
#         logger.error(f"Analysis value error for {symbol}: {str(e)}")
#         return [{"symbol": symbol.replace("/", ""), "action": "Hold", "error": str(e)}], 0
#     except Exception as e:
#         logger.error(f"Analysis error for {symbol}: {str(e)}")
#         traceback.print_exc()
#         return [{"symbol": symbol.replace("/", ""), "action": "Hold", "error": "Analysis failed"}], 0

# @app.route('/api/trades', methods=['POST'])
# async def trades():
#     """Main trading endpoint with improved error handling"""
#     try:
#         data = await request.json
#         symbols = data.get('symbols', ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'])
#         timeframe = data.get('timeframe', '15m').strip()
#         leverage = max(1, min(int(data.get('leverage', 1)), 10))
        
#         logger.info(f"Processing request for {symbols} with timeframe {timeframe}")
        
#         if not exchange:
#             return jsonify({"error": "Exchange not initialized", "error_code": 50001}), 500
        
#         try:
#             results = {}
#             for symbol in symbols:
#                 try:
#                     trade_list, _ = await analyze_current_signals(symbol, timeframe, leverage)
#                     results[symbol.replace("/", "")] = trade_list
#                 except Exception as e:
#                     logger.error(f"Error analyzing {symbol}: {str(e)}")
#                     results[symbol.replace("/", "")] = [{"symbol": symbol.replace("/", ""), "action": "Hold", "error": str(e)}]
            
#             return jsonify({"trades": results})
#         except ValueError as e:
#             if str(e) == "API key expired":
#                 return jsonify({"error": "API key expired", "error_code": 33004}), 400
#             raise
    
#     except Exception as e:
#         logger.error(f"API error: {str(e)}")
#         traceback.print_exc()
#         return jsonify({"error": "Server error", "details": str(e)}), 500

# @app.route('/create-checkout-session', methods=['POST'])
# async def create_checkout_session():
#     """Create Stripe checkout session"""
#     try:
#         if not stripe.api_key:
#             return jsonify({'error': 'Payment system not configured'}), 500
            
#         # Verify user token
#         token = request.headers.get('Authorization')
#         if not token or not token.startswith('Bearer '):
#             return jsonify({'error': 'Unauthorized'}), 401

#         data = await request.get_json()
#         amount = data.get('amount')
#         user_email = data.get('email')
        
#         if not amount or float(amount) <= 0:
#             return jsonify({'error': 'Invalid amount'}), 400

#         if not user_email:
#             return jsonify({'error': 'Email required'}), 400

#         session = stripe.checkout.Session.create(
#             payment_method_types=['card'],
#             line_items=[{
#                 'price_data': {
#                     'currency': 'usd',
#                     'product_data': {
#                         'name': 'Deposit Funds',
#                     },
#                     'unit_amount': int(float(amount) * 100),
#                 },
#                 'quantity': 1,
#             }],
#             mode='payment',
#             success_url='http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
#             cancel_url='http://localhost:3000/dashboard/deposit',
#             metadata={
#                 'user_email': user_email,
#                 'amount': amount
#             }
#         )

#         return jsonify({'sessionId': session.id}), 200

#     except Exception as e:
#         logger.error(f"Error creating checkout session: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/verify-payment', methods=['POST'])
# async def verify_payment():
#     """Verify payment and update user balance"""
#     try:
#         if not db:
#             return jsonify({'error': 'Database not available'}), 500
            
#         data = await request.get_json()
#         session_id = data.get('session_id')
        
#         if not session_id:
#             return jsonify({'error': 'Missing session ID'}), 400

#         # Retrieve the session from Stripe
#         session = stripe.checkout.Session.retrieve(session_id)
        
#         if session.payment_status != 'paid':
#             return jsonify({'error': 'Payment not completed'}), 400

#         # Get user email from metadata
#         user_email = session.metadata.get('user_email')
#         amount = float(session.metadata.get('amount'))
        
#         if not user_email:
#             return jsonify({'error': 'User email not found'}), 400

#         # Update user balance in Firestore
#         users_ref = db.collection('users')
#         query = users_ref.where('email', '==', user_email).limit(1)
#         docs = query.get()
        
#         if not docs:
#             return jsonify({'error': 'User not found'}), 404

#         new_balance = 0
#         for doc in docs:
#             current_balance = doc.to_dict().get('balance', 0)
#             new_balance = current_balance + amount
#             doc.reference.update({'balance': new_balance})
            
#             # Record the deposit
#             db.collection('deposits').add({
#                 'user_email': user_email,
#                 'amount': amount,
#                 'status': 'completed',
#                 'timestamp': firestore.SERVER_TIMESTAMP,
#                 'stripe_session_id': session_id
#             })

#         return jsonify({
#             'status': 'success',
#             'amount': amount,
#             'balance': new_balance
#         }), 200

#     except Exception as e:
#         logger.error(f"Error verifying payment: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/webhook', methods=['POST'])
# async def stripe_webhook():
#     """Handle Stripe webhooks"""
#     try:
#         if not db:
#             logger.error("Database not available for webhook processing")
#             return jsonify({'error': 'Database not available'}), 500
            
#         payload = await request.get_data()
#         sig_header = request.headers.get('Stripe-Signature')
#         webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
        
#         if not webhook_secret:
#             logger.error("Stripe webhook secret not configured")
#             return jsonify({'error': 'Webhook not configured'}), 500

#         try:
#             event = stripe.Webhook.construct_event(
#                 payload, sig_header, webhook_secret
#             )
#         except stripe.error.SignatureVerificationError as e:
#             logger.error(f"Webhook signature verification failed: {str(e)}")
#             return jsonify({'error': 'Webhook signature verification failed'}), 400

#         if event['type'] == 'checkout.session.completed':
#             session = event['data']['object']
            
#             try:
#                 user_email = session.get('metadata', {}).get('user_email') or session.get('customer_email')
#                 amount = float(session.get('metadata', {}).get('amount', session['amount_total'] / 100))
                
#                 # Add to Firestore
#                 deposit_data = {
#                     'user_email': user_email,
#                     'amount': amount,
#                     'currency': session['currency'],
#                     'payment_intent': session['payment_intent'],
#                     'status': 'completed',
#                     'timestamp': firestore.SERVER_TIMESTAMP
#                 }
                
#                 db.collection('deposits').add(deposit_data)
                
#                 logger.info(f"Successfully processed deposit for {user_email}")
                
#             except Exception as e:
#                 logger.error(f"Error processing webhook: {str(e)}")
#                 return jsonify({'error': str(e)}), 500

#         return jsonify({'status': 'success'}), 200
        
#     except Exception as e:
#         logger.error(f"Webhook error: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/health', methods=['GET'])
# async def health_check():
#     """Health check endpoint"""
#     status = {
#         'status': 'healthy',
#         'timestamp': datetime.now().isoformat(),
#         'services': {
#             'exchange': exchange is not None,
#             'database': db is not None,
#             'stripe': stripe.api_key is not None,
#             'openai': client is not None,
#             'huggingface': HF_API_KEY is not None
#         }
#     }
#     return jsonify(status)

# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5000, debug=False)
    

# @app.route('/create-checkout-session', methods=['POST'])
# async def create_checkout_session():
#     try:
#         data = await request.json
#         amount = data.get('amount')
#         if not amount or float(amount) <= 0:
#             return jsonify({'error': 'Invalid amount'}), 400

#         session = stripe.checkout.Session.create(
#             payment_method_types=['card'],
#             line_items=[{
#                 'price_data': {
#                     'currency': 'usd',
#                     'product_data': {
#                         'name': 'Deposit Funds',
#                     },
#                     'unit_amount': int(float(amount) * 100),
#                 },
#                 'quantity': 1,
#             }],
#             mode='payment',
#             success_url='http://localhost:3000/success',
#             cancel_url='http://localhost:3000/cancel',
#         )

#         return jsonify({'sessionId': session.id}), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/webhook', methods=['POST'])
# async def stripe_webhook():
#     payload = await request.data
#     sig_header = request.headers.get('Stripe-Signature')

#     try:
#         event = stripe.Webhook.construct_event(
#             payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
#         )
#     except stripe.error.SignatureVerificationError:
#         return jsonify({'error': 'Webhook signature verification failed'}), 400

#     if event['type'] == 'checkout.session.completed':
#         session = event['data']['object']
#         db.collection('deposits').add({
#             'user_email': session.get('customer_email', 'unknown'),
#             'amount': session['amount_total'] / 100,
#             'status': 'completed',
#             'timestamp': firestore.SERVER_TIMESTAMP
#         })

#     return jsonify({'status': 'success'}), 200

