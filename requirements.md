# Requirements Document

## Introduction

This document specifies the requirements for a role-based, AI-powered pharmacy operations web application designed to support both retail pharmacies and hospitals. Phase-1 focuses on exact UI/UX replication, role-based dashboards, inventory management, and Point of Sale (POS) foundation without AI execution (logic placeholders allowed for future phases).

## Glossary

- **System**: The pharmacy operations web application
- **User**: Any authenticated person using the system (Admin, Manager, or Pharmacist)
- **Admin**: User role with full system access and configuration capabilities
- **Manager**: User role with inventory, POS, and analytics access
- **Pharmacist**: User role with limited POS and read-only inventory access
- **POS**: Point of Sale interface for processing medicine sales
- **OPD**: Outpatient Department order type
- **IPD**: Inpatient Department order type
- **OT**: Operation Theatre order type
- **Retail Mode**: System configuration for retail pharmacy operations
- **Hospital Mode**: System configuration for hospital pharmacy operations
- **Medicine**: Pharmaceutical product tracked in inventory
- **Batch**: Specific lot of medicine with unique expiry date
- **Rack**: Physical storage location identifier for medicines
- **Stock Alert**: Notification for low stock or zero stock conditions
- **Expiry Alert**: Notification for expired or expiring medicines

## Requirements

### Requirement 1: User Authentication and Authorization

**User Story:** As a system administrator, I want secure user authentication and role-based access control, so that different users can access only the features appropriate to their role.

#### Acceptance Criteria

1. WHEN a user submits valid credentials THEN the System SHALL authenticate the user and return an authentication token
2. WHEN a user submits invalid credentials THEN the System SHALL reject the authentication attempt and display an error message
3. WHEN an authenticated user accesses a protected route THEN the System SHALL verify the authentication token before granting access
4. WHEN a user's role is determined THEN the System SHALL display only the navigation items and features permitted for that role
5. WHERE a user has Admin role THEN the System SHALL grant access to all pages including Dashboard, POS, Inventory, Analytics, Automation, and Settings
6. WHERE a user has Manager role THEN the System SHALL grant access to Dashboard, POS, Inventory, Analytics, Automation, and Settings pages
7. WHERE a user has Pharmacist role THEN the System SHALL grant access only to Dashboard (read-only), POS, and Inventory (read-only) pages

### Requirement 2: Global Design Language and UI Components

**User Story:** As a user, I want a consistent and visually appealing interface with soft rounded elements and clear visual hierarchy, so that I can navigate and use the application efficiently.

#### Acceptance Criteria

1. WHEN any card component is rendered THEN the System SHALL apply rounded corners with border radius between 14px and 18px
2. WHEN the application background is displayed THEN the System SHALL use light cream or off-white color (not pure white)
3. WHEN primary actions or highlights are shown THEN the System SHALL use yellow as the accent color
4. WHEN expiry or danger states are displayed THEN the System SHALL use red color indicators
5. WHEN available or success states are displayed THEN the System SHALL use green color indicators
6. WHEN neutral states are displayed THEN the System SHALL use grey color indicators
7. WHEN shadows are applied to elements THEN the System SHALL use subtle shadows without harsh borders
8. WHEN text is rendered THEN the System SHALL use a clean, modern, readable font family similar to Inter

### Requirement 3: Left Sidebar Navigation

**User Story:** As a user, I want a fixed vertical sidebar with icon-based navigation, so that I can quickly access different sections of the application.

#### Acceptance Criteria

1. WHEN the sidebar is rendered THEN the System SHALL display navigation icons in the following order from top to bottom: App logo, Home/Dashboard, POS, Inventory, Reports, Settings, User profile
2. WHEN a navigation item is selected THEN the System SHALL display a yellow circular background behind the icon
3. WHEN a navigation item is not selected THEN the System SHALL display the icon in grey color
4. WHEN the sidebar is displayed THEN the System SHALL show icons only without text labels
5. WHEN a user clicks a navigation icon THEN the System SHALL navigate to the corresponding page

### Requirement 4: Top Bar Global Elements

**User Story:** As a user, I want a clean top bar with search and notification capabilities, so that I can quickly find information and stay informed.

#### Acceptance Criteria

1. WHEN the top bar is rendered THEN the System SHALL display a global search bar aligned to center or right
2. WHEN the top bar is rendered THEN the System SHALL display a notification icon
3. WHEN the top bar is rendered THEN the System SHALL display an app grid or menu icon
4. WHEN the top bar is displayed THEN the System SHALL maintain a clean, minimal appearance without clutter

