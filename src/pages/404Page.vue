<template>
  <div>
    <section class="not-found">
      <div class="not-found__content">
        <h1 class="not-found__title">404</h1>
        <p class="not-found__subtitle">Page Not Found</p>
        <div v-if="quote.text" class="quote">
          &ldquo;{{ quote.text }}&rdquo;
          <span v-if="quote.movie" class="quote__movie">
            - {{ quote.movie }} {{ quote.year }}
          </span>
        </div>
        <seasoned-button class="button" @click="goBack">
          Go Back
        </seasoned-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from "vue";
  import { useStore } from "vuex";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import { ref } from "vue";

  const store = useStore();

  if (store.getters["popup/isOpen"]) {
    store.dispatch("popup/close");
  }

  const isMounted = ref(false);
  const quotes = [
    // --- Disney / Pixar 90s & early ---
    { text: "Hakuna Matata", movie: "The Lion King", year: "1994" },
    { text: "To infinity and beyond!", movie: "Toy Story", year: "1995" },
    { text: "You're my favorite deputy.", movie: "Toy Story", year: "1995" },
    {
      text: "I have a brilliant beyond brilliant idea!",
      movie: "The Parent Trap",
      year: "1998"
    },
    {
      text: "I'm not bad, I'm just drawn that way.",
      movie: "Who Framed Roger Rabbit",
      year: "1988"
    },
    // --- Classic 90s movies ---
    {
      text: "Life was like a box of chocolates.",
      movie: "Forrest Gump",
      year: "1994"
    },
    {
      text: "Hasta la vista, baby.",
      movie: "Terminator 2: Judgment Day",
      year: "1991"
    },
    {
      text: "There's no crying in baseball!",
      movie: "A League of Their Own",
      year: "1992"
    },
    {
      text: "Get busy livin’ or get busy dyin’",
      movie: "The Shawshank Redemption",
      year: "1994"
    },
    { text: "I’m the king of the world!", movie: "Titanic", year: "1997" },
    { text: "You had me at hello.", movie: "Jerry Maguire", year: "1996" },
    { text: "Show me the money!", movie: "Jerry Maguire", year: "1996" },
    {
      text: "Yippee-ki-yay …",
      movie: "Die Hard with a Vengeance",
      year: "1995"
    },
    { text: "You’re gonna need a bigger boat.", movie: "Jaws", year: "1975" },
    { text: "I see dead people.", movie: "The Sixth Sense", year: "1999" },
    { text: "Why so serious?", movie: "The Dark Knight", year: "2008" },
    { text: "Just keep swimming.", movie: "Finding Nemo", year: "2003" },
    { text: "I’ll be back.", movie: "The Terminator", year: "1984" },
    // --- Cult comedy quotes ---
    {
      text: "Stay classy, San Diego.",
      movie: "Anchorman: The Legend of Ron Burgundy",
      year: "2004"
    },
    {
      text: "Milk was a bad choice.",
      movie: "Anchorman: The Legend of Ron Burgundy",
      year: "2004"
    },
    {
      text: "60% of the time, it works every time.",
      movie: "Anchorman: The Legend of Ron Burgundy",
      year: "2004"
    },
    {
      text: "I love lamp.",
      movie: "Anchorman: The Legend of Ron Burgundy",
      year: "2004"
    },
    {
      text: "Well that escalated quickly.",
      movie: "Anchorman: The Legend of Ron Burgundy",
      year: "2004"
    },
    // --- A24 & Modern Indie ---
    {
      text: "In another life, I would have really liked just doing laundry and taxes with you.",
      movie: "Everything Everywhere All at Once",
      year: "2022"
    },
    {
      text: "Every rejection, every disappointment has led you here.",
      movie: "Everything Everywhere All at Once",
      year: "2022"
    },
    {
      text: "Whatever you plan on happening, never happens.",
      movie: "C’mon C’mon",
      year: "2021"
    },
    { text: "We made promises, Harper.", movie: "Men", year: "2022" },
    // (A24 quotes are harder to find officially listed, so these are standout lines from fans and quote compilations.) :contentReference[oaicite:1]{index=1}
    // --- Grand iconic movie quotes ---
    { text: "May the Force be with you.", movie: "Star Wars", year: "1977" },
    {
      text: "Frankly, my dear, I don't give a damn.",
      movie: "Gone with the Wind",
      year: "1939"
    },
    {
      text: "I love the smell of napalm in the morning.",
      movie: "Apocalypse Now",
      year: "1979"
    },
    {
      text: "Toto, I've a feeling we're not in Kansas anymore.",
      movie: "The Wizard of Oz",
      year: "1939"
    },
    { text: "Here's looking at you, kid.", movie: "Casablanca", year: "1942" },
    {
      text: "You can't handle the truth!",
      movie: "A Few Good Men",
      year: "1992"
    },
    { text: "Bond. James Bond.", movie: "Dr. No", year: "1962" },
    { text: "Houston, we have a problem.", movie: "Apollo 13", year: "1995" },
    { text: "I see dead people.", movie: "The Sixth Sense", year: "1999" },
    { text: "Rosebud.", movie: "Citizen Kane", year: "1941" },
    { text: "Plastics.", movie: "The Graduate", year: "1967" },
    { text: "You talkin’ to me?", movie: "Taxi Driver", year: "1976" },
    {
      text: "Fasten your seatbelts. It's going to be a bumpy night.",
      movie: "All About Eve",
      year: "1950"
    },
    { text: "Go ahead, make my day.", movie: "Sudden Impact", year: "1983" },
    // --- More quotable modern lines ---
    {
      text: "With great power comes great responsibility.",
      movie: "Spider‑Man",
      year: "2002"
    },
    {
      text: "You’re a wizard, Harry.",
      movie: "Harry Potter and the Sorcerer’s Stone",
      year: "2001"
    },
    {
      text: "I am your father.",
      movie: "Star Wars: The Empire Strikes Back",
      year: "1980"
    },
    { text: "Wakanda Forever!", movie: "Black Panther", year: "2018" },
    { text: "I am Iron Man.", movie: "Iron Man", year: "2008" },
    { text: "Avengers, assemble!", movie: "Avengers: Endgame", year: "2019" },
    { text: "We’ll always have Paris.", movie: "Casablanca", year: "1942" },
    {
      text: "Just when I thought I was out, they pull me back in.",
      movie: "The Godfather Part III",
      year: "1990"
    },
    {
      text: "I drink your milkshake!",
      movie: "There Will Be Blood",
      year: "2007"
    },
    // --- Crowd‑sourced favorite 90s lines ---
    {
      text: "The greatest trick the Devil ever pulled …",
      movie: "The Usual Suspects",
      year: "1995"
    },
    { text: "English, motherfucker …", movie: "Pulp Fiction", year: "1994" },
    {
      text: "As far back as I can remember …",
      movie: "Goodfellas",
      year: "1990"
    },
    { text: "Run, Forrest, run!", movie: "Forrest Gump", year: "1994" }
  ];
  const quote = ref({
    text: "404 - Page Not Found",
    movie: "",
    year: ""
  });

  onMounted(() => {
    isMounted.value = true;
    quote.value = quotes[Math.floor(Math.random() * quotes.length)];
  });

  function goBack() {
    window.history.go(-1);
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables.scss";
  @import "scss/media-queries.scss";

  .not-found {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - var(--header-size));
    background:
      linear-gradient(135deg, #1a1a2e 0%, rgba(0, 0, 0, 0.5) 100%),
      url("/assets/pulp-fiction.jpg");
    background-size: cover;
    background-position: center;
    background-blend-mode: multiply;
    color: white;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(
        circle at 50% 50%,
        rgba(120, 65, 255, 0.1) 0%,
        transparent 70%
      );
      pointer-events: none;
    }

    &__content {
      text-align: center;
      z-index: 10;
      padding: 2rem;

      @include mobile {
        padding: 1rem;
      }
    }

    &__title {
      font-size: clamp(4rem, 10vw, 8rem);
      font-weight: 800;
      margin: 0;
      line-height: 1;
      letter-spacing: -0.02em;
      color: white;
      text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }

    &__subtitle {
      font-size: clamp(1.2rem, 3vw, 1.8rem);
      font-weight: 300;
      margin: 0.5rem 0 2rem;
      color: rgba(255, 255, 255, 0.8);
      letter-spacing: 0.05em;
    }
  }

  .quote {
    font-family: "Georgia", serif;
    font-style: italic;
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    margin: 1.5rem 0;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    max-width: 600px;
    text-align: center;
    padding: 0 1rem;

    @include mobile {
      font-size: clamp(1rem, 2.5vw, 1.4rem);
    }
  }

  .quote__movie {
    display: block;
    font-size: clamp(0.9rem, 1.8vw, 1.2rem);
    margin-top: 0.5rem;
    color: rgba(255, 255, 255, 0.7);
    font-style: normal;
    opacity: 0.8;
    font-family: "Arial", sans-serif;
    font-weight: 400;

    @include mobile {
      font-size: clamp(0.8rem, 1.5vw, 1rem);
    }
  }

  .button {
    font-size: clamp(1rem, 2vw, 1.4rem);
    font-weight: 600;
    padding: 1rem 2.5rem;
    background: rgba(255, 255, 255, 0.9);
    color: #1a1a2e;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

    &:hover {
      background: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
    }

    @include mobile {
      padding: 0.8rem 2rem;
      font-size: 1rem;
    }
  }
</style>
