import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gratissimi — The Digital Decretals",
  description: "Acknowledgements for the Digital Decretals project.",
};

export default function GratissimiPage() {
  return (
    <main className="page">
      <h1>Gratissimi</h1>
      <p className="lede">Acknowledgements</p>
      <p>
        If there is a single person deserving of credit with helping this project along, it would be Bob Scott of
        the{" "}
        <a href="https://library.columbia.edu/locations/dhc.html" target="_blank" rel="noopener noreferrer">
          Columbia Libraries Digital Humanities Center
        </a>{" "}
        (formerly the Electronic Text Service). This project was only possible because of the sinecure I had working
        at the DHC while studying at Columbia, which allowed me to familiarize myself with the basics of Digital
        Humanities methods. Bob was also invaluable in assisting me in the launch and initial direction of this
        project — which was simply the latest in a line of previous projects he had helped me to develop. Bob has
        been instrumental in the intellectual and professional development of many medievalists coming out of
        Columbia (and canon law scholars in particular), whether through the employment he provided at the DHC, or
        through the direct assistance he gave on their research, on which he sometimes matched the hours put in by
        the researchers themselves, to their great embarrassment but eternal gratitude. If you haven't yet done so
        today, thank a librarian.
      </p>
      <p>
        Thank you as well to Adelphi University for giving me a Faculty Research Grant to take the initial data I
        had assembled as a graduate student and shape it into the coherent text presented here.
      </p>
      <p>
        I owe an additional thanks to the various current and former staff members of Adelphi's incomparable{" "}
        <a href="https://fcpe.adelphi.edu/" target="_blank" rel="noopener noreferrer">
          Faculty Center for Professional Excellence
        </a>{" "}
        for consulting on various aspects of the project along the way.
      </p>
      <p>
        Finally, I would like to say thanks to{" "}
        <a href="https://www.youtube.com/watch?v=-vo5me1Apsw" target="_blank" rel="noopener noreferrer">
          everyone else who assisted or made possible the work on this project
        </a>
        .
      </p>
      <p className="dim" style={{ fontStyle: "italic" }}>— Edward A. Reno III</p>
    </main>
  );
}