### Requirement 5: Dashboard - Medicine Inventory Overview

**User Story:** As a user, I want to see a visual overview of medicine inventory status, so that I can quickly understand stock levels across different categories.

#### Acceptance Criteria

1. WHEN the Dashboard page loads THEN the System SHALL display a Medicine Info card with dark background on the left side
2. WHEN the Medicine Info card is rendered THEN the System SHALL display a circular visualization showing Available count in green, Low stock count in yellow, and Out of stock count in red
3. WHEN inventory counts are displayed THEN the System SHALL show numbers in bold font
4. WHEN the circular visualization is shown THEN the System SHALL display a legend on the right side inside the card

### Requirement 6: Dashboard - Active Staff Display

**User Story:** As a manager, I want to see which staff members are currently active, so that I can monitor team availability.

#### Acceptance Criteria

1. WHEN the Dashboard page loads THEN the System SHALL display an Active Salesman card at the top center position
2. WHEN the Active Salesman card is rendered THEN the System SHALL show 3 to 4 visible user avatars in circular format
3. WHEN more than 4 staff members are active THEN the System SHALL display a "+X" indicator showing additional count
4. WHEN the Active Salesman card is displayed THEN the System SHALL use light background color

### Requirement 7: Dashboard - Prescription Summary

**User Story:** As a user, I want to see prescription statistics with visual indicators, so that I can monitor prescription processing activity.

#### Acceptance Criteria

1. WHEN the Dashboard page loads THEN the System SHALL display a Prescriptions card with bright yellow background in the center position
2. WHEN the Prescriptions card is rendered THEN the System SHALL display patient count, customer count, and a circular progress gauge
3. WHEN the Prescriptions card is displayed THEN the System SHALL make it visually stand out more than other cards

### Requirement 8: Dashboard - Recent Orders Management

**User Story:** As a user, I want to view and filter recent orders by type, so that I can process them efficiently.

#### Acceptance Criteria

1. WHEN the Dashboard page loads THEN the System SHALL display a Recent Orders card on the right side as a tall card
2. WHEN the Recent Orders card is rendered THEN the System SHALL display filter tabs for ALL, OPD, IPD, and OT
3. WHEN orders are listed THEN the System SHALL display columns for Patient, Ordered by (Doctor), Order type, and Action
4. WHEN a user clicks a filter tab THEN the System SHALL display only orders matching the selected type
5. WHEN an order row is displayed THEN the System SHALL show a "Sale Now" button with rounded style and grey/yellow hover effect
6. WHERE a user has Pharmacist role THEN the System SHALL disable the "Sale Now" button

### Requirement 9: Dashboard - Stock Alert Management

**User Story:** As a user, I want to monitor stock alerts with filtering capabilities, so that I can take action on low or zero stock items.

#### Acceptance Criteria

1. WHEN the Dashboard page loads THEN the System SHALL display a Stock Alert card at the bottom left position
2. WHEN the Stock Alert card is rendered THEN the System SHALL display tabs for ALL, LOW STOCK, and ZERO STOCK
3. WHEN stock items are listed THEN the System SHALL display columns for Medicine, Brand, Stock (with colored badge), Rack, and Status
4. WHEN a user clicks a tab THEN the System SHALL filter the stock list to show only items matching the selected category
5. WHEN a stock item requires action THEN the System SHALL display either "Requested" or "Order Now" status

### Requirement 10: Dashboard - Expired Medicines Alert

**User Story:** As a user, I want to see expired medicines highlighted prominently, so that I can remove them from inventory.

#### Acceptance Criteria

1. WHEN the Dashboard page loads THEN the System SHALL display an Expired card with red gradient background
2. WHEN the Expired card is rendered THEN the System SHALL display a list of expired medicines with expiry dates shown on the right
3. WHEN expired medicines exist THEN the System SHALL display a count badge at the top of the card

### Requirement 11: Dashboard - Expiring Soon Alert

**User Story:** As a user, I want to see medicines expiring soon with month filters, so that I can plan inventory actions proactively.

#### Acceptance Criteria

1. WHEN the Dashboard page loads THEN the System SHALL display an Expiring Soon card with orange or red background
2. WHEN the Expiring Soon card is rendered THEN the System SHALL display month filter pills (July, August, September)
3. WHEN the Expiring Soon card is displayed THEN the System SHALL show a count badge
4. WHEN a user clicks a month filter THEN the System SHALL display medicines expiring in the selected month

