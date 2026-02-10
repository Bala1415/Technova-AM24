class PromptEvaluator:
    """Evaluate prompt engineering skills and detect AI work-slop"""
    
    def __init__(self):
        # Common indicators of poor prompts
        self.poor_indicators = [
            "vague", "unclear", "ambiguous", "generic",
            "do this", "make it", "fix it", "help me"
        ]
        
        # Good prompt indicators
        self.good_indicators = [
            "specific", "context", "example", "format",
            "step-by-step", "detailed", "constraints", "role"
        ]
        
        # Work-slop indicators (AI hallucinations/errors)
        self.slop_indicators = [
            "as an ai", "i cannot", "i don't have access",
            "i apologize", "certainly", "of course",
            "factually incorrect", "inconsistent", "contradictory"
        ]
    
    def evaluate_prompt(self, question, user_prompt, ai_output):
        """Evaluate the quality of a user's prompt"""
        
        # Prompt Clarity Score (0-100)
        clarity_score = self._score_clarity(user_prompt)
        
        # Context Awareness Score (0-100)
        context_score = self._score_context(user_prompt, question)
        
        # Error Detection Score (0-100) - ability to spot AI errors
        error_detection_score = self._score_error_detection(ai_output)
        
        # Iterative Improvement (0-100) - did they refine their prompt?
        improvement_score = self._score_improvement(user_prompt)
        
        # Productivity (0-100) - how effective was the prompt?
        productivity_score = (clarity_score + context_score) / 2
        
        # Overall score
        overall_score = (
            clarity_score * 0.25 +
            context_score * 0.25 +
            error_detection_score * 0.20 +
            improvement_score * 0.15 +
            productivity_score * 0.15
        )
        
        # Generate feedback
        feedback = self._generate_feedback(
            clarity_score, context_score, error_detection_score
        )
        
        return {
            "score": round(overall_score, 2),
            "aiOutput": ai_output,
            "feedback": feedback,
            "metrics": {
                "promptClarity": round(clarity_score, 2),
                "contextAwareness": round(context_score, 2),
                "errorDetection": round(error_detection_score, 2),
                "iterativeImprovement": round(improvement_score, 2),
                "productivity": round(productivity_score, 2),
            },
        }
    
    def _score_clarity(self, prompt):
        """Score prompt clarity based on specificity"""
        score = 50  # Base score
        
        prompt_lower = prompt.lower()
        
        # Deduct for poor indicators
        for indicator in self.poor_indicators:
            if indicator in prompt_lower:
                score -= 5
        
        # Add for good indicators
        for indicator in self.good_indicators:
            if indicator in prompt_lower:
                score += 10
        
        # Length bonus (detailed prompts are usually better)
        if len(prompt) > 100:
            score += 15
        elif len(prompt) > 50:
            score += 10
        elif len(prompt) < 20:
            score -= 15
        
        return min(100, max(0, score))
    
    def _score_context(self, prompt, question):
        """Score how well the prompt provides context"""
        score = 50
        
        # Check if prompt references the question
        if question.lower() in prompt.lower():
            score += 20
        
        # Check for context keywords
        context_keywords = ["because", "in order to", "for", "given that", "considering"]
        for keyword in context_keywords:
            if keyword in prompt.lower():
                score += 10
        
        return min(100, max(0, score))
    
    def _score_error_detection(self, ai_output):
        """Score ability to detect AI errors (work-slop)"""
        score = 70  # Assume good unless slop detected
        
        ai_lower = ai_output.lower()
        
        # Check for work-slop indicators
        slop_count = 0
        for indicator in self.slop_indicators:
            if indicator in ai_lower:
                slop_count += 1
        
        # Deduct for each slop indicator found
        score -= (slop_count * 15)
        
        return min(100, max(0, score))
    
    def _score_improvement(self, prompt):
        """Score iterative improvement (simplified version)"""
        # In a real implementation, this would compare multiple prompt versions
        # For now, we'll score based on refinement indicators
        score = 60
        
        refinement_keywords = ["specifically", "more precisely", "to clarify", "in particular"]
        for keyword in refinement_keywords:
            if keyword in prompt.lower():
                score += 10
        
        return min(100, max(0, score))
    
    def _generate_feedback(self, clarity, context, error_detection):
        """Generate personalized feedback"""
        feedback_parts = []
        
        if clarity < 50:
            feedback_parts.append("Your prompt lacks clarity. Be more specific about what you want.")
        elif clarity > 80:
            feedback_parts.append("Excellent prompt clarity!")
        
        if context < 50:
            feedback_parts.append("Provide more context to help the AI understand your needs.")
        elif context > 80:
            feedback_parts.append("Great job providing context!")
        
        if error_detection < 50:
            feedback_parts.append("Watch out for AI hallucinations and errors in the output.")
        elif error_detection > 80:
            feedback_parts.append("You're good at spotting AI errors!")
        
        return " ".join(feedback_parts) if feedback_parts else "Good work overall!"


def assess_prompt_engineering(question, user_prompt, ai_output):
    """Main function to assess prompt engineering skills"""
    evaluator = PromptEvaluator()
    return evaluator.evaluate_prompt(question, user_prompt, ai_output)
