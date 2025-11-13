import mongoose from 'mongoose';
import { connectDB } from '../../../src/config/db';

jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(undefined),
  connection: {
    syncIndexes: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('config/db (connectDB)', () => {
  const OLD_ENV = process.env;

  let exitSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };

    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // 👇 OJO: guardamos el spy en una variable
    exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(((code?: number | string | null) => {
        throw new Error('process.exit called ' + code);
      }) as never);
  });

  afterEach(() => {
    process.env = OLD_ENV;
    logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore(); // 👈 ya no casteamos process.exit
  });

  it('conecta correctamente cuando MONGO_URI es válida', async () => {
    process.env.MONGO_URI = 'mongodb://user:pass@localhost:27017/testdb';

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect((mongoose.connection as any).syncIndexes).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled();
  });

  it('lanza error cuando MONGO_URI es inválida', async () => {
    process.env.MONGO_URI = 'invalid';

    await expect(connectDB()).rejects.toThrow('process.exit called');
    expect(console.error).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
