
# import hmac
# import hashlib
# import time
# import requests
# import os
# from dotenv import load_dotenv

# load_dotenv()
# api_key = os.getenv('BYBIT_API_KEY_TESTNET')
# api_secret = os.getenv('BYBIT_SECRET_TESTNET')

# timestamp = str(int(time.time() * 1000))
# recv_window = "10000"
# query_string = "category=spot"  # Ensure this matches the request
# param_str = f"{timestamp}{api_key}{recv_window}{query_string}"
# signature = hmac.new(api_secret.encode('utf-8'), param_str.encode('utf-8'), hashlib.sha256).hexdigest()

# headers = {
#     "X-BAPI-API-KEY": api_key,
#     "X-BAPI-SIGN": signature,
#     "X-BAPI-TIMESTAMP": timestamp,
#     "X-BAPI-RECV-WINDOW": recv_window
# }

# url = f"https://api-testnet.bybit.com/v5/account/info?{query_string}"
# response = requests.get(url, headers=headers)
# print(response.status_code, response.json())


# import hmac
# import hashlib
# import time
# import requests
# import os
# from dotenv import load_dotenv

# load_dotenv()
# api_key = os.getenv('BYBIT_API_KEY')
# api_secret = os.getenv('BYBIT_SECRET')
# timestamp = str(int(time.time() * 1000))
# recv_window = "10000"
# query_string = "accountType=UNIFIED&coin=USDT"
# param_str = f"{timestamp}{api_key}{recv_window}{query_string}"
# signature = hmac.new(api_secret.encode('utf-8'), param_str.encode('utf-8'), hashlib.sha256).hexdigest()

# headers = {
#     "X-BAPI-API-KEY": api_key,
#     "X-BAPI-SIGN": signature,
#     "X-BAPI-TIMESTAMP": timestamp,
#     "X-BAPI-RECV-WINDOW": recv_window
# }
# url = f"https://api.bybit.com/v5/account/wallet-balance?{query_string}"
# response = requests.get(url, headers=headers)
# print(response.status_code, response.json())