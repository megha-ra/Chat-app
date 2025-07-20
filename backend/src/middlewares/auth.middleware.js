import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
   try {
        console.log("🔍 ProtectRoute - All cookies:", req.cookies);
        
        const token = req.cookies.jwt;
        if (!token) {
            console.log("❌ No JWT token found in cookies");
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        console.log("🔑 JWT token found:", token.substring(0, 20) + "...");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token decoded successfully:", { userId: decoded.userId });
        
        if (!decoded.userId) {
            console.log("❌ No userId in token payload");
            return res.status(401).json({ error: "Unauthorized - Invalid token payload" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        console.log("👤 User lookup result:", user ? `Found: ${user.email}` : "User not found");
        
        if (!user) {
            console.log("❌ User not found in database for ID:", decoded.userId);
            return res.status(401).json({ error: "Unauthorized - User not found" });
        }

        req.user = user;
        console.log("✅ User attached to request, proceeding to next middleware");
        next();
   } catch (error) {
       console.error("❌ Error in protectRoute middleware:", error.message);
       if (error.name === 'JsonWebTokenError') {
           return res.status(401).json({ message: "Unauthorized - Invalid token" });
       }
       res.status(500).json({ message: "Internal server error"});
   }
}

// 2. TEST YOUR LOGIN FUNCTION - Make sure it's setting cookies correctly
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔐 Login attempt for:", email);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("❌ Invalid password for:", email);
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate token and set cookie
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });

        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });

        console.log("✅ Login successful for:", email);
        console.log("🍪 Cookie set with token:", token.substring(0, 20) + "...");

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("❌ Error in login controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 3. SAMPLE PROTECTED ROUTE TO TEST DATA FETCHING
export const getUsers = async (req, res) => {
    try {
        console.log("👥 Getting users for authenticated user:", req.user._id);
        
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        console.log("✅ Found users:", users.length);
        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Error in getUsers:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// 4. FRONTEND - PROPER FETCH WITH CREDENTIALS
const fetchWithAuth = async (url, options = {}) => {
    console.log("🌐 Making authenticated request to:", url);
    
    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include', // CRITICAL: This sends cookies
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        console.log("📡 Response status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.log("❌ Error response:", errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Data received:", data);
        return data;
        
    } catch (error) {
        console.error("❌ Fetch error:", error);
        throw error;
    }
};

// 5. FRONTEND - TEST AUTHENTICATION
const testAuth = async () => {
    try {
        const data = await fetchWithAuth('http://localhost:3000/api/auth/me');
        console.log("🧪 Auth test successful:", data);
        return data;
    } catch (error) {
        console.error("❌ Auth test failed:", error);
        // Redirect to login if auth fails
        window.location.href = '/login';
    }
};

// 6. FRONTEND - FETCH DATA EXAMPLE
const fetchUsers = async () => {
    try {
        const users = await fetchWithAuth('http://localhost:3000/api/auth/users');
        console.log("👥 Users fetched:", users);
        return users;
    } catch (error) {
        console.error("❌ Failed to fetch users:", error);
        // Handle error appropriately
    }
};
