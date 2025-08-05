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


# # Verify and fix pamm_distributions
# dist_ref = db.collection('pamm_distributions')
# for doc in dist_ref.stream():
#     data = doc.to_dict()
#     print(f"Before update - Document {doc.id}: {data}")
    
#     # Extract net_amount and user_id from details if available
#     details = data.get('details', [])
#     net_amount = float(data.get('net_amount', 0.0))
#     user_id = data.get('user_id', 'N/A')
    
#     if details and len(details) > 0:
#         net_amount = float(details[0].get('net_amount', net_amount))
#         user_id = details[0].get('user_id', user_id)
    
#     # Set defaults and ensure correct types
#     updates = {
#         'user_id': user_id,
#         'net_amount': net_amount,
#         'amount': net_amount,
#         'type': 'pamm_distribution',
#         'timestamp': data.get('timestamp', firestore.SERVER_TIMESTAMP),
#         'updated_at': firestore.SERVER_TIMESTAMP
#     }
    
#     # Specific fixes for known documents
#     if doc.id == 'Ije2GEwSzszLvrf3ZGlL':
#         updates.update({
#             'user_id': '9WOrKsgWvQQXiim4rZFxFwIemCJ3',
#             'net_amount': 213.2,
#             'amount': 213.2,
#             'type': 'pamm_distribution',
#             'timestamp': datetime(2025, 7, 4, 14, 6, 30, tzinfo=timezone.utc),
#             'updated_at': datetime(2025, 7, 4, 14, 6, 30, tzinfo=timezone.utc)
#         })
#     elif doc.id == 'WDS4VZNOvy9d4d9ou6qi':
#         updates.update({
#             'user_id': '9WOrKsgWvQQXiim4rZFxFwIemCJ3',
#             'net_amount': 309.2,
#             'amount': 309.2,
#             'type': 'pamm_distribution',
#             'timestamp': datetime(2025, 7, 4, 14, 7, 41, tzinfo=timezone.utc),
#             'updated_at': datetime(2025, 7, 4, 14, 7, 41, tzinfo=timezone.utc)
#         })
    
#     dist_ref.document(doc.id).set(updates, merge=True)
#     print(f"Updated {doc.id} with {updates}")

# print("PAMM distributions verified and updated successfully")