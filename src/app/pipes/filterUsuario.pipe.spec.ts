import { FilterPipeUsuario } from './filterUsuario.pipe';

describe('FilterPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterPipeUsuario();
    expect(pipe).toBeTruthy();
  });
});