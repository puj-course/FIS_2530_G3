import { AppConfig } from '../../frontend/src/config/AppConfig';


describe('AppConfig (smoke)', () => {
  it('getInstancia retorna singleton', () => {
    const a = AppConfig.getInstancia();
    const b = AppConfig.getInstancia();
    expect(a).toBe(b);
  });

  it('get("API_BASE") usa fallback por defecto si VITE_API_URL no está', () => {
    const cfg = AppConfig.getInstancia();
    const base = cfg.get('API_BASE');
    expect(base).toBe('http://localhost:3000/api');
  });
});
