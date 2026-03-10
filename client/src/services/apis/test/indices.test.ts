import axios from 'axios';
import { getIndicesConfig } from '../indices';
import { BASE_URL } from '../config';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getIndicesConfig', () => {
  const mockToken = 'indices-token-abc';
  const mockIndicesResponse = {
    indices: [
      { id: 'nifty50', name: 'Nifty 50', order: 1 },
      { id: 'sensex', name: 'SENSEX', order: 2 }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage before each test
    Storage.prototype.getItem = jest.fn();
  });

  it('fetches indices ordering from the BFF successfully', async () => {
    // 1. Setup Mock: Token exists in storage
    (Storage.prototype.getItem as jest.Mock).mockReturnValue(mockToken);
    
    // 2. Setup Mock: Axios returns success response
    mockedAxios.get.mockResolvedValueOnce({ data: mockIndicesResponse });

    const result = await getIndicesConfig();

    // Verify the correct BFF endpoint is called
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${BASE_URL}/v1/middleware-bff/profile/indices-ordering`,
      expect.objectContaining({
        headers: expect.anything()
      })
    );

    // Verify we get the indices object back
    expect(result).toEqual(mockIndicesResponse);
    expect(result.indices).toHaveLength(2);
  });

  it('throws "No bearer token found" if localStorage is empty', async () => {
    // Mock localStorage returning null
    (Storage.prototype.getItem as jest.Mock).mockReturnValue(null);

    await expect(getIndicesConfig()).rejects.toThrow("No bearer token found");
    
    // Ensure the API was never called without a token
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('logs the error message correctly on API failure', async () => {
    (Storage.prototype.getItem as jest.Mock).mockReturnValue(mockToken);
    
    const apiError = new Error('Gateway Timeout');
    mockedAxios.get.mockRejectedValueOnce(apiError);

    // Spy on console.error to check the logic in your catch block
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(getIndicesConfig()).rejects.toThrow('Gateway Timeout');
    
    // Your code logs: "Indices API Error:" + error.message
    expect(consoleSpy).toHaveBeenCalledWith("Indices API Error:", "Gateway Timeout");

    consoleSpy.mockRestore();
  });
});