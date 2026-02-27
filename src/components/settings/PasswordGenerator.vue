<template>
  <div class="password-generator">
    <div class="generator-panel">
      <div class="generator-tabs">
        <button
          :class="['tab', { 'tab--active': mode === 'words' }]"
          @click="mode = 'words'"
        >
          Passphrase
        </button>
        <button
          :class="['tab', { 'tab--active': mode === 'chars' }]"
          @click="mode = 'chars'"
        >
          Random
        </button>
      </div>

      <div v-if="mode === 'words'" class="generator-content">
        <div class="generator-header">
          <h4>Passphrase Generator</h4>
          <p>Create a memorable password using random words</p>
        </div>

        <div class="password-display" @click="copyPassword">
          <span class="password-text password-text--mono">{{
            generatedPassword
          }}</span>
          <button
            class="copy-btn"
            :title="copied ? 'Copied!' : 'Click to copy'"
          >
            {{ copied ? "✓" : "📋" }}
          </button>
        </div>

        <div class="generator-options">
          <div class="option-row">
            <label>Number of words: {{ wordCount }}</label>
            <input
              v-model.number="wordCount"
              type="range"
              min="3"
              max="7"
              class="slider"
              @input="generateWordsPassword"
            />
            <span class="option-value">{{ wordCount }}</span>
          </div>
        </div>
      </div>

      <div v-else class="generator-content">
        <div class="generator-header">
          <h4>Random Password Generator</h4>
          <p>Generate a secure random password</p>
        </div>

        <div class="password-display" @click="copyPassword">
          <span class="password-text password-text--mono">{{
            generatedPassword
          }}</span>
          <button
            class="copy-btn"
            :title="copied ? 'Copied!' : 'Click to copy'"
          >
            {{ copied ? "✓" : "📋" }}
          </button>
        </div>

        <div class="generator-options">
          <div class="option-row">
            <label>Length: {{ charLength }}</label>
            <input
              v-model.number="charLength"
              type="range"
              min="12"
              max="46"
              class="slider"
              @input="generateCharsPassword"
            />
            <span class="option-value">{{ charLength }}</span>
          </div>

          <div class="option-row checkbox-row">
            <label>
              <input
                v-model="includeUppercase"
                type="checkbox"
                @change="generateCharsPassword"
              />
              Uppercase (A-Z)
            </label>
            <label>
              <input
                v-model="includeLowercase"
                type="checkbox"
                @change="generateCharsPassword"
              />
              Lowercase (a-z)
            </label>
            <label>
              <input
                v-model="includeNumbers"
                type="checkbox"
                @change="generateCharsPassword"
              />
              Numbers (0-9)
            </label>
            <label>
              <input
                v-model="includeSymbols"
                type="checkbox"
                @change="generateCharsPassword"
              />
              Symbols (!@#$)
            </label>
          </div>
        </div>
      </div>

      <div class="generator-actions">
        <button class="action-btn action-btn--secondary" @click="regenerate">
          <IconActivity class="btn-icon" />
          Regenerate
        </button>
        <button class="action-btn action-btn--primary" @click="usePassword">
          Use This Password
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from "vue";
  import IconActivity from "@/icons/IconActivity.vue";

  interface Emit {
    (e: "passwordGenerated", password: string): void;
  }

  const emit = defineEmits<Emit>();

  const mode = ref<"words" | "chars">("words");
  const generatedPassword = ref("");
  const copied = ref(false);

  // Words mode options
  const wordCount = ref(4);
  const separator = ref("-");
  const capitalize = ref(true);
  const includeNumber = ref(true);

  // Chars mode options
  const charLength = ref(16);
  const includeUppercase = ref(true);
  const includeLowercase = ref(true);
  const includeNumbers = ref(true);
  const includeSymbols = ref(true);

  // Word lists for passphrase generation
  const wordLists = {
    adjectives: [
      "Swift",
      "Brave",
      "Cosmic",
      "Silent",
      "Golden",
      "Mystic",
      "Ancient",
      "Noble",
      "Rapid",
      "Stellar",
      "Thunder",
      "Crystal",
      "Shadow",
      "Bright",
      "Wild",
      "Mighty",
      "Silver",
      "Storm",
      "Frozen",
      "Lunar"
    ],
    nouns: [
      "Dragon",
      "Phoenix",
      "Tiger",
      "Wolf",
      "Eagle",
      "Panther",
      "Falcon",
      "Lion",
      "Shark",
      "Bear",
      "Hawk",
      "Raven",
      "Cobra",
      "Lynx",
      "Viper",
      "Jaguar",
      "Orca",
      "Cheetah",
      "Puma",
      "Raptor"
    ],
    verbs: [
      "Jumps",
      "Runs",
      "Flies",
      "Hunts",
      "Strikes",
      "Dances",
      "Glides",
      "Soars",
      "Prowls",
      "Climbs",
      "Swims",
      "Races",
      "Leaps",
      "Dives",
      "Roars",
      "Stalks",
      "Bounds",
      "Slides",
      "Charges",
      "Springs"
    ],
    objects: [
      "Mountain",
      "Ocean",
      "Forest",
      "Desert",
      "River",
      "Canyon",
      "Glacier",
      "Valley",
      "Island",
      "Volcano",
      "Lake",
      "Meadow",
      "Cliff",
      "Cave",
      "Peak",
      "Reef",
      "Marsh",
      "Dune",
      "Stream",
      "Ridge"
    ]
  };

  function getRandomWord(category: keyof typeof wordLists): string {
    const words = wordLists[category];
    return words[Math.floor(Math.random() * words.length)];
  }

  function generateWordsPassword() {
    const categories = ["adjectives", "nouns", "verbs", "objects"] as const;
    const words: string[] = [];

    for (let i = 0; i < wordCount.value; i++) {
      const category = categories[i % categories.length];
      let word = getRandomWord(category);
      words.push(word.toLowerCase());
    }

    let password = words.join(separator.value);

    generatedPassword.value = password;
  }

  function generateCharsPassword() {
    let charset = "";

    if (includeUppercase.value) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase.value) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers.value) charset += "0123456789";
    if (includeSymbols.value) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (charset === "") charset = "abcdefghijklmnopqrstuvwxyz";

    let password = "";
    for (let i = 0; i < charLength.value; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    generatedPassword.value = password;
  }

  function regenerate() {
    if (mode.value === "words") {
      generateWordsPassword();
    } else {
      generateCharsPassword();
    }
  }

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(generatedPassword.value);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  function usePassword() {
    emit("passwordGenerated", generatedPassword.value);
    // TODO: emit
    // showGenerator.value = false;
  }

  watch(mode, () => {
    if (mode.value === "words") {
      generateWordsPassword();
    } else {
      generateCharsPassword();
    }
  });

  onMounted(generateWordsPassword);
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .password-generator {
    margin-bottom: 1rem;
  }

  .generator-panel {
    margin-top: 0.75rem;
    padding: 1rem;
    background-color: var(--background-ui);
    border-radius: 0.5rem;
    border: 1px solid var(--background-40);

    @include mobile-only {
      padding: 0.75rem;
    }
  }

  .generator-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tab {
    flex: 1;
    padding: 0.65rem 1rem;
    background-color: transparent;
    border: 1px solid var(--background-40);
    border-radius: 0.25rem;
    color: $text-color-70;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;

    &:hover {
      background-color: var(--background-40);
    }

    &--active {
      background-color: var(--highlight-color);
      border-color: var(--highlight-color);
      color: $white;
    }
  }

  .generator-content {
    margin-bottom: 1rem;
  }

  .generator-header {
    margin-bottom: 0.75rem;

    h4 {
      margin: 0 0 0.15rem 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: $text-color;
      line-height: 1.3;
    }

    p {
      margin: 0;
      font-size: 0.8rem;
      color: $text-color-70;
      line-height: 1.3;
    }
  }

  .password-display {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background-color: var(--background-color);
    border: 2px solid var(--highlight-color);
    border-radius: 0.5rem;
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: var(--background-40);
    }

    @include mobile-only {
      padding: 0.6rem;
    }
  }

  .password-text {
    flex: 1;
    font-size: 1.8rem;
    font-weight: 500;
    color: var(--highlight-color);
    user-select: all;
    word-break: break-all;
    word-break: break-word;
    -webkit-hyphens: auto;
    hyphens: auto;

    @include mobile-only {
      font-size: 0.95rem;
    }

    &--mono {
      font-family: "Courier New", monospace;

      @include mobile-only {
        font-size: 0.85rem;
      }
    }
  }

  .copy-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.25rem;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }

  .generator-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .option-row {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    label {
      font-size: 0.85rem;
      color: $text-color;
      font-weight: 500;
      line-height: 1.2;
    }

    &.checkbox-row {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.75rem;

      @include mobile-only {
        flex-direction: column;
        gap: 0.6rem;
      }

      label {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-weight: 400;
        cursor: pointer;
        font-size: 0.85rem;

        input[type="checkbox"] {
          cursor: pointer;
          width: 16px;
          height: 16px;
        }
      }
    }
  }

  .slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: var(--background-40);
    outline: none;
    appearance: none;

    &::-webkit-slider-thumb {
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--highlight-color);
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--highlight-color);
      cursor: pointer;
      border: none;
    }
  }

  .option-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--highlight-color);
    text-align: center;
  }

  .separator-input {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--background-40);
    border-radius: 0.25rem;
    background-color: var(--background-color);
    color: $text-color;
    font-size: 0.85rem;
    font-family: "Courier New", monospace;
    text-align: center;

    &:focus {
      outline: none;
      border-color: var(--highlight-color);
    }

    &::placeholder {
      color: $text-color-50;
      font-family: inherit;
    }
  }

  .generator-actions {
    display: flex;
    gap: 0.5rem;

    @include mobile-only {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .action-btn {
    flex: 1;
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;

    &--secondary {
      background-color: var(--background-color);
      color: $text-color;
      border: 1px solid var(--background-40);

      &:hover {
        background-color: var(--background-40);
      }
    }

    &--primary {
      background-color: var(--highlight-color);
      color: $white;

      &:hover {
        background-color: var(--color-green-90);
      }
    }
  }

  .btn-icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
</style>
