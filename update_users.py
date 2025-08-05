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
# # Update users
# users_ref = db.collection('users')




# # User 1: 9WOrKsgWvQQXiim4rZFxFwIemCJ3
# user_ref = users_ref.document('9WOrKsgWvQQXiim4rZFxFwIemCJ3')
# user_ref.set({
#     'email': 'gideonandcobuilding@gmail.com',
#     'balance': 1720.0,
#     'accountStatus': 'active',
#     'createdAt': datetime(2025, 7, 4, 13, 0, 45, tzinfo=timezone.utc),
#     'updatedAt': datetime(2025, 7, 4, 13, 0, 45, tzinfo=timezone.utc),
#     'is_admin': True,
#     'is_premium': True,
#     'displayName': 'Gideon Gideon',
#     'holdings': 0.0,
#     'profit': 0.0,
#     'tradingEnabled': False,
#     'uid': '9WOrKsgWvQQXiim4rZFxFwIemCJ3'
# }, merge=True)

# # User 2: GGtuy5Ks3PgZ7qsx6762LD8IoOK2
# user_ref = users_ref.document('GGtuy5Ks3PgZ7qsx6762LD8IoOK2')
# user_ref.set({
#     'email': 'user2@example.com',
#     'balance': 10000.0,
#     'accountStatus': 'active',
#     'createdAt': datetime(2025, 7, 2, 20, 0, 0, tzinfo=timezone.utc),
#     'updatedAt': datetime(2025, 7, 3, 14, 0, 0, tzinfo=timezone.utc),
#     'is_admin': False,
#     'is_manager': True,
#     'is_premium': False,
#     'displayName': 'User Two',
#     'holdings': 0.0,
#     'profit': 0.0,
#     'tradingEnabled': True,
#     'uid': 'GGtuy5Ks3PgZ7qsx6762LD8IoOK2'
# }, merge=True)

# print("User documents updated successfully")