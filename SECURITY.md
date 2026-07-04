# Security Policy

## Supported versions

`@middag-io/react` follows a 0.x release line: only the **latest published
version** receives security fixes. Upgrade to the newest release before
reporting an issue you can no longer reproduce there.

## Reporting a vulnerability

Please do **not** open a public GitHub issue for security vulnerabilities.

- Preferred: use GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
  on this repository ("Report a vulnerability" under the Security tab).
- Alternatively, email **security@middag.com.br** with a description, steps to
  reproduce, and the affected version(s).

You should receive an acknowledgement within 5 business days. We will keep you
informed as we triage, fix and release. Please give us reasonable time to ship
a fix before any public disclosure.

## Scope

This library renders backend-provided page contracts. Reports of particular
interest:

- XSS or HTML injection through contract data (block data, markdown, rich text)
- Prototype pollution or unsafe deserialization of contract payloads
- Dependency vulnerabilities exploitable through this library's usage of them
