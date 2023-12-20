import { cleanEnv } from 'envalid';
import { str, port } from 'envalid/dist/validators';

export default cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: port({ default: 4000 }),
    JWT_ACCESS: str(),
    JWT_REFRESH: str(),
    CORS_ORIGIN: str(),
    MONGO_URI: str(),
    USERNAME: str(),
    PASSWORD: str(),
    EMAIL: str(),
    NODEMAILER_EMAIL: str(),
    NODEMAILER_PASSWORD: str(),
    SEMPAHORE_SENDER: str(),
    SEMAPHORE_KEY: str(),
});
