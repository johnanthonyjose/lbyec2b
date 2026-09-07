import React from "react";
import { Button } from "../../components/ds/index.js";
import { Figure, Field, GreenButton, BrowserFrame, PinnedShot } from "./Figures.jsx";

/* The seven steps of the handout.
   Content lives here as data so the walkthrough component stays a shell: it
   knows how to present a step, not what any step says. `body` and `figure`
   carry markup because the prose is threaded with emphasis and links, which
   plain strings cannot hold.

   `fix` is the id of the resolution panel the step's difficulty banner opens.
   It is not always the step number: step 6 raises the form's difficulty and
   step 7 raises the invitation's, and those two panels are numbered the other
   way round. See resolutions.jsx. */

const list = {
  margin: "22px 0 0", paddingLeft: 20, display: "grid", gap: 10,
  fontSize: "var(--text-base)", lineHeight: "var(--leading-relaxed)",
  color: "var(--text-secondary)", maxWidth: "70ch"
};

const colHead = {
  fontSize: "var(--text-2xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)",
  textTransform: "uppercase", color: "var(--text-gold)"
};
const colBody = {
  margin: "8px 0 0", fontSize: "var(--text-sm)",
  lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)"
};

export const steps = [
  {
    n: 1,
    title: "Open the registration page",
    action: <>Enter <strong>github.com/signup</strong> in the address bar of the browser.</>,
    fix: 1,
    difficulty: "The page does not load, or the address is not github.com",
    question: "Which of the following is displayed?",
    okLabel: "A single field requesting an electronic mail address",
    stuckLabel: "Some other page, or no page at all",
    okNote: "Correct. Proceed to step 2.",
    stuckNote: "A student who already holds an account will be directed to the account dashboard instead and may proceed to step 6. In all other cases, consult the resolution above.",
    body: (
      <ul style={list}>
        <li>Type the address directly. A search result should not be used.</li>
        <li>Confirm that the address bar reads <strong>github.com</strong> and that the connection is secure.</li>
        <li>Registration may also be reached from <a href="https://github.com" target="_blank" rel="noopener">github.com</a> by selecting <strong>Sign up</strong>. The direct address is <a href="https://github.com/signup" target="_blank" rel="noopener">github.com/signup</a>.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 1.1 · The registration page as first presented"
        note="Schematic diagram. A single field is presented, followed by Continue." maxWidth={620}>
        <BrowserFrame address="github.com/signup">
          <div style={{
            borderTop: "1px solid var(--border-subtle)", paddingTop: 20,
            display: "grid", gap: 10, maxWidth: 320, margin: "0 auto"
          }}>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Enter your email</div>
            <Field />
            <GreenButton>Continue</GreenButton>
          </div>
        </BrowserFrame>
      </Figure>
    )
  },

  {
    n: 2,
    title: "Complete the registration fields",
    action: <>Supply the DLSU electronic mail address, a password, a username and the country or region, selecting <strong>Continue</strong> after each entry.</>,
    fix: 2,
    difficulty: "The username is unavailable, or a personal address was entered",
    question: "Which address was entered?",
    okLabel: "The DLSU address, ending in @dlsu.edu.ph",
    stuckLabel: "A personal address, or the username was refused",
    okNote: "Correct. Record the username before proceeding.",
    stuckNote: "Neither condition prevents registration from being completed. The resolution above sets out the corrective procedure for each.",
    body: (
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        margin: "26px 0 0", borderTop: "1px solid var(--border-default)"
      }}>
        <div style={{ padding: "18px 20px 18px 0", borderRight: "1px solid var(--border-subtle)" }}>
          <div style={colHead}>Electronic mail</div>
          <p style={colBody}>The official <strong>@dlsu.edu.ph</strong> address. The organisation invitation in step 7 is issued to this address.</p>
        </div>
        <div style={{ padding: "18px 20px", borderRight: "1px solid var(--border-subtle)" }}>
          <div style={colHead}>Password</div>
          <p style={colBody}>Fifteen characters, or eight characters including one numeral and one lowercase letter. The DLSU password must not be reused.</p>
        </div>
        <div style={{ padding: "18px 0 18px 20px" }}>
          <div style={colHead}>Username</div>
          <p style={colBody}>Public, and attributed to every commit. Record it; step 6 requires it exactly as entered.</p>
        </div>
      </div>
    ),
    figure: (
      <>
        <Figure caption="Figure 2.1 · Order of the four registration screens"
          note="Schematic diagram. Select Philippines at the fourth screen." maxWidth={760}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 14, maxWidth: 760
          }}>
            {[
              ["1", "Enter your email", true],
              ["2", "Create a password", false],
              ["3", "Enter a username", false],
              ["4", "Country or region", false]
            ].map(([num, label, focused]) => (
              <div key={num} style={{
                border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
                background: "var(--neutral-50)", padding: 14
              }}>
                <div style={{ fontSize: "var(--text-2xs)", fontWeight: 700, color: "var(--text-muted)", fontFeatureSettings: "'tnum'" }}>{num}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", margin: "6px 0 8px" }}>{label}</div>
                <Field style={focused
                  ? { borderColor: "var(--green-700)", boxShadow: "0 0 0 2px var(--green-100)" }
                  : undefined} />
                <GreenButton height={28} size="var(--text-2xs)" style={{ marginTop: 8 }}>Continue</GreenButton>
              </div>
            ))}
          </div>
        </Figure>

        <div style={{
          margin: "28px 0 0", border: "1px solid var(--gold-300)", borderRadius: "var(--radius-md)",
          background: "var(--surface-gold-tint)", padding: "20px 24px", maxWidth: 760
        }}>
          <div style={{
            fontSize: "var(--text-2xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)",
            textTransform: "uppercase", color: "var(--gold-700)"
          }}>Permitted alternative</div>
          <p style={{
            margin: "10px 0 0", fontSize: "var(--text-base)",
            lineHeight: "var(--leading-relaxed)", color: "var(--text-primary)", maxWidth: "70ch"
          }}>
            The registration page also accepts <strong>Continue with Google</strong>. Authenticating
            with the DLSU Google account completes steps 2 to 4 in a single operation, and the
            address is confirmed on creation. Students electing this route must sign in by the same
            means thereafter, since a provider sign-in and a password sign-in constitute separate
            accounts.
          </p>
        </div>
      </>
    )
  },

  {
    n: 3,
    title: "Complete account verification",
    action: <>Complete the verification exercise presented under <strong>Verify your account</strong>, then select <strong>Create account</strong>.</>,
    fix: 3,
    difficulty: "The verification exercise does not appear, or Create account has no effect",
    question: "Was the account created?",
    okLabel: "Yes, and a verification code is now requested",
    stuckLabel: "No, the exercise or the button does not respond",
    okNote: "Correct. The browser tab must be left open.",
    stuckNote: "The condition is a browser restriction rather than an account fault. The resolution above sets out the corrective steps.",
    body: (
      <ul style={list}>
        <li>Verification is required of every registration and does not indicate an error.</li>
        <li>An unsuccessful attempt carries no consequence; a further exercise is issued.</li>
        <li>If the exercise does not appear, script and advertisement blocking must be disabled for the site.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 3.1 · The verification panel" note="Schematic diagram.">
        <div style={{
          border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
          background: "var(--neutral-50)", padding: 20, maxWidth: 380
        }}>
          <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>
            Verify your account
          </div>
          <div style={{
            border: "1px dashed var(--border-default)", borderRadius: "var(--radius-md)",
            background: "#fff", height: 120, display: "grid", placeItems: "center",
            color: "var(--text-muted)", fontSize: "var(--text-xs)",
            letterSpacing: "var(--tracking-wide)", textTransform: "uppercase"
          }}>Exercise loads here</div>
          <GreenButton style={{ marginTop: 14 }}>Create account</GreenButton>
        </div>
      </Figure>
    )
  },

  {
    n: 4,
    title: "Confirm the electronic mail address",
    action: <>Open the DLSU mailbox in a <strong>second browser tab</strong>, read the eight-digit code, and enter it in the tab awaiting it.</>,
    fix: 4,
    difficulty: "No code is received, or the code entered is refused",
    question: "Is the address now confirmed?",
    okLabel: "Yes, the code was accepted and the account is signed in",
    stuckLabel: "No code arrived, or the code was refused",
    okNote: "Correct. The account is registered and confirmed.",
    stuckNote: "A refused code is in most cases an expired one. The resolution above sets out the procedure for reissue and for correcting a mistyped address.",
    body: (
      <ul style={list}>
        <li>The registration tab must not be closed. It holds the registration open.</li>
        <li>No element of the message requires selection. Only the eight digits are needed.</li>
        <li>An unconfirmed address cannot create a repository, and laboratory work cannot then be submitted.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 4.1 · Transferring the code between tabs" note="Schematic diagram." maxWidth={760}>
        <div className="gh-two" style={{
          display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
          gap: 16, maxWidth: 760, alignItems: "stretch"
        }}>
          <div style={{
            border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
            background: "var(--neutral-50)", padding: 16
          }}>
            <div style={{ fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-wide)", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Tab 2 · DLSU mailbox
            </div>
            <div style={{
              marginTop: 12, background: "#fff", border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)", padding: 16
            }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>Your GitHub launch code</div>
              <div style={{
                marginTop: 10, fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600,
                letterSpacing: "0.12em", fontFeatureSettings: "'tnum'", color: "var(--text-primary)"
              }}>4 7 2 9 1 5 0 6</div>
              <div style={{ marginTop: 8, fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>Illustrative value only.</div>
            </div>
          </div>
          <div style={{
            border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
            background: "var(--neutral-50)", padding: 16
          }}>
            <div style={{ fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-wide)", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Tab 1 · registration
            </div>
            <div style={{ marginTop: 12, fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Enter code</div>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 5 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{
                  border: `1px solid ${i === 0 ? "var(--green-700)" : "var(--border-default)"}`,
                  borderRadius: "var(--radius-sm)", background: "#fff", height: 38
                }} />
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>Eight fields, one digit each.</div>
          </div>
        </div>
      </Figure>
    )
  },

  {
    n: 5,
    title: "Decline the optional offers",
    action: <>Answer or skip the personalisation questions, <strong>decline any paid trial</strong>, and proceed to the account dashboard.</>,
    fix: 5,
    difficulty: "Payment details are being requested",
    question: "What is now displayed?",
    okLabel: "The account dashboard, with no payment made",
    stuckLabel: "A request for payment details",
    okNote: "Correct. Registration is complete. Two course requirements remain.",
    stuckNote: "No payment instrument should be entered. The resolution above sets out how to leave the offer and reach the dashboard.",
    body: (
      <ul style={list}>
        <li>None of these responses bears on the requirements of this course.</li>
        <li>The free plan provides unlimited public and private repositories, which is sufficient throughout.</li>
        <li>No payment instrument is required at any point in the term.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 5.1 · The personalisation questions"
        note="Schematic diagram. Skip is the shortest path to the dashboard.">
        <div style={{
          border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
          background: "var(--neutral-50)", padding: 20, maxWidth: 420
        }}>
          <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>Tell us about yourself</div>
          <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
            {[0, 1, 2].map((i) => <Field key={i} style={{ height: 30 }} />)}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              height: 34, flex: 1, borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-default)", background: "#fff",
              display: "grid", placeItems: "center", fontSize: "var(--text-sm)", color: "var(--text-secondary)"
            }}>Continue</div>
            <div style={{
              height: 34, padding: "0 18px", borderRadius: "var(--radius-md)",
              border: "2px solid var(--gold-500)", display: "grid", placeItems: "center",
              fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--gold-700)"
            }}>Skip</div>
          </div>
        </div>
      </Figure>
    )
  },

  {
    n: 6,
    title: "Submit the membership form",
    action: <>Submit the organisation membership form, entering the username <strong>exactly</strong> as registered.</>,
    fix: 7,
    difficulty: "The form does not open, or the response is not accepted",
    question: "Was the form submitted?",
    okLabel: "Yes, with the username copied rather than typed",
    stuckLabel: "No, the form will not open or will not accept the response",
    okNote: "Recorded. The invitation follows automatically.",
    stuckNote: "Access is generally restricted to DLSU Google accounts. The resolution above sets out what to verify before contacting the course coordinator.",
    body: (
      <>
        <ul style={list}>
          <li>Copy the username from the profile address rather than entering it from memory.</li>
          <li>Give the same address confirmed at step 4.</li>
          <li>A single incorrect character prevents the invitation from being issued. This is the most frequent cause of failure.</li>
        </ul>
        <div style={{ margin: "26px 0 0" }}>
          <Button as="a" href="https://forms.gle/62vVyyMWzkLedn6a8" target="_blank" rel="noopener" size="lg">
            Open the membership form
          </Button>
          <p style={{ margin: "10px 0 0", fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>
            forms.gle/62vVyyMWzkLedn6a8
          </p>
        </div>
      </>
    ),
    figure: (
      <Figure caption="Figure 6.1 · Locating the username" note="Schematic diagram.">
        <div style={{
          border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
          background: "var(--neutral-50)", padding: 16, maxWidth: 560
        }}>
          <span style={{
            display: "block", background: "#fff", border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-pill)", padding: "7px 14px",
            fontSize: "var(--text-sm)", color: "var(--text-primary)"
          }}>
            github.com/<span style={{ borderBottom: "2px solid var(--gold-500)", fontWeight: 600 }}>your-username</span>
          </span>
          <p style={{
            margin: "12px 0 0", fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)"
          }}>
            Open the profile page. The underlined portion of the address is the username the form
            requires. Select it and copy.
          </p>
        </div>
      </Figure>
    )
  },

  {
    n: 7,
    title: "Accept the organisation invitation",
    action: <>Open the invitation message and select <strong>Join @dlsuece-programming-fundamentals</strong>.</>,
    fix: 6,
    difficulty: "No invitation has been received",
    question: "Is membership of the organisation now held?",
    okLabel: "Yes, the organisation appears on the account",
    stuckLabel: "No invitation has been received",
    okNote: "All requirements of this handout are satisfied.",
    stuckNote: "In most cases the username submitted at step 6 does not match the account. The resolution above sets out what to check before resubmitting.",
    body: (
      <ul style={list}>
        <li>Invitations expire after seven days. An expired invitation may be reissued on request.</li>
        <li>If the message cannot be located, sign in and open <a href="https://github.com/dlsuece-programming-fundamentals" target="_blank" rel="noopener">github.com/dlsuece-programming-fundamentals</a>, where a pending invitation is shown as a banner.</li>
        <li>An invitation may equally be accepted at <a href="https://github.com/settings/organizations" target="_blank" rel="noopener">github.com/settings/organizations</a>.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 7.1 · The invitation, and the banner shown in its absence">
        <div className="gh-two" style={{
          display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20, maxWidth: 860
        }}>
          <div>
            <PinnedShot src="assets/img/gh/invitation-message.jpeg" width={1200} height={748}
              alt="The GitHub invitation message, with the Join @dlsuece-programming-fundamentals button at the foot of the message."
              pins={[{ n: 1, left: "52%", top: "96%" }]} />
            <p style={{ margin: "10px 0 0", fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)" }}>
              <strong>1</strong> The Join control within the invitation message.
            </p>
          </div>
          <div>
            <PinnedShot src="assets/img/gh/organisation-banner.jpeg" width={1200} height={509}
              alt="The organisation profile page, showing a pending-invitation banner with a View invitation control at its right."
              pins={[{ n: 2, left: "93.8%", top: "10.5%" }]} />
            <p style={{ margin: "10px 0 0", fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)" }}>
              <strong>2</strong> The View invitation control on the organisation page.
            </p>
          </div>
        </div>
      </Figure>
    )
  }
];
