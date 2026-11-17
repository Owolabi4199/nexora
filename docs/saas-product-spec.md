# Lenvora — AI Sales Assistant MVP

> Working product/company name only. Brand, domain, company-name and trademark clearance are still required before public launch.

## Product thesis

Lenvora helps small service businesses capture enquiries, keep lead records organized, and respond consistently with AI-assisted replies and next-step recommendations.

We are not building a generic chatbot or a full CRM in version one. The initial product is a focused lead-to-follow-up workspace.

## Initial customer

English-speaking service businesses with 1–20 staff, initially agencies, consultants, and appointment-based service providers. The company may serve customers internationally over time; the first release will validate one narrow customer group before expanding.

## Customer problem

Enquiries arrive through different channels, replies are delayed or inconsistent, and follow-ups are forgotten. This causes avoidable lost opportunities and makes sales activity hard to track.

## MVP scope (first usable release)

1. Google sign-in using the existing Firebase Authentication project.
2. Create one business workspace and business profile (name, services, tone, working hours, contact details).
3. Add, view, edit, and archive leads.
4. Track lead status: New, Contacted, Qualified, Won, Lost.
5. Generate an AI-assisted reply draft using the business profile and lead enquiry.
6. Let the user review, edit, copy, and mark a reply as sent. No automatic external sending in MVP.
7. Record next-follow-up date and show overdue/upcoming follow-ups.
8. Basic dashboard: new leads, open leads, won leads, and follow-ups due.

## Explicitly out of scope for MVP

- Autonomous outbound email, SMS, WhatsApp, or phone calls.
- Scraping websites or buying contact lists.
- Payments and paid subscriptions until the product is validated.
- Multi-channel inbox integrations.
- Complex forecasting, custom model training, and multi-agent orchestration.
- Claims that AI guarantees more sales.

## Product success criteria

- A new user can sign in and create a workspace.
- A user can add and update a lead without data leaking across workspaces.
- AI can produce a relevant draft grounded in the saved business profile and enquiry.
- The user remains in control of every external communication.
- At least five real pilot businesses can complete the core workflow and provide feedback.

## Existing infrastructure to preserve

- Firebase project: `nexora-514918`
- Firebase web app: `NEXORA Web`
- Firebase Authentication: Google provider enabled.
- Cloud Firestore: existing database in `eur3` (Europe).
- Existing repository: `Owolabi4199/nexora`
- Existing `main` branch contains a separate personal task-workspace MVP. Do not overwrite it. Build this SaaS foundation on branch `ai-sales-saas-foundation`.

The Firebase web config is public project-identification data. Never put AI provider keys, service-account credentials, payment secrets, or other private credentials in browser code or Git.

## Proposed architecture

- Frontend: existing Vite + vanilla JavaScript app, mobile-first.
- Identity: Firebase Authentication.
- Data: Cloud Firestore, with tenant/workspace-scoped records.
- Backend: Firebase Cloud Functions (or a same-region server-side service) for AI requests.
- AI: begin with a low-cost/free-tier model provider only after checking current pricing, quotas, regional availability, and terms. Keep provider keys server-side in Secret Manager / Functions secrets.
- Hosting: Firebase Hosting after security rules and production checks are complete.

## Initial Firestore data model

```
workspaces/{workspaceId}
  name
  ownerUid
  createdAt
  businessProfile: { services, tone, hours, contactDetails }

workspaces/{workspaceId}/members/{uid}
  role: "owner" | "member"

workspaces/{workspaceId}/leads/{leadId}
  name
  email
  company
  source
  enquiry
  status
  nextFollowUpAt
  createdAt
  updatedAt
  createdBy

workspaces/{workspaceId}/aiDrafts/{draftId}
  leadId
  draftText
  model
  createdAt
  createdBy
```

Every read and write must verify authenticated workspace membership. Do not trust a workspace ID supplied by the browser without checking membership on the server/rules.

## Build sequence

1. Confirm the product requirements and keep the existing `main` branch intact.
2. Build the mobile-first workspace shell and navigation.
3. Implement workspace membership and Firestore security rules.
4. Implement lead CRUD and status tracking.
5. Implement follow-up scheduling.
6. Add a server-side AI draft endpoint with quotas and input limits.
7. Test isolation, error handling, abuse limits, and mobile usability.
8. Run a small pilot before enabling billing or automated messaging.

## Budget discipline

Keep the first prototype within the available ₦0–₦20,000 budget. Do not buy a domain, paid builder plan, paid AI credits, or company registration services until the relevant milestone requires it and the cost has been checked. AI API usage is separate from a ChatGPT subscription and may incur charges.
