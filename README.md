# Portfolio-Ravi

yeah i made my portfolio a game. because a normal portfolio was too boring and i wanted to do something different.

built with Phaser.js, HTML, CSS and JavaScript. no frameworks, no templates, just me and stackoverflow at 2am.

## what is this

its a 2D room you can walk around in. there are objects you can interact with to see my projects, skills, achievements and contact info. there's also a minigame if you're bored of looking at my stuff.

## how to play

- WASD or arrow keys to move
- E to interact with objects
- ESC to close panels
- don't touch the fake coins (you will touch the fake coins)

## what's in the room

- **desk** → about me
- **photo frame** → my projects (LessonLingo, Setu, Pathglass, this portfolio + a few early builds)
- **trophy shelf** → achievements (AIR 17 in Turing Cup 2k26, ICPC Asia Amritapuri 2025, openSUSE.Asia Summit 2026 and more)
- **bookshelf** → skills
- **mailbox** → contact info
- **door** → the hallway, with the archive (my journey) and the arcade machine (Coin Rush minigame)<img width="2704" height="1522" alt="image" src="https://github.com/user-attachments/assets/7fa92d09-e952-45fc-80b9-905585128bf9" />


## design decisions (these are on purpose, not bugs)

- **ENTER to start on desktop.** the start screen is a retro arcade title screen, so you press ENTER like an old game. phones get a START button because they have no keyboard.
- **the spam guard.** press E 5 times within 2 seconds and Angel tells you to chill. it's part of the room's personality. normal, slow exploring never triggers it.
- **Angel talks back.** stand still and she asks if you're gonna move. also on purpose.
- **fake coins look almost real.** in Coin Rush the fakes have a small tell (greener colour + a glitchy wobble) that gets harder to spot on Medium and Hard. that's the whole game.

## how the code is laid out

- `boot.js` loads Phaser and the game scripts in order (phones held upright wait until you rotate)
- `logic.js` the game rules as plain functions (spam guard, combo streak, multiplier, top-5 scores), tested in `tests/`
- `main.js` start screen, the room, and the projects screen. every object in the room is one entry in a `spots` table, opened by one `interact()` function
- `world.js` hallway, archive and journey scenes
- `arcade.js` Coin Rush
- `touch.js` on-screen buttons for phones (they send the same key events, so every scene works by touch)

## tests

```
node --test
```

no npm install needed, it uses node's built-in test runner. the same tests run on every push in GitHub Actions.

## tech used

- Phaser.js (game framework)
- HTML / CSS / vanilla JS
- deployed on Vercel

## run it locally

just open index.html in a browser. no npm install, no build step, no nonsense.

or just go to [sharmaravi.in](https://sharmaravi.in)

## why

normal portfolios are pdf files with bullet points. i didn't want that.
also i spent way too many hours on this to call it anything other than a portfolio.

---------------------------------------------------------------

made by Ravi Sharma - feel free to look around.
