import Redis from 'ioredis';
import { DynamicModule, FactoryProvider, ValueProvider } from '@nestjs/common';
import { RedisModule, REDIS_OPTIONS_TOKEN } from '../src/redis.module';

jest.mock('ioredis', () => ({
  default: jest.fn().mockImplementation(() => {}),
}));

describe('RedisModule', () => {
  const redisOption = { host: '0.0.0.0' };
  let redisModule: DynamicModule;

  beforeAll(() => {
    redisModule = RedisModule.forRoot(redisOption);
  });

  it('should return a DynamicModule', () => {
    expect(redisModule.global).toBeBoolean();
    expect(redisModule.providers).toHaveLength(2);
    expect(redisModule.exports).toHaveLength(2);
    expect(redisModule.module).toEqual(RedisModule);
  });

  it('should wrap options to a ValueProvider', () => {
    const [redisOptionProvider] = redisModule.providers;
    const { provide, useValue } = redisOptionProvider as ValueProvider;

    expect(provide).toEqual(REDIS_OPTIONS_TOKEN);
    expect(useValue).toEqual(redisOption);
  });

  it('should create redis instance from factory', () => {
    const [, redisClientProvider] = redisModule.providers;

    const client = (redisClientProvider as FactoryProvider).useFactory();

    expect(client).toBeInstanceOf(Redis);
  });
});
