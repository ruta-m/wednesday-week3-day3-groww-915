import axios from 'axios';
import { login } from '../login';
import { BASE_URL } from '../config';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('login', () => {
  const mockUser = 'testuser';
  const mockPass = 'password123';
  const mockAuthResponse = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: { id: 1, name: 'Test User' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully logs in with valid credentials', async () => {
    // Setup Mock: Simulate a successful 200 OK response
    mockedAxios.post.mockResolvedValueOnce({ data: mockAuthResponse });

    const result = await login(mockUser, mockPass);

    // Verify the POST call details
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${BASE_URL}/v1/api/auth/login`,
      {
        username: mockUser,
        password: mockPass
      },
      expect.objectContaining({
        headers: expect.any(Object)
      })
    );

    // Verify the return value matches what the API "sent"
    expect(result).toEqual(mockAuthResponse);
  });

  it('throws an error and logs details on 401 Unauthorized', async () => {
    // Setup Mock: Simulate a failed login
    const apiError = {
      response: {
        data: { message: 'Invalid credentials' }
      }
    };
    mockedAxios.post.mockRejectedValueOnce(apiError);

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(login(mockUser, 'wrong-pass')).rejects.toEqual(apiError);
    
    // Verify the error was logged as per your code's logic
    expect(consoleSpy).toHaveBeenCalledWith("Login Error Details:", apiError.response.data);

    consoleSpy.mockRestore();
  });

  it('sends the correct request body format', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} });
    
    await login('admin', '1234');

    // Access the actual arguments passed to the mock to verify the body keys
    const [url, body] = mockedAxios.post.mock.calls[0];
    
    expect(body).toHaveProperty('username', 'admin');
    expect(body).toHaveProperty('password', '1234');
  });
});