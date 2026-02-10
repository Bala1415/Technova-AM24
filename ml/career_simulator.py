import numpy as np
from scipy import stats
import random

class CareerSimulator:
    """Monte Carlo simulation for career path analysis"""
    
    def __init__(self, career_path, user_profile, num_simulations=1000):
        self.career_path = career_path
        self.user_profile = user_profile
        self.num_simulations = num_simulations
        
        # Career data (in production, fetch from external APIs or database)
        self.career_data = {
            "Data Science": {
                "base_salary": 95000,
                "salary_growth_rate": 0.08,
                "volatility": 0.15,
                "job_stability": 85,
                "market_demand": 90,
            },
            "Cybersecurity": {
                "base_salary": 98000,
                "salary_growth_rate": 0.10,
                "volatility": 0.12,
                "job_stability": 88,
                "market_demand": 92,
            },
            "Software Engineering": {
                "base_salary": 105000,
                "salary_growth_rate": 0.07,
                "volatility": 0.18,
                "job_stability": 80,
                "market_demand": 88,
            },
            "Product Management": {
                "base_salary": 115000,
                "salary_growth_rate": 0.09,
                "volatility": 0.20,
                "job_stability": 75,
                "market_demand": 85,
            },
        }
    
    def run_simulation(self):
        """Run Monte Carlo simulation for 5-year career projection"""
        career_info = self.career_data.get(self.career_path, self.career_data["Software Engineering"])
        
        base_salary = career_info["base_salary"]
        growth_rate = career_info["salary_growth_rate"]
        volatility = career_info["volatility"]
        
        yearly_projections = []
        
        for year in range(1, 6):  # 5-year projection
            year_salaries = []
            
            for _ in range(self.num_simulations):
                # Apply random variation based on volatility
                random_factor = np.random.normal(1.0, volatility)
                projected_salary = base_salary * ((1 + growth_rate) ** year) * random_factor
                year_salaries.append(projected_salary)
            
            # Calculate statistics
            salaries_array = np.array(year_salaries)
            
            yearly_projections.append({
                "year": year,
                "salaryMin": int(np.percentile(salaries_array, 10)),
                "salaryMax": int(np.percentile(salaries_array, 90)),
                "salaryAvg": int(np.mean(salaries_array)),
                "jobStability": career_info["job_stability"],
                "marketDemand": career_info["market_demand"],
            })
        
        # Calculate success rate (percentage of simulations above median)
        final_year_salaries = [base_salary * ((1 + growth_rate) ** 5) * np.random.normal(1.0, volatility) 
                                for _ in range(self.num_simulations)]
        median_salary = np.median(final_year_salaries)
        success_rate = sum(1 for s in final_year_salaries if s >= median_salary) / self.num_simulations * 100
        
        return {
            "yearlyProjections": yearly_projections,
            "totalSimulations": self.num_simulations,
            "successRate": round(success_rate, 2),
        }
    
    def calculate_risk_analysis(self, simulation_results):
        """Calculate risk vs. reward scores"""
        career_info = self.career_data.get(self.career_path, self.career_data["Software Engineering"])
        
        # Risk score based on volatility and job stability
        risk_score = (career_info["volatility"] * 100) + (100 - career_info["job_stability"])
        risk_score = min(100, max(0, risk_score))
        
        # Reward score based on salary growth and market demand
        avg_salary_5yr = simulation_results["yearlyProjections"][-1]["salaryAvg"]
        reward_score = (career_info["salary_growth_rate"] * 500) + (career_info["market_demand"] * 0.5)
        reward_score = min(100, max(0, reward_score))
        
        # Generate recommendation
        if reward_score > risk_score + 20:
            recommendation = f"{self.career_path} offers excellent growth potential with manageable risk"
        elif risk_score > reward_score + 20:
            recommendation = f"{self.career_path} has high volatility; consider risk mitigation strategies"
        else:
            recommendation = f"{self.career_path} presents a balanced risk-reward profile"
        
        return {
            "riskScore": round(risk_score, 2),
            "rewardScore": round(reward_score, 2),
            "volatility": career_info["volatility"],
            "recommendation": recommendation,
        }


def simulate_career_path(career_path, comparison_path=None, user_profile=None):
    """Main function to run career simulation"""
    
    # Simulate primary career path
    simulator = CareerSimulator(career_path, user_profile)
    results = simulator.run_simulation()
    risk_analysis = simulator.calculate_risk_analysis(results)
    
    response = {
        "results": results,
        "riskAnalysis": risk_analysis,
        "marketData": {
            "industry": "Technology",
            "location": "United States",
            "economicFactors": {
                "inflation": 0.03,
                "gdp_growth": 0.025,
            },
        },
    }
    
    # If comparison path provided, simulate it too
    if comparison_path:
        comp_simulator = CareerSimulator(comparison_path, user_profile)
        comp_results = comp_simulator.run_simulation()
        comp_risk_analysis = comp_simulator.calculate_risk_analysis(comp_results)
        
        response["comparisonResults"] = {
            "results": comp_results,
            "riskAnalysis": comp_risk_analysis,
        }
    
    return response
