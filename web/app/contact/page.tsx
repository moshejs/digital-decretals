import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — The Digital Decretals",
  description: "Contact information for Prof. Edward A. Reno III.",
};

export default function ContactPage() {
  return (
    <main className="page">
      <h1>Contact</h1>
      <p className="lede">Feedback, corrections, and collaboration</p>
      <p>
        I welcome any and all feedback on the project, suggestions for improvement, and ideas for expansion and
        collaboration.
      </p>
      <p>
        My email is <a href="mailto:ereno@adelphi.edu">ereno@adelphi.edu</a>. Please note that I am sometimes bad
        about the email, and so you are welcome to text me directly either as a follow up or even as a first line of
        contact at <a href="sms:+18453800167">845-380-0167</a>.
      </p>
      <p className="dim">
        Edward A. Reno III, Ph.D. — Associate Professor of Medieval History, Department of History, Adelphi
        University, Garden City, NY.
      </p>
    </main>
  );
}
