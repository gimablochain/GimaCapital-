import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});





// aiodns==3.2.0
// aiofiles==24.1.0
// aiohappyeyeballs==2.4.4
// aiohttp==3.10.11
// aiosignal==1.3.2
// annotated-types==0.7.0
// anyio==4.4.0
// APScheduler==3.10.4
// asgiref==3.8.1
// asyncio==3.4.3
// attrs==25.1.0
// blinker==1.8.2
// CacheControl==0.14.0
// cachetools==5.5.0
// ccxt==4.4.52
// certifi==2024.8.30
// cffi==1.17.0
// charset-normalizer==3.3.2
// click==8.1.7
// colorama==0.4.6
// cryptography==43.0.0
// fastapi==0.114.0
// firebase-admin==6.5.0
// Flask==3.0.3
// Flask-Cors==5.0.0
// frozenlist==1.5.0
// google-api-core==2.19.2
// google-api-python-client==2.143.0
// google-auth==2.34.0
// google-auth-httplib2==0.2.0
// google-cloud-core==2.4.1
// google-cloud-firestore==2.18.0
// google-cloud-storage==2.18.2
// google-crc32c==1.5.0
// google-resumable-media==2.7.2
// googleapis-common-protos==1.65.0
// grpcio==1.66.1
// grpcio-status==1.66.1
// gunicorn==23.0.0
// h11==0.14.0
// h2==4.1.0
// hpack==4.0.0
// httpcore==1.0.5
// httplib2==0.22.0
// httpx==0.27.2
// Hypercorn==0.17.3
// hyperframe==6.0.1
// idna==3.8
// itsdangerous==2.2.0
// Jinja2==3.1.4
// joblib==1.4.2
// MarkupSafe==2.1.5
// msgpack==1.0.8
// multidict==6.1.0
// numpy==2.2.2
// packaging==24.1
// pandas==2.2.3
// pandas_ta==0.3.14b0
// priority==2.0.0
// propcache==0.2.1
// proto-plus==1.24.0
// protobuf==5.28.0
// pyasn1==0.6.0
// pyasn1_modules==0.4.0
// pycares==4.5.0
// pycparser==2.22
// pydantic==2.9.0
// pydantic_core==2.23.2
// PyJWT==2.9.0
// pyparsing==3.1.4
// python-dateutil==2.9.0.post0
// python-dotenv==1.0.1
// python-telegram-bot==21.6
// pytz==2024.1
// Quart==0.19.6
// quart-cors==0.7.0
// requests==2.32.3
// rsa==4.9
// setuptools==75.8.0
// six==1.16.0
// sniffio==1.3.1
// starlette==0.38.4
// typing_extensions==4.12.2
// tzdata==2024.1
// tzlocal==5.2
// uritemplate==4.1.1
// urllib3==2.2.2
// uvicorn==0.30.6
// waitress==3.0.0
// Werkzeug==3.0.4
// wsproto==1.2.0
// yarl==1.18.3
