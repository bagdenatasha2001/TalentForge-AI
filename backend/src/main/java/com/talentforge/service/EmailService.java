package com.talentforge.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendOtpEmail(String toEmail, String name, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("TalentForge — Verify Your Account");
            helper.setFrom("noreply@talentforge.ai");

            String html = buildOtpEmailHtml(name, otp);
            helper.setText(html, true);

            mailSender.send(message);
            log.info("OTP email sent to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildOtpEmailHtml(String name, String otp) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { font-family: 'Segoe UI', sans-serif; background: #0a0a1a; color: #fff; margin: 0; padding: 0; }
                    .container { max-width: 560px; margin: 40px auto; background: linear-gradient(135deg, #1a1a2e 0%%, #16213e 100%%); border-radius: 16px; overflow: hidden; border: 1px solid #00d4ff33; }
                    .header { background: linear-gradient(135deg, #00d4ff 0%%, #0066ff 100%%); padding: 32px; text-align: center; }
                    .logo { font-size: 28px; font-weight: 900; color: white; letter-spacing: 2px; }
                    .tagline { font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 4px; }
                    .body { padding: 40px 36px; }
                    .greeting { font-size: 18px; color: #e0e0e0; margin-bottom: 20px; }
                    .otp-label { font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
                    .otp-box { background: #0a0a1a; border: 2px solid #00d4ff; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
                    .otp-code { font-size: 42px; font-weight: 900; color: #00d4ff; letter-spacing: 12px; font-family: monospace; }
                    .expiry { color: #888; font-size: 13px; text-align: center; margin-top: 16px; }
                    .footer { background: #0a0a1a; padding: 20px; text-align: center; color: #555; font-size: 12px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <div class="logo">⚡ TALENTFORGE</div>
                      <div class="tagline">Powered by ForgeAI</div>
                    </div>
                    <div class="body">
                      <div class="greeting">Hello, <strong>%s</strong>! 👋</div>
                      <p style="color:#aaa;line-height:1.6;">Your one-time verification code is below. Enter it to complete your account setup and start your AI-powered interview preparation journey.</p>
                      <div class="otp-label">Your Verification Code</div>
                      <div class="otp-box">
                        <div class="otp-code">%s</div>
                      </div>
                      <p class="expiry">⏱ This code expires in <strong>10 minutes</strong></p>
                      <p style="color:#666;font-size:13px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                      © 2024 TalentForge AI. All rights reserved.<br>
                      <em>This is an automated message. Please do not reply.</em>
                    </div>
                  </div>
                </body>
                </html>
                """
                .formatted(name, otp);
    }
}
