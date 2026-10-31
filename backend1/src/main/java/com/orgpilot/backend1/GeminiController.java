
package com.orgpilot.backend1;

import com.orgpilot.backend1.service.GeminiService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {
        "http://localhost:5180",
        "http://127.0.0.1:5180",
        "http://localhost:5173",
        "http://localhost:5174"
})
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(
            @RequestBody Map<String, String> request) {

        String question = request.get("question");

        if (question == null || question.isBlank()) {
            throw new IllegalArgumentException(
                    "Question cannot be empty");
        }

        String answer = geminiService.askGemini(question);

        return Map.of("answer", answer);
    }
}

