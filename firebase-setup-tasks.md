# Firebase Setup and Feature Implementation Tasks

## Tasks to Complete

### Firebase Setup

1. [x] Add Firebase SDK to the project:
   - Install Firebase: `npm install firebase`.
   - Import Firebase in the project and initialize it with your Firebase credentials.

2. [x] Configure Firebase credentials:
   - Add the Firebase configuration object (API key, project ID, etc.) to a secure location in the project (e.g., an `.env` file or a dedicated configuration file).

3. [ ] Set up Realtime Database rules:
   - Configure read/write rules for development (e.g., allow all access temporarily).
   - Update rules for production to secure the database.

---

### Frontend Integration

4. [x] Implement Firebase initialization:
   - Create a utility file (e.g., `firebaseConfig.ts`) to initialize and export the Firebase instance.

5. [x] Update the "New Order" flow:
   - Generate a unique table ID and store it in Firebase under the `tables` node.
   - Add the user to the `users` node under the table ID.

6. [x] Update the "Join Existing Order" flow:
   - Prompt the user for a table ID and validate it against Firebase.
   - Add the user to the `users` node under the table ID.

7. [x] Implement user selections:
   - Track user selections locally during swiping.
   - On completion, batch the selections and write them to Firebase under the `selections` node for the table.

---

### Real-Time Updates

8. [x] Implement real-time listeners:
   - Use Firebase listeners to fetch updates for the summary page.
   - Update the summary page dynamically as other users complete their selections.

9. [x] Add a manual refresh option:
   - Provide a "Refresh" button to fetch the latest data from Firebase.

---

### Testing and Optimization

10. [ ] Test single-user and multi-user flows:
    - Ensure data consistency and correct behavior for both scenarios.

11. [ ] Optimize database interactions:
    - Minimize reads and writes to stay within Firebase's free tier limits.

12. [ ] Secure the database:
    - Update Firebase rules to restrict access based on user authentication.

---

### Notes

- Mark tasks as completed (`[x]`) as you progress.
- Ensure proper error handling and user feedback for all database interactions.
