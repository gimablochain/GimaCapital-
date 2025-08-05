from firebase_admin import firestore, initialize_app, credentials
import json
import os
from dotenv import load_dotenv

load_dotenv()
service_account_json = os.getenv('FIREBASE_SERVICE_ACCOUNT')
cred = credentials.Certificate(json.loads(service_account_json))
initialize_app(cred)
db = firestore.client()

user_ref = db.collection("users").document("O1fCq9HG0jRgBtNWu9qS7TkfdPn1")
user_ref.set({
    "balance": 1000.0,  # Set an initial balance for testing
    "holdings": {},
    "lastUpdated": firestore.SERVER_TIMESTAMP
})
print("User document reset successfully")