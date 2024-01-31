import { HttpStatus } from '@nestjs/common';

export type ErrorDetail = {
  code: string;
  message: string;
  status: number;
};

export const RentsError = {
  MULTI_RENTED: 'E_USER_MULTI_RENTED',
  SCOOTER_RENTED: 'E_SCOOTER_RENTED',
  SCOOTER_NOT_EXISTS: 'E_SCOOTER_NOT_EXISTS',
  RECORD_NOT_EXISTS: 'E_RENT_RECORD_NOT_EXISTS',
  TOKEN_INVALID: 'E_RENT_TOKEN_INVALID',
};

export const RentsErrorDetail: { [key: string]: ErrorDetail } = {
  E_SCOOTER_RENTED: {
    code: 'E_SCOOTER_RENTED',
    message: 'Scooter has been rented',
    status: HttpStatus.BAD_REQUEST,
  },
  E_USER_MULTI_RENTED: {
    code: 'E_USER_MULTI_RENTED',
    message: 'User has rented a scooter',
    status: HttpStatus.BAD_REQUEST,
  },
  E_SCOOTER_NOT_EXISTS: {
    code: 'E_SCOOTER_NOT_EXISTS',
    message: 'Scooter not exists',
    status: HttpStatus.BAD_REQUEST,
  },
  E_RENT_RECORD_NOT_EXISTS: {
    code: 'E_SCOOTER_RENTED',
    message: 'Rent record not found',
    status: HttpStatus.BAD_REQUEST,
  },
  E_RENT_TOKEN_INVALID: {
    code: 'E_RENT_TOKEN_INVALID',
    message: 'Rent token invalid',
    status: HttpStatus.BAD_REQUEST,
  },
};
