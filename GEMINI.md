# AI Guidelines for Project Contributions

## Project Standards & Architecture

### Code Quality Requirements
- **Coding Conventions**: Follow established language-specific style guides (e.g., PEP 8 for Python, ESLint for JavaScript)
- **Naming Conventions**: Use descriptive, consistent naming for variables, functions, classes, and files
- **Error Handling**: Implement comprehensive try-catch blocks, custom error classes, and graceful failure mechanisms
- **Input Validation**: Sanitize and validate all user inputs, API parameters, and data sources
- **Code Documentation**: Write self-documenting code with meaningful variable names and clear function signatures
- **Code Comments**: Add comments for business logic, complex algorithms, and non-obvious implementation decisions
- **Code Formatting**: Use automated formatters (Prettier, Black, etc.) to maintain consistent code style
- **Linting**: Configure and use linters to catch potential issues early in development

### Architecture Principles
- **Design Patterns**: Follow established patterns (MVC, Repository, Factory, Observer) appropriate to the project
- **Separation of Concerns**: Clearly separate business logic, data access, and presentation layers
- **SOLID Principles**: Implement Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion
- **DRY Implementation**: Create reusable components, utilities, and shared libraries
- **Abstraction Layers**: Define clear interfaces between different system components
- **Dependency Management**: Use dependency injection and avoid tight coupling between modules
- **Configuration Management**: Externalize configuration settings and environment-specific variables
- **Scalability Design**: Design for horizontal and vertical scaling from the beginning

### Documentation Standards
- **README Requirements**: Include project description, prerequisites, installation steps, usage examples, and contribution guidelines
- **API Documentation**: Document all endpoints with request/response examples, error codes, and authentication requirements
- **Data Models**: Provide schema documentation with field descriptions, data types, and validation rules
- **Architecture Documentation**: Maintain system diagrams, component relationships, and data flow documentation
- **Setup Instructions**: Include environment setup, database migration steps, and dependency installation
- **Troubleshooting Guide**: Document common issues, error messages, and their solutions
- **Change Log**: Maintain a detailed changelog for version releases and breaking changes
- **Code Examples**: Provide practical usage examples for complex features and integrations

### Testing Requirements
- **Unit Testing**: Achieve minimum 80% code coverage with meaningful test cases
- **Test Structure**: Follow AAA pattern (Arrange, Act, Assert) for clear test organization
- **Integration Testing**: Test API endpoints, database interactions, and external service integrations
- **End-to-End Testing**: Implement user journey testing for critical application workflows
- **Test Data Management**: Use fixtures, factories, and mock data for consistent testing
- **Performance Testing**: Include load testing for high-traffic scenarios and bottleneck identification
- **Security Testing**: Implement tests for authentication, authorization, and input validation
- **Continuous Testing**: Integrate automated testing into CI/CD pipeline with failure notifications

### Version Control Guidelines
- **Commit Messages**: Use conventional commit format with type, scope, and clear description
- **Branch Naming**: Follow pattern: `type/feature-description` (e.g., `feature/user-authentication`)
- **Branching Strategy**: Implement Git Flow with main, develop, feature, release, and hotfix branches
- **Atomic Commits**: Keep commits focused on single changes with complete functionality
- **Code Reviews**: Require pull request reviews before merging to main branches
- **Issue Tracking**: Link commits and PRs to relevant issue numbers for traceability
- **Merge Strategy**: Use squash merges for feature branches to maintain clean history
- **Release Tagging**: Tag releases with semantic versioning (MAJOR.MINOR.PATCH)

### Performance & Security
- **Performance Optimization**: Profile code for bottlenecks, optimize database queries, and implement caching strategies
- **Security Implementation**: Use HTTPS, secure headers, input sanitization, and output encoding
- **Authentication & Authorization**: Implement robust user authentication with role-based access control
- **Data Protection**: Encrypt sensitive data at rest and in transit, follow GDPR/privacy regulations
- **Dependency Security**: Regularly update dependencies and scan for known vulnerabilities
- **Logging & Monitoring**: Implement comprehensive logging with appropriate log levels and monitoring alerts
- **Rate Limiting**: Implement API rate limiting and DDoS protection mechanisms
- **Security Headers**: Configure CSP, HSTS, X-Frame-Options, and other security headers

### Code Review Process
- **Review Checklist**: Verify functionality, code quality, security, performance, and documentation
- **Feedback Quality**: Provide constructive, specific feedback with suggestions for improvement
- **Response Time**: Review pull requests within 24-48 hours of submission
- **Testing Verification**: Ensure all tests pass and new features include appropriate test coverage
- **Standards Compliance**: Verify adherence to coding standards, architectural principles, and documentation requirements
- **Knowledge Sharing**: Use reviews as learning opportunities and knowledge transfer sessions
- **Approval Criteria**: Require at least two approvals for critical changes and one for routine updates
- **Follow-up Actions**: Track and verify that all review feedback has been addressed before merging

### Development Workflow
- **Environment Setup**: Maintain consistent development environments using Docker, virtual environments, or similar tools
- **Local Development**: Provide clear instructions for running the project locally with all dependencies
- **Database Management**: Use migrations for schema changes and seed data for development environments
- **CI/CD Pipeline**: Implement automated building, testing, and deployment processes
- **Deployment Strategy**: Use blue-green or rolling deployments for zero-downtime releases
- **Monitoring & Alerting**: Set up application monitoring, error tracking, and performance metrics
- **Backup & Recovery**: Implement automated backups and disaster recovery procedures
- **Environment Promotion**: Establish clear promotion process from development to staging to production

### Communication & Collaboration
- **Issue Management**: Use clear, descriptive issue titles with proper labels and assignments
- **Documentation Updates**: Keep all documentation current with code changes and new features
- **Team Communication**: Use established channels for technical discussions and decision-making
- **Knowledge Base**: Maintain internal wiki or documentation for team processes and decisions
- **Code Standards Discussions**: Regularly review and update coding standards based on team feedback
- **Training & Onboarding**: Provide resources for new team members to understand project standards
- **Technical Debt**: Track and prioritize technical debt with regular refactoring sessions
- **Innovation Time**: Allocate time for exploring new technologies and improving existing processes