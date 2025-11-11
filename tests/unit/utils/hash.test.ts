import bcrypt from 'bcrypt';

import * as hashUtils from '../../../src/utils/hash';

jest.mock('bcrypt');

describe('utils/hash', () => {
  const plain = 'MiSecreta#123';
  const fakeHash = '$2b$10$fakehash';

  it('hashPassword delega en bcrypt.hash', async () => {
    (bcrypt.hash as unknown as jest.Mock).mockResolvedValue(fakeHash);

    const res = await hashUtils.hashPassword(plain);

    expect(res).toBe(fakeHash);
    expect(bcrypt.hash).toHaveBeenCalledWith(plain, expect.any(Number));
  });

  it('comparePassword delega en bcrypt.compare', async () => {
    (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(true);

    const ok = await hashUtils.comparePassword(plain, fakeHash);

    expect(ok).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith(plain, fakeHash);
  });

  it('comparePassword maneja false correctamente', async () => {
    (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(false);

    const ok = await hashUtils.comparePassword('otra', fakeHash);

    expect(ok).toBe(false);
  });
});
