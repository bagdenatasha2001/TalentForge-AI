package com.talentforge.controller;

import com.talentforge.entity.ReadinessScore;
import com.talentforge.entity.User;
import com.talentforge.service.ReadinessService;
import com.talentforge.service.UserService;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
@Slf4j
public class PdfController {

    private final ReadinessService readinessService;
    private final UserService userService;

    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(0, 212, 255);
    private static final DeviceRgb DARK_BG = new DeviceRgb(10, 10, 26);
    private static final DeviceRgb CARD_BG = new DeviceRgb(26, 26, 46);
    private static final DeviceRgb TEXT_SECONDARY = new DeviceRgb(160, 160, 200);

    @GetMapping("/report")
    public ResponseEntity<byte[]> generateReport(@AuthenticationPrincipal User authUser) {
        try {
            User user = userService.getUserByEmail(authUser.getEmail());
            Optional<ReadinessScore> latestOpt = readinessService.getLatestScore(user.getId());

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document doc = new Document(pdf);
            doc.setMargins(40, 40, 40, 40);

            // Header
            Paragraph title = new Paragraph("⚡ TALENTFORGE")
                    .setFontSize(28)
                    .setBold()
                    .setFontColor(PRIMARY_COLOR)
                    .setTextAlignment(TextAlignment.CENTER);
            doc.add(title);

            Paragraph subtitle = new Paragraph("AI Interview Readiness Report")
                    .setFontSize(14)
                    .setFontColor(TEXT_SECONDARY)
                    .setTextAlignment(TextAlignment.CENTER);
            doc.add(subtitle);

            doc.add(new Paragraph("Powered by ForgeAI")
                    .setFontSize(10)
                    .setFontColor(TEXT_SECONDARY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            // Divider
            doc.add(new LineSeparator(new com.itextpdf.kernel.pdf.canvas.draw.SolidLine()));

            // Candidate Info
            doc.add(new Paragraph("CANDIDATE PROFILE")
                    .setFontSize(12)
                    .setBold()
                    .setFontColor(PRIMARY_COLOR)
                    .setMarginTop(20));

            doc.add(new Paragraph("Name: " + user.getFullName()).setFontSize(11));
            doc.add(new Paragraph("Email: " + user.getEmail()).setFontSize(11));
            doc.add(new Paragraph("Current Role: " + (user.getCurrentRole() != null ? user.getCurrentRole() : "N/A"))
                    .setFontSize(11));
            doc.add(new Paragraph(
                    "Technical Skills: " + (user.getTechnicalSkills() != null ? user.getTechnicalSkills() : "N/A"))
                    .setFontSize(11));
            doc.add(new Paragraph("Generated: "
                    + java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")))
                    .setFontSize(10).setFontColor(TEXT_SECONDARY));

            doc.add(new LineSeparator(new com.itextpdf.kernel.pdf.canvas.draw.SolidLine()).setMarginTop(15));

            if (latestOpt.isPresent()) {
                ReadinessScore score = latestOpt.get();

                // Readiness Score
                doc.add(new Paragraph("READINESS SCORE BREAKDOWN")
                        .setFontSize(12)
                        .setBold()
                        .setFontColor(PRIMARY_COLOR)
                        .setMarginTop(20));

                String levelLabel = switch (score.getLevel()) {
                    case NOT_READY -> "🔴 Not Ready";
                    case IMPROVING -> "🟡 Improving";
                    case INTERVIEW_READY -> "🟢 Interview Ready";
                    case HIGHLY_COMPETITIVE -> "⭐ Highly Competitive";
                };

                doc.add(new Paragraph("FINAL SCORE: " + String.format("%.1f", score.getFinalScore()) + " / 100")
                        .setFontSize(22).setBold().setFontColor(PRIMARY_COLOR));
                doc.add(new Paragraph("Classification: " + levelLabel).setFontSize(14).setBold());

                doc.add(new Paragraph("\nScore Components:").setFontSize(12).setBold().setMarginTop(15));

                // Table
                Table table = new Table(UnitValue.createPercentArray(new float[] { 40, 20, 20, 20 }))
                        .useAllAvailableWidth();

                table.addHeaderCell(new Cell().add(new Paragraph("Component").setBold()));
                table.addHeaderCell(new Cell().add(new Paragraph("Score").setBold()));
                table.addHeaderCell(new Cell().add(new Paragraph("Weight").setBold()));
                table.addHeaderCell(new Cell().add(new Paragraph("Contribution").setBold()));

                addTableRow(table, "MCQ Assessment", score.getMcqScore(), 0.35);
                addTableRow(table, "Coding Proficiency", score.getCodingScore(), 0.30);
                addTableRow(table, "JD Match Score", score.getJdMatchScore(), 0.20);
                addTableRow(table, "Learning Depth", score.getLearningDepthScore(), 0.15);

                doc.add(table);

                // Formula
                doc.add(new Paragraph(
                        "\nFormula: (MCQ × 0.35) + (Coding × 0.30) + (JD Match × 0.20) + (Learning × 0.15)")
                        .setFontSize(10).setFontColor(TEXT_SECONDARY).setMarginTop(10));
            } else {
                doc.add(new Paragraph(
                        "No readiness score data available yet. Complete your preparation journey to generate a full report.")
                        .setFontSize(12).setFontColor(TEXT_SECONDARY).setMarginTop(20));
            }

            // Footer
            doc.add(new LineSeparator(new com.itextpdf.kernel.pdf.canvas.draw.SolidLine()).setMarginTop(30));
            doc.add(new Paragraph("TalentForge AI — Confidential Interview Readiness Report")
                    .setFontSize(9).setFontColor(TEXT_SECONDARY).setTextAlignment(TextAlignment.CENTER));

            doc.close();

            byte[] bytes = baos.toByteArray();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"TalentForge_Readiness_Report.pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(bytes);

        } catch (Exception e) {
            log.error("PDF generation failed: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    private void addTableRow(Table table, String component, Double score, double weight) {
        table.addCell(new Cell().add(new Paragraph(component)));
        table.addCell(new Cell().add(new Paragraph(score != null ? String.format("%.1f", score) : "0.0")));
        table.addCell(new Cell().add(new Paragraph((int) (weight * 100) + "%")));
        double contrib = (score != null ? score : 0.0) * weight;
        table.addCell(new Cell().add(new Paragraph(String.format("%.2f", contrib))));
    }
}
