# Npc detector 3000

## Run it

```bash
npm start
```

Then open http://localhost:3000 in a browser. The server reads `.env`; it stays ignored by Git.

## What’s done

- Version 1 has the four MVP features: suspicious-bot reports, screenshot checking, current-session signals, and safe AI questions.
- The server uses `getKey()` from `server/getKey.js` and model `gpt-5.6-luna`; the page never receives the key.
- AI instructions come from the `My AI’s instructions` section of `BRIEF.md` with every AI request.
- Reports and sample session data save in the browser through `storage.js`.
- Saves on this computer only for now.
- Serious flags are for human review; the app does not automatically punish players.

## MVP check

1. **Report a suspicious bot — works.** Fill in the first form and press “Send for human review”; the report appears in the list and survives a refresh.
2. **Check a screenshot — works.** Choose an image in “02 / Check a screenshot,” then press “Check with AI”; the result appears after “Thinking…” finishes.
3. **See current-session detections — works.** Open “03 / Current session”; the made-up sample signals appear immediately.
4. **Ask the AI a safe question — works.** Enter a real question in “04 / Ask the safety AI” and press “Ask AI”; the answer appears without exposing the API key.

## Next

- Connect reports and review to a real database.
- Improve screenshot and live-session signals with tested examples.
- Prepare the written entry PDF and short demo video.

## Maybe Later

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

After each save point, push it to GitHub.
