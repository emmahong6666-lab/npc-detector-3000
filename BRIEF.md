# Project brief: Npc detector 3000

## The competition

- I’m entering the Presidential SI Challenge (Standard Track), a national K–12 competition. My age group: High school (grades 9–12)
- Judges score only a written entry (a PDF of up to 10 pages) and a video of up to 4 minutes. They reward a clear understanding of the problem and a sensible use of AI.
- My deadlines: 18, 23 of December entry and submission

## The problem

- People in the gaming community struggle with bot misinformation, rigging, or scams because of unauthorized bots placed into games. These bots impact gamers, streamers, and citizens too.
- Impact area: Something else
- Why it matters (impact): no more bot scams and improved human safety
- Evidence it’s real: In this instance, the lawsuit claims, Nahdi and Nasser created multiple Fortnite accounts and, under those accounts, added multiple island features. In December 2024, the lawsuit said, activity from about 15,000 bot accounts fed metrics to islands owned by those two that appeared to show popularity. As a result of the initial metrics, they earned payouts.
- What people told me: They got scammed by a bot.

## My solution

- My AI’s job: help identify suspicious bots and bot scams; it should be clearer and more useful than existing bot detection apps.
- Tools that already exist, and how mine is different: Lens AI takes photos and CHEQ identifies whether a bot is online. Mine helps users flag suspicious behavior in their current game or screenshot and explains the reason without automatically punishing anyone.
- Safety plan: use the system to make bots safer to detect, not to target real people or expose private information.

## My MVP features (build these first, in this order)

1. The user can submit a report on a suspicious bot for review.
2. The user can upload a screenshot of their game to check for bots.
3. The user can see a list of bots detected in their current game session.
4. The AI gives correct, safe answers to real questions.

## Maybe later (not yet)

- The user can receive alerts when a bot is violating game rules.
- The user can view detailed information about each detected bot.
- The user can compare the performance of their game with and without bot interference.
- The user can view statistics on how many bots were detected in their games.
- The user can get recommendations on how to improve their gaming safety.
- The user can learn about common bot tactics and how to spot them.
- The user can access a FAQ section for help with using the app.
- The user can provide feedback on the bot detection accuracy.
- The user can view success stories from other gamers who used the app.
- The user can set notifications for when new bot detection features are added.
- The user can report any technical issues they experience with the app.
- The user can learn about the importance of reporting bots to game developers.

## My AI’s instructions

- When it answers: a browser that can have access to your device, such as streams and games, will flag anything suspicious after the user presses start. In this MVP, the user presses the check button after choosing a screenshot or asking a question.
- Its job: read submitted screenshots or user-provided descriptions of stream chats or gameplay to detect possible bots and bot scams.
- Who it talks to and how to sound: talk to gamers, streamers, and stream watchers in clear, calm language.
- Facts it must use:
  - Unauthorized bots can enter games and act like real players.
  - Bots can cheat, spam chats, impersonate players, spread false information, or disrupt games.
  - Roblox prohibits disruptive bots, false reports, flooding games, scams, and impersonation.
  - Roblox warns that fake messages and links can steal passwords, Robux, or personal information.
  - AI should check player behavior, chat messages, account activity, and reports for suspicious patterns.
  - AI should not automatically punish someone based on one message; a human should review serious cases.
  - AI should protect players’ private information and clearly explain why something was flagged.
- Rules it must follow: do not look into or disclose private information.
- How to answer: flag the comment or action and send an alert with a short explanation of why it might be a bot. The flag should be short, like “bot” or similar.

## Build instructions

- Build Version 1 with the MVP features in order, starting with suspicious-bot reports.
- Make the difference from existing tools easy to see, follow the safety plan from the start, and leave the Maybe later features out of the app.
- Save data in the browser with localStorage for now, using a few made-up sample items and no real people. Keep all saving in one small file so it can switch to a real database later.
- Use the OpenAI API through the existing server-only getKey() helper. The page must never receive the key or token.
- Use the model named in NOTES.md. Send these AI instructions with every AI message as the system instructions.
- Ask the AI only when the user presses the relevant check/ask button. While waiting, show “Thinking…” and disable the button.
- If the AI cannot answer, show getKey()’s error message when available, otherwise show a friendly internet-check message.
- Keep the AI request in one small, clearly named server file.
- Keep NOTES.md short with how to run the app, what is done, and what is next.
