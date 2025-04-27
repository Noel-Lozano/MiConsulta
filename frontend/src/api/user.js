
import api from './axios';  // <-- import your preconfigured Axios instance

// Claim daily points for the user
export async function claimDailyPoints(userId) {
    try {
        const response = await api.post(`/users/${userId}/claim-daily`);
        return response.data;
    } catch (error) {
        console.error("Error claiming daily points:", error);
        throw error;
    }
}

// Get the user's profile info (username, gender, weight, points, badge)
export async function getUserProfile(userId) {
    try {
        const response = await api.get(`/users/${userId}/profile`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

// Create a new user (sign up)
// assuming you have a signup page later that collects username, email, password, etc.
export async function createUser(userData) {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

// (Optional) Delete a user by userId
export async function deleteUser(userId) {
    try {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

// (Optional) Update user's gender or weight
export async function updateUser(userId, updateData) {
    try {
        const response = await api.patch(`/users/${userId}`, updateData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

export async function loginUser(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // contains access_token and user_id
}

export async function signupUser(userData) {
    const response = await api.post('/auth/signup', userData);
    return response.data; // contains access_token and user_id
}

export async function claimDailyReward(userId) {
    const response = await api.post(`/rewards/claim-daily?user_id=${userId}`);
    return response.data;
}