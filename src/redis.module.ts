import {
  Module,
  DynamicModule,
  FactoryProvider,
  ValueProvider,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import Redis, { RedisOptions } from 'ioredis';

export const REDIS_OPTIONS_TOKEN = Symbol('REDIS_OPTIONS');
export const REDIS_CLIENT_TOKEN = Symbol('REDIS_CLIENT');

const createRedisOptionsProvider = (
  options: RedisOptions,
): ValueProvider<RedisOptions> => ({
  provide: REDIS_OPTIONS_TOKEN,
  useValue: options,
});

const redisClientProvider: FactoryProvider<Redis> = {
  provide: REDIS_CLIENT_TOKEN,
  useFactory: (options: RedisOptions): Redis => {
    const client = new Redis(options);

    return client;
  },
  inject: [REDIS_OPTIONS_TOKEN],
};

@Module({})
export class RedisModule implements OnApplicationShutdown {
  constructor(private moduleRef: ModuleRef) {}

  static forRoot(options: RedisOptions, isGlobal = true): DynamicModule {
    const redisOptionsProvider = createRedisOptionsProvider(options);
    return {
      global: isGlobal,
      module: RedisModule,
      providers: [redisOptionsProvider, redisClientProvider],
      exports: [redisOptionsProvider, redisClientProvider],
    };
  }

  onApplicationShutdown() {}
}
