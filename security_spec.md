# Security Specification & Test Targets

This document outlines the security invariants, negative scenario payloads ("The Dirty Dozen"), and validation criteria for the PH TRADE UNION database layout in Firestore.

## 1. Data Invariants

1. **Authentication Boundary**: No unauthenticated client can read or write any users, transactions, or support tickets records.
2. **PII and Ownership Isolation**: A user can only read and write their own UserProfile document `/users/{userId}`. Non-authorized users cannot read another user's profile.
3. **Role Lock / Privilege Escalation Guard**: The `role` property of a user profile is immutable via the client SDK. Only administrative/system-owner accounts can alter roles. Users cannot change their own roles on sign-up or update.
4. **Balance Integrity**: System adjusting balances, deposits, and status fields cannot be directly written/updated arbitrarily by standard users.
5. **Support Integrity**: Users can submit new tickets, read their own tickets, and add replies to their own tickets. Administrative roles ("Support Admin", "System Owner") can read all tickets and append administrative replies.
6. **Immutable Fields**: Properties like `createdAt` of a support ticket, and standard `userEmail` must remain immutable after initial write.

## 2. "The Dirty Dozen" Exploit Payloads

Here are 12 malicious payloads designed to attack the database. The security rules are configured to reject all of these.

### Scenario 1: Unauthenticated profile creation
* **Collection**: `/users/attackerId`
* **Vulnerability Target**: Identity Spoofing / No-auth write
* **Payload**: `{"name": "Attacker", "email": "attacker@spam.com", "balance": 999999}` (Attempted without login)

### Scenario 2: Standard user self-assigning Admin / System Owner role
* **Collection**: `/users/user123`
* **Vulnerability Target**: Privilege Escalation
* **Payload**: `{"role": "System Owner"}` (Submitted by normal user during update)

### Scenario 3: User altering their currency account balance directly
* **Collection**: `/users/user123`
* **Vulnerability Target**: Value Poisoning / Financial Fraud
* **Payload**: `{"balance": 2000000.00}` (Standard user attempting to credit their own account)

### Scenario 4: Reading another trader's PII profile
* **Collection**: `/users/victimUserId`
* **Vulnerability Target**: PII Data Leak
* **Operation**: `get` victim profile by `attackerId`

### Scenario 5: User approving their own pending withdrawal
* **Collection**: `/transactions/tx789`
* **Vulnerability Target**: State Shortcutting
* **Payload**: `{"status": "Approved"}` (Injected by a basic non-admin user)

### Scenario 6: Injecting an oversized string in Transaction Reference
* **Collection**: `/transactions/tx999`
* **Vulnerability Target**: Denial of Wallet (Resource Exhaustion)
* **Payload**: `{"id": "tx999", "referenceId": "VERY_LONG_STRING_REPEATED_TO_1MB..."}`

### Scenario 7: Normal user reading all deposits in database
* **Collection**: `/transactions`
* **Vulnerability Target**: Transaction Ledger Leaks (Insecure List Queries)
* **Operation**: Standard list query without matching relational constraints `where("userEmail", "==", request.auth.token.email)`

### Scenario 8: Forging the user email in transaction submission
* **Collection**: `/transactions/tx123`
* **Vulnerability Target**: Identity Spoofing
* **Payload**: `{"id": "tx123", "type": "deposit", "amount": 1000, "userEmail": "victim@gmail.com"}` (Signed-in as attacker@gmail.com)

### Scenario 9: Injecting bad characters in support ticket ID
* **Collection**: `/tickets/TCK-BAD%20CHARS`
* **Vulnerability Target**: Path/ID Poisoning
* **Operation**: Create ticket with malformed pattern ID

### Scenario 10: Anonymous reply to Support Ticket
* **Collection**: `/tickets/TCK-48102`
* **Vulnerability Target**: Integrity failure
* **Payload**: Add reply without active user auth UID context

### Scenario 11: Updating a support ticket once status is closed/resolved (terminal state lock bypass)
* **Collection**: `/tickets/TCK-32111`
* **Vulnerability Target**: Terminal State Locking bypass
* **Pipeline**: Update status to "Open" after ticket is resolved/closed by Support Admin.

### Scenario 12: Updating immutable fields like createdAt
* **Collection**: `/tickets/TCK-48102`
* **Vulnerability Target**: Temporal Integrity Breach
* **Payload**: `{"createdAt": "2020-01-01 00:00:00"}`

---

## 3. Deployment Rules Design

Our safety rules enforces strict ABAC checks and will prevent all 12 scenarios above.
