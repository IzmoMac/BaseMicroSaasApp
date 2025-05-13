import { jwtDecode, type JwtPayload } from 'jwt-decode';
import Cookies from 'js-cookie';
//import { useAuth } from "./AuthContext";


const clearTokens = (): void => {
    // Example using localStorage
    Cookies.remove('refreshToken');
    Cookies.remove('userId');


    // Maybe redirect to login page or show an error
    console.error('Tokens cleared. Please log in again.');
    // Example redirect (in a browser environment)
    window.location.href = '/login';
};

/**
 * Checks if a JWT is expired or will expire within a given buffer time.
 * @param token The JWT string.
 * @param bufferMilliseconds The time in milliseconds before expiration to consider the token "expiring". Defaults to 30 seconds.
 * @returns True if the token is expired or expiring soon, false otherwise.
 */
const isTokenExpiring = (
    token: string | null | undefined,
    bufferMilliseconds: number = 30000 // 30 seconds
): boolean => {
    if (!token) {
        return true;
    }

    try {
        const decoded: JwtPayload = jwtDecode(token);
        if (!decoded.exp) {
            // Token has no expiration date, treat as valid or handle as an error
            console.warn('JWT has no exp claim');
            return false; // Or true, depending on your policy
        }

        const expirationTimeMs = decoded.exp * 1000; // exp is in seconds
        const currentTimeMs = Date.now();

        return expirationTimeMs < currentTimeMs + bufferMilliseconds;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        // If decoding fails, assume token is invalid/expired
        return true;
    }
};

/**
 * Calls your refresh token API endpoint.
 * @returns A promise that resolves with new access and refresh tokens.
 */
const callRefreshTokenApi = async (): Promise<{ token: string|null|undefined; }> => {
    try {
        // Replace with your actual API call logic (e.g., using fetch or)
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        });

        if (!response.ok) {
            // Handle API errors (e.g., refresh token invalid/expired)
            if (response.status === 401 || response.status === 403) {
                console.error('Refresh token invalid or expired');
                clearTokens(); // Clear tokens and potentially redirect to login
                throw new Error('Refresh token invalid or expired');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Assuming the API returns new accessToken and refreshToken
        if (!data.token) {
            throw new Error('Refresh API did not return expected tokens');
        }
        return data.token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        // Depending on the error, you might need to clear tokens and force re-login
        clearTokens();
        throw error; // Re-throw the error so the caller knows it failed
    }
};

interface ApiResponse {
    jsonData: any;
    token: string | null | undefined;
}
/**
 * Calls your /account/me API endpoint with the given access token.
 * @param token 
 * @param endpoint 
 * @param method 
 * @param body 
 * @returns A promise that resolves with the account data.
 */
const CallApi = async (endpoint: string, method: string, token: string | null | undefined, body?: string | undefined): Promise<ApiResponse> => {
    try {
        let currentToken: string | null |undefined = token;
        //const { token, setToken } = useAuth();
        if (isTokenExpiring(token))
        {
            const data = await callRefreshTokenApi();
            currentToken = data.token;
        }

        const response = await fetch(endpoint, {
            method: method,
            headers: {
                Authorization: `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
            },
            body: body
        });

        if (!response.ok) {
            // Handle API errors (e.g., access token invalid/expired for this specific call)
            // Note: If refresh worked, this 401 is less likely but possible.
            if (response.status === 401) {
                console.error(endpoint +' API returned 401. Token might be invalid despite refresh.');
                // You might want to try refreshing again, or force logout depending on strategy
                // For simplicity here, we'll just throw
                clearTokens();
                throw new Error('Unauthorized access to' + endpoint);
            }
            throw new Error(`HTTP error! status: ${response.status} calling `+ endpoint);
        }

        const data = await response.json();
        return { jsonData: data, token: currentToken};
    } catch (error) {
        console.error('Error fetching account data:', error);
        throw error; // Re-throw the error
    }
};

export default CallApi;
