// import { Test, TestingModule } from '@nestjs/testing';
// import { CustomersService } from './customers.service';

// describe('CustomersService', () => {
//   let service: CustomersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [CustomersService],
//     }).compile();

//     service = module.get<CustomersService>(CustomersService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CustomersService } from './customers.service';
import { CustomerModel, HistoryDevice } from './entities/customers.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { EmailService } from '../email/email.service';
import { DateTime } from 'luxon';
import * as crypto from 'crypto';

const customerModelMock = {
  create: jest.fn().mockReturnThis(),
  save: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
};

const emailServiceMock = {
  sendEmail: jest.fn(),
};

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getModelToken('customers'),
          useValue: customerModelMock,
        },
        {
          provide: EmailService,
          useValue: emailServiceMock,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insertNewCustomer', () => {
    it('should insert new customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        firstname: 'John',
        lastname: 'Doe',
        sex: 'M',
        birthdate: '1990-01-01',
        username: 'johndoe',
        password: 'password',
        email: 'johndoe@example.com',
        date_created: new Date(),
        device_history: [],
      };
      const newCustomer = {
        ...createCustomerDto,
        _id: '000000000001000000000005',
      };
      customerModelMock.save.mockResolvedValue(newCustomer);

      const result = await service.insertNewCustomer(createCustomerDto);

      expect(customerModelMock.create).toHaveBeenCalledWith(createCustomerDto);
      expect(customerModelMock.save).toHaveBeenCalled();
      console.log("============================\n",customerModelMock.create)
      expect(result).toEqual(newCustomer);
    });
  });

  describe('updateLatestDevice', () => {
    it('should update latest device and device history', async () => {
      const customerId = '000000000001000000000005';
      const latest_device = 'iPhone 13';
      const device_history: HistoryDevice = 
        {
          device: 'Iphone',
          ip: '111.111.111.111',
          date: '2022-01-01T01:00:00Z',
        };
      const customer =  new CustomerModel({
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
      customerModelMock.findById.mockResolvedValue(customer);

      const result = await service.updateLatestDevice(
        customerId,
        latest_device,
        device_history,
      );

      expect(customerModelMock.findById).toHaveBeenCalledWith(customerId);
      expect(customer.latest_device).toBe(latest_device);
      expect(customer.device_history).toEqual([device_history]);
      expect(customer.save).toHaveBeenCalled();
      expect(result).toEqual(customer);
    });
  });

  describe('getCustomer', () => {
    it('should return customer by email', async () => {
      const email = 'johndoe@example.com';
      const customer = {
        _id: '000000000001000000000005',
        email,
      };
      customerModelMock.findOne.mockResolvedValue(customer);

      const result = await service.getCustomer(email);
      const result2 = await service.getCustomerByEmail(email);

      expect(customerModelMock.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(customer);

      expect(customerModelMock.findOne).toHaveBeenCalledWith({ email });
      expect(result2).toEqual(customer);
    });
    it('should return customer by id', async () => {
      const id = '000000000001000000000005';
      const customer = {
        _id: id,
        email: 'jew@gmail.com'
      }
      customerModelMock.findById.mockResolvedValue(customer);

      const result = await service.getCustomerById(id);

      expect(customerModelMock.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(customer);
    });
  });
  describe('getHistory', () => {
    it('should return the device history of the customer', async () => {
      const customerId = '000000000001000000000005';
      const customer = new CustomerModel ({
        _id: '000000000001000000000005',
        firstname: 'John',
        lastname: 'Doe',
        sex: 'M',
        birthdate: '1990-01-01',
        username: 'johndoe',
        password: 'password',
        email: 'john.doe@example.com',
        date_created: new Date(),
        latest_device: 'iPhone X',
        device_history: [{ name: 'iPhone 8', date: new Date() }],
      });
      const expectedHistory = customer.device_history.reverse();
  
      jest.spyOn(CustomerModel, 'findById').mockResolvedValue(customer);
  
      const history = await service.getHistory(customerId);
  
      expect(history).toEqual(expectedHistory);
    });
  
    it('should return an empty array if the customer does not exist', async () => {
      const customerId = '000000000001000000000005';
  
      jest.spyOn(CustomerModel, 'findById').mockResolvedValue(null);
  
      const history = await service.getHistory(customerId);
  
      expect(history).toEqual([]);
    });
  });
  describe('Update information', () => {
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

    it('should update the customer information', async () => {
      const customerID = "000000000001000000000005";
      
      const result = await service.updateInformation(customerID, "Charnkij", "Suksuwanveeree", "Male", "1967-12-25", "hammyonlyone@gg.com");

      expect(customerModelMock.findById).toHaveBeenCalledWith(customerID);
      expect(result.firstname).toBe("Charnkij");
      expect(result.lastname).toBe("Suksuwanveeree");
      
    });
  })
  
});