### Requirement 12: Dashboard - Financial Metrics

**User Story:** As a manager, I want to see key financial metrics at a glance, so that I can monitor business performance.

#### Acceptance Criteria

1. WHEN the Dashboard page loads THEN the System SHALL display small metric cards at the bottom right showing Invoices, Paid, Discount, Dues, and Refund
2. WHEN a metric card is rendered THEN the System SHALL display an icon on the left, a large number, and apply subtle shadow
3. WHERE a user has Pharmacist role THEN the System SHALL hide financial metric cards

### Requirement 13: Point of Sale - Medicine Selection Interface

**User Story:** As a pharmacist, I want to select medicines from a visual card interface, so that I can quickly add items to a sale.

#### Acceptance Criteria

1. WHEN the POS page loads THEN the System SHALL display horizontal medicine cards in the left section
2. WHEN a medicine card is rendered THEN the System SHALL display image, name, dosage, price, and rack information
3. WHEN a user clicks a medicine card THEN the System SHALL highlight it with a yellow outline
4. WHEN a medicine card is displayed THEN the System SHALL show "Change" and "Alternative" buttons
5. WHEN the medicine selection area is rendered THEN the System SHALL display an "Add Medicine" card with a plus icon

### Requirement 14: Point of Sale - Active Orders Bar

**User Story:** As a pharmacist, I want to see and switch between active orders, so that I can process multiple customers efficiently.

#### Acceptance Criteria

1. WHEN the POS page loads THEN the System SHALL display a horizontal list of patient avatars at the top
2. WHEN an order is displayed in the active orders bar THEN the System SHALL show an order type badge (OPD, IPD, or OT)
3. WHEN a user clicks a patient avatar THEN the System SHALL load that order and highlight it

### Requirement 15: Point of Sale - Billing Panel

**User Story:** As a pharmacist, I want to manage quantities, apply discounts, and calculate totals, so that I can complete sales transactions.

#### Acceptance Criteria

1. WHEN the POS page loads THEN the System SHALL display a billing panel on the right section
2. WHEN medicines are added to the order THEN the System SHALL display a list with quantity controls (+ and – buttons)
3. WHEN the billing panel is rendered THEN the System SHALL display fields for Subtotal, Discount input, Receivable, Received, and Total due
4. WHEN a user clicks the plus button THEN the System SHALL increment the medicine quantity by one
5. WHEN a user clicks the minus button THEN the System SHALL decrement the medicine quantity by one
6. WHEN a user enters a discount value THEN the System SHALL recalculate the receivable and total due amounts
7. WHEN payment options are displayed THEN the System SHALL show Cash, Card, and Code options
8. WHEN the billing panel is rendered THEN the System SHALL display a large yellow SAVE button at the bottom
9. WHEN no medicines are added to the order THEN the System SHALL disable the SAVE button

### Requirement 16: Inventory - Stock List Management

**User Story:** As a manager, I want to view and search the complete medicine stock list, so that I can manage inventory effectively.

#### Acceptance Criteria

1. WHEN the Inventory page loads THEN the System SHALL display a Stock List tab as the default view
2. WHEN the Stock List is rendered THEN the System SHALL display columns for Medicine name, Batch, Stock count, Rack, and Status badge
3. WHEN a user enters text in the search field THEN the System SHALL filter the stock list to show only matching medicines
4. WHERE a user has Pharmacist role THEN the System SHALL display the stock list in read-only mode without action buttons

### Requirement 17: Inventory - Expiry Management

**User Story:** As a manager, I want to manage expired and expiring medicines with month filters, so that I can minimize waste.

#### Acceptance Criteria

1. WHEN the Inventory page loads THEN the System SHALL display an Expiry Management tab
2. WHEN the Expiry Management tab is selected THEN the System SHALL display separate lists for expired and expiring soon medicines
3. WHEN the expiring soon list is displayed THEN the System SHALL provide month filter options
4. WHEN a user selects a month filter THEN the System SHALL display only medicines expiring in that month

### Requirement 18: Inventory - Stock Alerts

**User Story:** As a manager, I want to view low stock and zero stock alerts, so that I can reorder medicines before stockouts occur.

#### Acceptance Criteria

1. WHEN the Inventory page loads THEN the System SHALL display a Stock Alerts tab
2. WHEN the Stock Alerts tab is selected THEN the System SHALL display separate views for low stock and zero stock items
3. WHEN stock alert items are displayed THEN the System SHALL show medicine name, current stock level, and recommended action

