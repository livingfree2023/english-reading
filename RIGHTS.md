# Copyright and media rights register

This site distinguishes the rights in the text from the rights in any recording or presentation.

## Policy

Under 17 U.S.C. §105, copyright protection is generally unavailable in the United States for a work prepared by a U.S. government officer or employee as part of official duties. Section 101 defines the relevant government work. This can cover an official presidential transcript, but it does not automatically cover campaign or private speeches, third-party recordings, photographs, broadcasts, music, narration, or every video uploaded by an official channel.

The site therefore uses **public domain in the United States** only where the specific text has been reviewed. Third-party media remains linked to its host and is described as external media. Copyright status outside the United States may differ. Modern non-government speeches are presented as limited excerpts with attribution and source links.

Primary references: [17 U.S.C. §105](https://www.law.cornell.edu/uscode/text/17/105), [17 U.S.C. §101](https://www.law.cornell.edu/uscode/text/17/101), and the [Copyright Office Compendium §313.6](https://copyright.gov/comp3/chap300/ch300-copyrightable-authorship.pdf). This register is informational and is not legal advice.

## Per-page register

Each Markdown entry in `src/content/speeches/` is the source register for one page. Its frontmatter records `sourceName`, `sourceUrl`, `copyrightStatus`, `copyrightNote`, and any separate `audio` or `video` rights note. The build validation rejects entries missing those fields.

Allowed text statuses:

- `us-government-work`: official U.S. federal work reviewed as created within official duties.
- `historical-public-domain`: older text reviewed as public domain in the United States.
- `copyrighted-excerpt`: limited excerpt with attribution and rights notice.
- `rights-review`: do not publish as full text until reviewed.

Media URLs are never treated as public domain merely because the speech text is public domain.
