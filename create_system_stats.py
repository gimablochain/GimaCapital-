# from firebase_admin import firestore
# import firebase_admin
# from firebase_admin import credentials
# from datetime import datetime, timezone
# import json
# import os

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


# # Calculate stats
# users_ref = db.collection('users')
# pamm_dist_ref = db.collection('pamm_distributions')

# # Fetch all users and distributions
# users = list(users_ref.stream())
# pamm_distributions = list(pamm_dist_ref.stream())

# # Calculate metrics
# total_users = len(users)
# active_users = len([doc for doc in users if doc.to_dict().get('accountStatus') == 'active'])
# total_deposits = sum([doc.to_dict().get('balance', 0.0) for doc in users])
# total_volume = sum([
#     float(doc.to_dict().get('details', [{}])[0].get('net_amount', doc.to_dict().get('net_amount', 0.0)))
#     for doc in pamm_distributions
# ])

# # Create or update system_stats/current
# stats_ref = db.collection('system_stats').document('current')
# stats_ref.set({
#     'total_users': total_users,
#     'active_users': active_users,
#     'total_deposits': float(total_deposits),
#     'total_volume': float(total_volume),
#     'last_updated': firestore.SERVER_TIMESTAMP
# })

# print(f"System stats created: {total_users} users, {active_users} active, {total_deposits} deposits, {total_volume} volume")

# Calculate stats
# users_ref = db.collection('users')
# pamm_dist_ref = db.collection('pamm_distributions')

# # Fetch all users and distributions
# users = list(users_ref.stream())
# pamm_distributions = list(pamm_dist_ref.stream())

# # Calculate metrics
# total_users = len(users)
# active_users = len([doc for doc in users if doc.to_dict().get('accountStatus') == 'active'])
# total_deposits = sum([doc.to_dict().get('balance', 0.0) for doc in users])
# total_volume = sum([
#     float(doc.to_dict().get('details', [{}])[0].get('net_amount', doc.to_dict().get('net_amount', 0.0)))
#     for doc in pamm_distributions
# ])

# # Create or update system_stats/current
# stats_ref = db.collection('system_stats').document('current')
# stats_ref.set({
#     'total_users': total_users,
#     'active_users': active_users,
#     'total_deposits': float(total_deposits),
#     'total_volume': float(total_volume),
#     'last_updated': firestore.SERVER_TIMESTAMP
# })

# print(f"System stats created: {total_users} users, {active_users} active, {total_deposits} deposits, {total_volume} volume")