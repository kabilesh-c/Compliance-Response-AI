# Compliance Response AI - User Flow

A step-by-step visual guide showing the complete user journey from landing page to AI-powered compliance assistance.

---

## User Journey Overview

```
Landing Page → Login → Dashboard → AI Assistant Landing → Chatbot Interface
```

---

## Step 1: Landing Page

The user arrives at the main landing page and sees the Compliance Response AI introduction.

<!-- LANDING PAGE SCREENSHOT -->
<img width="1899" height="859" alt="Screenshot 2026-03-08 051754" src="https://github.com/user-attachments/assets/a7cb4908-01a3-46b1-84d5-6a6b58bfe0d9" />



<br>

<p align="center">
  <img src="https://img.shields.io/badge/ACTION-Click%20'Try%20Compliance%20AI'-blue?style=for-the-badge" alt="Action Button"/>
</p>

<p align="center">⬇️</p>
<p align="center"><strong>▼</strong></p>
<p align="center"><strong>▼</strong></p>
<p align="center">⬇️</p>

---

## Step 2: Login Page

User is redirected to the authentication page to sign in with their credentials.

<!-- LOGIN PAGE SCREENSHOT -->
<img width="1917" height="912" alt="Screenshot 2026-03-08 051827" src="https://github.com/user-attachments/assets/178f3154-1415-4767-a172-3636168f97b5" />


<br>

<p align="center">
  <img src="https://img.shields.io/badge/ACTION-Enter%20Credentials%20%26%20Login-green?style=for-the-badge" alt="Action Button"/>
</p>

<p align="center">⬇️</p>
<p align="center"><strong>▼</strong></p>
<p align="center"><strong>▼</strong></p>
<p align="center">⬇️</p>

---

## Step 3: Dashboard with Pop-up

After successful login, the user lands on the main dashboard. A pop-up notification appears prompting the user to try the AI Compliance Assistant.

<!-- DASHBOARD WITH POPUP SCREENSHOT -->
<img width="1895" height="908" alt="Screenshot 2026-03-08 051904" src="https://github.com/user-attachments/assets/60af57cc-1325-4ed2-a914-8a50cb6a7de2" />


<br>

<p align="center">
  <img src="https://img.shields.io/badge/ACTION-Click%20'Go%20to%20AI%20Assistant'-orange?style=for-the-badge" alt="Action Button"/>
</p>

<p align="center">⬇️</p>
<p align="center"><strong>▼</strong></p>
<p align="center"><strong>▼</strong></p>
<p align="center">⬇️</p>

---

## Step 4: AI Assistant Landing Page

User arrives at the AI Assistant landing page where they can upload documents and questionnaires.

<!-- AI ASSISTANT LANDING PAGE SCREENSHOT -->
<img width="1919" height="913" alt="Screenshot 2026-03-08 051923" src="https://github.com/user-attachments/assets/c204b2b9-cb02-40c6-8567-690158a604ea" />


<br>

<p align="center">
  <img src="https://img.shields.io/badge/ACTION-Upload%20Documents%20%26%20Click%20Send-purple?style=for-the-badge" alt="Action Button"/>
</p>

<p align="center">⬇️</p>
<p align="center"><strong>▼</strong></p>
<p align="center"><strong>▼</strong></p>
<p align="center">⬇️</p>

---

## Step 5: AI Chatbot Interface

The chatbot interface opens, displaying the AI-generated responses with structured answer cards, citations, confidence scores, and export options.

<!-- CHATBOT INTERFACE SCREENSHOT -->
<img width="1919" height="917" alt="Screenshot 2026-03-08 025537" src="https://github.com/user-attachments/assets/93347f04-c891-491b-870c-adc317234a03" />



---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ┌──────────────┐         ┌──────────────┐         ┌──────────────────┐   │
│   │              │         │              │         │                  │   │
│   │   LANDING    │────────▶│    LOGIN     │────────▶│    DASHBOARD     │   │
│   │    PAGE      │         │    PAGE      │         │    + POPUP       │   │
│   │              │         │              │         │                  │   │
│   └──────────────┘         └──────────────┘         └────────┬─────────┘   │
│                                                               │             │
│                                                               ▼             │
│   ┌──────────────────────────────────────────────────────────────────────┐ │
│   │                                                                      │ │
│   │   ┌──────────────────┐              ┌──────────────────────────┐    │ │
│   │   │                  │              │                          │    │ │
│   │   │   AI ASSISTANT   │─────────────▶│   CHATBOT INTERFACE      │    │ │
│   │   │   LANDING PAGE   │   Upload &   │   • Answer Cards         │    │ │
│   │   │   • Upload Docs  │    Send      │   • Citations            │    │ │
│   │   │   • Start Chat   │              │   • Confidence Scores    │    │ │
│   │   │                  │              │   • Export Options       │    │ │
│   │   └──────────────────┘              └──────────────────────────┘    │ │
│   │                                                                      │ │
│   └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Image Placement Guide

Create a folder `design images/flow/` and add your screenshots with these exact names:

| Step | Filename | Description |
|------|----------|-------------|
| 1 | `01-landing-page.png` | Landing page with "Try Compliance AI" button visible |
| 2 | `02-login-page.png` | Login form with email/password fields |
| 3 | `03-dashboard-popup.png` | Dashboard with pop-up notification visible |
| 4 | `04-ai-landing.png` | AI Assistant landing with upload zones |
| 5 | `05-chatbot.png` | Chatbot interface showing answer cards |

---

## Key Features Shown in Flow

### Landing Page
- Hero section with product introduction
- "Try Compliance AI" call-to-action button
- Feature highlights

### Login Page
- Email and password authentication
- Demo access option
- Firebase authentication integration

### Dashboard
- Pharmacy operations overview
- Pop-up notification for AI Assistant
- Navigation sidebar

### AI Assistant Landing
- Document upload zone (PDF, DOCX, TXT, MD)
- Questionnaire upload zone (XLSX)
- Start conversation button

### Chatbot Interface
- Structured answer cards per question
- Confidence score visualization
- Citation references
- Evidence snippets
- Edit and regenerate buttons
- Version history navigation
- Export options (XLSX, PDF, DOCX, MD)

---

*This document provides a visual guide to the Compliance Response AI user experience.*
