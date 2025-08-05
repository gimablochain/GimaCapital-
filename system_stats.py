# import asyncio
# import logging
# from firebase_admin import firestore
# import firebase_admin
# from firebase_admin import credentials
# from datetime import datetime, timezone
# import json
# import os

# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# # Initialize Firebase Admin SDK
# def initialize_firebase():
#     service_account_json = os.getenv('FIREBASE_SERVICE_ACCOUNT')
#     if not service_account_json:
#         raise ValueError("FIREBASE_SERVICE_ACCOUNT not found in .env")
#     cred_dict = json.loads(service_account_json)
#     cred = credentials.Certificate(cred_dict)
#     if not firebase_admin._apps:
#         firebase_admin.initialize_app(cred)
#     return firestore.client()

# db = initialize_firebase()

# async def sync_system_stats():
#     try:
#         # Fetch all users and distributions
#         users_ref = db.collection('users')
#         pamm_dist_ref = db.collection('pamm_distributions')
#         users = list(users_ref.stream())
#         pamm_distributions = list(pamm_dist_ref.stream())

#         # Calculate metrics
#         total_users = len(users)
#         active_users = len([doc for doc in users if doc.to_dict().get('accountStatus') == 'active'])
#         total_deposits = sum([doc.to_dict().get('balance', 0.0) for doc in users])
#         total_volume = sum([
#             float(doc.to_dict().get('details', [{}])[0].get('net_amount', doc.to_dict().get('net_amount', 0.0)))
#             for doc in pamm_distributions
#         ])

#         # Update system_stats/current
#         stats_ref = db.collection('system_stats').document('current')
#         stats_ref.set({
#             'total_users': total_users,
#             'active_users': active_users,
#             'total_deposits': float(total_deposits),
#             'total_volume': float(total_volume),
#             'last_updated': firestore.SERVER_TIMESTAMP
#         })

#         logger.info(f"System stats synced: {total_users} users, {active_users} active, {total_deposits} deposits, {total_volume} volume")
#     except Exception as e:
#         logger.error(f"Error syncing system stats: {str(e)}")

# async def run_scheduler():
#     while True:
#         try:
#             await sync_system_stats()
#             await asyncio.sleep(1200)  # Sleep for 5 minutes
#         except Exception as e:
#             logger.error(f"Scheduler error: {str(e)}")
#             await asyncio.sleep(60)  # Wait before retrying



# import asyncio
# import logging
# from firebase_admin import firestore
# import firebase_admin
# from firebase_admin import credentials
# from datetime import datetime, timezone
# import json
# import os

# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# # Initialize Firebase Admin SDK
# def initialize_firebase():
#     service_account_json = os.getenv('FIREBASE_SERVICE_ACCOUNT')
#     if not service_account_json:
#         raise ValueError("FIREBASE_SERVICE_ACCOUNT not found in .env")
#     cred_dict = json.loads(service_account_json)
#     cred = credentials.Certificate(cred_dict)
#     if not firebase_admin._apps:
#         firebase_admin.initialize_app(cred)
#     return firestore.client()

# db = initialize_firebase()

# async def sync_system_stats():
#     try:
#         # Initialize collections and variables
#         users_ref = db.collection('users')
#         pamm_dist_ref = db.collection('pamm_distributions')
#         users = []
#         pamm_distributions = []
#         batch_size = 100  # Process 100 documents at a time

#         # Paginate users
#         query = users_ref.order_by('__name__').limit(batch_size)
#         last_doc = None
#         while True:
#             if last_doc:
#                 query = query.start_after(last_doc)
#             docs = list(query.stream())
#             if not docs:
#                 break
#             users.extend(docs)
#             last_doc = docs[-1]

#         # Paginate PAMM distributions
#         query = pamm_dist_ref.order_by('__name__').limit(batch_size)
#         last_doc = None
#         while True:
#             if last_doc:
#                 query = query.start_after(last_doc)
#             docs = list(query.stream())
#             if not docs:
#                 break
#             pamm_distributions.extend(docs)
#             last_doc = docs[-1]

#         # Calculate metrics
#         total_users = len(users)
#         active_users = len([doc for doc in users if doc.to_dict().get('accountStatus') == 'active'])
#         total_deposits = sum([doc.to_dict().get('balance', 0.0) for doc in users])
#         total_volume = sum([
#             float(doc.to_dict().get('details', [{}])[0].get('net_amount', doc.to_dict().get('net_amount', 0.0)))
#             for doc in pamm_distributions
#         ])

