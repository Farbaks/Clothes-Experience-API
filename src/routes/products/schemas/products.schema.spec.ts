import { ProductsSchema } from './products.schema';

describe('ProductsSchema', () => {
  it('should be defined', () => {
    expect(new ProductsSchema()).toBeDefined();
  });
});
