// Database Functions (MySQL Version)
class DatabaseManager {
    constructor(apiBaseUrl = "http://localhost:4000/api") {
        this.apiBaseUrl = apiBaseUrl;
    }

    // Save quiz result
    async saveQuizResult(quizData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/results`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(quizData)
            });
            const result = await response.json();
            console.log("✅ Quiz result saved with ID:", result.id);
            return result.id;
        } catch (error) {
            console.error("❌ Error saving quiz result:", error);
            return null;
        }
    }

    // Get user quiz results
    async getUserQuizResults(userId, limit = 10) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/results/${userId}`);
            const results = await response.json();
            console.log("📊 Results fetched:", results);
            return results.slice(0, limit);
        } catch (error) {
            console.error("❌ Error getting quiz results:", error);
            return [];
        }
    }

    // Placeholder for other functions (you can extend later)
    async createUser(userData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("✅ User created/updated successfully:", result.id);
            return result.id;
        } catch (error) {
            console.warn("⚠️ createUser() API call failed:", error.message);
            return false;
        }
    }

    async getUser(userId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/users/${userId}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`User ${userId} not found in database`);
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const user = await response.json();
            console.log("✅ User retrieved successfully:", user.name);
            return user;
        } catch (error) {
            console.warn("⚠️ getUser() API call failed:", error.message);
            return null;
        }
    }

    async updateUser(userId, updateData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: userId, ...updateData })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("✅ User updated successfully:", result.id);
            return true;
        } catch (error) {
            console.warn("⚠️ updateUser() API call failed:", error.message);
            return false;
        }
    }

    async getQuestions(domain, difficulty, limit = 10) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/questions?domain=${domain}&difficulty=${difficulty}&limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const questions = await response.json();
            console.log(`✅ Retrieved ${questions.length} questions for ${domain} (${difficulty})`);
            return questions;
        } catch (error) {
            console.warn("⚠️ getQuestions() API call failed, using fallback:", error.message);
            // Fallback to local questions if API fails
            return this.getFallbackQuestions(domain, difficulty, limit);
        }
    }

    // Fallback method to get questions locally when API is not available
    getFallbackQuestions(domain, difficulty, limit = 10) {
        // Get questions from the seed data
        if (window.sampleQuestions) {
            const filtered = window.sampleQuestions.filter(q => 
                q.domain === domain && q.difficulty === difficulty
            );
            const shuffled = filtered.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, limit);
        }
        console.warn(`No fallback questions available for ${domain} (${difficulty})`);
        return [];
    }

    async updateUserProgress(userId, domain, topic, progressData) {
        console.warn("updateUserProgress() not implemented for MySQL yet.");
        return false;
    }

    async getUserProgress(userId, domain) {
        console.warn("getUserProgress() not implemented for MySQL yet.");
        return [];
    }

    async createLearningPath(pathData) {
        console.warn("createLearningPath() not implemented for MySQL yet.");
        return null;
    }

    async getUserLearningPaths(userId) {
        console.warn("getUserLearningPaths() not implemented for MySQL yet.");
        return [];
    }

    // Add question to database (for seeding)
    async addQuestion(questionData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(questionData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("✅ Question added with ID:", result.id);
            return result.id;
        } catch (error) {
            console.warn("⚠️ addQuestion() API call failed:", error.message);
            // In a real scenario, you might want to queue this for later
            return null;
        }
    }

    // Get all questions (for admin purposes)
    async getAllQuestions() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/questions/all`);
            const questions = await response.json();
            return questions;
        } catch (error) {
            console.error("❌ Error getting all questions:", error);
            return [];
        }
    }

    // Check database connection
    async checkConnection() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            return response.ok;
        } catch (error) {
            console.warn("Database connection check failed:", error.message);
            return false;
        }
    }
}

// ✅ Initialize Database Manager
window.dbManager = new DatabaseManager();
console.log("✅ Database Manager (MySQL) initialized successfully!");
