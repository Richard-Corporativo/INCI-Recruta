# Spec: Dynamic Dashboard

## MODIFIED Requirements

### Req: Metric Calculation
KPIs on the Dashboard must be calculated from real candidate and job data.

#### Scenario: Average Time to Hire
- **Given** two hired candidates with hiring times of 10 and 20 days.
- **Then** the "Tempo Médio (Hire)" KPI should display "15 Dias corridos".

### Req: Dashboard Filtering
The Dashboard must support filtering data by period, department, and manager.

#### Scenario: Filter by Manager
- **When** a specific manager is selected in the filter.
- **Then** only jobs and candidates assigned to that manager should be included in the KPIs.
