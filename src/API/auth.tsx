// API/auth.tsx
import url from "@/constants/urls";

export const loginFn = async (email: string, password: string) => {
    const response = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    console.log("Login response:", data);
    
    // Backend returns { token: { accessToken, refreshToken }, user: {...} }
    if (data.token?.accessToken) {
        // Store the access token with key 'token' (what your profile route expects)
        localStorage.setItem('token', data.token.accessToken);
        
        // Store refresh token if needed
        localStorage.setItem('refreshToken', data.token.refreshToken);
        
        // Store user info
        if (data.user) {
            localStorage.setItem('role', data.user.role);
            localStorage.setItem('userId', String(data.user.user_id));
            localStorage.setItem('userEmail', data.user.email);
        }
        
        console.log("Token stored successfully:", !!localStorage.getItem('token'));
        console.log("Role stored:", localStorage.getItem('role'));
    } else {
        console.error("No accessToken in response:", data);
    }
    
    return data;
};