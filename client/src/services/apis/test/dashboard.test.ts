import axios from 'axios';
import { getDashboardConfig } from '../dashboard';
import { BASE_URL } from '../config';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getDashboardConfig', () => {
  const mockToken = 'valid-bearer-token';
  const mockDashboardData = {
    theme: 'dark',
    widgets: ['portfolio', 'watchlist'],
    refreshRate: 3000
  };

  beforeEach(() => {
    // Clear localStorage before each test
    jest.spyOn(Storage.prototype, 'getItem');
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches dashboard config successfully when token exists', async () => {
    // 1. Setup Mock: localStorage returns a token
    Storage.prototype.getItem = jest.fn().mockReturnValue(mockToken);
    
    // 2. Setup Mock: Axios returns success
    mockedAxios.get.mockResolvedValueOnce({ data: mockDashboardData });

    const result = await getDashboardConfig();

    // Verify correct URL and headers were used
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${BASE_URL}/v1/api/profile/dashboard-config`,
      expect.objectContaining({
        headers: expect.anything() // getAuthHeaders logic is handled here
      })
    );
    
    expect(result).toEqual(mockDashboardData);
  });

  it('throws an explicit error if bearer_token is missing', async () => {
    // Setup Mock: localStorage returns null
    Storage.prototype.getItem = jest.fn().mockReturnValue(null);

    await expect(getDashboardConfig()).rejects.toThrow("No bearer token found in storage");
    
    // Ensure axios was never even called
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('logs and re-throws error when the API call fails', async () => {
    // Setup Mock: Token exists but API fails
    Storage.prototype.getItem = jest.fn().mockReturnValue(mockToken);
    const apiError = new Error('Unauthorized');
    mockedAxios.get.mockRejectedValueOnce(apiError);

    // Spy on console.error to verify it was called
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(getDashboardConfig()).rejects.toThrow('Unauthorized');
    expect(consoleSpy).toHaveBeenCalledWith("Dashboard API Error:", expect.anything());

    consoleSpy.mockRestore();
  });
});