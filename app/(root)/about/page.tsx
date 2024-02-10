export default function Home() {
  return (
    <section className={"wrapper flex flex-col justify-between"}>
      <p>
        👋🏾 Hey, my name’s Aaron. I’m a Software Engineer and Yoga Instructor.
      </p>
      <br />
      <p>
        I’m constantly inspired by everything yoga has to teach. The philosophy,
        the physical movement, the meditation, and the breathwork. It’s my goal
        to take what I’ve learned in my own study of the practice, combined with
        modern research and science, and share it with you. So we can learn,
        practice, and grow together.
      </p>
      <br />
      <p>
        If one of the events on this site resonates with you. Please sign up.
        It’d be great to connect in person. And, if you’re interested in
        collaborating on a professional level – please feel free to email me
        anytime at{" "}
        <a
          href="mailto:aaroncurtisyoga@gmail.com"
          className={"text-blue-500" + " hover:text-blue-700"}
        >
          aaroncurtisyoga@gmail.com
        </a>
      </p>
      <br />
      <p>Sincerely,</p>
      <p>Aaron</p>
    </section>
  );
}