### Requirement 19: Analytics and Reports

**User Story:** As a manager, I want to view inventory trends and waste analytics, so that I can make data-driven decisions.

#### Acceptance Criteria

1. WHEN the Analytics page loads THEN the System SHALL display inventory trends with sales trend graph and stock movement graph
2. WHEN the Analytics page loads THEN the System SHALL display waste analytics showing expired stock value and overstock indicators
3. WHEN the Reports section is displayed THEN the System SHALL show download buttons with date filter options
4. WHERE a user has Pharmacist role THEN the System SHALL deny access to the Analytics page

### Requirement 20: Automation and AI Placeholders

**User Story:** As an admin, I want to see placeholder UI for future AI and automation features, so that the interface is ready for Phase-2 implementation.

#### Acceptance Criteria

1. WHEN the Automation page loads THEN the System SHALL display AI Recommendations section with reorder suggestion cards and expiry prevention cards as UI placeholders
2. WHEN the Automation page loads THEN the System SHALL display Workflow Automation section with if-then rule cards and enable/disable toggles as UI placeholders
3. WHEN the Automation page loads THEN the System SHALL display WhatsApp Integration section showing connected/not connected state with disabled test message button
4. WHERE a user has Pharmacist role THEN the System SHALL deny access to the Automation page

### Requirement 21: Settings and Configuration

**User Story:** As an admin, I want to manage user profiles, system modes, and role permissions, so that I can configure the system appropriately.

#### Acceptance Criteria

1. WHEN the Settings page loads THEN the System SHALL display Profile Settings section with fields for Name, Role, and Mode (Retail/Hospital)
2. WHEN the Settings page loads THEN the System SHALL display Mode Settings section with OPD/IPD/OT toggles for Hospital mode and Critical medicine toggle
3. WHERE a user has Admin role THEN the System SHALL display Role Management section with view roles and permission preview options
4. WHERE a user has Pharmacist role THEN the System SHALL deny access to the Settings page

### Requirement 22: Retail and Hospital Mode Behavior

**User Story:** As an admin, I want to switch between Retail and Hospital modes, so that the system adapts to different operational contexts.

#### Acceptance Criteria

1. WHERE the System is in Retail Mode THEN the System SHALL display SKU-focused views with profit metrics visible and simplified interfaces
2. WHERE the System is in Hospital Mode THEN the System SHALL activate OPD/IPD/OT filters, display department logic placeholders, and emphasize critical medicines
3. WHEN a user switches modes in Settings THEN the System SHALL update all relevant UI components to reflect the selected mode

### Requirement 23: Responsive Layout and Spacing

**User Story:** As a user, I want the interface to maintain consistent spacing and layout, so that the application is visually balanced and easy to use.

#### Acceptance Criteria

1. WHEN any page is rendered THEN the System SHALL apply consistent spacing between elements matching the design specifications
2. WHEN cards are arranged in a grid THEN the System SHALL maintain equal gaps between cards
3. WHEN the viewport size changes THEN the System SHALL maintain layout integrity and readability

### Requirement 24: Data Fetching and API Integration

**User Story:** As a developer, I want all pages to fetch data via API with authentication, so that the frontend and backend are properly connected.

#### Acceptance Criteria

1. WHEN any page loads THEN the System SHALL fetch data from the backend API using the authentication token
2. WHEN API requests are made THEN the System SHALL include the authentication token in request headers
3. WHEN the backend returns user role information THEN the System SHALL adapt the UI based on the returned role
4. WHEN API requests fail THEN the System SHALL display appropriate error messages to the user

### Requirement 25: Landing, Signup, and Login Pages

**User Story:** As a new user, I want to access landing, signup, and login pages, so that I can create an account and access the system.

#### Acceptance Criteria

1. WHEN a user visits the application root URL THEN the System SHALL display a landing page
2. WHEN the landing page is displayed THEN the System SHALL provide navigation to signup and login pages
3. WHEN a user accesses the signup page THEN the System SHALL display a form to create a new account with fields for name, email, password, and role selection
4. WHEN a user submits the signup form with valid data THEN the System SHALL create the account and redirect to the login page
5. WHEN a user accesses the login page THEN the System SHALL display a form with email and password fields
6. WHEN a user submits the login form with valid credentials THEN the System SHALL authenticate the user and redirect to the Dashboard
