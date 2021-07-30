import { FilterPipePedido } from './filterPedido.pipe';

describe('FilterPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterPipePedido();
    expect(pipe).toBeTruthy();
  });
});