#         # Update system_stats/current
#         stats_ref = db.collection('system_stats').document('current')
#         stats_ref.set({
#             'total_users': total_users,
#             'active_users': active_users,
#             'total_deposits': float(total_deposits),
#             'total_volume': float(total_volume),
#             'last_updated': firestore.SERVER_TIMESTAMP
#         })

#         logger.info(f"System stats synced: {total_users} users, {active_users} active, {total_deposits} deposits, {total_volume} volume")
#     except Exception as e:
#         logger.error(f"Error syncing system stats: {str(e)}")

# async def run_scheduler():
#     while True:
#         try:
#             await sync_system_stats()
#             await asyncio.sleep(1200)  # Sleep for 20 minutes
#         except Exception as e:
#             logger.error(f"Scheduler error: {str(e)}")
#             await asyncio.sleep(60)  # Wait before retrying

# import asyncio
# import logging
# from datetime import datetime, timezone
# from firebase_admin import firestore
# from config import db

# logger = logging.getLogger(__name__)

# # Global flag to prevent duplicate scheduler runs
# _scheduler_running = False

# async def sync_system_stats():
#     try:
#         users_ref = db.collection('users')
#         users = await asyncio.get_event_loop().run_in_executor(None, lambda: users_ref.get())
        
#         total_users = len(users)
#         active_users = sum(1 for user in users if user.to_dict().get('accountStatus') == 'active')
#         total_deposits = sum(float(user.to_dict().get('balance', 0.0)) for user in users)
#         total_volume = sum(float(user.to_dict().get('volume', 0.0)) for user in users)

#         stats_ref = db.collection('system_stats').document('current')
#         await asyncio.get_event_loop().run_in_executor(None, lambda: stats_ref.set({
#             'total_users': total_users,
#             'active_users': active_users,
#             'total_deposits': total_deposits,
#             'total_volume': total_volume,
#             'last_updated': firestore.SERVER_TIMESTAMP
#         }))

#         logger.info(f"System stats synced: {total_users} users, {active_users} active, {total_deposits} deposits, {total_volume} volume")
#     except Exception as e:
#         logger.error(f"Error syncing system stats: {str(e)}", exc_info=True)

# async def run_scheduler():
#     global _scheduler_running
#     if _scheduler_running:
#         logger.debug("Scheduler already running, skipping")
#         return
#     _scheduler_running = True
#     logger.debug("System stats scheduler started by system_stats")
#     while True:
#         try:
#             await sync_system_stats()
#         except Exception as e:
#             logger.error(f"Scheduler error: {str(e)}", exc_info=True)
#         await asyncio.sleep(300)  # Run every 5 minutes
        
        
        
    
import asyncio
import logging
from datetime import datetime, timezone, timedelta
from firebase_admin import firestore
from firebase_admin.firestore import FieldFilter
from quart import Quart, abort
from quart_cors import cors
from config import db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('pamm_api.log'), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = Quart(__name__)
app = cors(app, allow_origin=["http://localhost:3000", "https://www.gimacapital.com"], allow_methods=["GET"])

_scheduler_running = False

