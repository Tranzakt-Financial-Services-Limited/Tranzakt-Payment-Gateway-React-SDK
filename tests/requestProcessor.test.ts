import { ApiError } from "../src";
import { requestProcessor } from "../src/utils/request-processor";

describe("Test request processor", () => {
  const mockUrl = "/test-endpoint";

  // Reset fetch mock before each test
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("should process a successful request with StandardApiResponse structure", async () => {
    const mockData = { someField: "someValue" };
    const mockStandardResponse = {
      data: mockData,
      status: 200,
      message: "Success",
    };
    const expectedResponse = {
      success: true,
      data: mockData,
      status: 200,
      message: "Success",
    };

    // Mock fetch to return a standard API response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockStandardResponse),
    });

    const response = await requestProcessor({
      url: mockUrl,
      method: "POST",
      data: { key: "value" },
    });

    expect(response).toEqual(expectedResponse);
  });

  it("should process a successful request with direct data response", async () => {
    const mockData = { someField: "someValue" };
    const expectedResponse = {
      success: true,
      data: mockData,
      status: 200,
      message: "Success",
    };

    // Mock fetch to return raw data
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    });

    const response = await requestProcessor({
      url: mockUrl,
      method: "GET",
    });

    expect(response).toEqual(expectedResponse);
  });

  it("should handle a 400 Bad Request error with minimal error response", async () => {
    const expectedResponse = {
      success: false,
      data: null,
      status: 400,
      message: "Bad Request",
    };

    // Mock fetch to return a response with minimal error info
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: () => Promise.reject(new Error("Parsing error")),
    });

    const response = await requestProcessor({
      url: mockUrl,
      method: "POST",
      data: { key: "value" },
    });

    expect(response).toEqual(expectedResponse);
  });

  it("should handle a 404 Not Found error", async () => {
    const mockError: ApiError = {
      status: 404,
      message: "Resource not found",
      type: "NotFound",
      errors: ["The requested resource does not exist"],
    };

    const expectedResponse = {
      success: false,
      data: null,
      status: 404,
      message: "Resource not found",
    };

    // Mock fetch to return a 404 error
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(mockError),
    });

    const response = await requestProcessor({
      url: mockUrl,
      method: "GET",
    });

    expect(response).toEqual(expectedResponse);
  });

  it("should handle a network error with undefined error message", async () => {
    const expectedResponse = {
      success: false,
      data: null,
      status: 500,
      message: "",
    };

    // Mock fetch to throw an error with no message
    (global.fetch as jest.Mock).mockRejectedValue(new Error());

    const response = await requestProcessor({
      url: mockUrl,
      method: "PUT",
      data: { key: "value" },
      headers: { "Custom-Header": "test" },
    });

    expect(response).toEqual(expectedResponse);
  });

  it("should send custom headers with the request", async () => {
    const mockData = { result: "success" };
    const customHeaders = {
      Authorization: "Bearer token",
      "Custom-Header": "test-value",
    };

    // Mock fetch to verify headers are sent correctly
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    });

    await requestProcessor({
      url: mockUrl,
      method: "DELETE",
      headers: customHeaders,
    });

    // Verify fetch was called with correct config
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(mockUrl),
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          ...customHeaders,
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
      })
    );
  });
  it("should use fallback message when errorResponse.message is undefined", async () => {
    const errorResponse = {
      status: 500,
      // Intentionally omit the message property
      type: "UnknownError",
    };

    const expectedResponse = {
      success: false,
      data: null,
      status: 500,
      message: "An error occurred",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve(errorResponse),
    });

    const response = await requestProcessor({
      url: mockUrl,
      method: "POST",
      data: { key: "value" },
    });

    expect(response).toEqual(expectedResponse);
  });
});
