interface CommandData {
  count: number;
  lastUsed: string; // ISO timestamp
  routePath?: string;
  type: "route" | "content";
}

interface CommandStats {
  commands: Record<string, CommandData>;
  version: number;
}

const STORAGE_KEY = "commandPalette_stats";
const CURRENT_VERSION = 1;

function getStats(): CommandStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { commands: {}, version: CURRENT_VERSION };
    }
    const parsed = JSON.parse(stored) as CommandStats;
    return parsed;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to parse command stats:", error);
    return { commands: {}, version: CURRENT_VERSION };
  }
}

function saveStats(stats: CommandStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to save command stats:", error);
  }
}

export function trackCommand(
  id: string,
  type: "route" | "content",
  metadata?: { routePath?: string }
): void {
  const stats = getStats();

  if (!stats.commands[id]) {
    stats.commands[id] = {
      count: 0,
      lastUsed: new Date().toISOString(),
      type,
      routePath: metadata?.routePath
    };
  }

  stats.commands[id].count += 1;
  stats.commands[id].lastUsed = new Date().toISOString();

  if (metadata?.routePath) {
    stats.commands[id].routePath = metadata.routePath;
  }

  saveStats(stats);
}

export function getCommandScore(commandId: string): number {
  const stats = getStats();
  const command = stats.commands[commandId];

  if (!command) return 0;

  const now = new Date().getTime();
  const lastUsed = new Date(command.lastUsed).getTime();
  const daysSinceLastUse = (now - lastUsed) / (1000 * 60 * 60 * 24);

  // Recency bonus: 10 points for today, decreasing to 0 after 10 days
  const recencyBonus = Math.max(0, 10 - daysSinceLastUse);

  // Combined score: 70% frequency, 30% recency
  return command.count * 0.7 + recencyBonus * 0.3;
}

export function getTopCommands(limit = 10): { id: string; score: number }[] {
  const stats = getStats();

  const scored = Object.keys(stats.commands).map(id => ({
    id,
    score: getCommandScore(id)
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function clearCommandHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCommandStats(commandId: string): CommandData | null {
  const stats = getStats();
  return stats.commands[commandId] || null;
}
