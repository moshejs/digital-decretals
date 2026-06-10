import type { Metadata } from "next";
import Link from "next/link";
import TryEx from "@/components/TryEx";

export const metadata: Metadata = {
  title: "Legal Allegations",
  description:
    "How to search the standardized legal allegations of the Glossa Ordinaria: Decretum, Liber extra, extravagantes, Codex, Digest, Institutes, Novellae — plus jurists' sigla and mnemonic verses.",
};

export default function AllegationsPage() {
  return (
    <main className="page">
      <h1>How to search for legal allegations</h1>
      <p className="lede">
        Canon and Roman Law allegations — every example below can be run directly against the gloss with its
        "Search" button.
      </p>

      <p>
        In order to make the project somewhat manageable, an allegation style was employed that hews fairly closely
        to that of the gloss itself, as opposed to the modern numerical system. This style will be familiar to
        anyone who has used a medieval or early modern legal commentary, and for those who haven't, it is quick to
        pick up. For the <i>Liber extra</i> and the <i>Corpus iuris civilis</i>, it consists of an abbreviated form
        of the title, followed by the incipit (the first 1–3 words) of the capitulum or lex. The <i>Decretum</i>{" "}
        allegations employ the familiar numerical divisions for the Distinctiones and Causae, followed by the
        incipit designating the capitulum.
      </p>
      <p>
        All of the title abbreviations used for the allegations are matched up with their modern numerical
        references in the <Link href="/abbreviations">Abbreviations explorer</Link> (and in the downloadable
        spreadsheet on <Link href="/text">The Text</Link> page). Note that to perform a proper search it is
        important to follow the exact punctuation style modeled in the examples below — unless you enable the
        "Ignore punctuation" option in the search bar.
      </p>

      <h2>Decretum</h2>
      <TryEx q="50. dist., si lapsis" eq="D. 50 c. 1" />
      <TryEx q="15. q. 8, si quis presbyter" eq="C. 15 q. 8 c. 4" />
      <p>
        Following the usage of the gloss, Gratian's dicta are indicated with a section siglum § and the incipit
        [note the lack of comma separating the section siglum § from the other elements]:
      </p>
      <TryEx q="27. q. 2 § sequitur" eq="dictum ante C. 27 q. 2 c. 1" />
      <p>
        Note, however, that on a few occasions the gloss will cite the dicta by first giving the canon after which
        they appear:
      </p>
      <TryEx q="16. q. 3, placuit § potest" eq="dictum post C. 16 q. 3 c. 15" />
      <p>
        The <i>De consecratione</i> and <i>De poenitentia</i> treatises are both indicated by an appropriate
        abbreviation as follows:
      </p>
      <TryEx q="de poen. dist. 3, qui vult" eq="De pen. D. 3 c. 19" />
      <TryEx q="de conse. dist. 4, sanctum est baptisma" eq="De cons. D. 4 c. 36" />

      <h2>Liber extra</h2>
      <p>
        Following the usage of the gloss, all cross-references to the <i>Liber extra</i> are introduced according to
        their relative position either before (<i>supra</i>) or after (<i>infra</i>) the place they are cited. Since
        each title has a unique abbreviation, however, the <i>infra/supra</i> may be excluded from searches. The{" "}
        <i>Liber extra</i> references are thus all very straightforward:
      </p>
      <TryEx q="de frig. et malef., quod sedem" eq="X 4.15.2 (tit. De frigidis et maleficiatis, cap. Quod sedem)" />
      <TryEx
        q="de regular., ad Apostolicam"
        eq="X 3.31.16 (tit. De regularibus et transeuntibus ad religionem, cap. Ad Apostolicam)"
      />

      <h3>Extravagantes</h3>
      <p>
        All of the extravagantes — decretals or conciliar legislation issued after 1234 (such as Innocent IV's 1245
        Council of Lyons legislation), most of which eventually found its way into Boniface VIII's{" "}
        <i>Liber sextus</i> (1298) — have been given a consistent form so that they may be searched individually or
        globally. This form mirrors that of a <i>Liber extra</i> cross-reference, with the added indicator{" "}
        <i>extravag.</i> placed before the incipit without comma separation. So:
      </p>
      <TryEx q="de except., extravag. pia" eq="VI 2.12.1 (tit. De exceptionibus, cap. Pia consideratione)" />
      <TryEx q="de iudic., extravag. iuris esse ambiguum" eq="VI 2.1.1 (tit. De iudiciis, cap. Iuris esse ambiguum)" />
      <p>
        The full store of extravagantes can be seen at a single glance by simply performing a global search for the
        abbreviation <i>extravag.</i> — its use has been restricted to these allegations. (A list of all the
        extravagantes cited in the gloss is also in the <Link href="/abbreviations">Abbreviations explorer</Link>.)
      </p>
      <TryEx q="extravag." eq="every post-1234 allegation in the gloss" />

      <h2>Roman law</h2>
      <p>
        For the sake of consistency, all citations of the <i>Corpus iuris civilis</i> are keyed to the
        Mommsen–Krueger–Schoell edition, and are formatted as follows [note the lack of comma separating the volume
        abbreviation from the title].
      </p>

      <h3>Codex</h3>
      <TryEx
        q="C. de legi. et const., non dubium"
        eq="Cod. 1.14.5 (tit. De legibus et constitutionibus principum et edictis, l. Non dubium)"
      />
      <p>
        Note that the gloss occasionally cites the <i>authenticae</i> — texts adapted from Justinian's Novellae (aka
        Authenticum) that were inserted directly into the Codex by medieval jurists. The form of this allegation is
        as follows, with the abbreviation <i>authen.</i> placed before the incipit without comma separation, similar
        to how the extravagantes are cited in the <i>Liber extra</i>:
      </p>
      <TryEx q="C. de adulter., authen. sed hodie" eq="auth. Sed hodie after Cod. 9.9.29" />

      <h3>Digest</h3>
      <TryEx q="ff. de itin. act. priv., nec enim" eq="Dig. 43.19.2 (tit. De itinere actuque privato, l. Nec enim)" />

      <h3>Institutes</h3>
      <TryEx
        q="Inst. de rerum div. § illud quaesitum"
        eq="Inst. 2.1.13 (tit. De rerum divisione et qualitate, § Illud quaesitum)"
      />
      <p>
        Institutes references almost always have a section siglum § designating the individual subchapter (not
        separated by a comma from the incipit), except for when the gloss cites the prefatory remarks of the title,
        in which case it uses the form: <i>Inst. de rerum div., in princ.</i> [note the <i>princ.</i> abbreviation
        for <i>principio</i> — for a discussion of the standard abbreviations preserved in the Digital Decretals,
        see <Link href="/text">The Text</Link> page].
      </p>

      <h3>Novellae</h3>
      <TryEx q="in Auth. ut liceat mat. et avi. § quod autem" eq="Nov. 117.11 / Auth. 112.11, coll. VIII" />
      <p>
        Note the lack of a comma separating the title from the section siglum §. Although the practice of the gloss
        in adding the <i>collatio</i> reference has been followed — that is, the section of the Codex that the
        particular Novel/Authenticum supplements — it is not necessary to include this in a search.
      </p>

      <h2>Additional considerations</h2>
      <p>
        On occasion, the <i>Glossa Ordinaria</i> will cite a specific sentence or section of a capitulum or lex,
        usually when the alleged text is a longer one. Because most of these are one-offs, the sentence/section
        level of the allegation has not been standardized (for example, by substituting an incipit for the numerical
        or positional reference of the section, as in § 1 or § ulti.[ma]). It is enough to have them visible through
        a search at the capitulum/lex level using the incipit. A few examples:
      </p>
      <TryEx q="ff. de recept. qui arb., Labeo § penulti." eq="Dig. 4.8.3.2" noBtn />
      <TryEx q="28. q. 1, sic enim neque, vers. ideo" eq="C. 28 q. 1 c. 9, in the sentence starting Ideo autem nec iuberi…" />
      <p>
        In order to standardize the legal allegations and make them searchable, some slight modifications have been
        made to the text beyond just adding consistency to how the titles are abbreviated. Most often, this involves
        expanding the text to give the full abbreviated reference in cases where multiple capitula or leges are
        alleged from a single title/section in succession. The following example of three successive allegations of
        Causa 22 of the <i>Decretum</i> illustrates what this entails:
      </p>
      <ul>
        <li>
          Original: <i>22. q. 5 § ex his et cap. quacumque &amp; q. 2 ne quis</i>
        </li>
        <li>
          Digital Decretals: <i>22. q. 5 § ex his; et 22. q. 5, quacumque; et 22. q. 2, ne quis</i>
        </li>
      </ul>
      <p>
        Similarly, the practice whereby the gloss alleges cross-references in the same title of the{" "}
        <i>Liber extra</i> using <i>infra/supra, eodem [titulo]</i> has been adjusted, substituting the assigned
        title abbreviation, as illustrated by this example from X 4.1.26 s.v. <i>nec forma</i>:
      </p>
      <ul>
        <li>
          Original: <i>Idem esset et si alterum deesset supra. eod. cum apud &amp; cap. tuae</i>
        </li>
        <li>
          Digital Decretals: <i>Idem esset et si alterum deesset, supra, de spons., cum apud; et supra, de spons.,
          tuae</i>
        </li>
      </ul>
      <p>
        Finally, the incipit has been substituted where the gloss uses instead numerical or positional designations,
        which it frequently does for the first through third canon/lex of any title as well as the final two:
      </p>
      <ul>
        <li>
          Original: <i>infra, de vit. et honest. cler. c. ulti.</i> → Digital Decretals:{" "}
          <i>infra, de vit. et honest. cler., ex litteris</i>
        </li>
        <li>
          Original: <i>64. di. c. 1 et 2 et penulti.</i> → Digital Decretals:{" "}
          <i>64. dist., episcopi; et 64. dist., ordinationes; et 64. dist., episcopum</i>
        </li>
      </ul>
      <p>
        It should be obvious that without these expansions, the utility of the Digital Decretals as a search tool
        for the legal allegations would be nil.
      </p>
      <p>
        To remove any possibility of search contamination, the <i>Liber extra</i> and Roman Law abbreviations of the
        same title have been deliberately distinguished. So, for example, the title on proofs,{" "}
        <i>De probationibus</i>, which is shared between the <i>Liber extra</i>, Digest and Codex, is abbreviated as
        follows:
      </p>
      <TryEx q="de probat." eq="Liber extra (X 2.19)" />
      <TryEx q="de probation." eq="Codex (Cod. 4.19) and Digest (Dig. 22.3)" />
      <p>
        This example also illustrates another feature of the system: the rationalization of titles in the{" "}
        <i>Corpus iuris civilis</i> that deal with the same subject matter, but have slight variations in their
        wording. Although the Codex title on proofs is <i>De probationibus</i> and the Digest title is{" "}
        <i>De probationibus et praesumptionibus</i>, the same abbreviation is employed for both so that one may do a
        global search for all Roman Law allegations related to that subject by using <i>de probation.</i> as a
        search term. To isolate just those citations of a particular volume of the <i>Corpus iuris civilis</i>, one
        need only add <i>C.</i> or <i>ff.</i> or <i>Inst.</i> at the beginning of a search.
      </p>

      <h2>Caveats</h2>
      <h3>Repeated incipits in Liber extra allegations</h3>
      <p>
        Unfortunately, Bernard of Parma was not always consistent in how he distinguished canons in the same title
        that have the same or similar incipit (e.g., X 4.1.13 <i>Veniens</i> and X 4.1.15 <i>Veniens</i>). Sometimes
        he will add a 1 or 2 to the incipit to make the distinction, though almost as often he failed to do so,
        presumably since the context would have been familiar enough to his readers that they would know immediately
        which one was being referenced.
      </p>
      <p>
        In the initial stages of the project this problem seemed sufficiently discrete to bracket off, but after
        finalizing Books 1 and 4, a systematic survey revealed that almost 10% of the <i>Liber extra</i>'s 1971
        capitula were potentially implicated. Additional specifying information has therefore been standardized for
        the affected capitula throughout the text. Sometimes this involves just adding a 1 or 2 after the incipit:
      </p>
      <TryEx q="de spons., veniens 1" eq="X 4.1.13" />
      <TryEx q="de spons., veniens 2" eq="X 4.1.15" />
      <p>Other times it involves expanding out the incipit by an extra word or two:</p>
      <TryEx q="de sent. excom., super eo vero" eq="X 5.39.1" />
      <TryEx q="de sent. excom., super eo quod" eq="X 5.39.51" />
      <p>
        To see the standard incipit used in the Digital Decretals for any of the 1971 <i>Liber extra</i> capitula,
        including those cases of repeat incipits, consult the capitula register in the{" "}
        <Link href="/abbreviations">Abbreviations explorer</Link>.
      </p>

      <h3>Apologies to the Decretistae and Legistae</h3>
      <p>
        Standardizing the <i>Liber extra</i> allegations — not just at the title level but for each of the 1971
        individual capitula — was tremendously time-consuming given Bernard's inconsistent citation methods. He will
        often vary the incipit of an allegation, sometimes within the same glossula. Thus, for example, X 1.6.36
        shows up variously as <i>Bonae</i>, <i>Bonae memoriae</i> or <i>Bonae 2</i> in Bernard's text (in the
        Digital Decretals, it is always <i>de elect., bonae 2</i>, in order to distinguish it from X 1.6.23 ={" "}
        <i>de elect., bonae 1</i>).
      </p>
      <TryEx q="de elect., bonae 2" eq="X 1.6.36" />
      <p>
        Achieving the same level of precision for <i>Decretum</i> and Roman Law citations unfortunately exceeded the
        scope of the project so far. The problem is once again Bernard's inconsistency, which can be illustrated
        through a group of <i>Decretum</i> canons from Causa 16: C. 16 q. 7 c. 1 <i>Decimas quas in usum</i>; c. 6{" "}
        <i>Decimas Deo</i>; c. 7 <i>Decimas quas populus</i>; c. 39 <i>Decimas et ecclesias</i>. We can be thankful
        that at least one of the group comes at the head of quaestio 7, since Bernard will usually allege it as{" "}
        <i>16. q. 7 cap. 1</i> (= <i>16. q. 7, decimas quas in usum</i> in the Digital Decretals). But what are we
        to do when Bernard throws out an allegation of <i>16. q. 7 decimas</i>? Context can usually clarify which of
        the four is meant, but not always. Rather than risk introducing a whole host of unrecoverable errors into
        the text, the ambiguity of the gloss has been preserved in these cases. The same is true with a small batch
        of citations of the <i>Corpus iuris civilis</i>, though there the phenomenon of repeated incipits is not
        nearly as prevalent as in the <i>Decretum</i>.
      </p>
      <p>
        The problem is manageable provided the Decretistae and Legistae among the user base are aware of its
        existence. A rigorous standardization of the <i>Decretum</i> and <i>Corpus iuris civilis</i> allegations on
        par with what the Digital Decretals now provides for cross-references to the <i>Liber extra</i> may follow
        in the future.
      </p>

      <h3>Erroneous allegations</h3>
      <p>
        The <i>Editio Romana</i> does contain more than a few errors in the legal allegations. A system was
        developed for catching and correcting these when it comes to <i>Liber extra</i> cross-references, so that,
        for example, the ER's occasional allegation of the incipit of X 1.8.2 as <i>Ad haec</i> is consistently
        rendered in the Digital Decretals as <i>de auctor. et usu pal., ad hoc</i>. The majority of errors seem to
        cluster in the <i>Decretum</i> citations, since the numbering of the Distinctiones and Causae were more
        easily subject to copyist errors. The obvious typographical ones have been corrected when noticed, taking
        care to consult 13th-century manuscripts of the gloss to confirm the correction when necessary. So, for
        example, the citation of C. 23 q. 7 c. 4 in X 4.21.3 s.v. <i>iterari</i>:
      </p>
      <ul>
        <li>
          ER original: <i>Sacramenta enim iterari non debent…33. q. 7, quemadmodum</i>
        </li>
        <li>
          Digital Decretals: <i>Sacramenta enim iterari non debent…23. q. 7, quemadmodum</i> (there is no quaestio 7
          in Causa 33)
        </li>
      </ul>
      <p>
        But in general the practice has been simply to transcribe as is, and so there will doubtless be some pass
        through of the ER's erroneous allegations into the Digital Decretals. As with the problem of repeated
        incipits in the <i>Decretum</i>, this is something to return to now that the entire text is completed.
      </p>

      <h2 id="jurists">Citations of other jurists</h2>
      <p>
        While Bernard will often simply settle for the generic <i>quidam alii</i> when discussing the opinions of
        other jurists, the <i>Glossa Ordinaria</i> does include a fair number of named citations of his
        contemporaries (together with a few glosses that have the sigla of other canonists appended to them). These
        have been standardized so that they may be located using a normal search. To avoid confusion with the title
        abbreviations it has not always been possible to utilize the traditional sigla employed in the text, but an
        effort has been made to keep them as close as possible when a change has been made. Note that nowhere close
        to a majority of Bernard's own contributions to the <i>Glossa Ordinaria</i> are signed with his siglum{" "}
        <i>Ber.</i>, but it has been included whenever it has been appended to a gloss in the ER.
      </p>
      <p>
        <b>Search tip:</b> run these with <b>Whole words</b> and <b>Match case</b> enabled (the buttons below do
        this automatically), so that e.g. <i>Ala.</i> does not also match <i>mala.</i>
      </p>
      <TryEx q="Ala." eq="Alanus Anglicus" ww cs />
      <TryEx q="Azo" eq="Azo of Bologna" ww cs />
      <TryEx q="Anto." eq="? (cited once together with Tancred in X 1.11.4 s.v. utatur)" ww cs noBtn />
      <TryEx q="Bart." eq="Bartholomeus Brixiensis" ww cs />
      <TryEx q="Bazian." eq="Johannes Bassianus" ww cs />
      <TryEx q="Ber." eq="Bernard of Parma" ww cs />
      <TryEx q="Bulg." eq="Bulgarus" ww cs />
      <TryEx q="Dama." eq="Damasus" ww cs />
      <TryEx q="Gandulf." eq="Gandulfus" ww cs />
      <TryEx q="Gott." eq="Gottfried of Trani" ww cs />
      <TryEx q="Gratian." eq="Gratian" ww cs />
      <TryEx q="Host." eq="Hostiensis (Cardinal of Ostia, Henricus de Segusio)" ww cs />
      <TryEx q="Hug." eq="Huguccio of Pisa" ww cs />
      <TryEx q="Iacob." eq="Jacobus Balduini" ww cs />
      <TryEx q="Inno. iiii" eq="Innocent IV (Sinebaldus Fieschi)" ww cs />
      <TryEx q="Io." eq="Iohannes Teutonicus" ww cs />
      <TryEx q="Ioan. And." eq="Johannes Andreae" ww cs />
      <TryEx q="Ioan. Favent." eq="Johannes Faventinus" ww cs />
      <TryEx q="Laur." eq="Laurentius Hispanus" ww cs />
      <TryEx q="Marc." eq="Marcoaldus" ww cs />
      <TryEx q="Mart." eq="Martinus" ww cs />
      <TryEx q="Melend." eq="Melendus Hispanus" ww cs />
      <TryEx q="Naso" eq="Guilelmus Naso" ww cs />
      <TryEx q="Petr. Hisp." eq="Petrus Hispanus" ww cs />
      <TryEx q="Placen." eq="Placentinus" ww cs />
      <TryEx q="Rich." eq="Richardus Anglicus" ww cs />
      <TryEx q="Tanc." eq="Tancred of Bologna" ww cs />
      <TryEx q="Vincen." eq="Vincentius Hispanus" ww cs />
      <p>
        A few figures without an assigned abbreviation are cited once each: <i>Dominus Albericus</i> (in a gloss
        attributed to Richardus Anglicus, X 5.40.13 s.v. <i>solis acclesiarum</i>) and <i>Iurisconsultus</i> =
        Julianus (X 1.9.10 s.v. <i>plerumque</i>).
      </p>
      <p>
        Bernard is not consistent with how he cites other jurists. Usually the context makes clear whether, for
        example, his invocation of the <i>opinio M.</i> is a reference to the legist Martinus or the canonist
        Melendus, but a couple of judgment calls were necessary, particularly for the less-frequently cited jurists.
      </p>

      <h2 id="verses">Mnemonic verses</h2>
      <p>
        The mnemonic verses — the pithy, pedagogical poetry that helped students memorize important aspects of the
        law — are almost invariably introduced in the same way, thus providing a path for identifying where they
        occur through a search. All of the mnemonic verses are introduced with a form of the word <i>versus</i>,
        either in the singular, as in <i>unde versus</i>, or in the plural, as in <i>his versibus</i>. In
        transcribing the verses, a double slash // formatting mark has been used to indicate line breaks when
        necessary. For example, X 4.9.7 s.v. <i>contumelia</i>:
      </p>
      <ul>
        <li>
          <i>
            Iuxta illud versus: desere spernentem vel blasphemare volentem // vel te credentem scelus ad mortale
            trahentem // nam sunt absque mora sic vincula rupta priora.
          </i>
        </li>
      </ul>
      <p>
        When using <i>versus</i> as a search term to isolate the mnemonic verses, enable <b>Whole words</b> (the
        button below does) so as not to match <i>adversus</i> and the like.
      </p>
      <TryEx q="versus" eq="all mnemonic verses (singular form)" ww />
      <TryEx q="versibus" eq="all mnemonic verses (plural form)" ww />
    </main>
  );
}
