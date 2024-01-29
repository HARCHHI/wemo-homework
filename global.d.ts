/// <reference types="jest-extended" />

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    DB_TYPE: 'postgres';
    DB_HOST: string;
    DB_PORT: string;
    DB_DATABASE: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
  }
}
