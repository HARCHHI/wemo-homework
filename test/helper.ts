export function createMockRepo(mockEntity) {
  return {
    find: jest.fn().mockReturnValue([mockEntity]),
    findOne: jest.fn().mockReturnValue(mockEntity),
    findOneBy: jest.fn().mockReturnValue(mockEntity),
    update: jest.fn().mockReturnValue(null),
    insert: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(null),
  };
}

export function createMockRedis() {
  return {
    hset: jest.fn().mockResolvedValue(1),
    zadd: jest.fn().mockResolvedValue(null),
    zrange: jest.fn().mockResolvedValue([1]),
    zrem: jest.fn().mockResolvedValue(null),
    hdel: jest.fn().mockResolvedValue(null),
    disconnect: jest.fn(),
  };
}
