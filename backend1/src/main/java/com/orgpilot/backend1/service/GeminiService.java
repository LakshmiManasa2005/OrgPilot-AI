
package com.orgpilot.backend1.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient = createRestClient();

    private static RestClient createRestClient() {
        var factory =
                new org.springframework.http.client.SimpleClientHttpRequestFactory();

        factory.setConnectTimeout(Duration.ofSeconds(10));
        factory.setReadTimeout(Duration.ofSeconds(120));

        return RestClient.builder()
                .requestFactory(factory)
                .build();
    }

    public String askGemini(String question) {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";


        String instructions = """
        You are OrgPilot AI, a professional and friendly AI assistant.

        STRICT FORMATTING RULES:

        1. Always use proper Markdown formatting.
        2. Never write multiple numbered points in the same paragraph.
        3. Put every numbered point on a NEW LINE.
        4. Leave one blank line between major sections.
        5. Put every bullet point on a separate line.
        6. Use headings to organize longer answers.
        7. Use **bold** for important terms.
        8. Keep paragraphs short and readable.
        9. Use code blocks for programming examples.
        10. Use Markdown tables for comparisons when appropriate.
        11. Follow the exact structure requested by the user.

        EXAMPLE FORMAT:

        ## Java in 5 Points

        1. **Object-Oriented Language**
           - Java uses classes and objects.
           - It supports code reusability.

        2. **Platform Independent**
           - Java code runs through the JVM.
           - It follows Write Once, Run Anywhere.

        3. **Simple Language**
           - Java has readable syntax.
           - It removes explicit pointer arithmetic.

        Always follow this layout. Never combine all points into one paragraph.
        Use simple English and provide accurate information.
        """;


        Map<String, Object> request = Map.of(
                "systemInstruction",
                Map.of(
                        "parts",
                        List.of(Map.of("text", instructions))
                ),
                "contents",
                List.of(
                        Map.of(
                                "parts",
                                List.of(Map.of("text", question))
                        )
                ),
                "generationConfig",
                Map.of(
                        "temperature", 0.5,
                        "topP", 0.9,
                        "maxOutputTokens", 2048
                )
        );

        long start = System.currentTimeMillis();

        Map response = restClient.post()
                .uri(url)
                .header("x-goog-api-key", apiKey)
                .header(HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE)
                .body(request)
                .retrieve()
                .body(Map.class);

        System.out.println("Gemini API time: " +
                (System.currentTimeMillis() - start) + " ms");

        if (response == null || !response.containsKey("candidates")) {
            throw new RuntimeException("Gemini returned an empty response.");
        }

        List candidates = (List) response.get("candidates");

        if (candidates.isEmpty()) {
            throw new RuntimeException("Gemini did not generate an answer.");
        }

        Map candidate = (Map) candidates.get(0);
        Map content = (Map) candidate.get("content");
        List parts = (List) content.get("parts");

        StringBuilder answer = new StringBuilder();

        for (Object item : parts) {
            Map part = (Map) item;
            Object text = part.get("text");

            if (text instanceof String) {
                answer.append(text);
            }
        }

        if (answer.isEmpty()) {
            throw new RuntimeException("Gemini returned no text.");
        }

        return answer.toString();
    }
}
