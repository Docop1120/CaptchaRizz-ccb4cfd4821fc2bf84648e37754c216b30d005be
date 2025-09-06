import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { insertUserSchema, insertWaitlistSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  
  // Sign up route
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, email, password } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email" });
      }

      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await storage.createUser({
        username,
        email,
        password: hashedPassword,
      });

      // Return user without password
      const { password: _, ...userResponse } = newUser;
      res.status(201).json({ user: userResponse, message: "User created successfully" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Return user without password
      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse, message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Waitlist route
  app.post("/api/waitlist", async (req, res) => {
    try {
      const { email } = insertWaitlistSchema.parse(req.body);
      
      // Check if email already exists in waitlist
      const existingEntry = await storage.getWaitlistEntry(email);
      if (existingEntry) {
        return res.status(400).json({ error: "Email already registered for waitlist" });
      }

      // Add to waitlist
      const waitlistEntry = await storage.addToWaitlist({ email });
      res.status(201).json({ 
        message: "Successfully joined the waitlist! We'll notify you when CaptchaRizz launches.",
        entry: { id: waitlistEntry.id, email: waitlistEntry.email }
      });
    } catch (error) {
      console.error("Waitlist error:", error);
      res.status(400).json({ error: "Invalid email address" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
