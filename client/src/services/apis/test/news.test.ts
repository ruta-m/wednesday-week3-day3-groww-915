import axios from 'axios';
import { getMarketNews } from '../news';
import { BASE_URL } from '../config';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getMarketNews', () => {
  const mockToken = 'fake-token-123';
  const mockNewsData = [
    { id: 1, title: 'Market Hits Record High' },
    { id: 2, title: 'Tech Stocks Rally' }
  ];

  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => mockToken),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches market news successfully from the API', async () => {
    // Setup mock response
    mockedAxios.get.mockResolvedValueOnce({ data: mockNewsData });

    const result = await getMarketNews();

    // Verify the URL and headers
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${BASE_URL}/v1/api/stocks/news?top=10&skip=0`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'source': 'web'
        })
      })
    );

    // Verify returned data
    expect(result).toEqual(mockNewsData);
  });

  it('throws an error when the API call fails', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(getMarketNews()).rejects.toThrow(errorMessage);
  });
});