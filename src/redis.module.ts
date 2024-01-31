import {
  Module,
  DynamicModule,
  FactoryProvider,
  ValueProvider,
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

const createRedisClientProvider = (
  options: RedisOptions,
): FactoryProvider<Redis> => {
  const client = new Redis(options);

  return {
    provide: REDIS_CLIENT_TOKEN,
    useFactory: (): Redis => client,
  };
};

@Module({})
export class RedisModule {
  constructor(private moduleRef: ModuleRef) {}

  static forRoot(options: RedisOptions, isGlobal = true): DynamicModule {
    const redisOptionsProvider = createRedisOptionsProvider(options);
    const redisClientProvider = createRedisClientProvider(options);

    return {
      global: isGlobal,
      module: RedisModule,
      providers: [redisOptionsProvider, redisClientProvider],
      exports: [redisOptionsProvider, redisClientProvider],
    };
  }
}
