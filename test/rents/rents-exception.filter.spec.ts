import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { RentsError, RentsErrorDetail } from '../../src/rents/rents.exception';
import { RentsExceptionFilter } from '../../src/rents/rents-exception.filter';

describe('RentsExceptionFilter', () => {
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const mockContext = {
    getResponse: jest.fn().mockReturnValue(mockResponse),
  };
  const mockArgsHost = {
    switchToHttp: jest.fn().mockReturnValue(mockContext),
  } as unknown as ArgumentsHost;
  const exceptionFilter = new RentsExceptionFilter();

  it('should convert Error into HttpException', () => {
    const error = new Error(RentsError.MULTI_RENTED);
    const errorDetail = RentsErrorDetail[RentsError.MULTI_RENTED];

    exceptionFilter.catch(error, mockArgsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(errorDetail.status);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: errorDetail.status,
      code: errorDetail.code,
      message: errorDetail.message,
      timestamp: expect.toBeString(),
    });
  });

  it('should convert into 500 error when error code not listed', () => {
    const error = new Error('E_BRAND_NEW_ERROR');

    exceptionFilter.catch(error, mockArgsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.toBeString(),
    });
  });
});
