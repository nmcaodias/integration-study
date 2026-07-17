/* MCD1 · reword m1-138 so it doesn't lean on the previous question ("the same
 * logic is moved into..."). Its exhibit is already self-contained. */
module.exports = {
  questions: {
    "m1-138": {
      q: "In the flow shown, Flow A sets vars.status='pending' before an Async scope whose processors set vars.status='done' and change the payload. What does Flow A see immediately after the Async scope?"
    }
  }
};
