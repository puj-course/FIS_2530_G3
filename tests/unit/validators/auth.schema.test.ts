import { registerSchema, loginSchema } from '../../../src/validators/auth.schema';

describe('validators/auth.schema', () => {
  it('registerSchema acepta payload válido', () => {
    const { error } = registerSchema.validate({
      username: 'sam',
      email: 'sam@example.com',
      password: '12345678',
    });
    expect(error).toBeUndefined();
  });

  it('registerSchema rechaza password corto', () => {
    const { error } = registerSchema.validate({
      username: 'sam',
      email: 'sam@example.com',
      password: '123',
    });
    expect(error).toBeDefined();
  });

  it('loginSchema acepta payload válido', () => {
    const { error } = loginSchema.validate({
      email: 'sam@example.com',
      password: '12345678',
    });
    expect(error).toBeUndefined();
  });

  it('loginSchema rechaza email inválido', () => {
    const { error } = loginSchema.validate({
      email: 'no-es-email',
      password: '12345678',
    });
    expect(error).toBeDefined();
  });
});
