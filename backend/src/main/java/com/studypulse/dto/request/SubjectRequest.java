package com.studypulse.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubjectRequest {
    @NotBlank(message = "Subject name is required")
    private String name;
    private String code;
    private String description;
}
