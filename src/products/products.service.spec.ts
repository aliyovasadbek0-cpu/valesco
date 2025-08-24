import { Test, TestingModule } from '@nestjs/testing';
import { Products;Service } from './products.service';

describe('Products;Service', () => {
  let service: Products;Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Products;Service],
    }).compile();

    service = module.get<Products;Service>(Products;Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
