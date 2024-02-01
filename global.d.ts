/// <reference types="jest-extended" />

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_DATABASE: string;
    POSTGRES_USERNAME: string;
    POSTGRES_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
  }
}
