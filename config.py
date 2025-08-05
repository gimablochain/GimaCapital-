import os
import json
import logging
import firebase_admin
from firebase_admin import credentials, firestore
from stellar_sdk import Keypair
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('pamm_api.log'),
        logging.StreamHandler()
    ],
    encoding='utf-8'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Firebase
def initialize_firebase():
    try:
        service_account_json = os.getenv('FIREBASE_SERVICE_ACCOUNT')
        if not service_account_json:
            raise ValueError("FIREBASE_SERVICE_ACCOUNT not found in .env")
        cred_dict = json.loads(service_account_json)
        cred = credentials.Certificate(cred_dict)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        # logger.info("Initialized Firebase Firestore: (default)")
        return db
    except Exception as e:
        logger.error(f"Failed to initialize Firebase: {str(e)}", exc_info=True)
        raise

# Initialize Stellar
def initialize_stellar():
    try:
        master_secret = os.getenv('STELLAR_MASTER_SECRET')
        if master_secret:
            keypair = Keypair.from_secret(master_secret)
            # logger.info(f"Loaded existing Stellar master account: {keypair.public_key}")
        else:
            keypair = Keypair.random()
            # logger.info(f"Generated new Stellar master account: {keypair.public_key}")
        return keypair, keypair.public_key
    except Exception as e:
        logger.error(f"Failed to initialize Stellar: {str(e)}", exc_info=True)
        raise

# Initialize globals
db = initialize_firebase()
MASTER_KEYPAIR, MASTER_PUBLIC_KEY = initialize_stellar()



