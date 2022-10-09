import { logging } from '../logger.js'
const { createLogger, format, transports } = require('winston');

jest.mock('winston', () => {
  const mFormat = {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
  };
  const mTransports = {
    Console: jest.fn(),
    File: jest.fn(),
  };
  const mLogger = {
    info: jest.fn(),
  };
  return {
    format: mFormat,
    transports: mTransports,
    createLogger: jest.fn(() => mLogger),
  };
});

describe('logger', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get all indexes of given value within array', () => {
    const testLogger = logging('test');

    let templateFunctions = [];
    
    format.printf.mockImplementation((templateFn) => {
      templateFunctions.push(templateFn);
    });

    const info = {
      timestamp: 123,
      level: 'info',
      message: 'haha',
    };

    testLogger.log('info', info);

    const tFn1 = templateFunctions.shift();
    expect(tFn1(info)).toBe(`${info.timestamp} ${info.level}: ${info.message}`);
    
    const tFn2 = templateFunctions.shift();
    expect(tFn2(info)).toBe(`${info.level}: ${info.message}`);

    expect(format.combine).toBeCalledTimes(2);
    expect(format.timestamp).toBeCalledWith({ format: 'YYYY-MM-DD HH:mm:ss' });
    expect(format.printf).toBeCalledWith(expect.any(Function));
    expect(transports.Console).toBeCalledTimes(1);
    expect(createLogger).toBeCalledTimes(1);

  });
});

