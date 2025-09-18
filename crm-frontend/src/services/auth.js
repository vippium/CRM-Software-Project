import { jwtDecode } from "jwt-decode";

export const getUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded; // contains id, role, etc.
    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
};

export const isAdmin = () => {
    const user = getUser();
    return user && user.role === "admin";
};

// New function to check for the sales role
export const isSales = () => {
    const user = getUser();
    return user && user.role === "sales";
};