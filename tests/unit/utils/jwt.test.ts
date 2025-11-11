import * as jwt from 'jsonwebtoken';
import { signJwt, verifyJwt } from '../../../src/utils/jwt';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('utils/jwt', () => {
  const payload = { sub: 'u123', rol: 'user' };

  it('signJwt usa jwt.sign', () => {
    (jwt.sign as jest.Mock).mockReturnValue('TOKEN_FAKE');

    const token = signJwt(payload);

    expect(token).toBe('TOKEN_FAKE');
    expect(jwt.sign).toHaveBeenCalledWith(
      payload,
      expect.anything(),
      expect.objectContaining({ expiresIn: expect.any(String) })
    );
  });

  it('verifyJwt ok', () => {
    (jwt.verify as jest.Mock).mockReturnValue(payload);

    const result = verifyJwt('TOKEN_FAKE');

    expect(result).toEqual(payload);
    expect(jwt.verify).toHaveBeenCalledWith('TOKEN_FAKE', expect.anything());
  });

  it('verifyJwt retorna null si hay error', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('bad'); });

    const res = verifyJwt('BAD');

    expect(res).toBeNull();
  });
});
