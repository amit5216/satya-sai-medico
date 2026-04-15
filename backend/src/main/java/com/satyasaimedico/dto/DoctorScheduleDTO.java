package com.satyasaimedico.dto;

import com.satyasaimedico.model.DoctorSchedule;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

/**
 * DTO for setting a doctor's weekly schedule.
 * Contains doctorId and list of days the doctor sits.
 */
@Data
public class DoctorScheduleDTO {

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotEmpty(message = "At least one day must be selected")
    private List<DoctorSchedule.DayOfWeek> days;
}
