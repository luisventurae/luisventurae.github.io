# Spec Delta

## MODIFIED Requirements

### Requirement: Categorized technologies

The stack map SHALL list technologies grouped in the categories Backend, Frontend and Other, with a visual weight given by the usage tier (daily use, used in production, exploring) instead of a numeric proficiency level, and SHALL show a localized legend for the three tiers. No numeric self-rating SHALL be displayed.

#### Scenario: Category filter

- **WHEN** the visitor selects the "Frontend" category
- **THEN** only Frontend technologies remain visible

#### Scenario: Tier weight

- **WHEN** the stack map is rendered
- **THEN** daily-use technologies such as Node.js are more prominent than exploring technologies such as Kafka, and the legend names the three tiers
