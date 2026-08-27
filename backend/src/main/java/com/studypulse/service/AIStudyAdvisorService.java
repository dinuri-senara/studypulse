package com.studypulse.service;

import com.studypulse.dto.response.AIAdviceResponse;
import com.studypulse.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AIStudyAdvisorService {

    @Value("${app.ai.api-key:}")
    private String apiKey;

    public AIAdviceResponse generateStudyAdvice(User user) {
        // Mock Implementation as requested for initial phase
        if (apiKey == null || apiKey.isEmpty()) {
            return generateMockAdvice(user);
        }
        
        return generateMockAdvice(user);
    }

    private AIAdviceResponse generateMockAdvice(User user) {
        String mockResponse = "Based on your recent activity, your productivity is highest between 6 PM and 8 PM.\n\n" +
            "You spend more time studying Web Development than Algorithms.\n\n" +
            "Consider allocating an additional 30 minutes to Algorithms on Tuesday and Thursday.";
            
        return AIAdviceResponse.builder()
                .advice(mockResponse)
                .build();
    }
}
