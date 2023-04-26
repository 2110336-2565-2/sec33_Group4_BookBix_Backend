import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerModel, HistoryDevice } from './entities/customers.entity';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            updateInformation: jest.fn(),
            getCustomerById: jest.fn(),
            getHistory: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('updateProfile', () => {
    it('should update customer profile', async () => {
      const req = { params: { id: '1' } };
      const firstname = 'John';
      const lastname = 'Doe';
      const sex = 'male';
      const birthdate = '01-01-2000';
      const email = 'johndoe@example.com';

      jest.spyOn(service, 'updateInformation').mockImplementation();

      const result = await controller.updateProfile(
        req,
        firstname,
        lastname,
        sex,
        birthdate,
        email,
      );

      expect(result).toEqual({
        status: HttpStatus.OK,
        msg: 'Customer updated',
      });
      expect(service.updateInformation).toHaveBeenCalledWith(
        '1',
        firstname,
        lastname,
        sex,
        birthdate,
        email,
      );
    });

    it('should return error when update customer profile fails', async () => {
      const req = { params: { id: '1' } };
      const firstname = 'John';
      const lastname = 'Doe';
      const sex = 'male';
      const birthdate = '01-01-2000';
      const email = 'johndoe@example.com';

      jest.spyOn(service, 'updateInformation').mockImplementation(() => {
        throw new Error();
      });

      const result = await controller.updateProfile(
        req,
        firstname,
        lastname,
        sex,
        birthdate,
        email,
      );

      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        msg: 'Customer not updated',
      });
      expect(service.updateInformation).toHaveBeenCalledWith(
        '1',
        firstname,
        lastname,
        sex,
        birthdate,
        email,
      );
    });
  });

  describe('getCustomer', () => {
    it('should get customer by ID', async () => {
      const customerId = "000000000001000000000005";
      const customer = new CustomerModel({
        _id: '000000000001000000000005',
        firstname: 'David',
        lastname: 'Williams',
        sex: 'Male',
        birthdate: '1987-12-25',
        username: 'davidw87',
        password: '$2a$12$rCMpOnOuZMulEy.SrzMH7.mx3gzWgwVh96EgIuKuvYXI7A.9SBJJK', //test123
        email: 'davidw87@gmail.com',
        date_created: new Date('2022-10-20T09:00:00.000Z'),
        device_history: ['WINDOWS - CHROME - 192.168.0.1'],
      });

      jest.spyOn(service, 'getCustomerById').mockResolvedValue(customer);

      const result = await controller.getCustomer(customerId);

      expect(result).toEqual(customer);
      expect(service.getCustomerById).toHaveBeenCalledWith(customerId);
    });
  });

  describe('getHistory', () => {
    const mockHistory: HistoryDevice[] = [
      {
        device: 'Mac',
        ip: '111.111.111.111',
        date: '2022-01-01T00:00:00Z',
      },
      {
        device: 'Iphone',
        ip: '111.111.111.111',
        date: '2022-01-01T01:00:00Z',
      },
    ];

    it('should return customer history by ID', async () => {
      jest.spyOn(service, 'getHistory').mockResolvedValueOnce(mockHistory);

      expect(await controller.getHistory('1')).toEqual(mockHistory);
    });
  });
});