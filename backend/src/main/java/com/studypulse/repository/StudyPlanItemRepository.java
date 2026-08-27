package com.studypulse.repository;

import com.studypulse.entity.StudyPlanItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudyPlanItemRepository extends JpaRepository<StudyPlanItem, Long> {
}