async def sync_system_stats():
    try:
        # Fetch users
        users_ref = db.collection('users')
        users = await asyncio.get_event_loop().run_in_executor(None, lambda: users_ref.get())
        total_users = len(users)
        active_users = sum(1 for user in users if user.to_dict().get('accountStatus') == 'active')
        total_deposits = sum(float(user.to_dict().get('balance', 0.0)) for user in users)
        
        # Include pending deposits
        try:
            pending_ref = db.collection('pending_deposits')
            pending_deposits = await asyncio.get_event_loop().run_in_executor(None, lambda: pending_ref.get())
            pending_total = sum(float(pd.to_dict().get('amount', 0.0)) for pd in pending_deposits)
            total_deposits += pending_total
            logger.info(f"Pending deposits: {len(pending_deposits)} documents, total amount: {pending_total}")
        except Exception as e:
            logger.warning(f"No pending_deposits collection or error: {str(e)}")

        # Fetch trades from top-level and user subcollections
        total_trades = 0
        total_volume = 0.0
        
        # Check top-level trades
        try:
            trades_ref = db.collection('trades')
            trades = await asyncio.get_event_loop().run_in_executor(None, lambda: trades_ref.get())
            total_trades += len(trades)
            total_volume += sum(float(trade.to_dict().get('amount', 0.0)) for trade in trades)
            logger.info(f"Top-level trades: {len(trades)} documents")
            for trade in trades:
                logger.debug(f"Trade {trade.id}: {trade.to_dict()}")
        except Exception as e:
            logger.warning(f"Error fetching top-level trades: {str(e)}")

        # Check user subcollection trades
        for user in users:
            user_id = user.id
            try:
                user_trades_ref = db.collection('users').document(user_id).collection('trades')
                user_trades = await asyncio.get_event_loop().run_in_executor(None, lambda: user_trades_ref.get())
                total_trades += len(user_trades)
                total_volume += sum(float(trade.to_dict().get('amount', 0.0)) for trade in trades)
                logger.info(f"User {user_id} trades: {len(user_trades)} documents")
                for trade in user_trades:
                    logger.debug(f"User {user_id} trade {trade.id}: {trade.to_dict()}")
            except Exception as e:
                logger.warning(f"Error fetching trades for user {user_id}: {str(e)}")

        # Check trades_manager_bybit and trades_recent
        for collection in ['trades_manager_bybit', 'trades_recent']:
            try:
                trades_ref = db.collection(collection)
                trades = await asyncio.get_event_loop().run_in_executor(None, lambda: trades_ref.get())
                total_trades += len(trades)
                total_volume += sum(float(trade.to_dict().get('amount', 0.0)) for trade in trades)
                logger.info(f"{collection}: {len(trades)} documents")
                for trade in trades:
                    logger.debug(f"{collection} trade {trade.id}: {trade.to_dict()}")
            except Exception as e:
                logger.warning(f"Error fetching {collection}: {str(e)}")

        # Update Firestore
        stats_ref = db.collection('system_stats').document('current')
        await asyncio.get_event_loop().run_in_executor(None, lambda: stats_ref.set({
            'total_users': total_users,
            'active_users': active_users,
            'total_deposits': total_deposits,
            'total_volume': total_volume,
            'total_trades': total_trades,
            'last_updated': firestore.SERVER_TIMESTAMP
        }))

        logger.info(f"System stats synced: {total_users} users, {active_users} active, {total_deposits} deposits, {total_volume} volume, {total_trades} trades")
    except Exception as e:
        logger.error(f"Error syncing system stats: {str(e)}", exc_info=True)

async def run_scheduler():
    global _scheduler_running
    if _scheduler_running:
        logger.debug("Scheduler already running, skipping")
        return
    _scheduler_running = True
    logger.debug("System stats scheduler started by system_stats")
    while True:
        try:
            await sync_system_stats()
        except Exception as e:
            logger.error(f"Scheduler error: {str(e)}", exc_info=True)
        await asyncio.sleep(300)  # Run every 5 minutes
        

# @app.route('/api/stats', methods=['GET'])
# async def get_system_stats():
#     try:
#         stats_ref = db.collection('system_stats').document('current')
#         doc = await asyncio.get_event_loop().run_in_executor(None, lambda: stats_ref.get())
#         if not doc.exists:
#             abort(404, description="Stats not found")
        
#         stats = doc.to_dict()
#         last_updated = stats.get('last_updated')
#         if last_updated:
#             last_updated = last_updated.isoformat()

#         # Fetch daily trades
#         daily_trades_count = 0
#         try:
#             trades_ref = db.collection('trades').where(
#                 filter=FieldFilter('timestamp', '>=', datetime.now(timezone.utc) - timedelta(days=1))
#             )
#             trades = await asyncio.get_event_loop().run_in_executor(None, lambda: trades_ref.get())
#             daily_trades_count = len(trades)
#         except Exception as e:
#             logger.warning(f"Failed to query trades with timestamp: {str(e)}. Falling back to total trades.")
#             trades = await asyncio.get_event_loop().run_in_executor(None, lambda: db.collection('trades').get())
#             daily_trades_count = len(trades)  # Fallback to total trades (47)

#         daily_trades = f"{daily_trades_count:,}" if daily_trades_count < 5000 else f"{daily_trades_count:,}+"

#         return {
#             "activeTraders": stats.get('active_users', 0),
#             "dailyTrades": daily_trades,
#             "lastUpdated": last_updated,
#             "totalDeposits": stats.get('total_deposits', 0),
#             "totalVolume": stats.get('total_volume', 0)
#         }
#     except Exception as e:
#         logger.error(f"Error fetching system stats: {str(e)}", exc_info=True)
#         abort(500, description="Internal server error")