# 🏏 Gitwicket for GitHub

> Turn any GitHub profile into a high-octane T20-style cricket player card and full match scorecard.

Gitwicket converts your commits into runs, streaks into not-outs, merged pull requests into boundaries, and code reviews into match-winning bowling wickets.

---

## 🌟 Features

- **T20 Player Cards**: Rated from 40 to 99 with custom tier borders, metallic accents, and holographic vibes.
- **5 Player Tiers**:
  - 👑 **Legend** (92–99 OVR): Amber Gold frame
  - 💎 **National** (82–91 OVR): Neon Emerald frame
  - ⚡ **State** (70–81 OVR): Sapphire Cyan frame
  - 🔮 **Club** (55–69 OVR): Amethyst Violet frame
  - 🛡️ **Rookie** (40–54 OVR): Titanium Slate frame
- **Tactical Role Assignments**: Opener, Anchor, Finisher, Bowler, All-Rounder.
- **Playstyle Badges**: Night Watchman, Polyglot, Marathon Runner, Clean Hitter, Big Match Player, Skipper, Pinch Hitter, Spin Wizard.
- **Authentic Match Scorecard**: Batting card, bowling card, dismissal types, boundaries, and bowling economy.
- **Over-by-Over Worm & Manhattan Chart**: 12-month contribution histogram and cumulative run-rate progression curve.
- **⚔️ Duel Match Arena** (`/duel?a=user1&b=user2`): Head-to-head comparison across 6 rounds with cricket match verdicts (*"antfu won by 4 wickets!"*).
- **Export & Share**:
  - One-click crisp 2x PNG card download.
  - Native share links for X (Twitter), WhatsApp, and LinkedIn.
  - Dynamic OpenGraph preview image via `next/og` (`/{username}/opengraph-image`).

---

## 🧮 Cricket Stat Mapping & Scoring Engine

All scoring logic is purely deterministic and contained within [`lib/scoring.ts`](lib/scoring.ts).

### 1. Stat Conversion Table
| Cricket Metric | GitHub Source | Formula & Meaning |
| :--- | :--- | :--- |
| **Innings** | Active Days in Last Year | Active days with $\ge 1$ contribution ($0 \le \text{Innings} \le 365$) |
| **Runs** | Total Contributions (1 Year) | Total commits, PRs, issues, and reviews |
| **Batting Average** | Contributions per Active Day | $\text{Batting Avg} = \frac{\text{Runs}}{\max(1, \text{Innings})}$ |
| **Strike Rate (SR)** | Work Pace / Velocity | $\text{SR} = \min\left(250, \text{round}\left(\frac{\text{Runs}}{\max(1, \text{Innings})} \times 25\right)\right)$ |
| **Fifties (50s)** | Monthly Milestones | Months with 50 to 99 contributions |
| **Centuries (100s)**| Monster Months | Months with 100+ contributions |
| **Not Outs (NO)** | Current Active Streak | Unbroken consecutive days currently active |
| **Fours (4s)** | Merged Pull Requests | Crisp, completed deliveries to the boundary |
| **Sixes (6s)** | Starred Repositories | Repos with $\ge 10$ stars (+ bonus for repos with $\ge 100$ stars) |
| **Wickets (Wkts)** | Bowling & Team Support | Code reviews given + issues closed |
| **Bowling Average** | Bowling Impact | Ratio of contributions to wickets |
| **Form Indicator** | 30-Day Velocity vs Yearly Pace | $\text{Pace}_{30} = \frac{\text{Last 30 Days}}{30}$ vs $\text{Pace}_{365} = \frac{\text{Yearly Runs}}{365}$ |

---

### 2. Overall Rating (0 – 99 OVR)
Rating is computed across 5 weighted pillars normalized against sensible real-world ceilings:

1. **Volume & Consistency (25%)**: Runs ceiling ($2,500$), Innings ceiling ($250$).
2. **Impact & Boundaries (20%)**: Merged PRs ceiling ($60$), Sixes ceiling ($12$).
3. **Bowling & Team Play (20%)**: Wickets ceiling ($60$ reviews + issues).
4. **Efficiency & Pace (20%)**: Batting average ceiling ($8.0$), Strike Rate ceiling ($180$).
5. **Stardom & Longevity (15%)**: Followers ceiling ($150$), Account age ceiling ($6$ years).

$$\text{OVR} = \text{clamp}\left(\text{round}\left(45 + \frac{\text{Raw Score}}{100} \times 54\right), 40, 99\right)$$

*(Zero-activity accounts start at 40 Rookie; world-class maintainers reach 95–99).*

---

### 3. Role Classification Rules
- **All-Rounder**: Balanced performance across contributions, PRs, and team reviews.
- **Bowler**: High review-to-PR ratio ($\text{Wickets} \ge 20$ and $\ge 1.4\times$ merged PRs).
- **Finisher**: High merge volume ($\ge 20$ PRs and $\ge 1.8\times$ owned repos).
- **Opener**: High repository creator ($\ge 8$ repos with Strike Rate $\ge 110$).
- **Anchor**: Relentless stamina ($\ge 28$-day longest streak or $\ge 150$ active days).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js 24)
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/your-username/gitwicket.git
cd gitwicket
npm install
```

### 2. Configure GitHub Token (Recommended)
GitHub provides 60 unauthenticated requests/hr on the REST API. Adding a free token unlocks 5,000 requests/hr and powers the high-speed GraphQL contributions calendar:

1. Go to [GitHub Settings &rarr; Personal Access Tokens](https://github.com/settings/tokens).
2. Generate a new Classic Token with **no scopes checked** (zero permissions required for public data).
3. Create a `.env.local` file:
```env
GITHUB_TOKEN=ghp_yourTokenHere
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Unit Tests
```bash
npm test
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Dark Navy Athletic Theme)
- **Export**: `html-to-image` for high-res PNG trading cards
- **Social Previews**: Dynamic `ImageResponse` via `next/og`
- **Testing**: `vitest`

---

## 🧪 Navigation & Back-Button Regression Checklist

To ensure the search input never freezes after navigating back from a player card:
- [x] **Browser Back Button**: Search `@torvalds`, land on `/torvalds`, click browser Back &rarr; input is active, cleared, and editable without page reload.
- [x] **In-App Back Link**: Navigate to `/antfu`, click `"Back to Arena Home"` &rarr; input is unfrozen, cleared, and ready for input.
- [x] **Forward & Back Transitions**: Forward button returns to card; Back button cleanly restores interactive input.
- [x] **Input Independence**: `<input>` is never disabled based on transient loading state (`disabled={isLoading}` removed).
- [x] **Transition Safety**: Handled via React `useTransition`, window `pageshow` listener, and `usePathname` route resets.

Run the automated browser regression suite:
```bash
node scripts/verify-fix.mjs
```

---

## ⚖️ Legal & Brand Notice
Gitwicket is an independent fan-made web application for developers. It uses generic cricket and sports terminology ("T20", "Innings", "Wickets", "Batting Average") and does **not** use any real trademarks, leagues (such as IPL, BCCI, ICC), or player likenesses.
